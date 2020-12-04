import { TPosition } from "../../ts/index";
import View from "../View";

class GameStatusAriaLiveRegionView extends View {
  constructor() {
    super({ root: "#game-status" });
  }

  announce({
    playerId,
    position = { column: 1, row: 1 },
    vs,
    state,
    onlineMultiplayer = false,
  }: {
    vs: "ai" | "human";
    playerId: string;
    position?: TPosition;
    state: "move" | "tie" | "win";
    onlineMultiplayer?: boolean;
  }) {
    this.parentEl.setAttribute("aria-live", "assertive");
    position.row += 1;
    position.column += 1;

    const positionMsg = `row ${position.row} column ${position.column}`;
    let currentPlayer = playerId === "P1" ? "Player 1" : "Player 2";
    const nextPlayer = playerId === "P1" ? "Player 2" : "Player 1";
    if (vs === "ai") currentPlayer = "Computer";

    const announceState = ({
      currentPlayer,
      nextPlayer,
      state,
    }: {
      state: "move" | "tie" | "win";
      currentPlayer: string;
      nextPlayer: string;
    }) => {
      const currentPlayerMovement = `${currentPlayer} has moved at ${positionMsg}`;
      const humanMovesVsAi = vs === "ai" && playerId === "P1";
      const aiMoves = vs === "ai" && playerId === "P2";

      if (state === "move") {
        if (humanMovesVsAi) {
          // this.parentEl.textContent = `You moved. It's now Computer's turn`;
          return;
        }

        if (aiMoves) {
          this.parentEl.textContent = `${currentPlayerMovement}. It's now Your turn`;
          return;
        }
        // if (onlineMultiplayer) {
        this.parentEl.textContent = `${currentPlayerMovement} .It's now ${nextPlayer}'s turn`;
        // return;
        // }
        return;
      }

      if (state === "tie") {
        if (humanMovesVsAi) {
          this.parentEl.textContent = "It's a Tie, game over";
          return;
        }

        this.parentEl.textContent = `${currentPlayerMovement}, it's a Tie, game over`;
        return;
      }

      if (state === "win") {
        if (humanMovesVsAi) {
          this.parentEl.textContent = "Congratulations, you won! Game Over!";
          return;
        }

        this.parentEl.textContent = `${currentPlayerMovement}, ${currentPlayer} wins! Game Over!`;
        return;
      }
    };

    announceState({
      currentPlayer,
      nextPlayer,
      state,
    });
  }
}

export default new GameStatusAriaLiveRegionView();
