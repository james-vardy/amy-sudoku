export interface SudokuPuzzle {
  id: number;
  date: string;
  difficulty: "easy" | "medium" | "hard";
  puzzle: number[][];
  solution: number[][];
}

export interface GameState {
  currentGrid: number[][];
  selectedCell: { row: number; col: number } | null;
  isCompleted: boolean;
  hasStarted: boolean;
  startTime: number;
  elapsedTime: number;
  mistakes: number;
}

export interface GameStats {
  gamesPlayed: number;
  gamesCompleted: number;
  totalTime: number;
  averageTime: number;
  fastestTime: number;
  slowestTime: number;
  currentStreak: number;
  maxStreak: number;
}
