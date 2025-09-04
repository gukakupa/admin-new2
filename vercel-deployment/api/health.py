from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorClient

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection
async def get_database():
    mongo_url = os.environ.get('MONGO_URL', 'mongodb+srv://datalab_user:password@cluster0.mongodb.net/datalab_georgia?retryWrites=true&w=majority')
    client = AsyncIOMotorClient(mongo_url)
    return client["datalab_georgia"]

@app.get("/")
async def health_check():
    try:
        db = await get_database()
        # Test database connection
        await db.list_collection_names()
        return {
            "status": "healthy",
            "database": "connected",
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        return {
            "status": "error",
            "database": "disconnected",
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }

# For Vercel
from fastapi import Request

async def handler(request: Request):
    return await app(request)