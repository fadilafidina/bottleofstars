alter table public.messages
add column if not exists card_payload jsonb;
