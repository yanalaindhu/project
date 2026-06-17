from ai.llm_client import client
import json


def analyze_journal(text: str):

    prompt = f"""
    Analyze this journal entry.

    Journal:
    {text}

    Return ONLY valid JSON:

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

    content = response.choices[0].message.content

    # Remove markdown if model wraps JSON
    content = content.replace("```json", "")
    content = content.replace("```", "")
    content = content.strip()

    return json.loads(content)