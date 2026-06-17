from fastapi import APIRouter, HTTPException

from database.supabase_client import supabase
from services.coach_service import get_ai_coach_response

router = APIRouter(
    prefix="/coach",
    tags=["AI Coach"]
)
@router.post("/{user_id}")
def ai_coach(user_id: str):

    try:

        checkin = (
            supabase
            .table("daily_checkins")
            .select("*")
            .eq("user_id", user_id)
            .order("created_at", desc=True)
            .limit(1)
            .execute()
        )

        profile = (
            supabase
            .table("profile_analysis")
            .select("*")
            .eq("user_id", user_id)
            .order("created_at", desc=True)
            .limit(1)
            .execute()
        )

        journals = (
            supabase
            .table("journals")
            .select("*")
            .eq("user_id", user_id)
            .limit(5)
            .execute()
        )

        context = f"""
        Checkin:
        {checkin.data}

        Profile:
        {profile.data}

        Journals:
        {journals.data}
        """

        advice = get_ai_coach_response(context)

        return {
            "success": True,
            "coach_response": advice
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )