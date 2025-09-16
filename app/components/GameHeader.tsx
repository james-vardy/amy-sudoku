"use client";

import React from "react";
import { SudokuUtils } from "../utils/sudoku";

interface GameHeaderProps {
  puzzleNumber: number;
  difficulty: string;
  elapsedTime: number;
  mistakes: number;
  isCompleted: boolean;
  hasStarted: boolean;
  onPlayStart: () => void;
}

export default function GameHeader({
  puzzleNumber,
  difficulty,
  elapsedTime,
  mistakes,
  isCompleted,
  hasStarted,
  onPlayStart,
}: GameHeaderProps) {
  return (
    <div className="w-full max-w-lg mx-auto mb-8">
      <div className="bg-gradient-to-br from-pink-50 via-white to-rose-50 border-4 border-pink-300 rounded-2xl shadow-2xl p-6">
        {/* Title and Date with Hearts */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-2 flex items-center justify-center gap-2">
            ♥ Daily Sudoku for Amy ♥
          </h1>
          <div className="text-2xl font-bold text-pink-700 mb-2">
            Hey my love, ready to play Sudoku #{puzzleNumber}? 💕
          </div>
          <p className="text-pink-600 font-medium">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Play Button - Show only if game hasn't started */}
        {!hasStarted && !isCompleted && (
          <div className="text-center mb-6">
            <button
              onClick={onPlayStart}
              className="heart-button px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-2xl font-bold text-xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-110 active:scale-95"
            >
              ♥ Start Playing ♥
            </button>
          </div>
        )}

        {/* Game Stats with Valentine styling - Show only if game has started */}
        {hasStarted && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center bg-rose-100 p-3 rounded-xl border-2 border-rose-200">
              <div className="text-xs text-rose-600 uppercase tracking-wide font-semibold">
                ♥ Difficulty ♥
              </div>
              <div
                className={`font-bold text-lg capitalize ${SudokuUtils.getDifficultyColor(
                  difficulty
                )}`}
              >
                {difficulty}
              </div>
            </div>

            <div className="text-center bg-pink-100 p-3 rounded-xl border-2 border-pink-200">
              <div className="text-xs text-pink-600 uppercase tracking-wide font-semibold">
                ♥ Time ♥
              </div>
              <div className="font-bold text-lg font-mono text-rose-700">
                {SudokuUtils.formatTime(elapsedTime)}
              </div>
            </div>

            <div className="text-center bg-red-100 p-3 rounded-xl border-2 border-red-200">
              <div className="text-xs text-red-600 uppercase tracking-wide font-semibold">
                ♥ Mistakes ♥
              </div>
              <div className="font-bold text-lg text-red-600">{mistakes}</div>
            </div>
          </div>
        )}

        {isCompleted && (
          <div className="mt-6 p-4 bg-gradient-to-r from-pink-100 to-rose-100 border-3 border-pink-300 rounded-xl text-center completion-hearts">
            <div className="text-2xl mb-2">💖✨🎉✨💖</div>
            <div className="text-pink-800 font-bold text-lg">
              Congratulations, Amy! 💕
            </div>
            <div className="text-rose-600 font-medium mt-1">
              Completed in {SudokuUtils.formatTime(elapsedTime)} with love! ♥
            </div>
            <div className="text-xl mt-2">💖💖💖</div>
          </div>
        )}
      </div>
    </div>
  );
}
