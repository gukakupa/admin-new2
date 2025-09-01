from pydantic import BaseModel
from typing import Literal

class PriceEstimateRequest(BaseModel):
    device_type: Literal['hdd', 'ssd', 'raid', 'usb', 'sd']
    problem_type: Literal['logical', 'physical', 'water', 'fire']
    urgency: Literal['standard', 'urgent', 'emergency']

class PriceEstimateResponse(BaseModel):
    device_type: str
    problem_type: str
    urgency: str
    estimated_price: float
    timeframe_ka: str
    timeframe_en: str
    currency: str = "₾"

# Price calculation constants
BASE_PRICES = {
    'hdd': 100,
    'ssd': 150,
    'raid': 300,
    'usb': 80,
    'sd': 60
}

PROBLEM_MULTIPLIERS = {
    'logical': 1.0,
    'physical': 1.5,
    'water': 2.0,
    'fire': 2.5
}

URGENCY_MULTIPLIERS = {
    'standard': 1.0,
    'urgent': 1.5,
    'emergency': 2.0
}

TIMEFRAMES = {
    'standard': {'ka': 'სტანდარტული (5-7 დღე)', 'en': 'Standard (5-7 days)'},
    'urgent': {'ka': 'ეჩქარებული (2-3 დღე)', 'en': 'Urgent (2-3 days)'},
    'emergency': {'ka': 'გადაუდებელი (24 საათი)', 'en': 'Emergency (24 hours)'}
}