const superagent = require('superagent');

const API_BASE_URL = 'https://deckofcardsapi.com/api/deck';

/**
 * helper function to make the GET request to the Deck of Cards API
 * @param {string} composed - the composed url
 * @param {object} query - the query parameter object
 */
const _fetch = async (composed, query = {}) => {
    const res = await superagent.get(`${API_BASE_URL}/${composed}`).query(query);
    return res.body;
};

/**
 * helper function to build a query parameter object to use when making GET request to the Deck of Cards API
 * @param {object} args
 */
const _buildQueryArgs = (args) => {
    const { deck_count, count, cards } = args;

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

    return query;
};

/**
 * get a deck of cards
 * @param {object} options - the available options when getting a deck of card
 */
const deck = async (options = {}) => {
    const { shuffle, deck_count, cards } = options;
    const query = _buildQueryArgs({ deck_count, cards });

    if (shuffle) {
        return await _fetch(`new/shuffle/`, query);
    } else {
        return await _fetch(`new/`, query);
    }
};

/**
 * reshuffle a deck of cards
 * @param {string} deckId - the id of a deck of cards
 */
const reshuffle = async (deckId) => {
    return await _fetch(`${deckId}/shuffle/`);
};

/**
 * draw from a deck of cards
 * @param {string} deckId - the id of a deck of cards
 * @param {object} options - the available options when drawing from a deck of card
 */
const draw = async (deckId, count) => {
    const { count } = options;
    const query = _buildQueryArgs({ count });

    return await _fetch(`${deckId}/draw/`, query);
};

/**
 * draw from a deck of cards
 * @param {string} deckId - the id of a deck of cards
 * @param {string} pileName - the name given to a pile
 */
const pile = (deckId, pileName) => {
    return {
        add: async (cards) => {
            const query = _buildQueryArgs(cards);
            return await _fetch(`${deckId}/pile/${pileName}/add/`, query);
        },
        draw: async ({ cards, count, bottom }) => {
            const query = _buildQueryArgs({ cards, count });

            if (bottom) {
                return await _fetch(`${deckId}/pile/${pileName}/draw/bottom`);
            } else {
                return await _fetch(`${deckId}/pile/${pileName}/draw/`, query);
            }
        },
        shuffle: async () => {
            return await _fetch(`${deckId}/pile/${pileName}/shuffle/`);
        },
        show: async () => {
            return await _fetch(`${deckId}/pile/${pileName}/list/`);
        }
    };
};

module.exports = {
    deck,
    draw,
    reshuffle,
    pile
};
