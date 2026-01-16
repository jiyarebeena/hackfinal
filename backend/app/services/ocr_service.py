import pytesseract
from PIL import Image
import io
import os

# --- ADD THIS LINE ---
# This tells Python where the actual Tesseract engine lives
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

def extract_text(file) -> str:
    try:
        # Read image bytes
        image_bytes = file.read()
        image = Image.open(io.BytesIO(image_bytes))

        # Perform OCR
        text = pytesseract.image_to_string(image)
        
        # If text is empty, it means OCR worked but found nothing
        if not text.strip():
            return "ERROR: No text detected on receipt."

        return text.strip()

    except Exception as e:
        # If you see this in your terminal, the path above is wrong
        print(f"OCR Error: {e}")
        return "ERROR: Tesseract engine not found at specified path."