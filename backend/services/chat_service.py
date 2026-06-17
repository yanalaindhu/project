from ai.llm_client import client


def generate_chat_response(context, question):

    prompt = f"""
    You are TRIVARNA AI.

    User Context:

    {context}

    User Question:

    {question}

    Give personalized advice.
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