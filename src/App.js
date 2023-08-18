import { useCallback, useRef, useState } from 'react';
import produce from 'immer';
import { getNextGeneration } from './game';
import './App.css'

const numRows = 20;
const numCols = 20;

function App() {
  const [grid, setGrid] = useState(() => {
    const rows = [];
    for (let i = 0; i < numRows; i++) {
      rows.push(Array.from(Array(numCols), () => 0));
    }
    return rows
  });

  //this is for the start button
  const [running, setRunning] = useState(false);

  const runningRef = useRef(running);
  runningRef.current = running;

  //useCallback is similar to useMemo, except that useMemo returns a memoized value, where useCallback returns a memoized function; prevents a component from re-rendering unless its props have been changed 
  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }
    //GOL rules implementation 
    setGrid(g => {
      return produce(g, gridCopy => {
        getNextGeneration(gridCopy);
      })
    })
  
    setTimeout(runSimulation, 100);
  }, [])

  return (
    //wrapped in a fragment bc React is only able to return one child, not multiple on same level 
    <>
    <h1
    style={{
      justifyItems: "center",
      alignItems: "center",
      textAlign: "center",
      color: "black"
    }}>
      Conway's Game of Life
    </h1>
    <div 
    style={{
      display: "grid",
      justifyContent: "center",
      alignItems: "center",
      gridTemplateColumns: `repeat(${numCols}, 20px)`
    }}>
      {grid.map((rows, i) => (rows.map((col, k) => 
      <div 
        key={`${i}-${k}`}
        onClick={() => {
          const newGrid = produce(grid, gridCopy => {
            gridCopy[i][k] = grid[i][k] ? 0 : 1;
          });
          setGrid(newGrid);
        }}
        style={{
        width: 20, 
        height: 20, 
        backgroundColor: grid[i][k] ? "aquamarine" : undefined, 
        border: "solid 1px black"}}/>)))}
    </div>
    <div
     style={{
      marginRight: "3rem",
      padding: "1rem"
    }}>
    <button
    onClick={() => {
      setRunning(!running);
      if (!running) {
        runningRef.current = true;
        runSimulation();
      }
    }}
    >{running ? "Stop" : "Start"}</button>
    <button
    onClick={() => {
      setGrid()
    }}>
      Reset
    </button>
    </div>
    </>
  );
}

export default App;
