from fastapi import FastAPI, APIRouter
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List
import uuid
from datetime import datetime

# Import route modules
from routes import service_requests, contact, price_estimate, testimonials

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(
    title="DataLab Georgia API",
    description="Data Recovery Service API",
    version="1.0.0"
)

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Define Models (keeping original status check for health monitoring)
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

# Health check endpoints
@api_router.get("/")
async def root():
    return {"message": "DataLab Georgia API is running", "status": "healthy"}

@api_router.get("/health")
async def health_check():
    try:
        # Test database connection
        await client.admin.command('ping')
        return {
            "status": "healthy",
            "database": "connected",
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        return {
            "status": "unhealthy", 
            "database": "disconnected",
            "error": str(e),
            "timestamp": datetime.utcnow().isoformat()
        }

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# Include all route modules with proper prefixes
api_router.include_router(service_requests.router, prefix="/service-requests")
api_router.include_router(contact.router, prefix="/contact")
api_router.include_router(price_estimate.router, prefix="/price-estimate")
api_router.include_router(testimonials.router, prefix="/testimonials")

# Include the main API router in the app
app.include_router(api_router)

# Static files serving for production deployment
static_dir = ROOT_DIR / "static"
if static_dir.exists():
    app.mount("/static", StaticFiles(directory=str(static_dir)), name="static")
    
    # Serve React app for all non-API routes
    @app.get("/{path:path}")
    async def serve_react_app(path: str):
        """Serve the React application for all non-API routes."""
        # If requesting a file with extension, try to serve it
        if "." in path and not path.startswith("api/"):
            file_path = static_dir / path
            if file_path.exists():
                return FileResponse(file_path)
        
        # For all other routes, serve index.html (React Router will handle routing)
        index_path = static_dir / "index.html"
        if index_path.exists():
            return FileResponse(index_path)
        
        # Fallback to API 404
        return {"detail": "Not found"}

# Root endpoint for API
@app.get("/", include_in_schema=False)
async def root():
    return {"message": "DataLab Georgia API is running", "status": "healthy"}

# Health check endpoint
@app.get("/api/health", include_in_schema=False)
async def health_check():
    return {
        "status": "healthy",
        "database": "connected",
        "timestamp": datetime.utcnow().isoformat()
    }

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
