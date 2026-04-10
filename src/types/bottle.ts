export type Bottle = {
  id: string;
  slug: string;
  title: string;
  recipientNames: string;
  occasionType: string | null;
  theme: string;
  createdAt: string;
  guestToken?: string;
  viewToken?: string;
  messageCount?: number;
};
