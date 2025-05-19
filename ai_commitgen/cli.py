
import argparse
from .git_utils import run_cmd, get_diff_by_file
from .core import generate_commit_message
from .config import DEFAULT_MODEL, DEFAULT_LANG

def main():
    parser = argparse.ArgumentParser(description="AI-powered Git commit message generator")
    parser.add_argument("-f", "--files", nargs="+", help="Files to include")
    parser.add_argument("-b", "--branch", default="main", help="Git branch to push to")
    parser.add_argument("-m", "--model", default=DEFAULT_MODEL, help="OpenAI model to use")
    parser.add_argument("-l", "--lang", default=DEFAULT_LANG, help="Language for output (en or zh)")
    parser.add_argument("-u", "--unstaged", action="store_true", help="Use unstaged changes")
    parser.add_argument("-d", "--dry-run", action="store_true", help="Only print commit message, don’t commit")

    args = parser.parse_args()

    if args.files:
        run_cmd(f"git add {' '.join(args.files)}")
    elif not args.unstaged:
        run_cmd("git add .")

    diff_by_file = get_diff_by_file(args.files, staged=not args.unstaged)
    if not diff_by_file:
        print("No changes found.")
        return

    commit_msg = generate_commit_message(diff_by_file, args.model, args.lang)
    print(f"\nGenerated commit message:\n\n{commit_msg}\n")

    if not args.dry_run:
        run_cmd(f'git commit -m "{commit_msg}"')
        run_cmd(f"git push origin {args.branch}")
        print("\nPush complete.")