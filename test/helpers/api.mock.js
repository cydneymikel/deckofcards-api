import nock from 'nock';

const API_BASE_URL = 'https://deckofcardsapi.com/api';

// generic helper for GET mocks
const mockGet = (path, query = true, replyBody) =>
  nock(API_BASE_URL).get(path).query(query).reply(200, replyBody);

const mockDeck = (deckId, shuffled = false, remaining = 52) =>
  mockGet('/deck/new/', true, { success: true, deck_id: deckId, shuffled, remaining });

const mockShuffleDeck = (deckId, remaining = 52) =>
  mockGet('/deck/new/shuffle/', true, {
    success: true,
    deck_id: deckId,
    shuffled: true,
    remaining
  });

const mockReshuffle = (deckId, remaining = 52) =>
  mockGet(`/deck/${deckId}/shuffle/`, true, {
    success: true,
    deck_id: deckId,
    shuffled: true,
    remaining
  });

const mockDrawCards = (deckId, count, cards) =>
  mockGet(
    `/deck/${deckId}/draw/`,
    { count },
    { success: true, deck_id: deckId, cards, remaining: 52 - count }
  );

const mockAddToPile = (deckId, pileName, cards) =>
  mockGet(
    `/deck/${deckId}/pile/${pileName}/add/`,
    { cards: cards.join(',') },
    {
      success: true,
      deck_id: deckId,
      remaining: 52 - cards.length,
      piles: { [pileName]: { remaining: cards.length } }
    }
  );

const mockListPile = (deckId, pileName, cards, deckRemaining = 52, pileRemaining = 0) =>
  mockGet(`/deck/${deckId}/pile/${pileName}/list/`, true, {
    success: true,
    deck_id: deckId,
    shuffled: false,
    remaining: deckRemaining,
    piles: { [pileName]: { remaining: pileRemaining, cards } }
  });

const mockPileDraw = (
  deckId,
  pileName,
  cards = [],
  remaining = 52,
  pileRemaining = 0,
  path = 'draw'
) =>
  mockGet(`/deck/${deckId}/pile/${pileName}/${path}`, true, {
    success: true,
    deck_id: deckId,
    cards,
    remaining,
    piles: { [pileName]: { remaining: pileRemaining } }
  });

const mockPileShuffle = (deckId, pileName, remaining = 52, pileRemaining = 0) =>
  mockGet(`/deck/${deckId}/pile/${pileName}/shuffle/`, true, {
    success: true,
    deck_id: deckId,
    shuffled: false,
    remaining,
    piles: { [pileName]: { remaining: pileRemaining } }
  });

beforeEach(() => {
  nock.disableNetConnect();
  nock.enableNetConnect('127.0.0.1');
});

afterEach(() => {
  nock.cleanAll();
  nock.enableNetConnect();
});

export {
  mockDeck,
  mockShuffleDeck,
  mockReshuffle,
  mockDrawCards,
  mockAddToPile,
  mockListPile,
  mockPileDraw,
  mockPileShuffle
};
