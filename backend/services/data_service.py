import json
from pathlib import Path
from typing import List, Dict, Optional
from models.skill import Skill
from models.role import Role
from models.question import Question

class DataService:
    def __init__(self):
        # Improved path resolution: relative to project root (where data/ is)
        # Assuming server.py is run from backend/ or root
        self.base_path = Path(__file__).parent.parent.parent / "data"
        self.skills: List[Skill] = []
        self.roles: List[Role] = []
        self.questions: List[Question] = []
        self.load_data()

    def load_data(self):
        try:
            # Load Skills
            skills_file = self.base_path / "skills.json"
            if skills_file.exists():
                with open(skills_file, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    self.skills = [Skill(**s) for s in data.get("skills", [])]
            else:
                print(f"Warning: {skills_file} not found")

            # Load Roles
            roles_file = self.base_path / "roles.json"
            if roles_file.exists():
                with open(roles_file, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    self.roles = [Role(**r) for r in data.get("roles", [])]
            else:
                print(f"Warning: {roles_file} not found")

            # Load Questions
            questions_file = self.base_path / "questions.json"
            if questions_file.exists():
                with open(questions_file, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    self.questions = [Question(**q) for q in data.get("questions", [])]
            else:
                print(f"Warning: {questions_file} not found")
            
            print(f"Loaded {len(self.skills)} skills, {len(self.roles)} roles, and {len(self.questions)} questions.")
        except Exception as e:
            print(f"Error loading data: {e}")

    def get_all_skills(self) -> List[Skill]:
        return self.skills

    def get_all_roles(self) -> List[Role]:
        return self.roles

    def get_role_by_id(self, role_id: str) -> Optional[Role]:
        return next((r for r in self.roles if r.id == role_id), None)

    def get_questions_by_skills(self, skill_ids: List[str]) -> List[Question]:
        return [q for q in self.questions if q.skillId in skill_ids]

    def get_question_by_id(self, q_id: str) -> Optional[Question]:
        return next((q for q in self.questions if q.id == q_id), None)

data_service = DataService()
