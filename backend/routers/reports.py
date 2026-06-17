from fastapi import APIRouter, HTTPException

from database.supabase_client import supabase
from services.weekly_report_service import generate_weekly_report

router = APIRouter(
    prefix="/reports",
    tags=["Weekly Reports"]
)
@router.get("/weekly/{user_id}")
def weekly_report(user_id: str):

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

        context = f"""
        CHECKINS:
        {checkins.data}

        JOURNALS:
        {journals.data}

        GOALS:
        {goals.data}

        HABITS:
        {habits.data}
        """

        report = generate_weekly_report(
            context
        )

        supabase.table(
            "weekly_reports"
        ).insert({
            "user_id": user_id,
            "weekly_score": report["weekly_score"],
            "biggest_win": report["biggest_win"],
            "main_risk": report["main_risk"],
            "mood_trend": report["mood_trend"],
            "habit_trend": report["habit_trend"],
            "coach_summary": report["coach_summary"]
        }).execute()

        return report

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )