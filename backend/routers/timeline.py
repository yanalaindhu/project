from fastapi import APIRouter, HTTPException

from database.supabase_client import supabase

router = APIRouter(
    prefix="/timeline",
    tags=["Timeline"]
)


@router.get("/{user_id}")
def get_timeline(user_id: str):

    try:

        scores = (
            supabase
            .table("trivarna_scores")
            .select("*")
            .eq("user_id", user_id)
            .order("created_at")
            .execute()
        )

        burnout = (
            supabase
            .table("burnout_predictions")
            .select("*")
            .eq("user_id", user_id)
            .order("created_at")
            .execute()
        )

        return {
            "mind_score_trend": [
                x["mind_score"]
                for x in scores.data
            ],

            "body_score_trend": [
                x["body_score"]
                for x in scores.data
            ],

            "lifestyle_score_trend": [
                x["lifestyle_score"]
                for x in scores.data
            ],

            "overall_score_trend": [
                x["overall_score"]
                for x in scores.data
            ],

            "burnout_trend": [
                x["burnout_score"]
                for x in burnout.data
            ]
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )