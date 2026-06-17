from ai.llm_client import client
import json


def extract_memory(context: str):

    prompt = f"""
    Analyze the user information below.

    Extract ONE important long-term memory.

    User Data:
    {context}

    Return ONLY JSON:

    {{
        "memory_type": "",
        "content": "",
        "importance_score": 1
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