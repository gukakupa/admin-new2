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
    status: Literal['pending', 'in_progress', 'completed', 'picked_up', 'archived'] = 'pending'
    case_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    estimated_completion: Optional[datetime] = None
    price: Optional[float] = None
    is_read: bool = False
    is_archived: bool = False
    approved_for_kanban: bool = False  # New field for Kanban approval
    admin_comment: Optional[str] = None  # Admin comment field

class ServiceRequestUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    device_type: Optional[Literal['hdd', 'ssd', 'raid', 'usb', 'sd', 'other']] = None
    problem_description: Optional[str] = None
    urgency: Optional[Literal['low', 'medium', 'high', 'critical']] = None
    status: Optional[Literal['pending', 'in_progress', 'completed', 'picked_up', 'archived']] = None
    estimated_completion: Optional[datetime] = None
    price: Optional[float] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    is_read: Optional[bool] = None
    is_archived: Optional[bool] = None
    approved_for_kanban: Optional[bool] = None
    admin_comment: Optional[str] = None  # Admin comment field  # New field for Kanban approval

class CaseTrackingResponse(BaseModel):
    case_id: str
    device_type: str
    status: str
    progress: int
    created_at: str
    started_at: Optional[str] = None
    completed_at: Optional[str] = None
    estimated_completion: Optional[str] = None
    price: Optional[float] = None