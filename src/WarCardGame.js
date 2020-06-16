import { INVALID_MOVE } from 'boardgame.io/core';

var suits = ["spades", "diamonds", "clubs", "hearts"];
var values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
function getDeck()
{
	var deck = new Array();

	for(var i = 0; i < suits.length; i++)
	{
		for(var x = 0; x < values.length; x++)
		{
			var card = {Value: values[x], Suit: suits[i]};
			deck.push(card);
		}
	}

	return deck;
}

function shuffle(deck)
{
	// for 1000 turns
	// switch the values of two random cards
	for (var i = 0; i < 1000; i++)
	{
		var location1 = Math.floor((Math.random() * deck.length));
		var location2 = Math.floor((Math.random() * deck.length));
		var tmp = deck[location1];

		deck[location1] = deck[location2];
		deck[location2] = tmp;
    }
    
    return deck;
}


function DrawCard(G, ctx) {
    const player = ctx.currentPlayer;
    G.hand[player].push(G.decks[player].shift());

    document.getElementById('player' + player + '-hand').innerHTML = G.hand[player][0]['Value'] + " " + G.hand[player][0]['Suit'];
}

function ResolveCards(G, ctx) {
    let playerOne = G.hand[0][G.hand[0].length - 1]['Value'];
    let playerTwo = G.hand[1][G.hand[1].length - 1]['Value'];

    if (playerOne == "J") { playerOne = 11; }
    if (playerOne == "Q") { playerOne = 12; }
    if (playerOne == "K") { playerOne = 13; }
    if (playerOne == "A") { playerOne = 14; }
    if (playerTwo == "J") { playerOne = 11; }
    if (playerTwo == "Q") { playerOne = 12; }
    if (playerTwo == "K") { playerOne = 13; }
    if (playerTwo == "A") { playerOne = 14; }

    let winner = null;
    if (playerOne > playerTwo) {
        G.decks[0].push(G.hand[0][0], G.hand[1][0]);
        winner = 0;
    } else {
        G.decks[1].push(G.hand[1][0], G.hand[0][0]);
        winner = 1;
    }

    document.getElementById('winner-banner').innerHTML = '<span class="banner">Player ' + winner + ' wins!</span>';

    G.hand[0] = [];
    G.hand[1] = [];

    document.getElementById('player0-hand').innerHTML = '';
    document.getElementById('player1-hand').innerHTML = '';
}

function getDecks()
{
    let deck = getDeck();
    deck = shuffle(deck);
    return [
        deck.slice(0,26),
        deck.slice(26,52)
    ];
}

export const WarCardGame = {
    setup: ctx => ({
        numPlayers: 2,
        decks: getDecks(),
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
            next: 'draw',
            onEnd: (G, ctx) => {
                ctx.currentPlayer = 0;
            }
        }

    },
    turn: { moveLimit: 1 },
}