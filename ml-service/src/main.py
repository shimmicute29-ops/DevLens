from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any
import numpy as np
from sqlalchemy import create_engine, text
import os
import joblib

app = FastAPI(title="DevLens ML Service")

# Database connection
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://devlens:devlens_secure_password@localhost:5432/devlens_db")
engine = create_engine(DATABASE_URL)

class SkillPredictionRequest(BaseModel):
    user_id: str
    current_skills: Dict[str, float]
    historical_data: List[Dict[str, Any]]

class RoleRecommendationRequest(BaseModel):
    user_id: str
    skills: Dict[str, float]
    experience_years: float

class TeamCompositionRequest(BaseModel):
    team_size: int
    required_skills: List[str]
    available_users: List[str]

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "ml-service"}

@app.post("/predict-skills")
def predict_skills(request: SkillPredictionRequest):
    """
    Predict future skill levels based on historical trajectory
    """
    try:
        # Extract historical proficiency values
        history = [(data['timestamp'], data['proficiency']) for data in request.historical_data]
        history.sort()
        
        if len(history) < 2:
            return {"predictions": request.current_skills}
        
        # Simple linear regression for trend
        proficiencies = [p for _, p in history]
        trend = np.polyfit(range(len(proficiencies)), proficiencies, 1)
        
        # Predict next 3 months
        predictions = {}
        for skill, current_level in request.current_skills.items():
            # Simulate growth with diminishing returns
            future_level = min(100, current_level + (trend[0] * 5))
            predictions[skill] = max(0, future_level)
        
        return {
            "user_id": request.user_id,
            "predictions": predictions,
            "trend": float(trend[0])
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/recommend-roles")
def recommend_roles(request: RoleRecommendationRequest):
    """
    Recommend ideal roles based on skill profile
    """
    try:
        role_skill_requirements = {
            "Backend Engineer": {"Backend": 0.7, "DevOps": 0.4, "Database": 0.6},
            "Frontend Engineer": {"Frontend": 0.8, "UI/UX": 0.5, "Web APIs": 0.6},
            "Full Stack Engineer": {"Backend": 0.6, "Frontend": 0.6, "DevOps": 0.5},
            "DevOps Engineer": {"DevOps": 0.8, "Cloud": 0.7, "Infrastructure": 0.7},
            "ML Engineer": {"Machine Learning": 0.8, "Python": 0.7, "Data Science": 0.7},
            "Tech Lead": {"Backend": 0.7, "Frontend": 0.6, "Leadership": 0.7},
        }
        
        recommendations = []
        for role, requirements in role_skill_requirements.items():
            match_score = 0
            for skill, required_level in requirements.items():
                current_level = request.skills.get(skill, 0) / 100
                match_score += min(current_level, required_level)
            
            avg_match = match_score / len(requirements)
            
            # Factor in experience
            experience_boost = min(0.2, request.experience_years * 0.05)
            final_score = min(1.0, avg_match + experience_boost)
            
            if final_score > 0.5:
                recommendations.append({
                    "role": role,
                    "match_score": float(final_score),
                    "required_skills": requirements
                })
        
        recommendations.sort(key=lambda x: x['match_score'], reverse=True)
        return {
            "user_id": request.user_id,
            "recommendations": recommendations[:3]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/suggest-team-composition")
def suggest_team_composition(request: TeamCompositionRequest):
    """
    Suggest optimal team composition based on available users and required skills
    """
    try:
        # Fetch user skills from database
        with engine.connect() as conn:
            query = text("""
                SELECT user_id, skill_name, proficiency 
                FROM developer_skills 
                WHERE user_id = ANY(:user_ids)
            """)
            result = conn.execute(query, {"user_ids": request.available_users})
            user_skills = {}
            for row in result:
                if row[0] not in user_skills:
                    user_skills[row[0]] = {}
                user_skills[row[0]][row[1]] = row[2]
        
        # Simple greedy algorithm for team composition
        selected_team = []
        skills_covered = set()
        
        for user_id in request.available_users:
            if len(selected_team) >= request.team_size:
                break
            
            user_skill_set = set(user_skills.get(user_id, {}).keys())
            new_coverage = len(user_skill_set & set(request.required_skills) - skills_covered)
            
            if new_coverage > 0:
                selected_team.append(user_id)
                skills_covered.update(user_skill_set)
        
        return {
            "suggested_team": selected_team,
            "team_size": len(selected_team),
            "skills_covered": list(skills_covered),
            "missing_skills": list(set(request.required_skills) - skills_covered)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/analytics/skill-trends")
def skill_trends():
    """
    Get global skill trends across all developers
    """
    try:
        with engine.connect() as conn:
            query = text("""
                SELECT skill_category, AVG(proficiency) as avg_proficiency, COUNT(*) as developer_count
                FROM developer_skills
                GROUP BY skill_category
                ORDER BY avg_proficiency DESC
            """)
            result = conn.execute(query)
            trends = [
                {
                    "category": row[0],
                    "average_proficiency": float(row[1]),
                    "developer_count": row[2]
                }
                for row in result
            ]
        return {"trends": trends}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
