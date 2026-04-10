import { getSupabaseAdmin } from "../_lib/supabase-admin.js";
import { allowMethods, json, parseJsonBody, requireAdmin } from "../_lib/http.js";
import { generateToken, slugify } from "../_lib/tokens.js";

type CreateBottleBody = {
  title?: string;
  recipientNames?: string;
  occasionType?: string;
  slug?: string;
};

export default async function handler(req: any, res: any) {
  if (!allowMethods(req, res, ["GET", "POST"])) {
    return;
  }

  if (!requireAdmin(req)) {
    json(res, 401, { error: "Unauthorized." });
    return;
  }

  try {
    const supabase = getSupabaseAdmin();

    if (req.method === "GET") {
      const { data, error } = await supabase
        .from("bottles")
        .select("id, slug, title, recipient_names, occasion_type, theme, guest_token, view_token, created_at, messages(count)")
        .order("created_at", { ascending: false });

      if (error) {
        json(res, 500, { error: "Unable to load bottles." });
        return;
      }

      json(res, 200, {
        bottles: data.map((bottle) => ({
          id: bottle.id,
          slug: bottle.slug,
          title: bottle.title,
          recipientNames: bottle.recipient_names,
          occasionType: bottle.occasion_type,
          theme: bottle.theme,
          guestToken: bottle.guest_token,
          viewToken: bottle.view_token,
          createdAt: bottle.created_at,
          messageCount: bottle.messages?.[0]?.count ?? 0,
        })),
      });
      return;
    }

    const body = parseJsonBody<CreateBottleBody>(req);

    if (!body.title?.trim() || !body.recipientNames?.trim()) {
      json(res, 400, { error: "Title and recipients are required." });
      return;
    }

    const insertResult = await supabase
      .from("bottles")
      .insert({
        title: body.title.trim(),
        recipient_names: body.recipientNames.trim(),
        occasion_type: body.occasionType?.trim() || null,
        slug: slugify(body.slug?.trim() || body.title),
        guest_token: generateToken("guest"),
        view_token: generateToken("view"),
      })
      .select("id, slug, title, recipient_names, occasion_type, theme, guest_token, view_token, created_at")
      .single();

    if (insertResult.error || !insertResult.data) {
      json(res, 500, { error: "Unable to create bottle." });
      return;
    }

    json(res, 201, {
      bottle: {
        id: insertResult.data.id,
        slug: insertResult.data.slug,
        title: insertResult.data.title,
        recipientNames: insertResult.data.recipient_names,
        occasionType: insertResult.data.occasion_type,
        theme: insertResult.data.theme,
        guestToken: insertResult.data.guest_token,
        viewToken: insertResult.data.view_token,
        createdAt: insertResult.data.created_at,
        messageCount: 0,
      },
    });
  } catch (error) {
    json(res, 500, {
      error: error instanceof Error ? error.message : "Unexpected server error.",
    });
  }
}
