import superagent from 'superagent';
import type {
  DeckResponse,
  DrawResponse,
  PileResponse,
  PileListResponse,
  DeckOptions,
  ReshuffleOptions,
  DrawOptions,
  CardOptions,
  PileDrawOptions
} from './types';

const API_BASE_URL = 'https://deckofcardsapi.com/api';

/**
 * helper function to make a GET request to the Deck of Cards API
 * @param {string} composed - the URL path to append to the base API URL
 * @param {Record<string, any>} [query={}] - query parameters for the request
 * @returns {Promise<T>} the response body typed as T
 * @throws {Error} throws if the API request fails
 */
const _fetch = async <T>(composed: string, query: Record<string, any> = {}): Promise<T> => {
  try {
    const res = await superagent.get(`${API_BASE_URL}/${composed}`).query(query);
    return res.body;
  } catch (error: any) {
    throw new Error(`Deck of Cards API request failed: ${error.message}`);
  }
};

/**
 * helper function to build query parameters for API requests.
 * @param {Object} args
 * @param {number} [args.deck_count] - number of decks to use
 * @param {number} [args.count] - number of cards to draw
 * @param {string[]} [args.cards] - specific cards to include or manipulate
 * @param {boolean} [args.jokers_enabled] - whether to include jokers
 * @param {boolean} [args.remaining] - whether to only act on remaining cards
 * @returns {Record<string, any>} query object to pass to the API
 */
const _buildQueryArgs = (args: {
  deck_count?: number;
  count?: number;
  cards?: string[];
  jokers_enabled?: boolean;
  remaining?: boolean;
}): Record<string, any> => {
  const { deck_count, count, cards, jokers_enabled, remaining } = args;

  const query: Record<string, any> = {};

  if (deck_count) {
    query.deck_count = deck_count;
  }
  if (count) {
    query.count = count;
  }
  if (cards) {
    query.cards = cards.join(',');
  }
  if (jokers_enabled) {
    query.jokers_enabled = jokers_enabled;
  }
  if (remaining !== undefined) {
    query.remaining = remaining;
  }

  return query;
};

/**
 * create a new deck of cards.
 * @param {DeckOptions} [options={}] - options for the deck
 * @param {boolean} [options.shuffle] - shuffle the deck if true
 * @param {number} [options.deck_count] - number of decks to use
 * @param {string[]} [options.cards] - specific cards to include
 * @param {boolean} [options.jokers_enabled] - include jokers in the deck
 * @returns {Promise<DeckResponse>} the created deck information
 */
export const deck = async (options: DeckOptions = {}): Promise<DeckResponse> => {
  const { shuffle, deck_count, cards, jokers_enabled } = options;
  const query = _buildQueryArgs({ deck_count, cards, jokers_enabled });

  return shuffle
    ? _fetch<DeckResponse>('deck/new/shuffle/', query)
    : _fetch<DeckResponse>('deck/new/', query);
};

/**
 * reshuffle an existing deck.
 * @param {string} deckId - the ID of the deck to reshuffle
 * @param {ReshuffleOptions} [options={}] - options for reshuffling
 * @param {boolean} [options.remaining] - shuffle only remaining cards if true
 * @returns {Promise<DeckResponse>} updated deck information
 */
export const reshuffle = async (
  deckId: string,
  options: ReshuffleOptions = {}
): Promise<DeckResponse> => {
  const query = _buildQueryArgs(options);
  return _fetch<DeckResponse>(`deck/${deckId}/shuffle/`, query);
};

/**
 * draw cards from a deck
 * @param {string} deckId - the ID of the deck to draw from
 * @param {DrawOptions} [options={}] - options for drawing
 * @param {number} [options.count] - number of cards to draw
 * @returns {Promise<DrawResponse>} drawn cards and updated deck info
 */
export const draw = async (deckId: string, options: DrawOptions = {}): Promise<DrawResponse> => {
  const query = _buildQueryArgs(options);
  return _fetch<DrawResponse>(`deck/${deckId}/draw/`, query);
};

/**
 * return cards to a deck
 * @param {string} deckId - the ID of the deck to return cards to
 * @param {CardOptions} [options={}] - options specifying which cards to return
 * @param {string[]} [options.cards] - cards to return
 * @returns {Promise<PileResponse>} updated deck/pile info
 */
export const returnCards = async (
  deckId: string,
  options: CardOptions = {}
): Promise<PileResponse> => {
  const query = _buildQueryArgs(options);
  return _fetch<PileResponse>(`deck/${deckId}/return/`, query);
};

/**
 * manage a pile of cards within a deck
 * @param {string} deckId - the ID of the deck
 * @param {string} pileName - the name of the pile
 * @returns {object} methods to manipulate the pile
 */
export const pile = (deckId: string, pileName: string) => {
  return {
    /**
     * add cards to the pile.
     * @param {CardOptions} options - cards to add
     * @returns {Promise<PileResponse>} updated pile info
     */
    add: async (options: CardOptions): Promise<PileResponse> => {
      const query = _buildQueryArgs(options);
      return _fetch(`deck/${deckId}/pile/${pileName}/add/`, query);
    },
    /**
     * draw cards from the pile.
     * @param {PileDrawOptions} [options={}] - options for drawing
     * @param {string[]} [options.cards] - specific cards to draw
     * @param {number} [options.count] - number of cards to draw
     * @param {boolean} [options.bottom] - draw from bottom if true
     * @param {boolean} [options.random] - draw random cards if true
     * @returns {Promise<DrawResponse>} drawn cards and updated pile info
     */
    draw: async (options: PileDrawOptions = {}): Promise<DrawResponse> => {
      const { cards, count, bottom, random } = options;
      const query = _buildQueryArgs({ cards, count });

      if (bottom) return _fetch(`deck/${deckId}/pile/${pileName}/draw/bottom`);
      if (random) return _fetch(`deck/${deckId}/pile/${pileName}/draw/random`, query);
      return _fetch(`deck/${deckId}/pile/${pileName}/draw/`, query);
    },
    /**
     * shuffle the pile.
     * @returns {Promise<PileResponse>} updated pile info
     */
    shuffle: async (): Promise<PileResponse> => _fetch(`deck/${deckId}/pile/${pileName}/shuffle/`),
    /**
     * show the contents of the pile.
     * @returns {Promise<PileListResponse>} cards currently in the pile
     */
    show: async (): Promise<PileListResponse> => _fetch(`deck/${deckId}/pile/${pileName}/list/`),
    /**
     * return cards from the pile to the deck.
     * @param {CardOptions} [options={}] - cards to return
     * @returns {Promise<PileResponse>} updated pile info
     */
    return: async (options: CardOptions = {}): Promise<PileResponse> => {
      const query = _buildQueryArgs(options);
      return _fetch(`deck/${deckId}/pile/${pileName}/return/`, query);
    }
  };
};
