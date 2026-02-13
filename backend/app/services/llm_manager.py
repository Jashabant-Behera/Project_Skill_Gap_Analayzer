import os
import json
from openai import OpenAI
from app.config import settings
import logging

logger = logging.getLogger(__name__)

class LLMManager:
    """Manages Groq LLM API calls"""
    
    def __init__(self):
        self.client = OpenAI(
            api_key=settings.GROQ_API_KEY,
            base_url="https://api.groq.com/openai/v1"
        )
        self.fast_model = settings.GROQ_MODEL_FAST
        self.smart_model = settings.GROQ_MODEL_SMART
    
    def _make_completion(
        self, 
        messages: list, 
        model: str = None,
        temperature: float = 0.3,
        max_tokens: int = 4000
    ) -> str:
        """Make completion request"""
        try:
            response = self.client.chat.completions.create(
                model=model or self.smart_model,
                messages=messages,
                temperature=temperature,
                max_tokens=max_tokens
            )
            return response.choices[0].message.content
        except Exception as e:
            logger.error(f"Groq API error: {str(e)}")
            raise Exception(f"LLM API call failed: {str(e)}")
    
    def _extract_json(self, text: str) -> dict:
        """Extract JSON from LLM response with fallback strategies"""
        import re
        
        # Strategy 1: Try direct parsing
        try:
            return json.loads(text.strip())
        except json.JSONDecodeError:
            pass
        
        # Strategy 2: Extract from markdown code block
        markdown_pattern = r'```(?:json)?\s*(\{.*?\})\s*```'
        match = re.search(markdown_pattern, text, re.DOTALL)
        if match:
            try:
                return json.loads(match.group(1))
            except json.JSONDecodeError:
                pass
                
        # Strategy 3: Extract array from markdown code block
        array_pattern = r'```(?:json)?\s*(\[.*?\])\s*```'
        match = re.search(array_pattern, text, re.DOTALL)
        if match:
            try:
                return json.loads(match.group(1))
            except json.JSONDecodeError:
                pass
        
        # Strategy 4: Find first valid JSON object or array
        brace_pattern = r'\{(?:[^{}]|(?:\{[^{}]*\}))*\}'
        matches = re.finditer(brace_pattern, text, re.DOTALL)
        for match in matches:
            try:
                return json.loads(match.group(0))
            except json.JSONDecodeError:
                continue
                
        bracket_pattern = r'\[(?:[^\[\]]|(?:\[[^\[\]]*\]))*\]'
        match = re.search(bracket_pattern, text, re.DOTALL)
        if match:
            try:
                return json.loads(match.group(0))
            except json.JSONDecodeError:
                pass
        
        # All strategies failed
        logger.error(f"Failed to extract JSON from: {text[:200]}...")
        raise ValueError("Could not extract valid JSON from response")
    
    def generate_questions(
        self,
        skill: str,
        target_role: str,
        experience_level: str,
        user_context: dict,
        num_questions: int = 5
    ) -> list:
        """Generate assessment questions"""
        
        known_skills = user_context.get('known_skills', [])
        current_role = user_context.get('current_role', 'Unknown')
        years_exp = user_context.get('years_of_experience', 0)
        
        prompt = f"""Generate {num_questions} technical assessment questions for:
- Skill: {skill}
- Target Role: {target_role}
- Experience Level: {experience_level}
- Candidate's Background: {current_role} with {years_exp} years
- Known Skills: {', '.join(known_skills)}

Return ONLY valid JSON array with this structure:
[
  {{
    "question_text": "Scenario based question text...",
    "question_type": "mcq",
    "difficulty_level": "beginner|intermediate|advanced",
    "options": ["Specific Answer A", "Specific Answer B", "Specific Answer C", "Specific Answer D"],
    "correct_answer": "Specific Answer C (Must be exact textmatch with one option)",
    "expected_competency": ["Competency 1", "Competency 2"],
    "evaluation_criteria": ["Criteria 1", "Criteria 2"]
  }}
]
Ensure all questions are Multiple Choice Questions (MCQ) with 4 distinct, realistic technical options. Do NOT use placeholders like 'Option 1'. The correct_answer field must exactly match the text of one of the options."""

        messages = [{"role": "user", "content": prompt}]
        response = self._make_completion(messages, temperature=0.4)
        
        try:
            questions = self._extract_json(response)
            if not isinstance(questions, list):
                 # Try to wrap if single object
                 if isinstance(questions, dict):
                     questions = [questions]
                 else:
                     raise ValueError("Expected list of questions")
            
            for q in questions:
                q['skill_id'] = skill.lower().replace(' ', '_')
                q['skill_name'] = skill
                # Sanitize question text
                if 'question_text' in q:
                    from app.services.validation_service import ValidationService
                    q['question_text'] = ValidationService.sanitize_html(q['question_text'])
            return questions
        except Exception as e:
            logger.error(f"Failed to parse questions: {response}. Error: {e}")
            raise Exception("Failed to generate questions")
    
    def evaluate_response(
        self,
        question: dict,
        user_answer: str,
        skill_name: str
    ) -> dict:
        """Evaluate user response"""
        
        prompt = f"""Evaluate this answer:

Question: {question['question_text']}
Type: {question['question_type']}
Skill: {skill_name}

Expected: {', '.join(question.get('expected_competency', []))}
Correct Answer: {question.get('correct_answer', 'Not provided')}

Answer: {user_answer}

Return ONLY valid JSON:
{{
  "score": 0-100,
  "competency_level": "beginner|intermediate|advanced",
  "strengths": ["..."],
  "gaps": ["..."],
  "feedback": "...",
  "missing_concepts": ["..."]
}}"""

        messages = [{"role": "user", "content": prompt}]
        response = self._make_completion(messages, temperature=0.2, max_tokens=1500)
        
        try:
            return self._extract_json(response)
        except Exception:
            return {
                "score": 50,
                "competency_level": "beginner",
                "strengths": ["Response provided"],
                "gaps": ["Evaluation error"],
                "feedback": "Please try again",
                "missing_concepts": []
            }
    
    def generate_roadmap(
        self,
        skill_gaps: list,
        user_profile: dict,
        target_role: str,
        hours_per_week: int = 10
    ) -> dict:
        """Generate learning roadmap"""
        
        gaps_text = "\n".join([
            f"- {g['skill_name']}: {g['current_level']} -> {g['required_level']} (Priority: {g['priority']})"
            for g in skill_gaps[:10]
        ])
        
        prompt = f"""Create a learning roadmap:

Profile: {user_profile.get('current_role')} -> {target_role}
Time: {hours_per_week} hrs/week

Gaps:
{gaps_text}

Return ONLY valid JSON:
{{
  "total_weeks": 12,
  "overview": "...",
  "weeks": [
    {{
      "week_number": 1,
      "title": "...",
      "skills_to_learn": ["..."],
      "learning_objectives": "...",
      "estimated_hours": 10,
      "resources": {{}},
      "projects": {{}},
      "success_criteria": ["..."]
    }}
  ]
}}"""

        messages = [{"role": "user", "content": prompt}]
        response = self._make_completion(messages, max_tokens=8000, temperature=0.4)
        
        try:
            return self._extract_json(response)
        except Exception:
            raise Exception("Failed to generate roadmap")

# Global instance
llm_manager = LLMManager()
