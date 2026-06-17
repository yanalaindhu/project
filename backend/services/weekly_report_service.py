from ai.llm_client import client
import json


def generate_weekly_report(context: str):

    prompt = f"""
    Analyze this user's last week data.

    {context}

    Return ONLY JSON:

    {{
        "weekly_score": 0,
        "biggest_win": "",
        "main_risk": "",
        "mood_trend": "",
        "habit_trend": "",
        "coach_summary": ""
    }}
    """

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    content = response.choices[0].message.content

    content = content.replace("```json", "")
    content = content.replace("```", "")
    content = content.strip()

    return json.loads(content)