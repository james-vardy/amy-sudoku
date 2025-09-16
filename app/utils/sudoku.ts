import { SudokuPuzzle, GameStats, GameState } from "../types/sudoku";

export class SudokuUtils {
  // Get today's puzzle
  static getTodaysPuzzle(puzzles: SudokuPuzzle[]): SudokuPuzzle | null {
    const today = new Date().toISOString().split("T")[0];
    return puzzles.find((puzzle) => puzzle.date === today) || null;
  }

  // Validate if a number can be placed at position
  static isValidMove(
    grid: number[][],
    row: number,
    col: number,
    num: number
  ): boolean {
    // Check row
    for (let x = 0; x < 9; x++) {
      if (x !== col && grid[row][x] === num) return false;
    }

    // Check column
    for (let x = 0; x < 9; x++) {
      if (x !== row && grid[x][col] === num) return false;
    }

    // Check 3x3 box
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const currentRow = startRow + i;
        const currentCol = startCol + j;
        if (
          !(currentRow === row && currentCol === col) &&
          grid[currentRow][currentCol] === num
        ) {
          return false;
        }
      }
    }

    return true;
  }

  // Check if the puzzle is completed
  static isPuzzleComplete(grid: number[][], solution: number[][]): boolean {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] !== solution[row][col]) {
          return false;
        }
      }
    }
    return true;
  }

  // Get a hint (reveal a random empty cell)
  static getHint(
    currentGrid: number[][],
    solution: number[][]
  ): { row: number; col: number; value: number } | null {
    const emptyCells = [];

    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (currentGrid[row][col] === 0) {
          emptyCells.push({ row, col, value: solution[row][col] });
        }
      }
    }

    if (emptyCells.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    return emptyCells[randomIndex];
  }

  // Format time as MM:SS
  static formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  }

  // Get difficulty color
  static getDifficultyColor(difficulty: string): string {
    switch (difficulty) {
      case "easy":
        return "text-green-600";
      case "medium":
        return "text-yellow-600";
      case "hard":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  }
}

export class LocalStorage {
  private static readonly GAME_STATE_KEY = "amy-sudoku-game-state";
  private static readonly STATS_KEY = "amy-sudoku-stats";
  private static readonly CURRENT_DATE_KEY = "amy-sudoku-current-date";

  // Save game state
  static saveGameState(
    date: string,
    gameState: GameState & { puzzleId: number }
  ): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        `${this.GAME_STATE_KEY}-${date}`,
        JSON.stringify(gameState)
      );
    }
  }

  // Load game state
  static loadGameState(
    date: string
  ): (GameState & { puzzleId: number }) | null {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(`${this.GAME_STATE_KEY}-${date}`);
      return saved ? JSON.parse(saved) : null;
    }
    return null;
  }

  // Save stats
  static saveStats(stats: GameStats): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.STATS_KEY, JSON.stringify(stats));
    }
  }

  // Load stats
  static loadStats(): GameStats {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(this.STATS_KEY);
      if (saved) {
        const parsedStats = JSON.parse(saved);

        // Migration for legacy stats structure
        if (
          parsedStats.gamesWon !== undefined &&
          parsedStats.gamesCompleted === undefined
        ) {
          return {
            gamesPlayed: parsedStats.gamesPlayed || 0,
            gamesCompleted: parsedStats.gamesWon || 0,
            totalTime: parsedStats.totalTime || 0,
            averageTime: parsedStats.averageTime || 0,
            fastestTime: parsedStats.fastestTime || 0,
            slowestTime: 0, // New field, start fresh
            currentStreak: parsedStats.currentStreak || 0,
            maxStreak: parsedStats.maxStreak || 0,
          };
        }

        return parsedStats;
      }
    }

    return {
      gamesPlayed: 0,
      gamesCompleted: 0,
      totalTime: 0,
      averageTime: 0,
      fastestTime: 0,
      slowestTime: 0,
      currentStreak: 0,
      maxStreak: 0,
    };
  }

  // Update stats after game completion
  static updateStats(completed: boolean, timeInSeconds: number): GameStats {
    const stats = this.loadStats();

    stats.gamesPlayed++;

    if (completed) {
      stats.gamesCompleted++;
      stats.currentStreak++;
      stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak);
      stats.totalTime += timeInSeconds;
      stats.averageTime = stats.totalTime / stats.gamesCompleted;

      if (stats.fastestTime === 0 || timeInSeconds < stats.fastestTime) {
        stats.fastestTime = timeInSeconds;
      }

      if (stats.slowestTime === 0 || timeInSeconds > stats.slowestTime) {
        stats.slowestTime = timeInSeconds;
      }
    } else {
      stats.currentStreak = 0;
    }

    this.saveStats(stats);
    return stats;
  }
}
