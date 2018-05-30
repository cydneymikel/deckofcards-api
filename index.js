const superagent = require('superagent')

const API_BASE_URL = 'https://deckofcardsapi.com/api/deck'

const _fetch = (composed, query = {}) => {
    return new Promise((resolve, reject) => {
        return superagent.get(`${API_BASE_URL}/${composed}`)
                .query(query)
                .then(response => resolve(response.body))
                .catch(response => reject(response.error))
    })
}

const _buildQueryArgs = ({deck_count, count, cards }) => {
    const query = {}

    if (deck_count)
        query.deck_count = deck_count

    if (count)
        query.count = count

    if (cards)
        query.cards = cards.join(',')

    return query
}

const deck = (options = {}) => {
    const
        { shuffle, deck_count, cards } = options,
        query = _buildQueryArgs({ deck_count, cards })

    if (shuffle)
        return _fetch(`new/shuffle/`, query)
    else
        return _fetch(`new/`, query)
}

const reshuffle = (deckId) => {
    return _fetch(`${deckId}/shuffle/`)
}

const draw = (deckId, options = {}) => {
    const
        { count } = options,
        query = _buildQueryArgs({ count })

    return _fetch(`${deckId}/draw/`, query)
}

const pile = (deckId, pileName) => {
    return {
        add: cards => {
            const query = _buildQueryArgs(cards)
            return _fetch(`${deckId}/pile/${pileName}/add/`, query)
        },
        draw: ({ cards, count, bottom }) => {
            const query = _buildQueryArgs({ cards, count })

            if (bottom)
                return _fetch(`${deckId}/pile/${pileName}/draw/bottom`)
            else
                return _fetch(`${deckId}/pile/${pileName}/draw/`, query)
        },
        shuffle: () => {
            return _fetch(`${deckId}/pile/${pileName}/shuffle/`)
        },
        show: () => {
            return _fetch(`${deckId}/pile/${pileName}/list/`)
        }
    }
}

module.exports = {
    deck,
    draw,
    reshuffle,
    pile
}