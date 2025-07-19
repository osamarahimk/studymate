from pydantic import BaseModel
from typing import Optional

class DocumentMetadata(BaseModel):
    title: str
    subject: str
    topic: str
    storage_path: str # Path in Firebase Storage
    user_id: str
    created_at: Optional[str] = None