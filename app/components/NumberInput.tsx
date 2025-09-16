"use client";

import React from "react";

interface NumberInputProps {
  onNumberClick: (number: number) => void;
  onClear: () => void;
  disabled?: boolean;
}

export default function NumberInput({
  onNumberClick,
  onClear,
  disabled = false,
}: NumberInputProps) {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Heart decoration */}
      <div className="text-2xl text-pink-400 animate-pulse">♥ Numbers ♥</div>

      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {numbers.map((number) => (
          <button
            key={number}
            onClick={() => onNumberClick(number)}
            disabled={disabled}
            className="heart-button w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-pink-100 to-rose-100 border-3 border-pink-300 rounded-xl text-lg sm:text-xl md:text-2xl font-bold transition-all duration-300 hover:from-pink-200 hover:to-rose-200 hover:border-pink-400 hover:scale-110 hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-rose-700 shadow-md"
          >
            {number}
          </button>
        ))}
      </div>

      <div className="flex space-x-4">
        <button
          onClick={onClear}
          disabled={disabled}
          className="heart-button px-6 py-3 bg-gradient-to-r from-red-400 to-pink-400 hover:from-red-500 hover:to-pink-500 text-white rounded-xl font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
        >
          ♥ Clear ♥
        </button>
      </div>
    </div>
  );
}
