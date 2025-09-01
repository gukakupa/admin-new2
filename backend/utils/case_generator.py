from datetime import datetime
import asyncio
from motor.motor_asyncio import AsyncIOMotorDatabase

class CaseIDGenerator:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.collection = db.case_counters
    
    async def generate_case_id(self) -> str:
        """Generate a unique case ID in format DL2024001"""
        current_year = datetime.now().year
        
        # Find and increment the counter for current year
        result = await self.collection.find_one_and_update(
            {"year": current_year},
            {"$inc": {"sequence": 1}},
            upsert=True,
            return_document=True
        )
        
        sequence = result["sequence"]
        case_id = f"DL{current_year}{sequence:03d}"
        
        return case_id

def calculate_progress(status: str) -> int:
    """Calculate progress percentage based on status"""
    progress_map = {
        'pending': 10,
        'in_progress': 50,
        'completed': 100
    }
    return progress_map.get(status, 0)

def get_estimated_completion_days(urgency: str) -> int:
    """Get estimated completion days based on urgency"""
    urgency_days = {
        'low': 7,
        'medium': 5,
        'high': 3,
        'critical': 1
    }
    return urgency_days.get(urgency, 5)