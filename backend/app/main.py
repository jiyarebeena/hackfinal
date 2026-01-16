from fastapi import FastAPI
from app.api.receipt import router as receipt_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Carbon Receipt Tracker",
    description="Scan receipts and calculate carbon footprint",
    version="1.0"
)

# 1. ADD MIDDLEWARE FIRST
app.add_middleware(
    CORSMiddleware,
    # Adding both localhost and 127.0.0.1 to be safe
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. REGISTER ROUTES AFTER MIDDLEWARE
app.include_router(receipt_router)

@app.get("/")
def root():
    return {"message": "Carbon Receipt Tracker API is running"}