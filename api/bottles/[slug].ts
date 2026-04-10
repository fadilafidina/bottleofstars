import { getSupabaseAdmin } from "../_lib/supabase-admin";
import { allowMethods, json } from "../_lib/http";

export default async function handler(req: any, res: any) {
  if (!allowMethods(req, res, ["GET"])) {
    return;
  }

  try {
    const { slug, token, mode } = req.query;

    if (!slug || !token || !mode) {
      json(res, 400, { error: "Missing slug, token, or mode." });
      return;
    }

    const supabase = getSupabaseAdmin();
    const tokenColumn = mode === "guest" ? "guest_token" : "view_token";

    const { data, error } = await supabase
      .from("bottles")
      .select("id, slug, title, recipient_names, occasion_type, theme, created_at")
      .eq("slug", slug)
      .eq(tokenColumn, token)
      .single();

    if (error || !data) {
      json(res, 404, { error: "Bottle not found." });
      return;
    }

    json(res, 200, {
      bottle: {
        id: data.id,
        slug: data.slug,
        title: data.title,
        recipientNames: data.recipient_names,
        occasionType: data.occasion_type,
        theme: data.theme,
        createdAt: data.created_at,
      },
    });
  } catch (error) {
    json(res, 500, {
      error: error instanceof Error ? error.message : "Unexpected server error.",
    });
  }
}
