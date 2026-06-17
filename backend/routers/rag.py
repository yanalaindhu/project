from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from services.vector_memory_service import retrieve_memories
from ai.llm_client import client

router = APIRouter(
    prefix="/rag",
    tags=["RAG Memory"]
)

class RAGQuestion(BaseModel):
    question: str

@router.post("/{user_id}")
def ask_memory(user_id: str, data: RAGQuestion):

    memories = retrieve_memories(
        user_id,
        data.question
    )

    context = "\n".join(memories)

    prompt = f"""
    User Memories:
    {context}

    Question:
    {data.question}

    Answer based only on memories.
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

    return {
        "answer": response.choices[0].message.content,
        "memories_used": memories
    }