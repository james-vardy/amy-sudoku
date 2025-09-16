"use client";

import React, { useState, useEffect } from "react";
import { SudokuPuzzle } from "./types/sudoku";
import { SudokuUtils } from "./utils/sudoku";
import SudokuGame from "./components/SudokuGame";
import StatsModal from "./components/StatsModal";
import AppHeader from "./components/AppHeader";

export default function Home() {
  const [puzzle, setPuzzle] = useState<SudokuPuzzle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    async function loadTodaysPuzzle() {
      try {
        const response = await fetch("/sudokus.json");
        if (!response.ok) {
          throw new Error("Failed to load puzzles");
        }

        const puzzles: SudokuPuzzle[] = await response.json();
        const todaysPuzzle = SudokuUtils.getTodaysPuzzle(puzzles);

        if (!todaysPuzzle) {
          throw new Error("No puzzle found for today");
        }

        setPuzzle(todaysPuzzle);
      } catch (err) {
        console.error("Error loading puzzle:", err);
        setError(err instanceof Error ? err.message : "Failed to load puzzle");
      } finally {
        setLoading(false);
      }
    }

    loadTodaysPuzzle();
  }, []);

  const handleGameComplete = (stats: any) => {
    setShowStats(true);
  };

  if (loading) {
    return (
      <>
        <AppHeader onStatsClick={() => setShowStats(true)} />
        <div className="min-h-screen valentine-bg bg-gradient-to-br from-pink-50 via-rose-25 to-pink-100 flex items-center justify-center relative">
          {/* Background hearts for loading */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="absolute text-pink-400 animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  fontSize: `${1.5 + Math.random() * 2}rem`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              >
                ♥
              </div>
            ))}
          </div>

          <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-8 border-3 border-pink-300 shadow-2xl relative z-10">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-pink-300 border-t-pink-600 mx-auto mb-6"></div>
            <p className="text-pink-700 font-semibold text-lg">
              Loading today's puzzle with love... ♥
            </p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <AppHeader onStatsClick={() => setShowStats(true)} />
        <div className="min-h-screen valentine-bg bg-gradient-to-br from-pink-50 via-rose-25 to-pink-100 flex items-center justify-center">
          <div className="text-center bg-white/90 backdrop-blur-sm rounded-2xl p-8 border-3 border-red-300 shadow-2xl">
            <div className="text-red-400 text-6xl mb-4">💔</div>
            <h2 className="text-2xl font-bold text-red-600 mb-3">
              Oops! Love ran into an issue
            </h2>
            <p className="text-rose-600 font-medium mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="heart-button px-6 py-3 bg-gradient-to-r from-red-400 to-pink-400 text-white rounded-xl font-bold hover:from-red-500 hover:to-pink-500 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              ♥ Try Again my Love ♥
            </button>
          </div>
        </div>
      </>
    );
  }

  if (!puzzle) {
    return (
      <>
        <AppHeader onStatsClick={() => setShowStats(true)} />
        <div className="min-h-screen valentine-bg bg-gradient-to-br from-pink-50 via-rose-25 to-pink-100 flex items-center justify-center">
          <div className="text-center bg-white/90 backdrop-blur-sm rounded-2xl p-8 border-3 border-yellow-300 shadow-2xl">
            <div className="text-yellow-500 text-6xl mb-4">💛</div>
            <h2 className="text-2xl font-bold text-yellow-600 mb-3">
              No puzzle available yet, gorgeous!
            </h2>
            <p className="text-amber-600 font-medium">
              Check back tomorrow for a new Sudoku girl! ♥
            </p>
          </div>
        </div>
        {showStats && (
          <StatsModal isOpen={showStats} onClose={() => setShowStats(false)} />
        )}
      </>
    );
  }

  return (
    <>
      <AppHeader onStatsClick={() => setShowStats(true)} />
      <SudokuGame puzzle={puzzle} onGameComplete={handleGameComplete} />
      {showStats && (
        <StatsModal isOpen={showStats} onClose={() => setShowStats(false)} />
      )}
    </>
  );
}
