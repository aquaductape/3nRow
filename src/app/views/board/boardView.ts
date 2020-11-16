import { TControlGame, TControlStartGame } from "../../controller/controller";
import { TGame, TPlayer, TState } from "../../model/state";
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

  private getCellElement = ({
    column,
    row,
  }: {
    column: number;
    row: number;
  }) => {
    return this.parentEl.querySelector(
      `[data-row="${row}"] [data-column="${column}"]`
    ) as HTMLElement;
  };

  private selectCell = (cell: HTMLElement) => {
    const {
      game: { getCurrentPlayer },
    } = this.data;
    const player = getCurrentPlayer();

    cell.setAttribute("aria-selected", "true");
    cell.setAttribute("data-selected", "true");
    cell.setAttribute("data-player-id", player.id);
    cell.setAttribute("aria-label", `Marked by ${player.name}`);
  };

  private updateEmptyCellsAriaLabel(player: TPlayer) {
    const cells = this.parentEl.querySelectorAll(
      '[data-selected="false"]'
    ) as NodeListOf<HTMLElement>;
    const msg = player.isAI ? `Waiting for ${player.name}.` : "It's your turn";

    cells.forEach((cell) => {
      cell.setAttribute("aria-label", `Empty. ${msg}`);
    });
  }

  private isCellSelected = (cell: HTMLElement) => {
    const selected = cell.dataset.selected;
    if (!selected) return false;

    return selected.match(/true/i);
  };

  addHandlerCell(handler: TControlGame) {
    this.parentEl.addEventListener("click", (e) => {
      const target = <HTMLElement>e.target;
      const cell = target.closest("[data-column]") as HTMLElement;

      if (!cell) return;

      prevCellChangeTabindex(
        () => this.parentEl.querySelector('[data-column][tabindex="0"]')!
      );

      cell.setAttribute("tabindex", "0");

      if (this.isCellSelected(cell)) return;

      this.selectCell(cell);

      handler(this.getPositionFromCell(cell));
    });

    this.parentEl.addEventListener("keydown", (e) => {
      const keys = [" ", "Enter"];

      const target = <HTMLElement>e.target;
      const cell = target.closest("[data-column]") as HTMLElement;

      if (!cell) return;

      keyboardInteraction(e);

      if (!keys.includes(e.key) || this.isCellSelected(cell)) return;

      this.selectCell(cell);

      handler(this.getPositionFromCell(cell));
    });
  }

  renderFilledCell(player: TPlayer) {
    const {
      game: { markedPosition },
    } = this.data;
    const { shape, svgShapes: shapes } = player;

    const cell = this.getCellElement(markedPosition);
    cell.innerHTML = shapes[shape];
  }

  updateShapeInCells(player: TPlayer) {
    const cells = this.parentEl.querySelectorAll(
      `[data-player-id="${player.id}"]`
    ) as NodeListOf<HTMLElement>;

    cells.forEach((cell) => {
      cell.classList.add("block-animation");
      cell.innerHTML = player.getSvgShape();
    });
  }

  waitingForOtherPlayer(player: TPlayer) {
    // update cells aria
    this.updateEmptyCellsAriaLabel(player);
  }

  updateBoard({ data, player }: { data: TState; player: TPlayer }) {
    this.data = data;

    this.renderFilledCell(player);
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
