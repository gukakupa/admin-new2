from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, EmailStr
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
class ContactMessage(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str

class ContactResponse(BaseModel):
    message_id: str
    status: str
    timestamp: datetime

# MongoDB connection
async def get_database():
    mongo_url = os.environ.get('MONGO_URL', 'mongodb+srv://datalab_user:password@cluster0.mongodb.net/datalab_georgia?retryWrites=true&w=majority')
    client = AsyncIOMotorClient(mongo_url)
    return client["datalab_georgia"]

@app.post("/", response_model=ContactResponse)
async def submit_contact(contact: ContactMessage):
    db = await get_database()
    
    contact_dict = contact.dict()
    contact_dict["message_id"] = str(uuid.uuid4())
    contact_dict["status"] = "new"
    contact_dict["created_at"] = datetime.now()
    contact_dict["is_read"] = False
    
    result = await db.contact_messages.insert_one(contact_dict)
    
    return ContactResponse(
        message_id=contact_dict["message_id"],
        status="received",
        timestamp=contact_dict["created_at"]
    )

# For Vercel
from fastapi import Request

async def handler(request: Request):
    return await app(request)