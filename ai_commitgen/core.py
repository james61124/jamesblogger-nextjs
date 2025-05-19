
from .config import MAX_CHUNK_LINES
from .openai_utils import chat

def chunk_diff(diff: str, max_lines: int = MAX_CHUNK_LINES):
    lines = diff.splitlines()
    for i in range(0, len(lines), max_lines):
        yield "\n".join(lines[i:i + max_lines])

def summarize_large_diff(file: str, diff: str, model: str, lang: str) -> str:
    summaries = []
    for i, chunk in enumerate(chunk_diff(diff)):
        prompt = f"""
        Summarize the following code change in the file `{file}` ({lang}):

        Code diff:
        {chunk}
        """
        summaries.append(chat(prompt, model))

    combined_prompt = f"""
    Combine the following chunk summaries into one clear summary of changes in `{file}` ({lang}):

    {chr(10).join(summaries)}
    """
    return chat(combined_prompt, model)

def summarize_diff(file: str, diff: str, model: str, lang: str) -> str:
    token_estimate = len(diff) // 4
    if token_estimate > 8000:
        return summarize_large_diff(file, diff, model, lang)
    prompt = f"""
    Summarize the following git diff for the file `{file}` ({lang}) in 1–3 concise sentences:

    Diff:
    {diff}
    """
    return chat(prompt, model)

def generate_commit_message(diff_by_file: dict, model: str, lang: str) -> str:
    summaries = []
    for file, diff in diff_by_file.items():
        summary = summarize_diff(file, diff, model, lang)
        summaries.append(f"{file}:\n{summary}\n")

    final_prompt = f"""
    You are a professional software engineer. Based on the following summaries of code changes, generate a clear and complete Git commit message in {lang} with this structure:

    1. A short and descriptive title (max 50 characters), written in the imperative mood.
    2. A concise body explaining what was changed and why.
    3. An optional footer for issue references (e.g., "Closes #123").

    Use Conventional Commit style (e.g., feat, fix, chore, refactor, docs, test).

    Code change summaries:
    {chr(10).join(summaries)}
    """
    return chat(final_prompt, model)