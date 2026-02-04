from pydantic import BaseModel
from typing import List

class Question(BaseModel):
    id: str
    skillId: str
    text: str
    options: List[str]
    correctAnswer: str
    difficulty: str

class QuestionList(BaseModel):
    questions: List[Question]
