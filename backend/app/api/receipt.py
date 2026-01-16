
from fastapi import APIRouter, UploadFile, File
from app.services.ocr_service import extract_text
from app.services.categorize import categorize_item
from app.services.carbon_calc import calculate_co2
from app.services.db_service import save_receipt, get_all_receipts


router = APIRouter(
    prefix="/receipt",
    tags=["Receipt"]
)


@router.post("/upload")
async def upload_receipt(file: UploadFile = File(...)):
    # 1. OCR
    text = extract_text(file.file)
 
    # 2. Split text into lines (simple parsing)
    lines = text.split("\n")

    items = []
    total_co2 = 0.0

    # 3. Categorize + calculate CO₂
    for line in lines:
        if line.strip() == "":
            continue

        category = categorize_item(line)
        co2 = calculate_co2(category)

        items.append({
            "item": line,
            "category": category,
            "co2": co2
        })

        total_co2 += co2

    save_receipt(items, total_co2)
   

    # 4. Return result
    return {
        "items": items,
        "total_co2": round(total_co2, 2)
    }

@router.get("/analytics")
async def get_analytics():
    records = get_all_receipts() # Ensure this returns a list of dictionaries
    
    if not records:
        return {
            "daily": [],
            "weekly": [],
            "monthly": []
        }

    # 1. Calculate Daily (Mapping receipts to days)
    # For now, we'll map the last few receipts to specific days for the graph
    daily_data = []
    for i, record in enumerate(records[-7:]): # Take last 7 receipts
        daily_data.append({
            "date": f"Entry {i+1}",
            "co2": record.get("total_co2", 0)
        })

    # 2. Calculate Weekly
    weekly_total = sum(r.get("total_co2", 0) for r in records)
    weekly_data = [{"week": "Current", "co2": weekly_total}]

    # 3. Calculate Monthly
    monthly_data = [{"month": "January", "co2": weekly_total}]

    return {
        "daily": daily_data,
        "weekly": weekly_data,
        "monthly": monthly_data
    }