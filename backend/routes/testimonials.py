from fastapi import APIRouter, HTTPException, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List
import os

from models.Testimonial import (
    TestimonialCreate,
    Testimonial,
    TestimonialUpdate
)

router = APIRouter(tags=["testimonials"])

# Database dependency
async def get_database():
    from motor.motor_asyncio import AsyncIOMotorClient
    client = AsyncIOMotorClient(os.environ['MONGO_URL'])
    db = client[os.environ['DB_NAME']]
    return db

@router.get("/", response_model=List[Testimonial])
async def get_active_testimonials(
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get all active testimonials"""
    try:
        cursor = db.testimonials.find({"is_active": True}).sort("created_at", -1)
        testimonials = await cursor.to_list(100)
        
        return [Testimonial(**testimonial) for testimonial in testimonials]
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving testimonials: {str(e)}")

@router.post("/", response_model=dict)
async def create_testimonial(
    testimonial: TestimonialCreate,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Create a new testimonial (admin endpoint)"""
    try:
        new_testimonial = Testimonial(**testimonial.dict())
        
        # Insert into database
        result = await db.testimonials.insert_one(new_testimonial.dict())
        
        if result.inserted_id:
            return {
                "success": True,
                "message": "Testimonial created successfully",
                "id": new_testimonial.id
            }
        else:
            raise HTTPException(status_code=500, detail="Failed to create testimonial")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating testimonial: {str(e)}")

@router.put("/{testimonial_id}", response_model=dict)
async def update_testimonial(
    testimonial_id: str,
    update: TestimonialUpdate,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Update testimonial (admin endpoint)"""
    try:
        update_data = {k: v for k, v in update.dict().items() if v is not None}
        
        if update_data:
            result = await db.testimonials.update_one(
                {"id": testimonial_id},
                {"$set": update_data}
            )
            
            if result.matched_count == 0:
                raise HTTPException(status_code=404, detail="Testimonial not found")
            
            return {"success": True, "message": "Testimonial updated successfully"}
        else:
            raise HTTPException(status_code=400, detail="No valid fields to update")
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating testimonial: {str(e)}")

@router.delete("/{testimonial_id}", response_model=dict)
async def delete_testimonial(
    testimonial_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Soft delete testimonial by setting is_active to False (admin endpoint)"""
    try:
        result = await db.testimonials.update_one(
            {"id": testimonial_id},
            {"$set": {"is_active": False}}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Testimonial not found")
        
        return {"success": True, "message": "Testimonial deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting testimonial: {str(e)}")

@router.get("/all", response_model=List[Testimonial])
async def get_all_testimonials(
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get all testimonials including inactive (admin endpoint)"""
    try:
        cursor = db.testimonials.find().sort("created_at", -1)
        testimonials = await cursor.to_list(1000)
        
        return [Testimonial(**testimonial) for testimonial in testimonials]
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving all testimonials: {str(e)}")