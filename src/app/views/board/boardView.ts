import { TControlMovePlayer } from "../../controllers/move";
import {
  EdgeLegacy,
  IOS,
  IOS13,
  Safari,
} from "../../lib/onFocusOut/browserInfo";
import { TGame, TPlayer, TState } from "../../model/state";
import { Tooltip } from "../components/Tooltip/Tooltip";
import { colorMap } from "../constants/constants";
import { createHTMLFromString, getOppositePlayer } from "../utils/index";
import View from "../View";
import { keyboardInteraction } from "./keyboardInteraction";
import { renderWinnerSlash } from "./renderLine";

class BoardView extends View {
  protected data: TState;
  private focusableCell: HTMLElement;
  private slashContainer: HTMLElement;
  private tooltipTalkBubble: Tooltip | null = null;
  private playerCanSelectCell = false;
  private playerCanNavigateCells = false;
  private boardCleared = true;
  startingGameTriggeredByKeyboard = false;

  constructor() {
    super({ root: ".board" });
    this.focusableCell = this.parentEl.querySelector(
      '[data-column="0"]'
    ) as HTMLElement;
    this.slashContainer = this.parentEl.querySelector(
      ".line-svg"
    ) as HTMLElement;
    this.data = {} as TState;
  }

  private showPlayerTurnTalkBubble() {
    const { game } = this.data;

    if (game.hasAI) return;

    const selector = `.player-btn-options[data-player-id="${
      game.getCurrentPlayer().id
    }"]`;
    const playerBtn = document.querySelector(selector) as HTMLElement;

    if (this.tooltipTalkBubble) return;

    this.tooltipTalkBubble = new Tooltip({
      message: "Wait, it's still my turn!",
      tooltipTargetEl: playerBtn,
    });

    this.tooltipTalkBubble.show();

    setTimeout(() => {
      if (!this.tooltipTalkBubble!.active) {
        this.tooltipTalkBubble!.destroy();
        this.tooltipTalkBubble = null;
        return;
      }

      this.tooltipTalkBubble!.hide();

      setTimeout(() => {
        this.tooltipTalkBubble!.destroy();
        this.tooltipTalkBubble = null;
      }, 200);
    }, 1500);
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

  private selectCell({
    cell,
    player,
  }: {
    cell: HTMLElement;
    player?: TPlayer;
  }) {
    const {
      game: { getCurrentPlayer },
    } = this.data;
    player = player || getCurrentPlayer();

    if (this.isCellSelected(cell)) return;

    cell.setAttribute("aria-selected", "true");
    cell.setAttribute("data-selected", "true");
    cell.setAttribute("data-player-id", player.id);
    cell.setAttribute("aria-label", `Marked by ${player.name}`);
    this.playerCanSelectCell = false;
  }

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

  private renderFilledCells(player: TPlayer) {
    const {
      game: { markedPositions },
    } = this.data;
    const { shape, svgShapes } = player;

    markedPositions.forEach((markedPosition) => {
      const cell = this.getCellElement(markedPosition);
      this.selectCell({ cell, player });
      const shapeEl = createHTMLFromString(svgShapes[shape]) as SVGElement;

      // fires multiple times, debounce then when it ends add block-animation
      const animationEnd = () => {
        // cell.classList.add("block-animation");
        // cell.removeEventListener("animationend", animationEnd);
      };

      if (IOS || Safari) {
        shapeEl.style.animation = "Force-Full-Repaint-Frame 2000ms";
      }

      // remove circle shadow in cross
      cell.appendChild(shapeEl);

      // if (EdgeLegacy) {
      // BAD solution, use debounce instead
      setTimeout(() => {
        if (this.boardCleared) return;
        cell.classList.add("block-animation");
      }, 2000);
      // }

      // cell.addEventListener("animationend", animationEnd);
      // BAD solution, use debounce instead
      setTimeout(() => {
        this.boardCleared = false;
      }, 1000);
    });
  }

  private prevCellChangeTabindex() {
    const prevCell = this.parentEl.querySelector(
      '[data-column][tabindex="0"]'
    )!;
    if (!prevCell) return;
    prevCell.setAttribute("tabindex", "-1");
  }

  addHandlerCell(handler: TControlMovePlayer) {
    this.parentEl.addEventListener("click", (e) => {
      const target = <HTMLElement>e.target;
      const cell = target.closest("[data-column]") as HTMLElement;

      if (!cell) return;

      this.prevCellChangeTabindex();

      cell.setAttribute("tabindex", "0");

      if (!this.playerCanSelectCell) {
        if (this.isCellSelected(cell)) return;

        this.showPlayerTurnTalkBubble();
        return;
      }
      if (this.isCellSelected(cell)) return;

      this.selectCell({ cell });

      handler(this.getPositionFromCell(cell));
    });

    this.parentEl.addEventListener("keydown", (e) => {
      const keys = [" ", "Enter"];

      const target = <HTMLElement>e.target;
      const cell = target.closest("[data-column]") as HTMLElement;

      if (!cell) return;

      keyboardInteraction(e, { onFocusNewCell: this.onFocusNewCell });

      if (!this.playerCanSelectCell) {
        if (this.isCellSelected(cell)) return;
        this.showPlayerTurnTalkBubble();
        return;
      }
      if (!keys.includes(e.key) || this.isCellSelected(cell)) return;

      this.selectCell({ cell });

      handler(this.getPositionFromCell(cell));
    });
  }

  private onFocusNewCell = (el: HTMLElement) => {
    this.focusableCell = el;
  };

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
    const { game } = data;

    this.renderFilledCells(player);
    if (game.gameOver) {
      renderWinnerSlash({
        player,
        winPosition: game.winPosition,
        line: this.slashContainer,
      });
      this.updateWinnerSlashColor(player.color);
    }
  }

  allowPlayerToSelect() {
    this.playerCanSelectCell = true;
  }
  allowPlayerToNavigate() {
    this.playerCanNavigateCells = true;
    this.focusableCell.tabIndex = 0;
  }

  preventPlayerToNavigate() {
    this.playerCanNavigateCells = false;
    this.focusableCell.removeAttribute("tabindex");
  }

  preventPlayerToSelect() {
    this.playerCanSelectCell = false;
  }

  updateWinnerSlashColor(color: string) {
    const [primaryColor, secondaryColor] = colorMap[color];
    const lineColorPrimaryAll = <NodeListOf<HTMLElement>>(
      this.parentEl.querySelectorAll(".line-color-primary")
    );
    const lineColorSecondaryAll = <NodeListOf<HTMLElement>>(
      this.parentEl.querySelectorAll(".line-color-secondary")
    );

    lineColorPrimaryAll.forEach((line) => {
      line.style.stopColor = primaryColor;
    });
    lineColorSecondaryAll.forEach((line) => {
      line.style.stopColor = secondaryColor;
    });
  }

  startGame() {
    this.allowPlayerToNavigate();
    if (this.startingGameTriggeredByKeyboard) {
      this.focusableCell.classList.add("noFocusClick");
    }
    this.focusableCell.focus();
    this.parentEl.removeAttribute("aria-hidden");
    this.parentEl.classList.remove("pre-game");

    setTimeout(() => {
      this.parentEl.classList.remove("transition-out");
    }, 100);
    this.startingGameTriggeredByKeyboard = false;
  }

  preGame() {
    this.preventPlayerToSelect();
    this.preventPlayerToNavigate();

    setTimeout(() => {
      this.parentEl.classList.add("transition-out");
      this.parentEl.classList.add("pre-game");
    }, 300);
    this.parentEl.setAttribute("aria-hidden", "true");
  }

  clearBoard() {
    const cells = this.parentEl.querySelectorAll(
      ".cell"
    ) as NodeListOf<HTMLElement>;

    // clear cells
    cells.forEach((cell) => {
      this.clearChildren(cell);
      cell.setAttribute("aria-selected", "false");
      cell.setAttribute("data-selected", "false");
      cell.setAttribute("aria-label", "empty");
      cell.removeAttribute("data-player-id");
      cell.classList.remove("block-animation");
    });

    // remove slash
    this.clearChildren(this.slashContainer);

    // BAD solution, use debounce instead
    this.boardCleared = true;
  }

  // override render
  render(data: TState) {
    this.data = data;
    return "";
  }
}

export default new BoardView();
