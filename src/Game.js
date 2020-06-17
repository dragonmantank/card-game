import 'regenerator-runtime/runtime'
import { Client } from 'boardgame.io/client';
import { SocketIO } from 'boardgame.io/multiplayer';
import { WarCardGame } from './WarCardGame';

let localPlayerID = 0;

function SplashScreen(rootElement) {
  return new Promise(resolve => {
    const createButton = playerID => {
      const button = document.createElement('button');
      button.textContent = 'Player ' + playerID;
      button.onclick = () => {
        localPlayerID = playerID;
        resolve(playerID);
      }
      rootElement.append(button);
    };
    rootElement.innerHTML = ` <p>Play as</p>`;
    const playerIDs = ['0', '1', 'Spectator'];
    playerIDs.forEach(createButton);
  });
}

function generateCardHTML(card) {
  const suits = {
    spades: { color: 'black', character: '&spadesuit;' },
    clubs: { color: 'black', character: '&clubs;' },
    diamonds: { color: 'red', character: '&diamondsuit;' },
    hearts: { color: 'red', character: '&heartsuit;' }
  }

  let template = `<div class="card" style="color: ${suits[card.Suit].color}">${card.Value} ${suits[card.Suit].character}</div>`;
  return template;
}

class WarCardGameClient {
  constructor(rootElement, { playerID } = {}) {
    this.rootElement = rootElement;
    this.client = Client({
      game: WarCardGame,
      multiplayer: SocketIO({ server: window.location.protocol + '//' + window.location.hostname + ':8000' }),
      playerID
    });
    console.log(localPlayerID);
    this.createGameBoard();
    this.client.start();
    this.client.subscribe(state => this.update(state));
    this.attachListeners();
  }

  createGameBoard() {
    const template = document.getElementById('cardgame');
    this.rootElement.innerHTML = template.innerHTML;

    // Show the videos once you select a player ID
    let subscriber = document.getElementById('subscriber');
    let publisher = document.getElementById('publisher');

    if (localPlayerID == 0) {
      document.getElementById('player1').prepend(subscriber);
      document.getElementById('player0').prepend(publisher);
    } else if (localPlayerID == 1) {
      document.getElementById('player1').prepend(publisher);
      document.getElementById('player0').prepend(subscriber);
    }
    
    subscriber.style.display = 'inherit';
    publisher.style.display = 'inherit';
  }

  attachListeners() {
    const handleDrawCard = event => {
      this.client.moves.DrawCard();
    }

    const handleResolveGame = event => {
      this.client.moves['ResolveCards']();
    }

    document.getElementById('player0-deck').onclick = handleDrawCard;
    document.getElementById('player1-deck').onclick = handleDrawCard;
    document.getElementById('endbutton').onclick = handleResolveGame;
  }

  update(state) {
    if (state === null) return;
    document.getElementById('player0-hand-size').innerText = state.G.decks[0].length;
    document.getElementById('player1-hand-size').innerText = state.G.decks[1].length;

    document.getElementById('player' + state.ctx.currentPlayer).classList.add('current-player');
    document.getElementById('player' + (state.ctx.currentPlayer == 0 ? 1 : 0)).classList.remove('current-player');

    if (state.G.winner === 0 || state.G.winner === 1) {
      document.getElementById('winner-banner').innerHTML = '<span class="banner">Player ' + state.G.winner + ' wins!</span>';
      document.getElementById('player0-hand').innerHTML = '';
      document.getElementById('player1-hand').innerHTML = '';
    }

    if (state.G.hand[0].length == 1) {
      document.getElementById('player0-hand').innerHTML = generateCardHTML(state.G.hand[0][0]);
    }    

    if (state.G.hand[1].length == 1) {
      document.getElementById('player1-hand').innerHTML = generateCardHTML(state.G.hand[1][0]);
    }

    if (state.G.hand[1].length == 1 && state.G.hand[0].length == 1) {
      // Do nothing
    } else {
      document.getElementById('winner-banner').innerHTML = '</span>';
    }
  }
}

class App {
  constructor(rootElement) {
    SplashScreen(rootElement).then(playerID => {
      this.client = new WarCardGameClient(rootElement, { playerID });
    });
  }
}

const appElement = document.getElementById('cardtable')
const app = new App(appElement);
