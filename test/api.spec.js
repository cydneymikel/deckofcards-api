import { expect } from 'chai';
import * as api from '../dist/index.js';

import {
  mockDeck,
  mockShuffleDeck,
  mockDrawCards,
  mockAddToPile,
  mockListPile,
  mockReshuffle,
  mockPileDraw,
  mockPileShuffle
} from './helpers/api.mock.js';

const DECK_SIZE = 52;

describe('Deck Of Cards API', () => {
  describe('deck', () => {
    it('should get a new unshuffled deck', async () => {
      const testDeckId = 'test-deck-123';
      const scope = mockDeck(testDeckId);

      const deck = await api.deck();

      expect(deck).to.have.property('shuffled').and.to.equal(false);
      expect(deck).to.have.property('deck_id', testDeckId);
      expect(deck).to.have.property('success').and.to.equal(true);
      expect(deck).to.have.property('remaining').and.to.equal(DECK_SIZE);

      scope.done();
    });

    it('should get multiple shuffled decks', async () => {
      const testDeckId = 'test-deck-456';
      const options = { deck_count: 4, shuffle: true };
      const scope = mockShuffleDeck(testDeckId, DECK_SIZE * options.deck_count);

      const deck = await api.deck(options);

      expect(deck).to.have.property('shuffled').and.to.equal(true);
      expect(deck).to.have.property('deck_id', testDeckId);
      expect(deck).to.have.property('success').and.to.equal(true);
      expect(deck).to.have.property('remaining').and.to.equal(208);

      scope.done();
    });

    it('should get a partial deck', async () => {
      const testDeckId = 'test-deck-partial';
      const options = { cards: ['AS', 'AH', 'AD', 'AC'], shuffle: true };
      const scope = mockShuffleDeck(testDeckId, options.cards.length);

      const deck = await api.deck(options);

      expect(deck).to.have.property('shuffled').and.to.equal(options.shuffle);
      expect(deck).to.have.property('deck_id', testDeckId);
      expect(deck).to.have.property('success').and.to.equal(true);
      expect(deck).to.have.property('remaining').and.to.equal(options.cards.length);

      scope.done();
    });
  });

  describe('reshuffle', () => {
    it('should reshuffle a deck', async () => {
      const testDeckId = 'test-deck-reshuffle';
      const deckScope = mockDeck(testDeckId);
      const deck = await api.deck();
      deckScope.done();

      const reshuffleScope = mockReshuffle(deck.deck_id);
      const reshuffled = await api.reshuffle(deck.deck_id);

      expect(reshuffled).to.have.property('shuffled').and.to.equal(true);
      expect(reshuffled).to.have.property('deck_id').and.to.equal(deck.deck_id);
      expect(reshuffled).to.have.property('success').and.to.equal(true);
      expect(reshuffled).to.have.property('remaining').and.to.equal(DECK_SIZE);

      reshuffleScope.done();
    });
  });

  describe('draw', () => {
    it('should draw n number of cards', async () => {
      const testDeckId = 'test-deck-draw';
      const deckScope = mockShuffleDeck(testDeckId);
      const deck = await api.deck({ shuffle: true });
      deckScope.done();

      const options = { count: 2 };
      const testCards = [{ code: 'AS' }, { code: 'KH' }];
      const drawScope = mockDrawCards(deck.deck_id, options.count, testCards);

      const drawn = await api.draw(deck.deck_id, options);

      expect(drawn).to.have.property('deck_id').and.to.equal(deck.deck_id);
      expect(drawn).to.have.property('success').and.to.equal(true);
      expect(drawn)
        .to.have.property('remaining')
        .and.to.equal(DECK_SIZE - options.count);
      expect(drawn).to.have.property('cards').and.to.have.length(options.count);

      drawScope.done();
    });
  });

  describe('pile', () => {
    let original, drawn, cards, cardCount, pileName;

    before(async () => {
      const testDeckId = 'test-deck-pile';
      const deckScope = mockShuffleDeck(testDeckId);
      original = await api.deck({ shuffle: true });
      deckScope.done();

      const testCards = [
        { code: 'KH' },
        { code: '3S' },
        { code: 'AD' },
        { code: '8D' },
        { code: '7S' }
      ];
      const drawScope = mockDrawCards(original.deck_id, 5, testCards);
      drawn = await api.draw(original.deck_id, { count: 5 });
      drawScope.done();

      cards = drawn.cards.map((card) => card.code);
      cardCount = cards.length;
      pileName = 'mycards';
    });

    it('add | should add n number of cards to a pile', async () => {
      const options = { cards };
      const scope = mockAddToPile(original.deck_id, pileName, cards);
      const deck = await api.pile(original.deck_id, pileName).add(options);

      expect(deck).to.have.property('deck_id').and.to.equal(original.deck_id);
      expect(deck).to.have.property('success').and.to.equal(true);
      expect(deck)
        .to.have.property('remaining')
        .and.to.equal(DECK_SIZE - cards.length);

      expect(deck).to.have.property('piles');
      expect(deck.piles).to.have.property(pileName);
      expect(deck.piles[pileName]).to.have.property('remaining').and.to.equal(cardCount);

      scope.done();
    });

    it('draw | should draw from the bottom', async () => {
      const options = { bottom: true };
      const newCardCount = cardCount - 1;
      const scope = mockPileDraw(
        original.deck_id,
        pileName,
        [{ code: '7S' }],
        DECK_SIZE - cards.length,
        newCardCount,
        'draw/bottom'
      );
      const deck = await api.pile(original.deck_id, pileName).draw(options);

      expect(deck).to.have.property('deck_id').and.to.equal(original.deck_id);
      expect(deck).to.have.property('success').and.to.equal(true);

      expect(deck).to.have.property('piles');
      expect(deck.piles).to.have.property(pileName);

      cardCount = newCardCount;
      expect(deck.piles[pileName]).to.have.property('remaining').and.to.equal(cardCount);

      scope.done();
    });

    it('draw | should draw n number of cards from the top', async () => {
      const options = { count: 2 };
      const newCardCount = cardCount - options.count;
      const scope = mockPileDraw(
        original.deck_id,
        pileName,
        [{ code: 'KH' }, { code: '3S' }],
        DECK_SIZE - cards.length,
        newCardCount,
        'draw/'
      );
      const deck = await api.pile(original.deck_id, pileName).draw(options);

      expect(deck).to.have.property('deck_id').and.to.equal(original.deck_id);
      expect(deck).to.have.property('success').and.to.equal(true);

      expect(deck).to.have.property('piles');
      expect(deck.piles).to.have.property(pileName);

      cardCount = newCardCount;
      expect(deck.piles[pileName]).to.have.property('remaining').and.to.equal(cardCount);

      scope.done();
    });

    it('shuffle | should shuffle cards in pile', async () => {
      const scope = mockPileShuffle(
        original.deck_id,
        pileName,
        DECK_SIZE - cards.length,
        cardCount
      );
      const deck = await api.pile(original.deck_id, pileName).shuffle();

      expect(deck).to.have.property('deck_id').and.to.equal(original.deck_id);
      expect(deck).to.have.property('success').and.to.equal(true);

      expect(deck).to.have.property('piles');
      expect(deck.piles).to.have.property(pileName);

      expect(deck.piles[pileName]).to.have.property('remaining').and.to.equal(cardCount);

      scope.done();
    });

    it('show | should show cards in pile', async () => {
      const scope = mockListPile(
        original.deck_id,
        pileName,
        [{ code: 'AD' }],
        DECK_SIZE - cards.length,
        cardCount
      );
      const deck = await api.pile(original.deck_id, pileName).show();

      expect(deck).to.have.property('deck_id').and.to.equal(original.deck_id);
      expect(deck).to.have.property('success').and.to.equal(true);

      expect(deck).to.have.property('piles');
      expect(deck.piles).to.have.property(pileName);

      expect(deck.piles[pileName]).to.have.property('remaining').and.to.equal(cardCount);

      scope.done();
    });
  });
});
