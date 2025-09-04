from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PriceEstimateRequest(BaseModel):
    device_type: str
    problem_type: str
    urgency: str

class PriceEstimateResponse(BaseModel):
    estimated_price: float
    currency: str
    breakdown: Dict[str, Any]
    timeframe: Dict[str, str]

# Pricing configuration
PRICING_CONFIG = {
    "base_prices": {
        "hdd": 100,
        "ssd": 150,
        "raid": 300,
        "usb": 80,
        "sd": 60
    },
    "problem_multipliers": {
        "logical": 1.0,
        "physical": 1.5,
        "water": 2.0,
        "fire": 2.5
    },
    "urgency_multipliers": {
        "standard": 1.0,
        "urgent": 1.5,
        "emergency": 2.0
    },
    "timeframes": {
        "standard": {"ka": "სტანდარტული (5-7 დღე)", "en": "Standard (5-7 days)"},
        "urgent": {"ka": "ეჩქარებული (2-3 დღე)", "en": "Urgent (2-3 days)"},
        "emergency": {"ka": "გადაუდებელი (24 საათი)", "en": "Emergency (24 hours)"}
    }
}

@app.get("/pricing-info")
async def get_pricing_info():
    return PRICING_CONFIG

@app.post("/", response_model=PriceEstimateResponse)
async def calculate_price(request: PriceEstimateRequest):
    base_price = PRICING_CONFIG["base_prices"].get(request.device_type, 100)
    problem_multiplier = PRICING_CONFIG["problem_multipliers"].get(request.problem_type, 1.0)
    urgency_multiplier = PRICING_CONFIG["urgency_multipliers"].get(request.urgency, 1.0)
    
    estimated_price = base_price * problem_multiplier * urgency_multiplier
    
    return PriceEstimateResponse(
        estimated_price=estimated_price,
        currency="₾",
        breakdown={
            "base_price": base_price,
            "problem_multiplier": problem_multiplier,
            "urgency_multiplier": urgency_multiplier,
            "device_type": request.device_type,
            "problem_type": request.problem_type,
            "urgency": request.urgency
        },
        timeframe=PRICING_CONFIG["timeframes"].get(request.urgency, PRICING_CONFIG["timeframes"]["standard"])
    )

# For Vercel
from fastapi import Request

async def handler(request: Request):
    return await app(request)