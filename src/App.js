import React, { useCallback, useState, useRef } from 'react';
import produce from 'immer';
import useWebSocket from 'react-use-websocket';

const numRows = 20;
const numCols = 20;

function App() {
  const [grid, setGrid] = useState(() => {
    const rows = [];
    for (let i = 0; i < numRows; i++) {
      rows.push(Array.from(Array(numCols), () => 0));
    }
    return rows;
  });

  const { sendJsonMessage, lastJsonMessage } = useWebSocket('ws://localhost:8080', {
    onMessage: (event) => {
      const { grid } = JSON.parse(event.data);
      setGrid(grid);  // Update the grid when receiving a new state
    }
  });

  const handleCellToggle = (i, k) => {
    const newGrid = produce(grid, gridCopy => {
      gridCopy[i][k] = grid[i][k] ? 0 : 1;
    });
    setGrid(newGrid);
    sendJsonMessage({ grid: newGrid }); // Send the updated grid to the server
  };

  return (
    <>
      <h1>Conway's Game of Life - Multiplayer</h1>
      <div style={{
        display: "grid",
        gridTemplateColumns: `repeat(${numCols}, 20px)`
      }}>
        {grid.map((rows, i) =>
          rows.map((col, k) => (
            <div
              key={`${i}-${k}`}
              onClick={() => handleCellToggle(i, k)}
              style={{
                width: 20,
                height: 20,
                backgroundColor: grid[i][k] ? "aquamarine" : undefined,
                border: "solid 1px black"
              }}
            />
          ))
        )}
      </div>
      <button onClick={() => setRunning(!running)}>{running ? "Stop" : "Start"}</button>
    </>
  );
}

export default App;