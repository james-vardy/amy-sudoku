"use client";

import React, { useEffect, useState } from "react";
import { GameStats } from "../types/sudoku";
import { LocalStorage, SudokuUtils } from "../utils/sudoku";

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function StatsModal({ isOpen, onClose }: StatsModalProps) {
  const [stats, setStats] = useState<GameStats | null>(null);

  useEffect(() => {
    if (isOpen) {
      const gameStats = LocalStorage.loadStats();
      setStats(gameStats);
    }
  }, [isOpen]);

  if (!isOpen || !stats) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-pink-50 via-white to-rose-50 border-4 border-pink-300 rounded-2xl p-8 w-full max-w-lg shadow-2xl relative">
        {/* Decorative hearts */}
        <div className="absolute -top-2 -right-2 text-pink-400 text-2xl animate-pulse">
          ♥
        </div>
        <div className="absolute -top-2 -left-2 text-rose-400 text-2xl animate-pulse">
          ♥
        </div>

        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent flex items-center gap-2">
            ♥ Your Love Stats ♥
          </h2>
          <button
            onClick={onClose}
            className="heart-button text-pink-400 hover:text-pink-600 text-3xl font-bold transition-colors hover:scale-110"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="text-center p-5 bg-gradient-to-br from-pink-100 to-rose-100 border-2 border-pink-200 rounded-xl shadow-md">
            <div className="text-3xl font-bold text-rose-700 mb-1">
              {stats.gamesPlayed}
            </div>
            <div className="text-sm font-semibold text-pink-600 flex items-center justify-center gap-1">
              ♥ Games Played ♥
            </div>
          </div>

          <div className="text-center p-5 bg-gradient-to-br from-green-100 to-emerald-100 border-2 border-green-200 rounded-xl shadow-md">
            <div className="text-3xl font-bold text-green-700 mb-1">
              {stats.gamesWon}
            </div>
            <div className="text-sm font-semibold text-green-600 flex items-center justify-center gap-1">
              💚 Games Won 💚
            </div>
          </div>

          <div className="text-center p-5 bg-gradient-to-br from-purple-100 to-violet-100 border-2 border-purple-200 rounded-xl shadow-md">
            <div className="text-3xl font-bold text-purple-700 mb-1">
              {Math.round(
                (stats.gamesWon / Math.max(stats.gamesPlayed, 1)) * 100
              )}
              %
            </div>
            <div className="text-sm font-semibold text-purple-600 flex items-center justify-center gap-1">
              💜 Win Rate 💜
            </div>
          </div>

          <div className="text-center p-5 bg-gradient-to-br from-orange-100 to-amber-100 border-2 border-orange-200 rounded-xl shadow-md">
            <div className="text-3xl font-bold text-orange-700 mb-1">
              {stats.currentStreak}
            </div>
            <div className="text-sm font-semibold text-orange-600 flex items-center justify-center gap-1">
              🧡 Current Streak 🧡
            </div>
          </div>
        </div>

        <div className="bg-white/70 rounded-xl p-6 space-y-4 mb-8 border-2 border-pink-200">
          <div className="flex justify-between items-center">
            <span className="text-rose-700 font-semibold flex items-center gap-2">
              ♥ Max Streak:
            </span>
            <span className="font-bold text-pink-600 text-lg">
              {stats.maxStreak}
            </span>
          </div>

          {stats.averageTime > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-rose-700 font-semibold flex items-center gap-2">
                ⏱️ Average Time:
              </span>
              <span className="font-bold text-pink-600 text-lg">
                {SudokuUtils.formatTime(Math.round(stats.averageTime))}
              </span>
            </div>
          )}

          {stats.fastestTime > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-rose-700 font-semibold flex items-center gap-2">
                🏃‍♀️ Fastest Time:
              </span>
              <span className="font-bold text-pink-600 text-lg">
                {SudokuUtils.formatTime(stats.fastestTime)}
              </span>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="heart-button w-full px-6 py-4 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
        >
          ♥ Close with Love ♥
        </button>
      </div>
    </div>
  );
}
