import { createClient } from "@/lib/supabase/client";

export type ArticleRecord = {
  id: string;
  slug: string;
  view_count: number;
  created_at: string;
  updated_at: string;
};

export async function findArticle(
  id: string
): Promise<ArticleRecord | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("articles")
    .select("id, slug, view_count, created_at, updated_at")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function ensureArticle({
  id,
  slug,
}: {
  id: string;
  slug: string;
}): Promise<ArticleRecord> {
  const supabase = createClient();

  const existingArticle = await findArticle(id);

  if (existingArticle) {
    // 如果網址改了，就同步更新 slug
    if (existingArticle.slug !== slug) {
      const { error } = await supabase
        .from("articles")
        .update({ slug })
        .eq("id", id);

      if (error) {
        throw new Error(error.message);
      }

      return {
        ...existingArticle,
        slug,
      };
    }

    return existingArticle;
  }

  const { data, error } = await supabase
    .from("articles")
    .insert({
      id,
      slug,
    })
    .select("id, slug, view_count, created_at, updated_at")
    .single();

  if (!error && data) {
    return data;
  }

  // 兩個人同時建立同一篇文章
  if (error?.code === "23505") {
    const article = await findArticle(id);

    if (article) {
      return article;
    }
  }

  throw new Error(error?.message ?? "Failed to create article.");
}

export async function incrementArticleView(
  articleId: string
) {
  const supabase = createClient();

  const { data, error } = await supabase.rpc(
    "increment_article_view",
    {
      article_uuid: articleId,
    }
  );

  if (error) {
    throw new Error(error.message);
  }
}

export async function getArticleById(
  articleId: string
): Promise<ArticleRecord> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("id", articleId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}