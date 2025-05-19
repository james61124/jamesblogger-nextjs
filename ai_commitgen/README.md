# AI CommitGen

> Auto-generate Git commit messages using OpenAI GPT models.

## 🔧 Installation

```bash
pip install .
```

## 🚀 Usage

```bash
ai-commit [-f FILES...] [-b BRANCH] [-m MODEL] [-l LANG] [-u] [-d]
```

### Options

- `-f`, `--files`      Files to commit
- `-b`, `--branch`     Git branch to push to (default: main)
- `-m`, `--model`      OpenAI model (default: gpt-3.5-turbo)
- `-l`, `--lang`       Language (en or zh)
- `-u`, `--unstaged`   Use unstaged changes
- `-d`, `--dry-run`    Only print the message, don’t commit or push

## 🌱 Example

```bash
ai-commit -f src/app.py -l en -m gpt-4
```

## 📜 License

MIT


## pyproject.toml

[project]
name = "ai-commitgen"
version = "0.1.0"
description = "Generate Git commit messages using OpenAI GPT"
authors = [{ name = "Your Name", email = "your@email.com" }]
license = "MIT"
dependencies = [
    "openai",
    "python-dotenv"
]

[project.scripts]
ai-commit = "ai_commitgen.cli:main"