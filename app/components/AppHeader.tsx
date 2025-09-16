"use client";

import React from "react";

interface AppHeaderProps {
  onStatsClick: () => void;
}

export default function AppHeader({ onStatsClick }: AppHeaderProps) {
  return (
    <header className="w-full bg-gradient-to-r from-pink-100 via-rose-50 to-pink-100 shadow-lg border-b-4 border-pink-300">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent flex items-center gap-2">
          ♥ iloveamyb.com ♥
        </h1>

        <div className="flex items-center space-x-3">
          <button
            onClick={onStatsClick}
            className="heart-button p-3 rounded-xl bg-gradient-to-r from-pink-200 to-rose-200 hover:from-pink-300 hover:to-rose-300 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-110"
            title="View Your Love Stats ♥"
          >
            <svg
              className="w-6 h-6 text-pink-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <span className="sr-only">♥ Stats ♥</span>
          </button>
        </div>
      </div>
    </header>
  );
}
