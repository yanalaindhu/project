from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from database.supabase_client import supabase

from services.vector_memory_service import retrieve_memories
from services.chat_service import generate_chat_response

router = APIRouter(
    prefix="/chat",
    tags=["TRIVARNA AI Chat"]
)


class ChatRequest(BaseModel):
    message: str
@router.post("/{user_id}")
def chat(user_id: str, data: ChatRequest):

    try:

        memories = retrieve_memories(
            user_id,
            data.message
        )

        insights = (
            supabase
            .table("ai_insights")
            .select("*")
            .eq("user_id", user_id)
            .execute()
        )

        reports = (
            supabase
            .table("weekly_reports")
            .select("*")
            .eq("user_id", user_id)
            .execute()
        )

        context = f"""
        Memories:
        {memories}

        Insights:
        {insights.data}

        Reports:
        {reports.data}
        """

        answer = generate_chat_response(
            context,
            data.message
        )

        return {
            "answer": answer
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )