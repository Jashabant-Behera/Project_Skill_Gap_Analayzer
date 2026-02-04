import asyncio
import os
import logging
from openai import OpenAI
from dotenv import load_dotenv
from fastapi import HTTPException

load_dotenv()

logger = logging.getLogger(__name__)

# Fix 4: Centralize AI prompts
AI_PROMPTS = {
    "skill_gap_v1": """
            Analyze the skill gap for a user aiming for the role of '{target_role}'.
            Current Skills: {user_skills}
            
            Please provide:
            1. Missing critical skills.
            2. Recommendations to bridge the gap.
            3. A brief learning roadmap.
            """,
    "deep_gap_analysis": """
            You are an expert career advisor. Perform a deep skill gap analysis for a user.
            
            Target Role: {target_role}
            Role Description: {role_description}
            Required Skills: {required_skills}
            
            User's Declared Skills: {user_skills}
            Assessment Performance: {assessment_results}
            
            Please provide a structured response with:
            1. **Strength Analysis**: Where the user excels.
            2. **Critical Gaps**: Essential skills for the role that the user lacks or performed poorly on.
            3. **Personalized Learning Roadmap**: A prioritized, step-by-step plan to bridge the gaps.
            4. **Recommended Resources**: Specific topics or types of projects to work on.
            
            Keep the tone professional and encouraging.
            """
}

class AIService:
    def __init__(self):
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            logger.warning("OPENAI_API_KEY not found in environment variables.")
            self.client = None
        else:
            self.client = OpenAI(api_key=api_key)

    async def analyze_skill_gap(self, user_skills: list, target_role: str):
        try:
            if not self.client:
                raise ValueError("OpenAI client not initialized. Check API key.")
            
            prompt = AI_PROMPTS["skill_gap_v1"].format(
                target_role=target_role, 
                user_skills=", ".join(user_skills)
            )
            
            # Wrap blocking OpenAI call in a separate thread
            response = await asyncio.to_thread(
                self.client.chat.completions.create,
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are an expert career advisor and technical recruiter."},
                    {"role": "user", "content": prompt}
                ]
            )
            return response.choices[0].message.content
        except ValueError as ve:
            logger.error(f"AI service configuration error: {str(ve)}")
            raise HTTPException(
                status_code=503,
                detail="AI service not configured. Please contact administrator."
            )
        except Exception as e:
            logger.error(f"AI analysis failed: {str(e)}", exc_info=True)
            raise HTTPException(
                status_code=503, 
                detail="AI service temporarily unavailable. Please try again later."
            )

    async def generate_deep_analysis(self, target_role_data: dict, user_skills: list, assessment_data: dict, user_data: dict):
        try:
            if not self.client:
                raise ValueError("OpenAI client not initialized. Check API key.")
            
            role_name = target_role_data.get("title", "Unknown Role")
            role_desc = target_role_data.get("description", "N/A")
            req_skills_list = [f"{rs['skillId']} ({rs['level']})" for rs in target_role_data.get("required_skills", [])]
            req_skills = ", ".join(req_skills_list)
            
            proficiency = user_data.get("proficiency_level", "beginner")
            user_skills_summary = []
            for s in user_skills:
                # user_skills is now a list of dicts (UserSkill)
                rating = f"Self-rated: {s.get('self_rating')}/5" if s.get('self_rating') else ""
                score = f"Assessment: {s.get('assessment_score')}%" if s.get('assessment_score') else ""
                details = " & ".join(filter(None, [rating, score]))
                user_skills_summary.append(f"- {s.get('skill_id')}: {details}")
            
            assessment_summary = f"Overall score: {assessment_data.get('score_percentage')}%.\nSkill Breakdown: {assessment_data.get('skill_scores')}"
            
            prompt = AI_PROMPTS["deep_gap_analysis"].format(
                target_role=role_name,
                role_description=role_desc,
                required_skills=req_skills,
                user_skills="\n".join(user_skills_summary) if user_skills_summary else "No skills recorded yet.",
                assessment_results=f"User Proficiency Level: {proficiency}\n{assessment_summary}"
            )
            
            response = await asyncio.to_thread(
                self.client.chat.completions.create,
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are a professional technical career coach."},
                    {"role": "user", "content": prompt}
                ]
            )
            return response.choices[0].message.content
        except ValueError as ve:
            logger.error(f"AI service configuration error: {str(ve)}")
            raise HTTPException(
                status_code=503,
                detail="AI service not configured. Please contact administrator."
            )
        except Exception as e:
            logger.error(f"Deep analysis failed: {str(e)}", exc_info=True)
            raise HTTPException(
                status_code=503,
                detail="AI service temporarily unavailable. Please try again later."
            )

ai_service = AIService()
