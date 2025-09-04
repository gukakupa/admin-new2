from fastapi import APIRouter, HTTPException, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List
from datetime import datetime, timedelta
import os

from models.ServiceRequest import (
    ServiceRequestCreate, 
    ServiceRequest, 
    ServiceRequestUpdate,
    CaseTrackingResponse
)
from utils.case_generator import CaseIDGenerator, calculate_progress, get_estimated_completion_days

router = APIRouter(tags=["service-requests"])

# Database dependency
async def get_database():
    from motor.motor_asyncio import AsyncIOMotorClient
    client = AsyncIOMotorClient(os.environ['MONGO_URL'])
    db = client[os.environ['DB_NAME']]
    return db

@router.post("/", response_model=dict)
async def create_service_request(
    request: ServiceRequestCreate,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Create a new service request and return case ID"""
    try:
        # Generate unique case ID
        case_generator = CaseIDGenerator(db)
        case_id = await case_generator.generate_case_id()
        
        # Calculate estimated completion
        days = get_estimated_completion_days(request.urgency)
        estimated_completion = datetime.utcnow() + timedelta(days=days)
        
        # Create service request
        service_request = ServiceRequest(
            **request.dict(),
            case_id=case_id,
            estimated_completion=estimated_completion
        )
        
        # Insert into database
        result = await db.service_requests.insert_one(service_request.dict())
        
        if result.inserted_id:
            return {
                "success": True,
                "message": "Service request created successfully",
                "case_id": case_id,
                "estimated_completion": estimated_completion.isoformat()
            }
        else:
            raise HTTPException(status_code=500, detail="Failed to create service request")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating service request: {str(e)}")

@router.get("/archived", response_model=List[ServiceRequest])
async def get_archived_service_requests(
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get archived service requests (admin endpoint)"""
    try:
        cursor = db.service_requests.find({"is_archived": True}).sort("completed_at", -1)
        requests = await cursor.to_list(1000)
        
        return [ServiceRequest(**request) for request in requests]
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving archived requests: {str(e)}")

@router.get("/{case_id}", response_model=CaseTrackingResponse)
async def get_service_request_by_case_id(
    case_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get service request by case ID for tracking"""
    try:
        service_request = await db.service_requests.find_one({"case_id": case_id})
        
        if not service_request:
            raise HTTPException(status_code=404, detail="Case not found")
        
        progress = calculate_progress(service_request['status'])
        
        response = CaseTrackingResponse(
            case_id=service_request['case_id'],
            device_type=service_request['device_type'],
            status=service_request['status'],
            progress=progress,
            created_at=service_request['created_at'].strftime('%Y-%m-%d'),
            started_at=service_request.get('started_at', '').strftime('%Y-%m-%d') if service_request.get('started_at') else None,
            completed_at=service_request.get('completed_at', '').strftime('%Y-%m-%d') if service_request.get('completed_at') else None,
            estimated_completion=service_request.get('estimated_completion', '').strftime('%Y-%m-%d') if service_request.get('estimated_completion') else None,
            price=service_request.get('price')
        )
        
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving case: {str(e)}")

@router.get("/", response_model=List[ServiceRequest])
async def get_all_service_requests(
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get all active (non-archived) service requests (admin endpoint)"""
    try:
        cursor = db.service_requests.find({"is_archived": {"$ne": True}}).sort("created_at", -1)
        requests = await cursor.to_list(1000)
        
        return [ServiceRequest(**request) for request in requests]
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving requests: {str(e)}")

@router.put("/{request_id}", response_model=dict)
async def update_service_request(
    request_id: str,
    update: ServiceRequestUpdate,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Update service request status (admin endpoint)"""
    try:
        update_data = {k: v for k, v in update.dict().items() if v is not None}
        
        # Add timestamps based on status changes
        if 'status' in update_data:
            if update_data['status'] == 'in_progress' and 'started_at' not in update_data:
                update_data['started_at'] = datetime.utcnow()
            elif update_data['status'] == 'completed' and 'completed_at' not in update_data:
                update_data['completed_at'] = datetime.utcnow()
        
        # Mark as read when status is updated
        if 'status' in update_data and update_data['status'] != 'pending':
            update_data['is_read'] = True
        
        if update_data:
            result = await db.service_requests.update_one(
                {"id": request_id},
                {"$set": update_data}
            )
            
            if result.matched_count == 0:
                raise HTTPException(status_code=404, detail="Service request not found")
            
            return {"success": True, "message": "Service request updated successfully"}
        else:
            return {"success": False, "message": "No data to update"}
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating request: {str(e)}")

@router.put("/{request_id}/archive", response_model=dict)
async def archive_service_request(
    request_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Archive a completed service request"""
    try:
        # First check if request exists and is completed
        request = await db.service_requests.find_one({"id": request_id})
        if not request:
            raise HTTPException(status_code=404, detail="Service request not found")
        
        if request.get('status') != 'completed':
            raise HTTPException(status_code=400, detail="Only completed requests can be archived")
        
        result = await db.service_requests.update_one(
            {"id": request_id},
            {"$set": {"is_archived": True, "status": "archived"}}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Service request not found")
        
        return {"success": True, "message": "Service request archived successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error archiving request: {str(e)}")