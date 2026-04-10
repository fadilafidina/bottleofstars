import { getSupabaseAdmin } from "../_lib/supabase-admin";
import { allowMethods, json, parseJsonBody } from "../_lib/http";

type CreateMessageBody = {
  bottleId?: string;
  token?: string;
  name?: string;
  message?: string;
  stickers?: string[];
  photoDataUrl?: string;
  photoFileName?: string;
  photoMimeType?: string;
};

async function uploadPhotoIfPresent(
  supabase: ReturnType<typeof getSupabaseAdmin>,
  body: CreateMessageBody,
  bottleId: string,
) {
  if (!body.photoDataUrl || !body.photoMimeType) {
    return null;
  }

  const parts = body.photoDataUrl.split(",");
  const base64 = parts[1];

  if (!base64) {
    return null;
  }

  const bytes = Buffer.from(base64, "base64");
  const extension = body.photoMimeType.split("/")[1] || "jpg";
  const path = `${bottleId}/${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage
    .from("message-photos")
    .upload(path, bytes, {
      contentType: body.photoMimeType,
      upsert: false,
    });

  if (error) {
    throw new Error("Photo upload failed.");
  }

  const signed = await supabase.storage
    .from("message-photos")
    .createSignedUrl(path, 60 * 60 * 24 * 30);

  if (signed.error || !signed.data?.signedUrl) {
    throw new Error("Photo URL could not be created.");
  }

  return signed.data.signedUrl;
}

export default async function handler(req: any, res: any) {
  if (!allowMethods(req, res, ["GET", "POST"])) {
    return;
  }

  try {
    const supabase = getSupabaseAdmin();

    if (req.method === "GET") {
      const { bottleId, token } = req.query;

      if (!bottleId || !token) {
        json(res, 400, { error: "Missing bottleId or token." });
        return;
      }

      const bottleLookup = await supabase
        .from("bottles")
        .select("id, slug, title, recipient_names, occasion_type, theme, created_at")
        .eq("id", bottleId)
        .eq("view_token", token)
        .single();

      if (bottleLookup.error || !bottleLookup.data) {
        json(res, 403, { error: "Invalid viewer token." });
        return;
      }

      const messagesLookup = await supabase
        .from("messages")
        .select("id, bottle_id, sender_name, message_text, photo_url, stickers, star_color, created_at, opened_at")
        .eq("bottle_id", bottleId)
        .order("created_at", { ascending: true });

      if (messagesLookup.error) {
        json(res, 500, { error: "Unable to load messages." });
        return;
      }

      json(res, 200, {
        bottle: {
          id: bottleLookup.data.id,
          slug: bottleLookup.data.slug,
          title: bottleLookup.data.title,
          recipientNames: bottleLookup.data.recipient_names,
          occasionType: bottleLookup.data.occasion_type,
          theme: bottleLookup.data.theme,
          createdAt: bottleLookup.data.created_at,
          messageCount: messagesLookup.data.length,
        },
        messages: messagesLookup.data.map((message) => ({
          id: message.id,
          bottleId: message.bottle_id,
          senderName: message.sender_name,
          messageText: message.message_text,
          photoUrl: message.photo_url,
          stickers: Array.isArray(message.stickers) ? message.stickers : [],
          starColor: message.star_color,
          createdAt: message.created_at,
          openedAt: message.opened_at,
        })),
      });
      return;
    }

    const body = parseJsonBody<CreateMessageBody>(req);

    if (!body.bottleId || !body.token || !body.message?.trim()) {
      json(res, 400, { error: "Missing bottleId, token, or message." });
      return;
    }

    const bottleLookup = await supabase
      .from("bottles")
      .select("id")
      .eq("id", body.bottleId)
      .eq("guest_token", body.token)
      .single();

    if (bottleLookup.error || !bottleLookup.data) {
      json(res, 403, { error: "Invalid guest token." });
      return;
    }

    const photoUrl = await uploadPhotoIfPresent(supabase, body, body.bottleId);
    const palette = ["#A7D8FF", "#FFF3DA", "#F4C4D7", "#EEDC9A", "#CFE7C7"];
    const starColor = palette[Math.floor(Math.random() * palette.length)];

    const insertResult = await supabase
      .from("messages")
      .insert({
        bottle_id: body.bottleId,
        sender_name: body.name?.trim() || null,
        message_text: body.message.trim(),
        photo_url: photoUrl,
        stickers: body.stickers ?? [],
        star_color: starColor,
      })
      .select("id, bottle_id, sender_name, message_text, photo_url, stickers, star_color, created_at, opened_at")
      .single();

    if (insertResult.error || !insertResult.data) {
      json(res, 500, { error: "Unable to create message." });
      return;
    }

    json(res, 201, {
      message: {
        id: insertResult.data.id,
        bottleId: insertResult.data.bottle_id,
        senderName: insertResult.data.sender_name,
        messageText: insertResult.data.message_text,
        photoUrl: insertResult.data.photo_url,
        stickers: Array.isArray(insertResult.data.stickers) ? insertResult.data.stickers : [],
        starColor: insertResult.data.star_color,
        createdAt: insertResult.data.created_at,
        openedAt: insertResult.data.opened_at,
      },
    });
  } catch (error) {
    json(res, 500, {
      error: error instanceof Error ? error.message : "Unexpected server error.",
    });
  }
}
