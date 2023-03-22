const expect = require('chai').expect;

const api = require('../');
const DECK_SIZE = 52;

describe('Deck Of Cards API', () => {
    describe('deck', () => {
        let deck_id;

        it('should get a new unshuffled deck', async () => {
            const deck = await api.deck();

            expect(deck).to.have.property('shuffled').and.to.equal(false);
            expect(deck).to.have.property('deck_id');
            expect(deck).to.have.property('success').and.to.equal(true);
            expect(deck).to.have.property('remaining').and.to.equal(DECK_SIZE);

            deck_id = deck.deck_id;
        });

        it('should get multiple shuffled decks', async () => {
            const options = { deck_count: 4, shuffle: true };
            const deck = await api.deck(options);

            expect(deck).to.have.property('shuffled').and.to.equal(options.shuffle);
            expect(deck).to.have.property('deck_id');
            expect(deck).to.have.property('success').and.to.equal(true);
            expect(deck)
                .to.have.property('remaining')
                .and.to.equal(DECK_SIZE * options.deck_count);
        });

        it('should get a partial deck', async () => {
            const options = { cards: ['AS', 'AH', 'AD', 'AC'], shuffle: true };
            const deck = await api.deck(options);

            expect(deck).to.have.property('shuffled').and.to.equal(options.shuffle);
            expect(deck).to.have.property('deck_id');
            expect(deck).to.have.property('success').and.to.equal(true);
            expect(deck).to.have.property('remaining').and.to.equal(options.cards.length);
        });
    });

    describe('reshuffle', () => {
        it('should reshuffle a deck', async () => {
            const deck = await api.deck();
            const reshuffled = await api.reshuffle(deck.deck_id);

            expect(reshuffled).to.have.property('shuffled').and.to.equal(true);
            expect(reshuffled).to.have.property('deck_id').and.to.equal(deck.deck_id);
            expect(reshuffled).to.have.property('success').and.to.equal(true);
            expect(reshuffled).to.have.property('remaining').and.to.equal(DECK_SIZE);
        });
    });

    describe('draw', () => {
        it('should draw n number of cards', async () => {
            const deck = await api.deck({ shuffle: true });
            const options = { count: 2 };

            drawn = await api.draw(deck.deck_id, options);

            expect(drawn).to.have.property('deck_id').and.to.equal(deck.deck_id);
            expect(drawn).to.have.property('success').and.to.equal(true);
            expect(drawn)
                .to.have.property('remaining')
                .and.to.equal(DECK_SIZE - options.count);
            expect(drawn).to.have.property('cards').and.to.have.length(options.count);
        });
    });

    describe('pile', () => {
        let original, drawn, cards, cardCount, pileName;

        before(async () => {
            original = await api.deck({ shuffle: true });
            drawn = await api.draw(original.deck_id, { count: 5 });
            cards = drawn.cards.map((card) => card.code);
            cardCount = cards.length;
            pileName = 'mycards';
        });

        it('add | should add n number of cards to a pile', async () => {
            const options = { cards };
            const deck = await api.pile(original.deck_id, pileName).add(options);

            expect(deck).to.have.property('deck_id').and.to.equal(original.deck_id);
            expect(deck).to.have.property('success').and.to.equal(true);
            expect(deck)
                .to.have.property('remaining')
                .and.to.equal(DECK_SIZE - cards.length);

            expect(deck).to.have.property('piles');
            expect(deck.piles).to.have.property(pileName);
            expect(deck.piles[pileName]).to.have.property('remaining').and.to.equal(cardCount);
        });

        it('draw | should draw from the bottom', async () => {
            const options = { bottom: true };
            const deck = await api.pile(original.deck_id, pileName).draw(options);

            expect(deck).to.have.property('deck_id').and.to.equal(original.deck_id);
            expect(deck).to.have.property('success').and.to.equal(true);

            expect(deck).to.have.property('piles');
            expect(deck.piles).to.have.property(pileName);

            cardCount = cards.length - 1;
            expect(deck.piles[pileName]).to.have.property('remaining').and.to.equal(cardCount);
        });

        it('draw | should draw n number of cards from the top', async () => {
            const options = { count: 2 };
            const deck = await api.pile(original.deck_id, pileName).draw(options);

            expect(deck).to.have.property('deck_id').and.to.equal(original.deck_id);
            expect(deck).to.have.property('success').and.to.equal(true);

            expect(deck).to.have.property('piles');
            expect(deck.piles).to.have.property(pileName);

            cardCount = cardCount - options.count;
            expect(deck.piles[pileName]).to.have.property('remaining').and.to.equal(cardCount);
        });

        it('shuffle | should shuffle cards in pile', async () => {
            const deck = await api.pile(original.deck_id, pileName).shuffle();

            expect(deck).to.have.property('deck_id').and.to.equal(original.deck_id);
            expect(deck).to.have.property('success').and.to.equal(true);

            expect(deck).to.have.property('piles');
            expect(deck.piles).to.have.property(pileName);

            expect(deck.piles[pileName]).to.have.property('remaining').and.to.equal(cardCount);
        });

        it('show | should show cards in pile', async () => {
            const deck = await api.pile(original.deck_id, pileName).show();

            expect(deck).to.have.property('deck_id').and.to.equal(original.deck_id);
            expect(deck).to.have.property('success').and.to.equal(true);

            expect(deck).to.have.property('piles');
            expect(deck.piles).to.have.property(pileName);

            expect(deck.piles[pileName]).to.have.property('remaining').and.to.equal(cardCount);
        });
    });
});
