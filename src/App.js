import { useRef, useState } from 'react';
import { BLINKER_BOARD } from './game';
import produce from 'immer';

//1) create the grid 
//2) ability to change the state of each cell, where 1 = live/"on" & 0 = dead/"no color"
  //ask if I'm able to use packages; explain produce by immer 
//create the start button 

const numRows = 50;
const numCols = 50;

function App() {
  const [grid, setGrid] = useState(() => {
    const rows = [];
    for (let i = 0; i < numRows; i++) {
      rows.push(Array.from(Array(numCols), () => 0));
    }
    return rows
  });

  //this is for the start button
  const [running, SetRunning] = useState(false);

  const runningRef = useRef(running);
  runningRef.current = running;

  return (
    //wrapped in a fragment bc React is only able to return one child, not multiple on same level 
    <>
    <button>Start</button>
    <div 
    style={{
      display: "grid",
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
    </>
  );
}

export default App;
