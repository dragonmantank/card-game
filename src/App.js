import { Client } from 'boardgame.io/client';
import { WarCardGame } from './Game';

class TicTacToeClient {
  constructor() {
    this.client = Client({ game: WarCardGame });
    this.client.start();
  }
}

const app = new TicTacToeClient();