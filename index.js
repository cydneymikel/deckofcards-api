import superagent from 'superagent';

const API_BASE_URL = 'https://deckofcardsapi.com/api/deck';

/**
 * helper function to make the GET request to the Deck of Cards API
 * @param {string} composed - the composed url
 * @param {object} query - the query parameter object
 * @throws {Error} throws error if API request fails
 */
const _fetch = async (composed, query = {}) => {
    try {
        const res = await superagent.get(`${API_BASE_URL}/${composed}`).query(query);
        return res.body;
    } catch (error) {
        throw new Error(`Deck of Cards API request failed: ${error.message}`);
    }
};

/**
 * helper function to build a query parameter object to use when making GET request to the Deck of Cards API
 * @param {object} args
 */
const _buildQueryArgs = (args) => {
    const { deck_count, count, cards, jokers_enabled, remaining } = args;

    const query = {};

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
 * get a deck of cards
 * @param {object} options - the available options when getting a deck of card
 * @param {boolean} options.shuffle - shuffle the deck
 * @param {number} options.deck_count - number of decks to use
 * @param {Array<string>} options.cards - specific cards to include
 * @param {boolean} options.jokers_enabled - include jokers in the deck
 */
const deck = async (options = {}) => {
    const { shuffle, deck_count, cards, jokers_enabled } = options;
    const query = _buildQueryArgs({ deck_count, cards, jokers_enabled });

    if (shuffle) {
        return _fetch(`new/shuffle/`, query);
    }
    return _fetch(`new/`, query);
};

/**
 * reshuffle a deck of cards
 * @param {string} deckId - the id of a deck of cards
 * @param {object} options - the available options when reshuffling
 * @param {boolean} options.remaining - only shuffle remaining cards in deck
 */
const reshuffle = async (deckId, options = {}) => {
    const { remaining } = options;
    const query = _buildQueryArgs({ remaining });
    return _fetch(`${deckId}/shuffle/`, query);
};

/**
 * draw from a deck of cards
 * @param {string} deckId - the id of a deck of cards
 * @param {object} options - the available options when drawing from a deck of card
 */
const draw = async (deckId, options = {}) => {
    const { count } = options;
    const query = _buildQueryArgs({ count });

    return _fetch(`${deckId}/draw/`, query);
};

/**
 * return cards to deck
 * @param {string} deckId - the id of a deck of cards
 * @param {object} options - the available options when returning cards
 * @param {Array<string>} options.cards - specific cards to return
 */
const returnCards = async (deckId, options = {}) => {
    const { cards } = options;
    const query = _buildQueryArgs({ cards });
    return _fetch(`${deckId}/return/`, query);
};

/**
 * manage a pile of cards
 * @param {string} deckId - the id of a deck of cards
 * @param {string} pileName - the name given to a pile
 * @returns {object} object with methods to add, draw, shuffle, show, and return pile
 */
const pile = (deckId, pileName) => {
    return {
        add: async (options) => {
            const query = _buildQueryArgs(options);
            return _fetch(`${deckId}/pile/${pileName}/add/`, query);
        },
        draw: async ({ cards, count, bottom, random } = {}) => {
            const query = _buildQueryArgs({ cards, count });

            if (bottom) {
                return _fetch(`${deckId}/pile/${pileName}/draw/bottom`);
            }
            if (random) {
                return _fetch(`${deckId}/pile/${pileName}/draw/random`, query);
            }
            return _fetch(`${deckId}/pile/${pileName}/draw/`, query);
        },
        shuffle: async () => {
            return _fetch(`${deckId}/pile/${pileName}/shuffle/`);
        },
        show: async () => {
            return _fetch(`${deckId}/pile/${pileName}/list/`);
        },
        return: async (options = {}) => {
            const { cards } = options;
            const query = _buildQueryArgs({ cards });
            return _fetch(`${deckId}/pile/${pileName}/return/`, query);
        }
    };
};

export { deck, draw, reshuffle, pile, returnCards };
