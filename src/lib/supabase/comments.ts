import { createClient } from "@/lib/supabase/client";

export type CommentProfile = {
  display_name: string | null;
  avatar_url: string | null;
};

export type ProfileRecord = {
    id: string;
    display_name: string | null;
    avatar_url: string | null;
};

export type CommentRecord = {
    id: string;
    article_id: string;
    user_id: string;
    parent_id: string | null;
    content: string;
    is_edited: boolean;
    created_at: string;
    updated_at: string;

    profile?: ProfileRecord;
};

export async function getComments(
  articleId: string
): Promise<CommentRecord[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("article_id", articleId)
    .is("parent_id", null)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as unknown as CommentRecord[];
}

type CreateCommentInput = {
  articleId: string;
  userId: string;
  content: string;
};

export async function createComment({
  articleId,
  userId,
  content,
}: {
  articleId: string;
  userId: string;
  content: string;
}): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase
    .from("comments")
    .insert({
      article_id: articleId,
      user_id: userId,
      parent_id: null,
      content,
    });

  if (error) {
    throw new Error(error.message);
  }
}

export async function deleteComment(commentId: string) {
  const supabase = createClient();

  const { error } = await supabase
    .from("comments")
    .delete()
    .eq("id", commentId);

  if (error) throw error;
}

export async function updateComment({
  commentId,
  content,
}: {
  commentId: string;
  content: string;
}): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase
    .from("comments")
    .update({
      content,
      is_edited: true,
    })
    .eq("id", commentId);

  if (error) {
    throw new Error(error.message);
  }
}