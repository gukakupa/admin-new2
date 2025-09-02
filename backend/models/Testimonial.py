from pydantic import BaseModel, Field, HttpUrl
from typing import Optional
from datetime import datetime
import uuid

class TestimonialCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    name_en: str = Field(..., min_length=2, max_length=100)
    position: str = Field(..., min_length=2, max_length=100)
    position_en: str = Field(..., min_length=2, max_length=100)
    text_ka: str = Field(..., min_length=10, max_length=500)
    text_en: str = Field(..., min_length=10, max_length=500)
    rating: int = Field(5, ge=1, le=5)
    image: Optional[str] = None

class Testimonial(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    name_en: str
    position: str
    position_en: str
    text_ka: str
    text_en: str
    rating: int
    image: Optional[str] = None
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)

class TestimonialUpdate(BaseModel):
    name: Optional[str] = None
    name_en: Optional[str] = None
    position: Optional[str] = None
    position_en: Optional[str] = None
    text_ka: Optional[str] = None
    text_en: Optional[str] = None
    rating: Optional[int] = Field(None, ge=1, le=5)
    image: Optional[str] = None
    is_active: Optional[bool] = None