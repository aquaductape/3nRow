import {
  TControlBoardCell,
  TControlStartGame,
} from "../../controller/controller";
import { TState } from "../../model/state";
import View from "../View";
import {
  guardKey,
  keyboardInteraction,
  prevCellChangeTabindex,
} from "./keyboardInteraction";

class BoardView extends View {
  gameStartContainer: HTMLElement;
  gameStartMenu: HTMLElement;
  btnAi: HTMLElement;
  btnHuman: HTMLElement;
  firstCell: HTMLElement;
  data: TState;
  constructor() {
    super({ root: ".board" });

    this.gameStartMenu = this.parentEl.querySelector(
      ".game-start-menu"
    ) as HTMLElement;
    this.gameStartContainer = this.parentEl.querySelector(
      ".game-start"
    ) as HTMLElement;
    this.btnAi = this.parentEl.querySelector(".btn-ai") as HTMLElement;
    this.btnHuman = this.parentEl.querySelector(".btn-human") as HTMLElement;
    this.firstCell = this.parentEl.querySelector(
      '[data-column="0"]'
    ) as HTMLElement;
    this.data = {} as TState;
  }

  private getPositionFromCell(cell: HTMLElement) {
    const row = Number(cell.parentElement?.dataset.row!);
    const column = Number(cell.dataset.column!);

    return { row, column };
  }

  addHandlerStartGame(handler: TControlStartGame) {
    const { players } = this.data;
    const { id } = players[1];
    this.btnAi.addEventListener("click", () => {
      this.startGame();
      handler({ id, ai: true });
    });

    this.btnHuman.addEventListener("click", () => {
      this.startGame();
      handler({ id, ai: false });
    });
  }

  addHandlerCell(handler: TControlBoardCell) {
    this.parentEl.addEventListener("click", (e) => {
      const target = <HTMLElement>e.target;
      const cell = target.closest("[data-column]") as HTMLElement;

      if (!cell) return;

      prevCellChangeTabindex(
        () => this.parentEl.querySelector('[data-column][tabindex="0"]')!
      );
      cell.setAttribute("tabindex", "0");
      cell.setAttribute("aria-selected", "true");

      handler(this.getPositionFromCell(cell));
    });

    this.parentEl.addEventListener("keydown", (e) => {
      const keys = [" ", "Enter"];

      const target = <HTMLElement>e.target;
      const cell = target.closest("[data-column]") as HTMLElement;

      if (!cell) return;

      keyboardInteraction(e);

      if (!keys.includes(e.key)) return;

      cell.setAttribute("aria-selected", "true");

      handler(this.getPositionFromCell(cell));
    });
  }

  startGame() {
    this.gameStartContainer.style.pointerEvents = "none";
    this.gameStartMenu.style.opacity = "0";
    this.gameStartContainer.style.opacity = "0";

    this.firstCell.tabIndex = 0;
    this.firstCell.focus();

    setTimeout(() => {
      this.gameStartContainer.style.display = "none";
    }, 900);
  }

  playAgain() {}

  // override render
  render(data: TState) {
    this.data = data;
    return "";
  }
}

export default new BoardView();
