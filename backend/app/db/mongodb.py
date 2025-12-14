from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import MONGODB_URI, MONGODB_DB


client = AsyncIOMotorClient(MONGODB_URI)
db = client[MONGODB_DB]
