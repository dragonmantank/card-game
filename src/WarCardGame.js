import { INVALID_MOVE } from 'boardgame.io/core';

function DrawCard(G, ctx) {
    const player = ctx.currentPlayer;
    G.hand[player].push(G.decks[player].shift());

    document.getElementById('player' + player + '-hand').innerHTML = G.hand[player][0];
}

function ResolveCards(G, ctx) {
    const playerOne = G.hand[0][G.hand[0].length - 1];
    const playerTwo = G.hand[1][G.hand[1].length - 1];

    let winner = null;
    if (playerOne > playerTwo) {
        G.decks[0].push(playerOne, playerTwo);
        winner = 0;
    } else {
        G.decks[1].push(playerTwo, playerOne);
        winner = 1;
    }

    document.getElementById('winner-banner').innerHTML = '<span class="banner">Player ' + winner + ' wins!</span>';

    G.hand[0] = [];
    G.hand[1] = [];

    document.getElementById('player0-hand').innerHTML = '';
    document.getElementById('player1-hand').innerHTML = '';
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