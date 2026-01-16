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
 
    # 2. Split text into lines
    lines = text.split("\n")

    items = []
    total_co2 = 0.0

    # List of common non-item words to ignore
    trash_words = ["WALMART", "ST#", "OP#", "TE#", "TR#", "STORE", "STREET", "AVE", "THANK", "WELCOME", "TOTAL", "SUBTOTAL", "TAX", "CASH", "CHANGE"]

    # 3. Categorize + calculate CO₂
    for line in lines:
        clean = line.strip().upper()

        # --- THE FILTER (Ignores unnecessary things) ---
        if not clean or len(clean) < 4:
            continue
        
        # Skip if line contains any trash words (Walmart, Store, etc.)
        if any(word in clean for word in trash_words):
            continue
            
        # Skip lines that are mostly numbers (Dates, Phone numbers)
        if sum(c.isdigit() for c in clean) > (len(clean) * 0.5):
            continue
        # -----------------------------------------------

        category = categorize_item(line)
        
        # Only process if it's a valid category (skips unknown noise)
        if category and category.lower() != "unknown":
            co2 = calculate_co2(category)
            items.append({
                "item": line.strip(),
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
    records = get_all_receipts() 
    
    if not records:
        return {
            "daily": [],
            "weekly": [],
            "monthly": []
        }

    # Format data for the Recharts graphs
    daily_data = []
    for i, record in enumerate(records[-7:]): 
        daily_data.append({
            "date": f"Scan {i+1}",
            "co2": record.get("total_co2", 0)
        })

    weekly_total = sum(r.get("total_co2", 0) for r in records)
    weekly_data = [{"week": "Current", "co2": weekly_total}]
    monthly_data = [{"month": "Current Month", "co2": weekly_total}]

    return {
        "daily": daily_data,
        "weekly": weekly_data,
        "monthly": monthly_data
    }