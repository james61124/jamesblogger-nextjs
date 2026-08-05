from pathlib import Path
import mimetypes
import boto3

R2_ENDPOINT = "R2_ENDPOINT"
ACCESS_KEY = "ACCESS_KEY"
SECRET_KEY = "SECRET_KEY"
BUCKET = "james-blogger"

LOCAL_DIR = Path("../public/images/travel/iceland-20241104-1")
R2_PREFIX = "images/travel/iceland-20241104-1"

client = boto3.client(
    "s3",
    endpoint_url=R2_ENDPOINT,
    aws_access_key_id=ACCESS_KEY,
    aws_secret_access_key=SECRET_KEY,
)

files = list(LOCAL_DIR.rglob("*"))

print(files)

for f in files:
    print(f)

for file in LOCAL_DIR.rglob("*"):
    if not file.is_file():
        continue

    relative = file.relative_to(LOCAL_DIR)

    key = f"{R2_PREFIX}/{relative.as_posix()}"

    content_type, _ = mimetypes.guess_type(file)

    print(f"Uploading {file} -> {key}")

    client.upload_file(
        str(file),
        BUCKET,
        key,
        ExtraArgs={
            "ContentType": content_type or "application/octet-stream"
        },
    )

print("Done!")