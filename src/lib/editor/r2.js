// R2 的存取：上傳、搬資料夾、列出和刪除檔案。金鑰都從 .env.local 讀。

import {
  CopyObjectCommand,
  DeleteObjectsCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

export const BUCKET = process.env.R2_BUCKET || "james-blogger";
export const PUBLIC_BASE = (process.env.NEXT_PUBLIC_R2_BASE_URL || "").replace(/\/$/, "");

let client;
function r2() {
  client ??= new S3Client({
    region: "auto",
    endpoint: process.env.R2_ENDPOINT,
    credentials: { accessKeyId: process.env.ACCESS_KEY, secretAccessKey: process.env.SECRET_KEY },
  });
  return client;
}

export const publicUrl = (key) => `${PUBLIC_BASE}/${key}`;

export async function exists(key) {
  try {
    await r2().send(new HeadObjectCommand({ Bucket: BUCKET, Key: key }));
    return true;
  } catch (error) {
    if (error?.$metadata?.httpStatusCode === 404 || error?.name === "NotFound") return false;
    throw error;
  }
}

export async function put(key, body, contentType) {
  await r2().send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType,
      CacheControl: "public, max-age=31536000, immutable",
    })
  );
}

export async function listAll(prefix = "") {
  const objects = [];
  let token;
  do {
    const page = await r2().send(new ListObjectsV2Command({ Bucket: BUCKET, Prefix: prefix, ContinuationToken: token }));
    for (const item of page.Contents || []) objects.push({ key: item.Key, size: item.Size, modified: item.LastModified });
    token = page.IsTruncated ? page.NextContinuationToken : undefined;
  } while (token);
  return objects;
}

export async function removeMany(keys) {
  for (let i = 0; i < keys.length; i += 1000) {
    const batch = keys.slice(i, i + 1000);
    const result = await r2().send(
      new DeleteObjectsCommand({ Bucket: BUCKET, Delete: { Objects: batch.map((Key) => ({ Key })), Quiet: true } })
    );
    if (result.Errors?.length) throw new Error(`R2 刪除失敗：${result.Errors.map((e) => e.Key).join(", ")}`);
  }
}

// R2 沒有「改名」，只能整個資料夾複製到新位置再刪掉舊的
export async function movePrefix(fromPrefix, toPrefix) {
  const objects = await listAll(fromPrefix);
  for (const { key } of objects) {
    const target = toPrefix + key.slice(fromPrefix.length);
    await r2().send(
      new CopyObjectCommand({
        Bucket: BUCKET,
        CopySource: `${BUCKET}/${key.split("/").map(encodeURIComponent).join("/")}`,
        Key: target,
      })
    );
  }
  await removeMany(objects.map((object) => object.key));
  return objects.length;
}
