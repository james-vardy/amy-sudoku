"use client";

import React, { useState, useEffect, useCallback } from "react";
import { SudokuPuzzle, GameState, GameStats } from "../types/sudoku";
import { SudokuUtils, LocalStorage } from "../utils/sudoku";
import SudokuGrid from "./SudokuGrid";
import NumberInput from "./NumberInput";
import GameHeader from "./GameHeader";

interface SudokuGameProps {
  puzzle: SudokuPuzzle;
  onGameComplete?: (stats: GameStats) => void;
}

export default function SudokuGame({
  puzzle,
  onGameComplete,
}: SudokuGameProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const [gameState, setGameState] = useState<GameState>(() => {
    // Try to load saved game state
    const saved = LocalStorage.loadGameState(puzzle.date);
    if (saved && saved.puzzleId === puzzle.id) {
      return {
        ...saved,
        startTime: saved.startTime || Date.now(),
      };
    }

    // Initialize new game
    return {
      currentGrid: puzzle.puzzle.map((row) => [...row]),
      selectedCell: null,
      isCompleted: false,
      hasStarted: false,
      startTime: Date.now(),
      elapsedTime: 0,
      mistakes: 0,
    };
  });

  const [invalidCells, setInvalidCells] = useState<Set<string>>(new Set());
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  // Timer effect
  useEffect(() => {
    if (timer) {
      clearInterval(timer);
    }

    if (gameState.hasStarted && !gameState.isCompleted) {
      const interval = setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - gameState.startTime) / 1000);
        setGameState((prev) => ({ ...prev, elapsedTime: elapsed }));
      }, 1000);
      setTimer(interval);

      return () => {
        clearInterval(interval);
        setTimer(null);
      };
    }
  }, [gameState.hasStarted, gameState.isCompleted, gameState.startTime]);

  // Save game state whenever it changes
  useEffect(() => {
    const gameStateToSave = {
      ...gameState,
      puzzleId: puzzle.id,
    };
    LocalStorage.saveGameState(puzzle.date, gameStateToSave);
  }, [gameState, puzzle.date, puzzle.id]);

  // Handle play start
  const handlePlayStart = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      hasStarted: true,
      startTime: Date.now(),
      elapsedTime: 0,
    }));
  }, []);

  // Handle cell click
  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (!gameState.hasStarted || gameState.isCompleted) return;

      // Don't allow editing original puzzle cells
      if (puzzle.puzzle[row][col] !== 0) return;

      setGameState((prev) => ({
        ...prev,
        selectedCell: { row, col },
      }));
    },
    [gameState.hasStarted, gameState.isCompleted, puzzle.puzzle]
  );

  // Handle number input
  const handleNumberClick = useCallback(
    (number: number) => {
      if (
        !gameState.hasStarted ||
        !gameState.selectedCell ||
        gameState.isCompleted
      )
        return;

      const { row, col } = gameState.selectedCell;

      // Don't allow editing original puzzle cells
      if (puzzle.puzzle[row][col] !== 0) return;

      const newGrid = gameState.currentGrid.map((r) => [...r]);
      newGrid[row][col] = number;

      // Check if move is valid
      const isValid = SudokuUtils.isValidMove(newGrid, row, col, number);

      let newMistakes = gameState.mistakes;
      const newInvalidCells = new Set(invalidCells);
      const cellKey = `${row}-${col}`;

      if (!isValid) {
        newMistakes++;
        newInvalidCells.add(cellKey);
      } else {
        newInvalidCells.delete(cellKey);
      }

      setInvalidCells(newInvalidCells);

      // Check if puzzle is completed
      const isCompleted = SudokuUtils.isPuzzleComplete(
        newGrid,
        puzzle.solution
      );

      setGameState((prev) => {
        const newState = {
          ...prev,
          currentGrid: newGrid,
          mistakes: newMistakes,
          isCompleted,
        };

        if (isCompleted && onGameComplete) {
          const stats = LocalStorage.updateStats(true, newState.elapsedTime);
          onGameComplete(stats);
        }

        return newState;
      });
    },
    [gameState, puzzle, invalidCells, onGameComplete]
  );

  // Handle clear cell
  const handleClear = useCallback(() => {
    if (
      !gameState.hasStarted ||
      !gameState.selectedCell ||
      gameState.isCompleted
    )
      return;

    const { row, col } = gameState.selectedCell;

    // Don't allow editing original puzzle cells
    if (puzzle.puzzle[row][col] !== 0) return;

    const newGrid = gameState.currentGrid.map((r) => [...r]);
    newGrid[row][col] = 0;

    const newInvalidCells = new Set(invalidCells);
    newInvalidCells.delete(`${row}-${col}`);
    setInvalidCells(newInvalidCells);

    setGameState((prev) => ({
      ...prev,
      currentGrid: newGrid,
    }));
  }, [
    gameState.hasStarted,
    gameState.selectedCell,
    gameState.currentGrid,
    gameState.isCompleted,
    puzzle.puzzle,
    invalidCells,
  ]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameState.hasStarted || gameState.isCompleted) return;

      const key = e.key;
      if (key >= "1" && key <= "9") {
        handleNumberClick(parseInt(key));
      } else if (key === "Backspace" || key === "Delete") {
        handleClear();
      } else if (
        key === "ArrowUp" ||
        key === "ArrowDown" ||
        key === "ArrowLeft" ||
        key === "ArrowRight"
      ) {
        e.preventDefault();
        if (!gameState.selectedCell) return;

        const { row, col } = gameState.selectedCell;
        let newRow = row;
        let newCol = col;

        switch (key) {
          case "ArrowUp":
            newRow = Math.max(0, row - 1);
            break;
          case "ArrowDown":
            newRow = Math.min(8, row + 1);
            break;
          case "ArrowLeft":
            newCol = Math.max(0, col - 1);
            break;
          case "ArrowRight":
            newCol = Math.min(8, col + 1);
            break;
        }

        setGameState((prev) => ({
          ...prev,
          selectedCell: { row: newRow, col: newCol },
        }));
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [gameState, handleNumberClick, handleClear]);

  return (
    <div className="flex flex-col items-center min-h-screen valentine-bg bg-gradient-to-br from-pink-50 via-rose-25 to-pink-100 p-4 relative overflow-hidden">
      {/* Background hearts pattern */}
      {isClient && (
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute text-pink-400"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                fontSize: `${2 + Math.random() * 3}rem`,
                transform: `rotate(${Math.random() * 360}deg)`,
                animation: `pulse-heart ${
                  2 + Math.random() * 3
                }s infinite ease-in-out`,
              }}
            >
              ♥
            </div>
          ))}
        </div>
      )}

      <GameHeader
        puzzleNumber={puzzle.id}
        difficulty={puzzle.difficulty}
        elapsedTime={gameState.elapsedTime}
        mistakes={gameState.mistakes}
        isCompleted={gameState.isCompleted}
        hasStarted={gameState.hasStarted}
        onPlayStart={handlePlayStart}
      />

      <div className="flex flex-col xl:flex-row items-center xl:items-start space-y-8 xl:space-y-0 xl:space-x-12 relative z-10">
        <SudokuGrid
          grid={gameState.currentGrid}
          originalPuzzle={puzzle.puzzle}
          selectedCell={gameState.selectedCell}
          onCellClick={handleCellClick}
          invalidCells={invalidCells}
        />

        <NumberInput
          onNumberClick={handleNumberClick}
          onClear={handleClear}
          disabled={!gameState.hasStarted || gameState.isCompleted}
        />
      </div>
    </div>
  );
}
