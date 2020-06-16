import { Client } from 'boardgame.io/client';
import { WarCardGame } from './WarCardGame';

class WarCardGameClient {
  constructor() {
    this.client = Client({ game: WarCardGame });
    this.client.start();
    this.client.subscribe(state => this.update(state));

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
    document.getElementById('player0-hand-size').innerText = state.G.decks[0].length;
    document.getElementById('player1-hand-size').innerText = state.G.decks[1].length;
  }
}

const appElement = document.getElementById('carrdtable')
const app = new WarCardGameClient(appElement);
app.attachListeners();
