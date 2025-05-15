import argparse
import subprocess
import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key) 

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

def get_diff(files=None):
    if files:
        return run_cmd(f"git diff --cached {' '.join(files)}")
    return run_cmd("git diff --cached")

def generate_commit_message(diff):

    prompt = f"""
    You are a professional software engineer. Based on the following git diff, generate a complete and clear Git commit message in English with the following structure:

    1. A short and descriptive title (max 50 characters), written in the imperative mood (e.g., "Fix bug", "Add feature").
    2. A concise body explaining what was changed and why it was necessary. Wrap lines at 72 characters if needed.
    3. If applicable, add a footer for issue references (e.g., "Closes #123").

    The message should follow the Conventional Commits style (e.g., feat, fix, chore, refactor, docs, test).

    Here is the git diff:{diff}
    """

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            # model="gpt-4o",
            messages=[
                {"role": "user", "content": prompt}
            ],
            temperature=0.2
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"OpenAI API error: {e}")
        exit(1)

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

    diff = get_diff(files)

    if not diff:
        print("no file changed.")
        exit(0)

    commit_msg = generate_commit_message(diff)
    print(f"commit message:\n{commit_msg}\n")

    # commit & push
    run_cmd(f'git commit -m "{commit_msg}"')
    run_cmd(f"git push origin {branch}")
    print("push complete！")

if __name__ == "__main__":
    main()