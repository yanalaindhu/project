from fastapi import APIRouter, HTTPException

from database.supabase_client import supabase

from schemas.journal import JournalCreate

from services.journal_ai_service import analyze_journal


router = APIRouter(
    prefix="/journals",
    tags=["Journals"]
)


@router.post("/")
def create_journal(data: JournalCreate):

    try:

        analysis = analyze_journal(
            data.content
        )

        result = (
            supabase
            .table("journals")
            .insert({
                "user_id": data.user_id,
                "content": data.content,
                "emotion_detected": analysis["emotion"],
                "sentiment_score": analysis["sentiment_score"],
                "stress_level": analysis["stress_level"],
                "summary": analysis["summary"]
            })
            .execute()
        )

        return {
            "success": True,
            "analysis": analysis,
            "journal": result.data
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


@router.get("/{user_id}")
def get_journals(user_id: str):

    try:

        result = (
            supabase
            .table("journals")
            .select("*")
            .eq("user_id", user_id)
            .order("created_at", desc=True)
            .execute()
        )

        return result.data

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )