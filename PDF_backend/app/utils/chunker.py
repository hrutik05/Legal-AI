def chunk_text(text, chunk_size=1500):
    chunks = []
    current = ""
    for line in text.split("\n"):
        current += line + " "
        if len(current) > chunk_size:
            chunks.append(current)
            current = ""
    if current:
        chunks.append(current)
    return chunks
