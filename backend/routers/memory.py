from fastapi import APIRouter, HTTPException

from database.supabase_client import supabase
from services.memory_service import extract_memory
from services.vector_memory_service import save_memory

router = APIRouter(
    prefix="/memory",
    tags=["Memory"]
)
@router.post("/generate/{user_id}")
def generate_memory(user_id: str):

    try:

        journals = (
            supabase
            .table("journals")
            .select("*")
            .eq("user_id", user_id)
            .execute()
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
        Journals:
        {journals.data}

        Insights:
        {insights.data}

        Reports:
        {reports.data}
        """

        memory = extract_memory(context)

        result = (
            supabase
            .table("memory_entries")
            .insert({
                "user_id": user_id,
                "memory_type": memory["memory_type"],
                "content": memory["content"],
                "importance_score": memory["importance_score"]
            })
            .execute()
        )
        save_memory(
            user_id,
            memory["content"]
        )

        return {
            "success": True,
            "memory": result.data
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
@router.get("/{user_id}")
def get_memory(user_id: str):

    result = (
        supabase
        .table("memory_entries")
        .select("*")
        .eq("user_id", user_id)
        .order("importance_score", desc=True)
        .execute()
    )

    return result.data