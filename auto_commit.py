import argparse
import subprocess
import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key) 

def chunk_diff(diff: str, max_lines: int = 200):
    lines = diff.splitlines()
    for i in range(0, len(lines), max_lines):
        yield "\n".join(lines[i:i+max_lines])

def summarize_large_diff(file: str, diff: str) -> str:
    summaries = []
    for i, chunk in enumerate(chunk_diff(diff)):
        print(f"Summarizing chunk {i+1} of {file}...")
        prompt = f"""
        Summarize the following code change in the file `{file}`.

        Code diff:
        {chunk}
        """
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2,
        )
        summaries.append(response.choices[0].message.content.strip())
    
    # Combine chunk summaries into a final summary for this file
    final_prompt = f"""
    The following are summaries of different parts of changes made to `{file}`.
    Combine them into a single clear summary of what was changed and why.

    Chunk summaries:
    {"\n".join(summaries)}
    """
    final_response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": final_prompt}],
        temperature=0.2,
    )
    return final_response.choices[0].message.content.strip()

def summarize_diff(file: str, diff: str) -> str:
    token_estimate = len(diff) // 4  # 簡單估計 token 數（1 token ≈ 4 chars）
    if token_estimate > 8000:
        return summarize_large_diff(file, diff)
    else:
        # 正常摘要
        prompt = f"""
        Summarize the following git diff for the file `{file}` in 1–3 concise sentences.
        Focus on what was changed and why.

        Diff:
        {diff}
        """
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2,
        )
        return response.choices[0].message.content.strip()

def run_cmd(cmd, check=True):
    result = subprocess.run(
        cmd,
        shell=True,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace"
    )
    if check and result.returncode != 0:
        print(f"Error running command: {cmd}\n{result.stderr}")
        exit(1)
    return result.stdout.strip()

def get_diff_by_file(files=None):
    file_list = files or run_cmd("git diff --cached --name-only").splitlines()
    diff_by_file = {}
    for file in file_list:
        diff = run_cmd(f"git diff --cached {file}")
        if diff.strip():
            diff_by_file[file] = diff
    return diff_by_file

def generate_commit_message(diff_by_file):
    summaries = []

    for file, diff in diff_by_file.items():
        print(f"Summarizing {file}...")
        summary = summarize_diff(file, diff)
        summaries.append(f"{file}:\n{summary}\n")

    combined_summary = "\n".join(summaries)

    final_prompt = f"""
    You are a professional software engineer. Based on the following summaries of code changes, generate a clear and complete Git commit message in English with this structure:

    1. A short and descriptive title (max 50 characters), written in the imperative mood.
    2. A concise body explaining what was changed and why.
    3. An optional footer for issue references (e.g., "Closes #123").

    Use Conventional Commit style (e.g., feat, fix, chore, refactor, docs, test).

    Code change summaries:
    {combined_summary}
    """

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": final_prompt}],
        temperature=0.2,
    )
    return response.choices[0].message.content.strip()

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("-f", "--files", nargs="+", help="files should be pushed")
    parser.add_argument("-b", "--branch", default="main", help="branch")
    args = parser.parse_args()

    files = args.files
    branch = args.branch

    if files:
        run_cmd(f"git add {' '.join(files)}")
    else:
        run_cmd("git add .")

    diff_by_file = get_diff_by_file(files)

    if not diff_by_file:
        print("no file changed.")
        exit(0)

    commit_msg = generate_commit_message(diff_by_file)
    print(f"commit message:\n{commit_msg}\n")

    # commit & push
    run_cmd(f'git commit -m "{commit_msg}"')
    run_cmd(f"git push origin {branch}")
    print("push complete！")

if __name__ == "__main__":
    main()