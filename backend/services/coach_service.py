from ai.llm_client import client


def get_ai_coach_response(context: str):

    prompt = f"""
    You are TRIVARNA AI Coach.

    Analyze the user data below:

    {context}

    Provide:

    1. Mind wellness advice
    2. Body wellness advice
    3. Lifestyle advice
    4. One action for tomorrow

    Keep response under 150 words.
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

    return response.choices[0].message.content