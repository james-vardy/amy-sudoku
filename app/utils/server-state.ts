import { cookies } from "next/headers";

export interface ServerGameState {
  currentPuzzleId: number;
  completedPuzzles: number[];
  lastPlayedDate: string;
}

export class ServerState {
  private static readonly STATE_COOKIE = "amy-sudoku-server-state";
  private static readonly MAX_AGE = 365 * 24 * 60 * 60; // 1 year

  static async getState(): Promise<ServerGameState> {
    try {
      const cookieStore = await cookies();
      const stateCookie = cookieStore.get(this.STATE_COOKIE);

      if (stateCookie?.value) {
        const decoded = Buffer.from(stateCookie.value, "base64").toString(
          "utf-8"
        );
        return JSON.parse(decoded);
      }
    } catch (error) {
      console.warn("Failed to load server state:", error);
    }

    // Default state
    return {
      currentPuzzleId: 1,
      completedPuzzles: [],
      lastPlayedDate: new Date().toISOString().split("T")[0],
    };
  }

  static async setState(state: ServerGameState): Promise<void> {
    try {
      const cookieStore = await cookies();
      const encoded = Buffer.from(JSON.stringify(state)).toString("base64");

      cookieStore.set(this.STATE_COOKIE, encoded, {
        maxAge: this.MAX_AGE,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
    } catch (error) {
      console.error("Failed to save server state:", error);
    }
  }

  static async markPuzzleCompleted(puzzleId: number): Promise<void> {
    const state = await this.getState();

    if (!state.completedPuzzles.includes(puzzleId)) {
      state.completedPuzzles.push(puzzleId);
      state.lastPlayedDate = new Date().toISOString().split("T")[0];
      await this.setState(state);
    }
  }

  static async isPuzzleCompleted(puzzleId: number): Promise<boolean> {
    const state = await this.getState();
    return state.completedPuzzles.includes(puzzleId);
  }
}
