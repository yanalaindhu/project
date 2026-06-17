from pydantic import BaseModel


class JournalCreate(BaseModel):
    user_id: str
    content: str