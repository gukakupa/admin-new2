from fastapi import APIRouter, HTTPException
from models.PriceEstimate import (
    PriceEstimateRequest,
    PriceEstimateResponse,
    BASE_PRICES,
    PROBLEM_MULTIPLIERS,
    URGENCY_MULTIPLIERS,
    TIMEFRAMES
)

router = APIRouter(tags=["price-estimate"])

@router.post("/", response_model=PriceEstimateResponse)
async def calculate_price_estimate(request: PriceEstimateRequest):
    """Calculate price estimate based on device type, problem type, and urgency"""
    try:
        # Get base price
        base_price = BASE_PRICES.get(request.device_type)
        if not base_price:
            raise HTTPException(status_code=400, detail="Invalid device type")
        
        # Get multipliers
        problem_multiplier = PROBLEM_MULTIPLIERS.get(request.problem_type)
        urgency_multiplier = URGENCY_MULTIPLIERS.get(request.urgency)
        
        if not problem_multiplier or not urgency_multiplier:
            raise HTTPException(status_code=400, detail="Invalid problem type or urgency")
        
        # Calculate final price
        estimated_price = round(base_price * problem_multiplier * urgency_multiplier)
        
        # Get timeframe
        timeframe = TIMEFRAMES.get(request.urgency)
        if not timeframe:
            raise HTTPException(status_code=400, detail="Invalid urgency level")
        
        return PriceEstimateResponse(
            device_type=request.device_type,
            problem_type=request.problem_type,
            urgency=request.urgency,
            estimated_price=estimated_price,
            timeframe_ka=timeframe['ka'],
            timeframe_en=timeframe['en']
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calculating price: {str(e)}")

@router.get("/pricing-info", response_model=dict)
async def get_pricing_info():
    """Get pricing information and multipliers"""
    return {
        "base_prices": BASE_PRICES,
        "problem_multipliers": PROBLEM_MULTIPLIERS,
        "urgency_multipliers": URGENCY_MULTIPLIERS,
        "timeframes": TIMEFRAMES
    }