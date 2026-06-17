from ai.llm_client import client
import json


def generate_future_prediction(context: str):

    prompt = f"""
    You are a Future Self Simulator.

    Analyze the user data below.

    {context}

    Predict:

    1. What will happen in 30 days?
    2. What will happen in 90 days?
    3. What will happen in 1 year?

    Give realistic predictions.

    Return ONLY JSON:

    {{
        "30_days": "",
        "90_days": "",
        "1_year": ""
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