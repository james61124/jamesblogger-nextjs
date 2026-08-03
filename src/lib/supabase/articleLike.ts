import { createClient } from "@/lib/supabase/client";

export type ArticleLikeInfo = {
  liked: boolean;
  count: number;
};

export async function getArticleLikeInfo(
  articleId: string,
  userId?: string
): Promise<ArticleLikeInfo> {
  const supabase = createClient();

  const { count, error: countError } = await supabase
    .from("article_likes")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq("article_id", articleId);

  if (countError) {
    throw new Error(countError.message);
  }

  if (!userId) {
    return {
      liked: false,
      count: count ?? 0,
    };
  }

  const { data, error } = await supabase
    .from("article_likes")
    .select("article_id")
    .eq("article_id", articleId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return {
    liked: data !== null,
    count: count ?? 0,
  };
}

export async function toggleArticleLike(
  articleId: string,
  userId: string
): Promise<boolean> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("article_likes")
    .select("article_id")
    .eq("article_id", articleId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  // already liked -> unlike
  if (data) {
    const { error: deleteError } = await supabase
      .from("article_likes")
      .delete()
      .eq("article_id", articleId)
      .eq("user_id", userId);

    if (deleteError) {
      throw new Error(deleteError.message);
    }

    return false;
  }

  // not liked -> like
  const { error: insertError } = await supabase
    .from("article_likes")
    .insert({
      article_id: articleId,
      user_id: userId,
    });

  if (insertError) {
    throw new Error(insertError.message);
  }

  return true;
}