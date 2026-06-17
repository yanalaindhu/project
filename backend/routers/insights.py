from fastapi import APIRouter, HTTPException

from database.supabase_client import supabase
from services.insights_service import generate_insights

router = APIRouter(
    prefix="/insights",
    tags=["AI Insights"]
)
@router.get("/{user_id}")
def get_insights(user_id: str):

    try:

        checkins = (
            supabase
            .table("daily_checkins")
            .select("*")
            .eq("user_id", user_id)
            .execute()
        )

        journals = (
            supabase
            .table("journals")
            .select("*")
            .eq("user_id", user_id)
            .execute()
        )

        goals = (
            supabase
            .table("goals")
            .select("*")
            .eq("user_id", user_id)
            .execute()
        )

        habits = (
            supabase
            .table("habits")
            .select("*")
            .eq("user_id", user_id)
            .execute()
        )

        profile = (
            supabase
            .table("profile_analysis")
            .select("*")
            .eq("user_id", user_id)
            .execute()
        )

        context = f"""
        Checkins:
        {checkins.data}

        Journals:
        {journals.data}

        Goals:
        {goals.data}

        Habits:
        {habits.data}

        Profile:
        {profile.data}
        """

        insights = generate_insights(context)

        supabase.table("ai_insights").insert({
            "user_id": user_id,
            "strengths": insights["strengths"],
            "risks": insights["risks"],
            "recommendations": insights["recommendations"]
        }).execute()

        return insights

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )