# deckofcards-api

[![Tests](https://github.com/cydneymikel/deckofcards-api/actions/workflows/test.yml/badge.svg)](https://github.com/cydneymikel/deckofcards-api/actions/workflows/test.yml)
[![npm version](https://badge.fury.io/js/deckofcards-api.svg)](https://www.npmjs.com/package/deckofcards-api)

Unofficial Node.js Library for interacting with the Deck of Cards API. (https://deckofcardsapi.com/)

--

### Install

```
npm install --save deckofcards-api
```

--

### API Methods

##### deck(options)

Get a deck of cards with an optional options object.

```javascript
import * as cards from 'deckofcards-api';

// get a deck with the default options
await cards.deck()

// configure deck options
const options = {
    shuffle: boolean        // default: false
    deck_count: int         // default: 1
    cards: Array            // All 52 cards
    jokers_enabled: boolean // default: false, adds 2 jokers (54 cards total)
}
// get a deck with custom options
await cards.deck(options)

```

##### reshuffle(deckId, options)

Reshuffle a deck of cards by id.

```javascript
import * as cards from 'deckofcards-api';

const deck = await cards.deck();
await cards.reshuffle(deck.deck_id);

// optionally only shuffle remaining cards
await cards.reshuffle(deck.deck_id, { remaining: true });
```

##### draw(deckId, options)

Draw cards.

```javascript
import * as cards from 'deckofcards-api';

const deck = await cards.deck();

const count = { count: 2 };
await cards.draw(deck.deck_id, count);
```

##### pile(deckId, pileName).add(options)

Add cards to a pile.

```javascript
import * as cards from 'deckofcards-api';

const deck = await cards.deck();

const pileName = 'discards';
const cardsToAdd = { cards: ['AS', 'KS', 'QS', 'JS', '10S'] };
await cards.pile(deck.deck_id, pileName).add(cardsToAdd);
```

##### pile(deckId, pileName).draw(options)

Draw cards from a pile by card names, count, bottom, or random.

```javascript
import * as cards from 'deckofcards-api';

const deck = await cards.deck();
const pileName = 'discards';

// Draw specific cards
await cards.pile(deck.deck_id, pileName).draw({ cards: ['AS', 'KS'] });

// OR draw by count
await cards.pile(deck.deck_id, pileName).draw({ count: 2 });

// OR draw from bottom
await cards.pile(deck.deck_id, pileName).draw({ bottom: true });

// OR draw random
await cards.pile(deck.deck_id, pileName).draw({ random: true });
```

##### pile(deckId, pileName).shuffle()

Shuffle the pile.

```javascript
import * as cards from 'deckofcards-api';

const deck = await cards.deck();
const pileName = 'discards';
await cards.pile(deck.deck_id, pileName).shuffle();
```

##### pile(deckId, pileName).show()

Show cards in the pile.

```javascript
import * as cards from 'deckofcards-api';

const deck = await cards.deck();
const pileName = 'discards';
await cards.pile(deck.deck_id, pileName).show();
```

##### pile(deckId, pileName).return(options)

Return cards from a pile back to the deck.

```javascript
import * as cards from 'deckofcards-api';

const deck = await cards.deck();
const pileName = 'discards';

// Return specific cards
await cards.pile(deck.deck_id, pileName).return({ cards: ['AS', 'KS'] });

// OR return all cards from pile
await cards.pile(deck.deck_id, pileName).return();
```

##### returnCards(deckId, options)

Return cards to the deck.

```javascript
import * as cards from 'deckofcards-api';

const deck = await cards.deck();

// Return specific cards to deck
await cards.returnCards(deck.deck_id, { cards: ['AS', 'KS'] });

// OR return all drawn cards
await cards.returnCards(deck.deck_id);
```
