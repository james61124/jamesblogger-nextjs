import { createClient } from "@/lib/supabase/client";

export async function syncUserProfile() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const displayName =
    user.user_metadata.full_name ||
    user.user_metadata.name ||
    user.email?.split("@")[0] ||
    "Anonymous";

  const avatarUrl =
    user.user_metadata.avatar_url ||
    user.user_metadata.picture ||
    null;

  const { error } = await supabase
    .from("profiles")
    .upsert(
      {
        id: user.id,
        display_name: displayName,
        avatar_url: avatarUrl,
      },
      {
        onConflict: "id",
      }
    );

  if (error) {
    const { data, error } = await supabase
    .from("profiles")
    .upsert(
        {
        id: user.id,
        display_name: displayName,
        avatar_url: avatarUrl,
        },
        {
        onConflict: "id",
        }
    )
    .select();

    console.log("data:", data);
    console.log("error:", JSON.stringify(error, null, 2));
  }
}

export async function getProfiles(ids: string[]) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from("profiles")
        .select("id, display_name, avatar_url")
        .in("id", ids);

    if (error) throw error;

    return data;
}