import React, { useState, useEffect, useCallback } from 'react';
import { Bomb, Flag, RefreshCw, Smile, Frown, Trophy } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface Cell {
  row: number;
  col: number;
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
}

const ROWS = 10;
const COLS = 10;
const MINES = 15;

export const Minesweeper: React.FC = () => {
  const { t } = useLanguage();
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [mineCount, setMineCount] = useState(MINES);
  const [timer, setTimer] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Initialize Board
  const initBoard = useCallback(() => {
    const newGrid: Cell[][] = [];
    for (let r = 0; r < ROWS; r++) {
      const row: Cell[] = [];
      for (let c = 0; c < COLS; c++) {
        row.push({
          row: r,
          col: c,
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          neighborMines: 0,
        });
      }
      newGrid.push(row);
    }

    // Place Mines
    let minesPlaced = 0;
    while (minesPlaced < MINES) {
      const r = Math.floor(Math.random() * ROWS);
      const c = Math.floor(Math.random() * COLS);
      if (!newGrid[r][c].isMine) {
        newGrid[r][c].isMine = true;
        minesPlaced++;
      }
    }

    // Calculate Neighbors
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1],
    ];

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (newGrid[r][c].isMine) continue;
        let count = 0;
        directions.forEach(([dr, dc]) => {
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && newGrid[nr][nc].isMine) {
            count++;
          }
        });
        newGrid[r][c].neighborMines = count;
      }
    }

    setGrid(newGrid);
    setGameOver(false);
    setWin(false);
    setMineCount(MINES);
    setTimer(0);
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    initBoard();
  }, [initBoard]);

  useEffect(() => {
    let interval: any;
    if (isPlaying && !gameOver && !win) {
      interval = setInterval(() => {
        setTimer((t) => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, gameOver, win]);

  // Flood Fill for empty cells
  const revealCell = (r: number, c: number, currentGrid: Cell[][]) => {
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS || currentGrid[r][c].isRevealed || currentGrid[r][c].isFlagged) {
      return;
    }

    currentGrid[r][c].isRevealed = true;

    if (currentGrid[r][c].neighborMines === 0) {
      const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1],  [1, 0],  [1, 1],
      ];
      directions.forEach(([dr, dc]) => {
        revealCell(r + dr, c + dc, currentGrid);
      });
    }
  };

  const handleCellClick = (r: number, c: number) => {
    if (gameOver || win || grid[r][c].isFlagged || grid[r][c].isRevealed) return;

    if (!isPlaying) setIsPlaying(true);

    const newGrid = [...grid.map(row => [...row])];

    if (newGrid[r][c].isMine) {
      // Game Over
      newGrid[r][c].isRevealed = true;
      // Reveal all mines
      newGrid.forEach(row => row.forEach(cell => {
        if (cell.isMine) cell.isRevealed = true;
      }));
      setGrid(newGrid);
      setGameOver(true);
    } else {
      revealCell(r, c, newGrid);
      setGrid(newGrid);
      checkWin(newGrid);
    }
  };

  const handleContextMenu = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (gameOver || win || grid[r][c].isRevealed) return;
    if (!isPlaying) setIsPlaying(true);

    const newGrid = [...grid.map(row => [...row])];
    if (newGrid[r][c].isFlagged) {
      newGrid[r][c].isFlagged = false;
      setMineCount(m => m + 1);
    } else {
      newGrid[r][c].isFlagged = true;
      setMineCount(m => m - 1);
    }
    setGrid(newGrid);
  };

  const checkWin = (currentGrid: Cell[][]) => {
    let unrevealedSafeCells = 0;
    currentGrid.forEach(row => row.forEach(cell => {
      if (!cell.isMine && !cell.isRevealed) unrevealedSafeCells++;
    }));

    if (unrevealedSafeCells === 0) {
      setWin(true);
      setIsPlaying(false);
    }
  };

  const getCellContent = (cell: Cell) => {
    if (cell.isFlagged) return <Flag size={16} className="text-red-500 fill-red-500" />;
    if (!cell.isRevealed) return null;
    if (cell.isMine) return <Bomb size={18} className="text-slate-800 fill-slate-800" />;
    if (cell.neighborMines > 0) return <span className={`font-bold text-lg ${getNumberColor(cell.neighborMines)}`}>{cell.neighborMines}</span>;
    return null;
  };

  const getNumberColor = (num: number) => {
    const colors = [
      '', 'text-blue-500', 'text-green-600', 'text-red-500', 
      'text-purple-600', 'text-orange-600', 'text-teal-600', 'text-black', 'text-gray-600'
    ];
    return colors[num] || 'text-black';
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-200 dark:bg-slate-800 p-4 items-center justify-center select-none">
      
      {/* Header */}
      <div className="bg-slate-300 dark:bg-slate-700 p-3 rounded-t-lg w-full max-w-md flex items-center justify-between border-b-4 border-slate-400 dark:border-slate-600 shadow-inner">
        <div className="bg-black text-red-500 font-mono text-2xl px-2 py-1 rounded border border-slate-600 w-16 text-center">
          {String(Math.max(0, mineCount)).padStart(3, '0')}
        </div>
        
        <button 
          onClick={initBoard} 
          className="w-10 h-10 bg-slate-200 hover:bg-slate-100 dark:bg-slate-600 dark:hover:bg-slate-500 border-b-4 border-r-4 border-slate-400 dark:border-slate-800 active:border-none active:translate-y-1 rounded flex items-center justify-center transition-all"
        >
          {gameOver ? <Frown size={24} className="text-red-600" /> : 
           win ? <Trophy size={24} className="text-yellow-500" /> : 
           <Smile size={24} className="text-yellow-600 dark:text-yellow-400" />}
        </button>

        <div className="bg-black text-red-500 font-mono text-2xl px-2 py-1 rounded border border-slate-600 w-16 text-center">
          {String(Math.min(999, timer)).padStart(3, '0')}
        </div>
      </div>

      {/* Game Grid */}
      <div className="bg-slate-400 dark:bg-slate-600 p-3 rounded-b-lg shadow-2xl w-full max-w-md flex justify-center">
        <div 
          className="grid gap-1 bg-slate-500 dark:bg-slate-900 p-1 border-b-2 border-r-2 border-white/20 dark:border-white/10"
          style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
        >
          {grid.map((row, rIndex) => (
            row.map((cell, cIndex) => (
              <div
                key={`${rIndex}-${cIndex}`}
                onClick={() => handleCellClick(rIndex, cIndex)}
                onContextMenu={(e) => handleContextMenu(e, rIndex, cIndex)}
                className={`
                  w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center cursor-pointer text-sm font-bold transition-colors
                  ${cell.isRevealed 
                    ? 'bg-slate-100 dark:bg-slate-300 border border-slate-200 dark:border-slate-400 shadow-inner' 
                    : 'bg-slate-300 dark:bg-slate-500 hover:bg-slate-200 dark:hover:bg-slate-400 border-t-4 border-l-4 border-white/60 dark:border-white/20 border-b-4 border-r-4 border-slate-500 dark:border-slate-800 active:border-none'}
                  ${cell.isRevealed && cell.isMine ? 'bg-red-500 dark:bg-red-500' : ''}
                `}
              >
                {getCellContent(cell)}
              </div>
            ))
          ))}
        </div>
      </div>
      
      <div className="mt-4 text-slate-500 dark:text-slate-400 text-xs">
          {t('minesweeper.instruction')}
      </div>
    </div>
  );
};