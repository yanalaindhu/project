from ai.llm_client import client
import json


def generate_insights(context: str):

    prompt = f"""
    Analyze the user data.

    {context}

    Return ONLY JSON:

    {{
      "strengths": [],
      "risks": [],
      "recommendations": []
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