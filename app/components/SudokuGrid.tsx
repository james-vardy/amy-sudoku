"use client";

import React from "react";

interface SudokuGridProps {
  grid: number[][];
  originalPuzzle: number[][];
  selectedCell: { row: number; col: number } | null;
  onCellClick: (row: number, col: number) => void;
  invalidCells: Set<string>;
}

export default function SudokuGrid({
  grid,
  originalPuzzle,
  selectedCell,
  onCellClick,
  invalidCells,
}: SudokuGridProps) {
  const getCellClassName = (row: number, col: number): string => {
    const baseClasses =
      "w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center text-xs sm:text-sm md:text-base font-bold transition-all duration-200 cursor-pointer select-none relative";

    let classes = baseClasses;

    // Enhanced 3x3 grid borders
    let borderClasses = "border border-pink-200";

    // Top borders - thicker for 3x3 separation
    if (row === 0) borderClasses += " border-t-4 border-t-rose-400";
    else if (row % 3 === 0) borderClasses += " border-t-4 border-t-rose-400";
    else borderClasses += " border-t border-t-pink-200";

    // Bottom borders
    if (row === 8) borderClasses += " border-b-4 border-b-rose-400";
    else if ((row + 1) % 3 === 0)
      borderClasses += " border-b-4 border-b-rose-400";
    else borderClasses += " border-b border-b-pink-200";

    // Left borders
    if (col === 0) borderClasses += " border-l-4 border-l-rose-400";
    else if (col % 3 === 0) borderClasses += " border-l-4 border-l-rose-400";
    else borderClasses += " border-l border-l-pink-200";

    // Right borders
    if (col === 8) borderClasses += " border-r-4 border-r-rose-400";
    else if ((col + 1) % 3 === 0)
      borderClasses += " border-r-4 border-r-rose-400";
    else borderClasses += " border-r border-r-pink-200";

    classes += " " + borderClasses;

    // Cell state styling with Valentine's theme
    const isOriginal = originalPuzzle[row][col] !== 0;
    const isSelected = selectedCell?.row === row && selectedCell?.col === col;
    const isInvalid = invalidCells.has(`${row}-${col}`);

    if (isSelected) {
      classes +=
        " bg-pink-200 text-rose-800 shadow-lg scale-105 ring-2 ring-pink-300";
    } else if (isInvalid) {
      classes += " bg-red-100 text-red-600 animate-pulse";
    } else if (isOriginal) {
      classes += " bg-rose-50 text-gray-800 font-black";
    } else {
      classes += " bg-white text-pink-600 hover:bg-pink-50 hover:scale-105";
    }

    // Highlight related cells with love theme
    if (selectedCell && !isSelected) {
      const isSameRow = selectedCell.row === row;
      const isSameCol = selectedCell.col === col;
      const isSameBox =
        Math.floor(selectedCell.row / 3) === Math.floor(row / 3) &&
        Math.floor(selectedCell.col / 3) === Math.floor(col / 3);

      if (isSameRow || isSameCol || isSameBox) {
        classes += " bg-pink-50 ring-1 ring-pink-200";
      }
    }

    return classes;
  };

  return (
    <div className="relative">
      {/* Floating hearts background */}
      <div className="heart-bg">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="floating-heart"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              fontSize: `${1 + Math.random() * 1}rem`,
            }}
          >
            ♥
          </div>
        ))}
      </div>

      {/* Main grid container with Valentine's styling */}
      <div className="inline-block bg-gradient-to-br from-pink-100 via-rose-50 to-pink-100 p-2 sm:p-3 md:p-4 rounded-2xl shadow-2xl border-4 border-rose-300">
        {/* 3x3 section containers */}
        <div className="grid grid-cols-3 gap-1 sm:gap-2">
          {[0, 1, 2].map((boxRow) =>
            [0, 1, 2].map((boxCol) => (
              <div
                key={`${boxRow}-${boxCol}`}
                className="bg-white rounded-lg p-0.5 sm:p-1 shadow-md border-2 border-rose-200"
              >
                <div className="grid grid-cols-3 gap-0">
                  {[0, 1, 2].map((cellRow) =>
                    [0, 1, 2].map((cellCol) => {
                      const actualRow = boxRow * 3 + cellRow;
                      const actualCol = boxCol * 3 + cellCol;
                      const cell = grid[actualRow][actualCol];

                      return (
                        <div
                          key={`${actualRow}-${actualCol}`}
                          className={getCellClassName(actualRow, actualCol)}
                          onClick={() => onCellClick(actualRow, actualCol)}
                        >
                          {cell !== 0 ? cell : ""}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
