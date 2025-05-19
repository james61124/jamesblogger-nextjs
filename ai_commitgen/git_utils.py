import subprocess
import os

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
        raise RuntimeError(f"Error running command: {cmd}\n{result.stderr}")
    return result.stdout.strip()

def is_binary_file(file):
    output = run_cmd(f"git diff --cached --numstat {file}")
    return any(line.split()[0] == '-' for line in output.splitlines())

def get_diff_by_file(files=None, staged=True):
    diff_cmd = "git diff --cached" if staged else "git diff"
    file_list = files or run_cmd(f"{diff_cmd} --name-only").splitlines()
    diff_by_file = {}
    for file in file_list:
        if is_binary_file(file):
            continue
        diff = run_cmd(f"{diff_cmd} {file}")
        if diff.strip():
            diff_by_file[file] = diff
    return diff_by_file