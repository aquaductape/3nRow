import { round } from "../../utils/index";
import { debounce } from "../utils/index";
import View from "../View";
import { scaleStyles } from "./scale";

class GameContainerView extends View {
  dom: {
    playerBtnGroup: HTMLElement;
    playerBtns: HTMLElement[];
    p1BtnOptions: HTMLElement;
    fakePlayerBtns: HTMLElement[];
    fakePlayerBtnsHighlight: HTMLElement[];
    playerDropdowns: HTMLElement[];
    playerIndicators: HTMLElement[];
    rows: HTMLElement[];
    cells: HTMLElement[];
    board: HTMLElement;
    boardBackground: HTMLElement;
  };

  constructor() {
    super({ root: ".game-container" });
    this.dom = {} as any;
  }

  // overrides to do nothing
  render() {
    return;
  }

  private getSelectors() {
    const { dom } = this;

    dom.playerBtnGroup = this.parentEl.querySelector(
      ".player-btn-group"
    ) as HTMLElement;
    dom.p1BtnOptions = this.parentEl.querySelector(
      "#P1-btn-options"
    ) as HTMLElement;
    dom.rows = Array.from(this.parentEl.querySelectorAll(".row"));
    dom.cells = Array.from(this.parentEl.querySelectorAll(".cell"));
    dom.playerBtns = Array.from(
      this.parentEl.querySelectorAll(".player-btn-options")
    );
    dom.playerIndicators = Array.from(
      this.parentEl.querySelectorAll(".player-current-indicator")
    );
    dom.fakePlayerBtns = Array.from(
      this.parentEl.querySelectorAll(".fake-player-btns")
    );
    dom.fakePlayerBtnsHighlight = Array.from(
      this.parentEl.querySelectorAll(".player-btn-highlight")
    );
    dom.playerDropdowns = Array.from(
      this.parentEl.querySelectorAll(".dropdown-options")
    );
    dom.board = this.parentEl.querySelector(".board") as HTMLElement;
    dom.boardBackground = this.parentEl.querySelector(
      ".board-background"
    ) as HTMLElement;
  }

  runResizeListener() {
    this.getSelectors();
    let paddingBottomRatio = 11;

    const margin = 30;
    const gameContainer = this.parentEl;
    const {
      board,
      boardBackground,
      rows,
      cells,
      playerBtnGroup,
      playerIndicators,
      playerBtns,
      p1BtnOptions,
      playerDropdowns,
      fakePlayerBtns,
      fakePlayerBtnsHighlight,
    } = this.dom;

    const px = (num: number, decimal: number = 1) => `${round(num, decimal)}px`;

    const matchDropdownWidthToBoard = (width: number) => {
      playerDropdowns.forEach((playerDropdown) => {
        playerDropdown.style.width = `${width}px`;
      });
    };

    const scaleBoardFromWidth = (boardWidth: number) => {
      if (boardWidth > 1600) boardWidth *= 0.7;
      if (boardWidth > 700) boardWidth *= 0.8;

      scaleStyles({
        el: board,
        numerator: boardWidth,
        styleRatio: {
          gap: { ratio: 46.25, decimalPlaces: 0 },
          borderRadius: 12.33,
          boxShadow: () =>
            `0px ${px(boardWidth / 18.8)} 0px var(--blue-shadow)`,
        },
      });
      scaleStyles({
        el: boardBackground,
        numerator: boardWidth,
        styleRatio: {
          top: 52.85,
        },
      });
      scaleStyles({
        el: rows,
        numerator: boardWidth,
        styleRatio: {
          gap: { ratio: 46.25, decimalPlaces: 0 },
        },
      });
      scaleStyles({
        el: cells,
        numerator: boardWidth,
        styleRatio: {
          borderRadius: 37,
        },
      });
      scaleStyles({
        el: playerBtnGroup,
        numerator: boardWidth,
        styleRatio: {
          height: 5.692,
          marginBottom: 12.33,
        },
      });
      scaleStyles({
        el: playerBtns,
        numerator: boardWidth,
        styleRatio: {
          padding: 37,
          borderRadius: 37,
        },
      });
      scaleStyles({
        el: playerIndicators,
        numerator: boardWidth,
        styleRatio: {
          top: 74,
          borderRadius: 37,
          boxShadow: () => `0px ${px(boardWidth / 37)} 0px var(--blue-shadow)`,
        },
      });
      scaleStyles({
        el: p1BtnOptions,
        numerator: boardWidth,
        styleRatio: {
          marginRight: 14.8,
        },
      });
      scaleStyles({
        el: playerDropdowns,
        numerator: boardWidth,
        styleRatio: {
          borderRadius: 12.33,
          borderTopLeftRadius: (el) =>
            el.classList.contains("P1-options") ? "0" : px(boardWidth / 12.33),
          borderTopRightRadius: (el) =>
            el.classList.contains("P2-options") ? "0" : px(boardWidth / 12.33),
          padding: 12.33,
          top: 5.692,
          boxShadow: () => `0px ${px(boardWidth / 37)} 0px #bbb`,
        },
      });
      scaleStyles({
        el: fakePlayerBtns,
        numerator: boardWidth,
        styleRatio: {
          top: 37,
          height: 5.692,
        },
      });
      scaleStyles({
        el: fakePlayerBtnsHighlight,
        numerator: boardWidth,
        styleRatio: {
          top: 37,
          borderRadius: 37,
          borderBottomRightRadius: (el) =>
            el.classList.contains("P1-player-btn-highlight") ? "0" : "",
          borderBottomLeftRadius: (el) =>
            el.classList.contains("P2-player-btn-highlight") ? "0" : "",
          boxShadow: (el) =>
            el.classList.contains("P1-player-btn-highlight")
              ? `${px(boardWidth / 37)} 0px 0px 0px #eee`
              : `-${px(boardWidth / 37)} 0px 0px 0px #eee`,
        },
      });
    };

    const changeHeight = ({ init }: { init: boolean } = { init: false }) => {
      const browserInnerHeight =
        window.innerHeight || document.documentElement.clientHeight;
      const browserInnerWidth =
        window.innerWidth || document.documentElement.clientWidth;

      if (browserInnerWidth > 700) paddingBottomRatio = 3;

      const gameContainerPadding =
        Number(getComputedStyle(gameContainer).paddingLeft.match(/-?\d+/)![0]) *
        2;
      const gameContainerWidth = gameContainer.clientWidth;
      const diff =
        browserInnerWidth > gameContainerWidth
          ? browserInnerWidth - gameContainerWidth
          : 0;
      // const boardWidth = browserInnerWidth - gameContainerPadding - diff;
      const boardWidth = board.clientWidth;
      let width = 0;
      let padding = round(browserInnerHeight / paddingBottomRatio, 0);
      // padding = 40;
      // padding =

      width = browserInnerHeight - playerBtnGroup.clientHeight - padding;
      // browserInnerHeight - playerBtnGroup.clientHeight - margin - padding;

      // if (browserInnerHeight > 800) {
      //   gameContainer.style.maxWidth = `${width - 200}px`;
      //   return;
      // }
      gameContainer.style.maxWidth = px(width);

      if (browserInnerWidth > width) {
        console.log("browserInnerWidth > width");
        console.log({ boardWidth, width });
        scaleBoardFromWidth(width);
        matchDropdownWidthToBoard(board.clientWidth);
        return;
      }
      console.log("browserInnerWidth < width");
      // if (!init && browserInnerHeight > boardWidth + 200) return;
      console.log({ boardWidth, width });
      scaleBoardFromWidth(boardWidth);
      matchDropdownWidthToBoard(board.clientWidth);
    };

    // init height
    changeHeight({ init: true });

    const debouncedChangeHeight = debounce(changeHeight, 100);
    window.addEventListener("resize", () => {
      // debouncedChangeHeight();
      changeHeight();
    });
  }
}

export default new GameContainerView();
