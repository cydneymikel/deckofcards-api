# deckofcards-api

[![Tests](https://github.com/cydneymikel/deckofcards-api/actions/workflows/test.yml/badge.svg)](https://github.com/cydneymikel/deckofcards-api/actions/workflows/test.yml)
[![npm version](https://badge.fury.io/js/deckofcards-api.svg)](https://www.npmjs.com/package/deckofcards-api)

Unofficial Node.js Library for interacting with the Deck of Cards API. (https://deckofcardsapi.com/)

## Quick Start

```bash
npm install deckofcards-api
```

```javascript
import * as cards from 'deckofcards-api';

// Create and shuffle a deck
const deck = await cards.deck({ shuffle: true });

// Draw some cards
const drawn = await cards.draw(deck.deck_id, { count: 2 });
console.log(`Drew: ${drawn.cards.map((c) => c.code).join(', ')}`);
```

## Usage Examples

### Create a Deck

```javascript
// Basic deck
const deck = await cards.deck();

// With options
const customDeck = await cards.deck({
  shuffle: true, // Shuffle the deck
  deck_count: 2, // Use 2 decks (104 cards)
  jokers_enabled: true // Include jokers (2 per deck)
});
```

### Draw Cards

```javascript
// Draw 5 cards
const result = await cards.draw(deck.deck_id, { count: 5 });

// Draw specific cards
const specificCards = await cards.draw(deck.deck_id, {
  cards: ['AS', 'KS', 'QD', 'JC', '10H']
});
```

### Manage Piles

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
