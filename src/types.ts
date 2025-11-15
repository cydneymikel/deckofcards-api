export type Card = {
  code: string;
  image: string;
  images: { svg: string; png: string };
  value: string;
  suit: string;
};

export type DeckResponse = {
  success: boolean;
  deck_id: string;
  shuffled: boolean;
  remaining: number;
};

export type DrawResponse = DeckResponse & {
  cards: Card[];
};

export type PileResponse = DeckResponse & {
  piles: Record<string, { remaining: number }>;
};

export type PileListResponse = DeckResponse & {
  piles: Record<string, { remaining: number; cards?: Card[] }>;
};

export type DeckOptions = {
  shuffle?: boolean;
  deck_count?: number;
  cards?: string[];
  jokers_enabled?: boolean;
};

export type ReshuffleOptions = {
  remaining?: boolean;
};

export type DrawOptions = {
  count?: number;
};

export type CardOptions = {
  cards?: string[];
};

export type PileDrawOptions = {
  cards?: string[];
  count?: number;
  bottom?: boolean;
  random?: boolean;
};
