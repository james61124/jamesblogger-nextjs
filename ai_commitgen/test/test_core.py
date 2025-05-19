def test_chunking():
    from ai_commitgen.core import chunk_diff
    long_diff = "\n".join(["+ line" for _ in range(450)])
    chunks = list(chunk_diff(long_diff, 200))
    assert len(chunks) == 3
    assert all(isinstance(chunk, str) for chunk in chunks)