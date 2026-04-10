import { getSupabaseAdmin } from "../../_lib/supabase-admin";
import { allowMethods, json, parseJsonBody } from "../../_lib/http";

type OpenMessageBody = {
  bottleId?: string;
  token?: string;
};

export default async function handler(req: any, res: any) {
  if (!allowMethods(req, res, ["POST"])) {
    return;
  }

  try {
    const { id } = req.query;
    const body = parseJsonBody<OpenMessageBody>(req);

    if (!id || !body.bottleId || !body.token) {
      json(res, 400, { error: "Missing message id, bottleId, or token." });
      return;
    }

    const supabase = getSupabaseAdmin();
    const bottleLookup = await supabase
      .from("bottles")
      .select("id")
      .eq("id", body.bottleId)
      .eq("view_token", body.token)
      .single();

    if (bottleLookup.error || !bottleLookup.data) {
      json(res, 403, { error: "Invalid viewer token." });
      return;
    }

    const { data, error } = await supabase
      .from("messages")
      .update({ opened_at: new Date().toISOString() })
      .eq("id", id)
      .eq("bottle_id", body.bottleId)
      .select("id, bottle_id, sender_name, message_text, photo_url, stickers, star_color, created_at, opened_at, card_payload")
      .single();

    if (error || !data) {
      json(res, 500, { error: "Unable to update opened state." });
      return;
    }

    json(res, 200, {
      message: {
        id: data.id,
        bottleId: data.bottle_id,
        senderName: data.sender_name,
        messageText: data.message_text,
        photoUrl: data.photo_url,
        stickers: Array.isArray(data.stickers) ? data.stickers : [],
        starColor: data.star_color,
        createdAt: data.created_at,
        openedAt: data.opened_at,
        cardPayload: data.card_payload,
      },
    });
  } catch (error) {
    json(res, 500, {
      error: error instanceof Error ? error.message : "Unexpected server error.",
    });
  }
}
