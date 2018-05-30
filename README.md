# deckofcards-api
Unofficial Node.js Wrapper for Deck of Cards API. (https://deckofcardsapi.com/)

--
### Install
```
npm install --save deckofcards-api
```

--
### API Methods


##### deck({ shuffle, deck_count, cards })
Get a deck of cards.

```
const cards = require('deckofcards-api')

// optional
const options = {
    shuffle: boolean // default: false
    deck_count: int  // default: 1
    cards: Array     // All 52 cards
}
cards.deck(options)

```

##### reshuffle(deckId)
Reshuffle a deck of cards by id.

```
const cards = require('deckofcards-api')

const deck = cards.deck()
cards.reshuffle(deck.deck_id)

```

##### draw(deckId)
Draw cards.

```
const cards = require('deckofcards-api')

const deck = cards.deck()

const count = { count: 2 } // required
cards.draw(deck.deck_id, count)

```

##### pile(deckId, pileName).add(cards)
Add cards to a pile.

```
const cards = require('deckofcards-api')

const deck = cards.deck()

const
    pileName = 'discards',  // required
    cards = [ 'AS', 'KS', 'QS', JS', '10S' ]  // required
cards.pile(deckId, pileName).add(cards)

```

##### pile(deckId, pileName).draw(cards)
Draw cards from a pile by card names, count or bottom.

```
const cards = require('deckofcards-api')

const deck = cards.deck()

const
    pileName = 'discards',              // required
    cards = { cards: [ 'AS', 'KS' ] }   // required
cards.pile(deckId, pileName).draw(cards)

// OR

const
    pileName = 'discards',  // required
    count = { count: 2 }    // required
cards.pile(deckId, pileName).draw(count)

// OR

const
    pileName = 'discards',  // required
    bottom = { bottom: true }    // required
cards.pile(deckId, pileName).draw(bottom)

```

##### pile(deckId, pileName).shuffle()
Shuffle the pile.

```
const cards = require('deckofcards-api')

const deck = cards.deck()

const pileName = 'discards' // required
cards.pile(deckId, pileName).shuffle()

```

##### pile(deckId, pileName).show()
Show cards in the pile.

```
const cards = require('deckofcards-api')

const deck = cards.deck()

const pileName = 'discards' // required
cards.pile(deckId, pileName).show()

```