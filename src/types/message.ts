export type Message = {
  id: string;
  bottleId: string;
  senderName: string | null;
  messageText: string;
  photoUrl: string | null;
  stickers: string[];
  starColor: string;
  createdAt: string;
  openedAt: string | null;
};
