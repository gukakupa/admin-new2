from pydantic import BaseModel, Field, EmailStr
from typing import Optional, Literal
from datetime import datetime
import uuid

class ServiceRequestCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: str = Field(..., min_length=9, max_length=20)
    device_type: Literal['hdd', 'ssd', 'raid', 'usb', 'sd', 'other']
    problem_description: str = Field(..., min_length=10, max_length=1000)
    urgency: Literal['low', 'medium', 'high', 'critical']

class ServiceRequest(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    phone: str
    device_type: str
    problem_description: str
    urgency: str
    status: Literal['pending', 'in_progress', 'completed'] = 'pending'
    case_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    estimated_completion: Optional[datetime] = None
    price: Optional[float] = None

class ServiceRequestUpdate(BaseModel):
    status: Optional[Literal['pending', 'in_progress', 'completed']] = None
    estimated_completion: Optional[datetime] = None
    price: Optional[float] = None

class CaseTrackingResponse(BaseModel):
    case_id: str
    device_type: str
    status: str
    progress: int
    created_at: str
    estimated_completion: Optional[str] = None
    price: Optional[float] = None