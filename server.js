import { Server, OPEN } from 'ws';
const wss = new Server({ port: 8080 });

let players = {}; // Store players' WebSocket connections and game state

wss.on('connection', (ws) => {
  const playerId = Date.now(); // Assign unique ID to each player
  players[playerId] = ws;
  console.log(`Player ${playerId} connected`);

  // Handle incoming messages from players
  ws.on('message', (message) => {
    const { grid } = JSON.parse(message); 
    // Broadcast the updated grid to all connected players
    broadcastGridUpdate(grid);
  });

  ws.on('close', () => {
    delete players[playerId];
    console.log(`Player ${playerId} disconnected`);
  });
});

function broadcastGridUpdate(grid) {
  Object.values(players).forEach(player => {
    if (player.readyState === OPEN) {
      player.send(JSON.stringify({ grid }));
    }
  });
}
