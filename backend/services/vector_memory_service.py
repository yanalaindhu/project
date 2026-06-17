import chromadb

client = chromadb.PersistentClient(
    path="./chroma_db"
)

collection = client.get_or_create_collection(
    name="user_memories"
)
def save_memory(user_id, content):

    collection.add(
        documents=[content],
        ids=[f"{user_id}_{hash(content)}"],
        metadatas=[
            {
                "user_id": user_id
            }
        ]
    )
def retrieve_memories(user_id, query):

    result = collection.query(
        query_texts=[query],
        n_results=5,
        where={
            "user_id": user_id
        }
    )

    if result["documents"]:
        return result["documents"][0]

    return []