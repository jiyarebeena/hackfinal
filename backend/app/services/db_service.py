from app.config.firebase import db
from datetime import datetime, timezone, timedelta

def save_receipt(items, total_co2):
    now = datetime.now(timezone.utc)

    data = {
        "items": items,
        "total_co2": total_co2,
        "created_at": now,                       # ✅ timezone-aware
        "date": now.strftime("%Y-%m-%d")         # for UI grouping
    }

    db.collection("receipts").add(data)


def get_all_receipts():
    receipts = []
    docs = db.collection("receipts").stream()

    for doc in docs:
        receipts.append(doc.to_dict())

    return receipts
# backend/app/services/db_service.py

# THIS LIST MUST BE OUTSIDE THE FUNCTIONS
mock_db = []

def save_receipt(items, total_co2):
    entry = {
        "items": items,
        "total_co2": total_co2,
        "date": "2024-01-20" # You can use datetime.now() here
    }
    mock_db.append(entry)
    print(f"DATABASE_LOG: Saved {total_co2}kg. Total records: {len(mock_db)}")

def get_all_receipts():
    return mock_db