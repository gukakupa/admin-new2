from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
from typing import List, Optional
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
class TestimonialBase(BaseModel):
    name: str
    text: str
    rating: int
    position: Optional[str] = None
    company: Optional[str] = None

class TestimonialCreate(TestimonialBase):
    pass

class Testimonial(TestimonialBase):
    id: str
    created_at: datetime
    is_active: bool = True

# MongoDB connection
async def get_database():
    mongo_url = os.environ.get('MONGO_URL', 'mongodb+srv://datalab_user:password@cluster0.mongodb.net/datalab_georgia?retryWrites=true&w=majority')
    client = AsyncIOMotorClient(mongo_url)
    return client["datalab_georgia"]

@app.get("/", response_model=List[Testimonial])
async def get_testimonials():
    db = await get_database()
    testimonials = []
    async for testimonial in db.testimonials.find({"is_active": True}):
        testimonial["id"] = testimonial.pop("_id", str(uuid.uuid4()))
        testimonials.append(testimonial)
    return testimonials

@app.post("/", response_model=Testimonial)
async def create_testimonial(testimonial: TestimonialCreate):
    db = await get_database()
    testimonial_dict = testimonial.dict()
    testimonial_dict["id"] = str(uuid.uuid4())
    testimonial_dict["created_at"] = datetime.now()
    testimonial_dict["is_active"] = True
    
    result = await db.testimonials.insert_one(testimonial_dict)
    testimonial_dict["_id"] = result.inserted_id
    return testimonial_dict

# For Vercel
from fastapi import Request

async def handler(request: Request):
    return await app(request)