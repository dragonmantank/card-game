// src/server.js
const { Server } = require('boardgame.io/server');
const { WarCardGame } = require('./src/WarCardGame');

const server = Server({ games: [WarCardGame] });

server.run(8000);