from ai.llm_client import client
import json


def analyze_journal(text: str):

    prompt = f"""
    Analyze this journal entry.

    Journal:
    {text}

    Return JSON only:

    {{
      "emotion": "",
      "sentiment_score": 0,
      "stress_level": "",
      "summary": ""
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

    return json.loads(
        response.choices[0].message.content
    )