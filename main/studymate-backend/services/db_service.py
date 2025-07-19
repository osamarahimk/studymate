# services/db_service.py
from pymongo import MongoClient
import os

def get_mongo_client():
    mongo_uri = os.getenv("MONGO_URI")
    client = MongoClient(mongo_uri)
    return client

def get_database():
    client = get_mongo_client()
    return client[os.getenv("MONGO_DB_NAME")]

# Example function to interact with documents collection
def get_documents_collection():
    db = get_database()
    return db["documents"]

def get_discussions_collection():
    db = get_database()
    return db["discussions"]