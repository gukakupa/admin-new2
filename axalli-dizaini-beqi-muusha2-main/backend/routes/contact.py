from fastapi import APIRouter, HTTPException, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List
import os

from models.ContactMessage import (
    ContactMessageCreate,
    ContactMessage,
    ContactMessageUpdate
)

router = APIRouter(tags=["contact"])

# Database dependency
async def get_database():
    from motor.motor_asyncio import AsyncIOMotorClient
    client = AsyncIOMotorClient(os.environ['MONGO_URL'])
    db = client[os.environ['DB_NAME']]
    return db

@router.post("/", response_model=dict)
async def send_contact_message(
    message: ContactMessageCreate,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Send a contact message"""
    try:
        contact_message = ContactMessage(**message.dict())
        
        # Insert into database
        result = await db.contact_messages.insert_one(contact_message.dict())
        
        if result.inserted_id:
            return {
                "success": True,
                "message": "Message sent successfully",
                "id": contact_message.id
            }
        else:
            raise HTTPException(status_code=500, detail="Failed to send message")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error sending message: {str(e)}")

@router.get("/", response_model=List[ContactMessage])
async def get_all_contact_messages(
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get all contact messages (admin endpoint)"""
    try:
        cursor = db.contact_messages.find().sort("created_at", -1)
        messages = await cursor.to_list(1000)
        
        return [ContactMessage(**message) for message in messages]
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving messages: {str(e)}")

@router.put("/{message_id}/status", response_model=dict)
async def update_message_status(
    message_id: str,
    update: ContactMessageUpdate,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Update message status (admin endpoint)"""
    try:
        result = await db.contact_messages.update_one(
            {"id": message_id},
            {"$set": {"status": update.status}}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Message not found")
        
        return {"success": True, "message": "Message status updated successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating message: {str(e)}")

@router.get("/stats", response_model=dict)
async def get_contact_stats(
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get contact message statistics (admin endpoint)"""
    try:
        total = await db.contact_messages.count_documents({})
        new_count = await db.contact_messages.count_documents({"status": "new"})
        read_count = await db.contact_messages.count_documents({"status": "read"})
        replied_count = await db.contact_messages.count_documents({"status": "replied"})
        
        return {
            "total": total,
            "new": new_count,
            "read": read_count,
            "replied": replied_count
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving stats: {str(e)}")