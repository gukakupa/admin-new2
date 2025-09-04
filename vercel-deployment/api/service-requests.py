from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, EmailStr
from typing import Optional, List
import os
from datetime import datetime
import uuid

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class ServiceRequestCreate(BaseModel):
    email: EmailStr
    phone: str
    device_type: str
    problem_description: str
    urgency: str
    estimated_price: Optional[float] = None

class ServiceRequest(BaseModel):
    id: str
    case_id: str
    email: str
    phone: str
    device_type: str
    problem_description: str
    urgency: str
    estimated_price: Optional[float] = None
    status: str = "pending"
    created_at: datetime
    progress_percentage: int = 0

# MongoDB connection
async def get_database():
    mongo_url = os.environ.get('MONGO_URL', 'mongodb+srv://datalab_user:password@cluster0.mongodb.net/datalab_georgia?retryWrites=true&w=majority')
    client = AsyncIOMotorClient(mongo_url)
    return client["datalab_georgia"]

def generate_case_id() -> str:
    import random
    year = datetime.now().year
    random_num = random.randint(1, 999)
    return f"DL{year}{random_num:03d}"

@app.post("/", response_model=ServiceRequest)
async def create_service_request(request: ServiceRequestCreate):
    db = await get_database()
    
    request_dict = request.dict()
    request_dict["id"] = str(uuid.uuid4())
    request_dict["case_id"] = generate_case_id()
    request_dict["status"] = "pending"
    request_dict["created_at"] = datetime.now()
    request_dict["progress_percentage"] = 10
    
    # Check if case_id already exists, regenerate if needed
    while await db.service_requests.find_one({"case_id": request_dict["case_id"]}):
        request_dict["case_id"] = generate_case_id()
    
    result = await db.service_requests.insert_one(request_dict)
    request_dict["_id"] = result.inserted_id
    
    return request_dict

@app.get("/{case_id}")
async def get_service_request(case_id: str):
    db = await get_database()
    
    request = await db.service_requests.find_one({"case_id": case_id})
    if not request:
        raise HTTPException(status_code=404, detail="Service request not found")
    
    request["id"] = request.pop("_id", str(uuid.uuid4()))
    return request

# For Vercel
from fastapi import Request

async def handler(request: Request):
    return await app(request)