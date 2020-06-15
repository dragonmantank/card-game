import { INVALID_MOVE } from 'boardgame.io/core';

function DrawCard(G, ctx) {
    G.hand[ctx.currentPlayer].push(G.decks[ctx.currentPlayer].shift());
}

function ResolveCards(G, ctx) {
    console.log("Resolving");

    const playerOne = G.hand[0][G.hand[0].length - 1];
    const playerTwo = G.hand[1][G.hand[1].length - 1];

    if (playerOne > playerTwo) {
        G.decks[0].push(playerOne, playerTwo);
    } else {
        G.decks[1].push(playerTwo, playerOne);
    }
    G.hand[0] = [];
    G.hand[1] = [];
}

export const WarCardGame = {
    setup: ctx => ({
        numPlayers: 2,
        decks: [
            [1,4,5,6,7],
            [5,7,3,8,6]
        ],
        hand: Array(ctx.numPlayers).fill([]),
    }),
    phases: {
        draw: { 
            moves: { DrawCard },
            start: true,
            endIf: (G, ctx) => {
                return G.hand[0].length == 1 && G.hand[1].length == 1
            },
            next: 'resolve',
        },
        resolve: {
            moves: { ResolveCards },
            endIf: (G, ctx) => {
                return G.hand[0].length == 0 && G.hand[1].length == 0;
            },
            next: 'draw'
        }

    },
    turn: { moveLimit: 1 },
}