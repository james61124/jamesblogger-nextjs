"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/client";
import {
  ensureArticle,
  findArticle,
  type ArticleRecord,
} from "@/lib/supabase/article";
import {
  createComment,
  getComments,
  deleteComment,
  updateComment,
  type CommentRecord,
} from "@/lib/supabase/comments";
import {
  getProfiles,
} from "@/lib/supabase/profile";



type CommentSectionProps = {
  articleSlug: string;
  articleId: string;
};

export default function CommentSection({
  articleSlug,
  articleId,
}: CommentSectionProps) {
  const [user, setUser] = useState<User | null>(null);
  const [article, setArticle] = useState<ArticleRecord | null>(null);
  const [comments, setComments] = useState<CommentRecord[]>([]);
  const [content, setContent] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const loadCommentsWithProfiles = useCallback(
    async (articleId: string): Promise<CommentRecord[]> => {
        const loadedComments = await getComments(articleId);

        if (loadedComments.length === 0) {
        return [];
        }

        const userIds = [
        ...new Set(loadedComments.map((comment) => comment.user_id)),
        ];

        const profiles = await getProfiles(userIds);

        const profileMap = new Map(
        profiles.map((profile) => [profile.id, profile])
        );

        return loadedComments.map((comment) => ({
        ...comment,
        profile: profileMap.get(comment.user_id),
        }));
    },
    []
    );

  const initialize = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const supabase = createClient();

      const {
        data: { user: currentUser },
        } = await supabase.auth.getUser();

      setUser(currentUser);

      let currentArticle = await findArticle(articleId);
      if (!currentArticle && currentUser) {
        currentArticle = await ensureArticle({
            id: articleId,
            slug: articleSlug,
        });
      }

      setArticle(currentArticle);

      if (currentArticle) {
        const loadedComments = await loadCommentsWithProfiles(
            currentArticle.id
        );

        setComments(loadedComments);
      } else {
        setComments([]);
      }
    } catch (error) {
      console.error("Failed to initialize comments:", error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to load comments."
      );
    } finally {
      setIsLoading(false);
    }
  }, [articleSlug, loadCommentsWithProfiles]);

  useEffect(() => {
    void initialize();

    const supabase = createClient();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      void initialize();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [initialize]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user) {
      setErrorMessage("Please sign in before leaving a comment.");
      return;
    }

    if (!content.trim()) {
      setErrorMessage("Comment cannot be empty.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      let currentArticle = article;

      if (!currentArticle) {
        currentArticle = await ensureArticle({
          id: articleId,
          slug: articleSlug,
        });
        setArticle(currentArticle);
      }

      await createComment({
        articleId: currentArticle.id,
        userId: user.id,
        content: content.trim(),
      });

        const refreshedComments = await loadCommentsWithProfiles(
        currentArticle.id
      );

      setComments(refreshedComments);
      setContent("");
    } catch (error) {
      console.error("Failed to publish comment:", error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to publish comment."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(commentId: string) {
    if (!article) return;

    setErrorMessage("");

    try {
        await deleteComment(commentId);

        const refreshedComments =
        await loadCommentsWithProfiles(article.id);

        setComments(refreshedComments);

    } catch (error) {
        console.error("Failed to delete comment:", error);

        setErrorMessage(
        error instanceof Error
            ? error.message
            : "Failed to delete comment."
        );
    }
  }

  async function handleEdit(
    commentId: string,
    content: string
    ) {
    if (!article) return;

    setErrorMessage("");

    try {
        await updateComment({
        commentId,
        content,
        });

        const refreshedComments =
        await loadCommentsWithProfiles(article.id);

        setComments(refreshedComments);

    } catch (error) {
        console.error(error);

        setErrorMessage(
        error instanceof Error
            ? error.message
            : "Failed to edit comment."
        );
    }
  }

  async function handleSignIn() {
    const supabase = createClient();

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(
          window.location.pathname + window.location.search
        )}`,
      },
    });
  }

  return (
    <section className="mx-auto mt-16 w-full max-w-3xl border-neutral-200 pt-10">
      <div className="mb-8">
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
          Discussion
        </p>

        <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">
          Comments
        </h2>

        <p className="mt-2 text-sm text-neutral-500">
          {comments.length === 0
            ? "Be the first to leave a comment."
            : `${comments.length} ${
                comments.length === 1 ? "comment" : "comments"
              }`}
        </p>
      </div>

      {user ? (
        <form onSubmit={handleSubmit} className="mb-10">
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Share your thoughts..."
            rows={4}
            maxLength={2000}
            disabled={isSubmitting}
            className="w-full resize-y rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm leading-6 text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-400 focus:ring-4 focus:ring-neutral-100 disabled:cursor-not-allowed disabled:opacity-60"
          />

          <div className="mt-3 flex items-center justify-between gap-4">
            <span className="text-xs text-neutral-400">
              {content.length}/2000
            </span>

            <button
              type="submit"
              disabled={isSubmitting || !content.trim()}
              className="cursor-pointer rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isSubmitting ? "Publishing..." : "Publish comment"}
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-10 rounded-2xl border border-neutral-200 bg-neutral-50 px-5 py-4">
          <p className="text-sm text-neutral-600">
            <button
              onClick={handleSignIn}
              className="cursor-pointer font-medium text-neutral-900 underline underline-offset-2 hover:text-neutral-700"
            >
              Sign in
            </button>{" "}
            to leave a comment.
          </p>
        </div>
      )}

      {errorMessage && (
        <div
          role="alert"
          className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {errorMessage}
        </div>
      )}

      {isLoading ? (
        <p className="py-6 text-sm text-neutral-500">
          Loading comments...
        </p>
      ) : comments.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-200 px-5 py-10 text-center">
          <p className="text-sm text-neutral-500">
            No comments yet.
          </p>
        </div>
      ) : (
        <div className="space-y-7">
          {comments.map((comment) => (
            <CommentItem
                key={comment.id}
                comment={comment}
                currentUser={user}
                onDelete={handleDelete}
                onEdit={handleEdit}
            />
          ))}
        </div>
      )}
    </section>
  );
}

type CommentItemProps = {
  comment: CommentRecord;
  currentUser: User | null;
  onDelete: (commentId: string) => void;
  onEdit: (
    commentId: string,
    content: string
  ) => Promise<void>;
};

function CommentItem({
  comment,
  currentUser,
  onDelete,
  onEdit,
}: CommentItemProps) {
  const displayName =
    comment.profile?.display_name?.trim() || "Anonymous";

  const avatarUrl = comment.profile?.avatar_url;
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [isSaving, setIsSaving] = useState(false);

  return (
    <article className="flex gap-4">
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt=""
          className="h-10 w-10 shrink-0 rounded-full object-cover"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-sm font-semibold text-neutral-600">
          {displayName.charAt(0).toUpperCase()}
        </div>
      )}

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <p className="text-sm font-semibold text-neutral-900">
                {displayName}
            </p>

            <time
                dateTime={comment.created_at}
                className="text-xs text-neutral-400"
            >
                {formatCommentDate(comment.created_at)}
            </time>

            {comment.is_edited && (
                <span className="text-xs text-neutral-400">
                Edited
                </span>
            )}

            {currentUser?.id === comment.user_id && (
                <>
                    <button
                        onClick={() => setIsEditing(true)}
                        className="cursor-pointer text-xs text-neutral-500 hover:text-neutral-700"
                    >
                        Edit
                    </button>

                    <button
                        onClick={() => {
                            if (
                                confirm(
                                    "Are you sure you want to delete this comment?"
                                )
                            ) {
                                onDelete(comment.id);
                            }
                        }}
                        className="cursor-pointer text-xs text-red-500 hover:text-red-700"
                    >
                        Delete
                    </button>
                </>
            )}
        </div>

        {isEditing ? (
            <div className="mt-2">
                <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    rows={4}
                    className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
                />

                <div className="mt-2 flex gap-2">
                    <button
                        type="button"
                        onClick={async () => {
                            const trimmed = editedContent.trim();

                            if (!trimmed) return;

                            setIsSaving(true);
                            try {
                                await onEdit(comment.id, trimmed);
                                setIsEditing(false);
                            } finally {
                                setIsSaving(false);
                            }
                        }}
                        disabled={isSaving}
                        className="cursor-pointer rounded-full bg-neutral-900 px-4 py-2 text-xs text-white hover:bg-neutral-700"
                    >
                        {isSaving ? "Saving..." : "Save"}
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setEditedContent(comment.content);
                            setIsEditing(false);
                        }}
                        className="cursor-pointer rounded-full border border-neutral-300 px-4 py-2 text-xs hover:bg-neutral-100"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        ) : (
            <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-7 text-neutral-700">
                {comment.content}
            </p>
        )}
      </div>
    </article>
  );
}

function formatCommentDate(dateString: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(dateString));
}