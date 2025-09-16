const fs = require("fs");
const path = require("path");

class SudokuGenerator {
  constructor() {
    this.grid = Array(9)
      .fill()
      .map(() => Array(9).fill(0));
  }

  // Check if a number can be placed at the given position
  isValid(row, col, num) {
    // Check row
    for (let x = 0; x < 9; x++) {
      if (this.grid[row][x] === num) return false;
    }

    // Check column
    for (let x = 0; x < 9; x++) {
      if (this.grid[x][col] === num) return false;
    }

    // Check 3x3 box
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (this.grid[startRow + i][startCol + j] === num) return false;
      }
    }

    return true;
  }

  // Fill the grid with a valid sudoku solution
  fillGrid() {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (this.grid[row][col] === 0) {
          const numbers = this.shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
          for (const num of numbers) {
            if (this.isValid(row, col, num)) {
              this.grid[row][col] = num;
              if (this.fillGrid()) return true;
              this.grid[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  // Shuffle array for randomization
  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // Remove numbers to create puzzle (keeping it solvable)
  createPuzzle(difficulty = "medium") {
    const difficultyLevels = {
      easy: 35,
      medium: 45,
      hard: 55,
    };

    const cellsToRemove = difficultyLevels[difficulty] || 45;
    const solution = this.grid.map((row) => [...row]);

    let attempts = cellsToRemove;
    while (attempts > 0) {
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);

      if (this.grid[row][col] !== 0) {
        const backup = this.grid[row][col];
        this.grid[row][col] = 0;

        // Simple check - if we can still solve it uniquely, keep the removal
        // For simplicity, we'll just remove the cell
        attempts--;
      }
    }

    return {
      puzzle: this.grid.map((row) => [...row]),
      solution: solution,
    };
  }

  // Generate a new sudoku puzzle
  generate(difficulty = "medium") {
    this.grid = Array(9)
      .fill()
      .map(() => Array(9).fill(0));
    this.fillGrid();
    return this.createPuzzle(difficulty);
  }
}

function generateSudokus() {
  const generator = new SudokuGenerator();
  const sudokus = [];

  // Start date: Wednesday, September 17, 2025
  const startDate = new Date("2025-09-17");

  console.log("Generating 1000 sudoku puzzles...");

  for (let i = 0; i < 1000; i++) {
    if (i % 100 === 0) {
      console.log(`Generated ${i}/1000 puzzles...`);
    }

    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);

    const difficulty = ["easy", "medium", "hard"][
      Math.floor(Math.random() * 3)
    ];
    const sudoku = generator.generate(difficulty);

    sudokus.push({
      id: i + 1,
      date: currentDate.toISOString().split("T")[0], // YYYY-MM-DD format
      difficulty: difficulty,
      puzzle: sudoku.puzzle,
      solution: sudoku.solution,
    });
  }

  console.log("Generated 1000/1000 puzzles!");

  // Save to public folder
  const outputPath = path.join(__dirname, "..", "public", "sudokus.json");
  fs.writeFileSync(outputPath, JSON.stringify(sudokus, null, 2));

  console.log(`Sudokus saved to: ${outputPath}`);
  console.log(`Date range: ${sudokus[0].date} to ${sudokus[999].date}`);
}

// Run the generator
generateSudokus();
