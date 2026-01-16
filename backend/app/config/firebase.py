import firebase_admin
from firebase_admin import credentials, firestore
import os

try:
    cred = credentials.Certificate("app/firebase_key.json")
    firebase_admin.initialize_app(cred)
    db = firestore.client()
except Exception as e:
    print(f"Firebase initialization failed: {e}. Using mock database.")
    # Mock database for testing
    class MockDB:
        def collection(self, name):
            return self
        
        def add(self, data):
            print(f"Mock save: {data}")
            return None, "mock-id"
        
        def stream(self):
            return []
    
    db = MockDB()

