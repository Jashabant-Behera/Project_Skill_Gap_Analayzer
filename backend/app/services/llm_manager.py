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
    "question_text": "...",
    "question_type": "scenario|mcq|short_answer",
    "difficulty_level": "beginner|intermediate|advanced",
    "options": ["A", "B", "C", "D"] or null,
    "correct_answer": "A" or null,
    "expected_competency": ["...", "..."],
    "evaluation_criteria": ["...", "..."]
  }}
]"""

        messages = [{"role": "user", "content": prompt}]
        response = self._make_completion(messages, temperature=0.4)
        
        try:
            questions = json.loads(response)
            for q in questions:
                q['skill_id'] = skill.lower().replace(' ', '_')
                q['skill_name'] = skill
            return questions
        except json.JSONDecodeError:
            logger.error(f"Failed to parse questions: {response}")
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

Expected: {', '.join(question['expected_competency'])}

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
            return json.loads(response)
        except json.JSONDecodeError:
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
            return json.loads(response)
        except json.JSONDecodeError:
            raise Exception("Failed to generate roadmap")

# Global instance
llm_manager = LLMManager()
