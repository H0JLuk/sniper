/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config();
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: process.env.SERVER_PORT });
const MSG = require('./src/messages.json');

const toJSON = (data) => JSON.stringify(data);
const fromJSON = (row) => JSON.parse(row);
const noop = () => void 0;

const coords = [
  [
    [500, 1090, 43, 43, 28],
    [600, 1100, 43, 43, 36],
    [800, 1100, 43, 43, 28],
    [940, 1120, 43, 43, 32],
  ],
  [
    [2060, 824, 43, 43, 34],
    [2160, 822, 43, 43, 28],
    [2350, 836, 43, 43, 26],
  ],
  [
    [3180, 760, 43, 43, 26],
    [3300, 770, 43, 43, 32],
    [3600, 776, 43, 43, 26],
  ],
];

const MAX_PLAYERS = Math.min(3, coords.length);
const playerList = [];

wss.on('connection', (ws) => {
  const player = createNewPlayer();

  if (!player) {
    const err = 'Server is full';
    ws.send(toJSON({ type: MSG.ERROR, data: err }));
    ws.terminate();
    ws.close();
    console.log(err);
    return;
  }

  ws.id = player.id;
  playerList[player.id] = player;
  console.log(player.id + ' joined');

  const message = {
    type: MSG.CONNECT,
    data: player,
  };
  broadcast(message, ws);
  ws.send(
    toJSON({
      type: MSG.SHOW,
      data: playerList.filter(({ id }) => player.id !== id),
    })
  );

  ws.on('message', (msg) => {
    msg = fromJSON(msg);
    console.log('msg ', msg);

    const handlers = {
      [MSG.MOVE]: moveHandler,
    };

    handlers[msg?.type]?.(msg, ws);
  });

  ws.isAlive = true;
  ws.on('pong', heartbeat);

  ws.on('error', console.log);

  ws.on('close', () => {
    console.log(player.id + ' - has left the server.');
    broadcast({
      type: MSG.LEAVE,
      data: player.id,
    });
    delete playerList[player.id];
  });
});

function moveHandler(msg, ws) {
  const { side } = msg;

  let newCoords = null;
  const idx = coords[ws.id].findIndex((i) => i.toString() === playerList[ws.id].coords.toString());
  if (side === 'LEFT') {
    if (idx > 0) {
      newCoords = coords[ws.id][idx - 1];
    }
  } else if (side === 'RIGHT') {
    if (idx <= MAX_PLAYERS) {
      newCoords = coords[ws.id][idx + 1];
    }
  }

  if (newCoords) {
    playerList[ws.id].coords = newCoords;
    broadcast(
      {
        data: playerList[ws.id],
        type: MSG.MOVE,
      },
      ws
    );
  }
}

function createNewPlayer() {
  const id = findEmptyPlayerSlot();

  if (id >= MAX_PLAYERS) {
    return null;
  }

  return {
    name: 'Player ' + id,
    id,
    coords: coords[id][0],
  };
}

function findEmptyPlayerSlot() {
  for (let i = 0; i < playerList.length; i++) {
    if (playerList[i] == undefined) {
      return i;
    }
  }

  return playerList.length;
}

function broadcast(data, exception) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN && client != exception) {
      client.send(toJSON(data));
    }
  });
}

function heartbeat() {
  this.isAlive = true;
}

setInterval(function ping() {
  wss.clients.forEach((ws) => {
    if (!ws.isAlive) return ws.terminate();
    ws.isAlive = false;
    ws.ping(noop);
  });
}, 10_000);
