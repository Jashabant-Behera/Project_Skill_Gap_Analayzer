from typing import List, Dict, Any
import logging

logger = logging.getLogger(__name__)

class SkillGapAnalyzer:
    """Analyzes skill gaps between current and target role requirements"""
    
    def __init__(self):
        self.level_values = {
            "beginner": 1,
            "intermediate": 2,
            "advanced": 3
        }
        
        self.importance_weights = {
            "mandatory": 1.0,
            "important": 0.7,
            "nice_to_have": 0.4
        }
    
    async def analyze_gaps(
        self,
        assessment_results: List[Any],
        target_role_requirements: Dict[str, Any],
        user_profile: Dict[str, Any],
        additional_goals: List[Dict[str, Any]] = []  # NEW: Custom goals
    ) -> Dict[str, Any]:
        """Analyze skill gaps comprehensively"""
        
        # Group responses by skill
        skill_scores = {}
        skill_responses = {}
        
        for response in assessment_results:
            skill_id = str(getattr(response, 'skill_id', '')).lower().strip()
            if not skill_id:
                continue
            
            if skill_id not in skill_scores:
                skill_scores[skill_id] = []
                skill_responses[skill_id] = []
            
            skill_scores[skill_id].append(response.score)
            skill_responses[skill_id].append(response)
        
        # Calculate average score per skill
        skill_averages = {}
        for skill_id, scores in skill_scores.items():
            skill_averages[skill_id] = sum(scores) / len(scores)
        
        # Analyze gaps for each required skill
        gaps = []
        required_skills = target_role_requirements.get("required_skills", [])
        
        # Helper to process a skill requirement
        def process_requirement(req_skill, is_additional=False):
            skill_id = str(req_skill["skill_id"]).lower().strip()
            
            if is_additional:
                required_level = req_skill.get("desired_proficiency", "intermediate")
                importance = "personal_goal" # Custom importance type
                weightage = 0.0 # Don't affect role readiness score
            else:
                required_level = req_skill.get("proficiency_level", "intermediate")
                importance = req_skill.get("importance", "important")
                weightage = req_skill.get("weightage", 0.5)
            
            # Get user's current score for this skill
            current_score = skill_averages.get(skill_id, 0)
            current_level = self._score_to_level(current_score)
            
            # Calculate gap
            gap_score = self._calculate_gap_score(
                current_level=current_level,
                required_level=required_level,
                current_score=current_score,
                importance=importance
            )
            
            # For additional skills, always include even if gap is small (to track progress)
            if gap_score <= 0 and not is_additional:
                return
            
            # Determine priority
            priority = self._calculate_priority(gap_score, importance)
            
            # Estimate learning time
            estimated_weeks = self._estimate_learning_time(gap_score)
            
            # Collect missing concepts
            missing_concepts = []
            if skill_id in skill_responses:
                for response in skill_responses[skill_id]:
                    missing_concepts.extend(response.missing_concepts)
            
            # Remove duplicates
            missing_concepts = list(set(missing_concepts))
            
            gaps.append({
                "skill_id": skill_id,
                "skill_name": req_skill.get("skill_name", skill_id),
                "current_level": current_level,
                "current_score": current_score,
                "required_level": required_level,
                "gap_score": gap_score,
                "priority": priority,
                "estimated_learning_time": estimated_weeks,
                "missing_concepts": missing_concepts,
                "weightage": weightage,
                "is_additional": is_additional  # Flag to identify source
            })

        # Process role requirements
        for req in required_skills:
            process_requirement(req, is_additional=False)
            
        # Process additional goals
        for goal in additional_goals:
            # Check if not already covered by role requirements
            if not any(r["skill_id"] == goal["skill_id"] for r in required_skills):
                process_requirement(goal, is_additional=True)
        
        # Sort by priority and gap score
        gaps.sort(key=lambda x: (
            {"high": 3, "medium": 2, "low": 1}[x["priority"]],
            x["gap_score"]
        ), reverse=True)
        
        # Calculate overall readiness
        overall_readiness = self._calculate_readiness(gaps, required_skills)
        
        return {
            "total_gaps": len(gaps),
            "high_priority_gaps": len([g for g in gaps if g["priority"] == "high"]),
            "skill_gaps": gaps,
            "overall_readiness_score": overall_readiness
        }
    
    def _score_to_level(self, score: float) -> str:
        """Convert numeric score to proficiency level"""
        if score >= 80:
            return "advanced"
        elif score >= 60:
            return "intermediate"
        else:
            return "beginner"
    
    def _calculate_gap_score(
        self,
        current_level: str,
        required_level: str,
        current_score: float,
        importance: str
    ) -> float:
        """Calculate gap score (0-100)"""
        current_val = self.level_values.get(current_level, 1)
        required_val = self.level_values.get(required_level, 3)
        
        level_diff = required_val - current_val
        
        if level_diff <= 0:
            return 0.0
        
        # Convert to percentage
        gap_percentage = (level_diff / 2) * 100
        
        # Apply importance weight
        weight = self.importance_weights.get(importance, 0.7)
        weighted_gap = gap_percentage * weight
        
        return round(weighted_gap, 2)
    
    def _calculate_priority(self, gap_score: float, importance: str) -> str:
        """Determine priority level"""
        weight = self.importance_weights.get(importance, 0.7)
        weighted_gap = gap_score * weight
        
        if weighted_gap >= 70 or importance == "mandatory":
            return "high"
        elif weighted_gap >= 40:
            return "medium"
        else:
            return "low"
    
    def _estimate_learning_time(self, gap_score: float) -> int:
        """Estimate weeks needed to bridge gap"""
        weeks = (gap_score / 10) * 1.5
        return max(1, round(weeks))
    
    def _calculate_readiness(
        self,
        gaps: List[Dict],
        required_skills: List[Dict]
    ) -> float:
        """Calculate overall readiness percentage"""
        if not required_skills:
            return 100.0
        
        total_weighted_gap = 0
        total_weight = 0
        
        for gap in gaps:
            total_weighted_gap += gap["gap_score"] * gap["weightage"]
            total_weight += gap["weightage"]
        
        if total_weight == 0:
            return 100.0
        
        average_gap = total_weighted_gap / total_weight
        readiness = max(0, 100 - average_gap)
        
        return round(readiness, 2)

# Global instance
skill_gap_analyzer = SkillGapAnalyzer()
