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
    quickStartMenu: HTMLElement;
    menuBtn: HTMLElement;
    menu: HTMLElement;
    playAgainBtn: HTMLElement;
    quickStartMenuBtns: HTMLElement[];
  };
  debouncedGetSelectors: Function;

  constructor() {
    super({ root: ".game-container" });
    this.dom = {} as any;
    this.debouncedGetSelectors = () => {};
    this.init();
  }

  protected init() {
    this.debouncedGetSelectors = debounce(this.getSelectors.bind(this), {
      time: 200,
      leading: true,
    });
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
    dom.quickStartMenu = this.parentEl.querySelector(
      ".quick-start-menu"
    ) as HTMLElement;
    dom.menuBtn = this.parentEl.querySelector("#menu .menu-btn") as HTMLElement;
    dom.menu = this.parentEl.querySelector("#menu") as HTMLElement;
    dom.quickStartMenuBtns = Array.from(
      this.parentEl.querySelectorAll(".btn-pick")
    );
    dom.playAgainBtn = this.parentEl.querySelector(
      ".btn-play-again"
    ) as HTMLElement;
  }

  private resizeElements(boardWidth: number) {
    this.debouncedGetSelectors();

    const gameContainer = this.parentEl;
    const {
      board,
      boardBackground,
      quickStartMenu,
      menu,
      menuBtn,
      rows,
      cells,
      playerBtnGroup,
      playerIndicators,
      playerBtns,
      p1BtnOptions,
      playerDropdowns,
      fakePlayerBtns,
      fakePlayerBtnsHighlight,
      quickStartMenuBtns,
      playAgainBtn,
    } = this.dom;

    const matchDropdownWidthToBoard = () => {
      playerDropdowns.forEach((playerDropdown) => {
        playerDropdown.style.width = `${boardWidth}px`;
      });
    };

    const scaleBoardFromWidth = () => {
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
        el: quickStartMenu,
        numerator: boardWidth,
        styleRatio: {
          borderRadius: 12.33,
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
          fontSize: 16.5,
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
          boxShadow: (el) =>
            el.classList.contains("P1-options")
              ? `0px ${px(boardWidth / 37)} 0px #bbb,
               ${px(boardWidth / 113.6)} ${px(boardWidth / 27.0476)} ${px(
                  boardWidth / 47.33
                )} rgba(0, 0, 0, 0.35)`
              : `0px ${px(boardWidth / 37)} 0px #bbb,
               -${px(boardWidth / 113.6)} ${px(boardWidth / 27.0476)} ${px(
                  boardWidth / 47.33
                )} rgba(0, 0, 0, 0.35)`,
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

      scaleStyles({
        el: menuBtn,
        numerator: boardWidth,
        styleRatio: {
          height: boardWidth > 485 ? 14.08 : 8.08,
          borderBottomLeftRadius: 17.6,
          borderBottomRightRadius: 17.6,
          padding: () =>
            boardWidth > 485
              ? `${px(boardWidth / 70.4)} 0`
              : `${px(boardWidth / 30.4)} 0`,
        },
      });

      scaleStyles({
        el: menu,
        numerator: boardWidth,
        styleRatio: {
          marginBottom: 20.533,
        },
      });

      // stop at 420px for quickstart btns
      scaleStyles({
        el: quickStartMenuBtns,
        numerator: boardWidth,
        styleRatio: {
          paddingLeft: 21,
          paddingRight: 21,
          paddingTop: 28,
          paddingBottom: 28,
          maxWidth: 2.1538,
          borderRadius: 42,
          // fontSize: 21,
        },
      });

      scaleStyles({
        el: playAgainBtn,
        numerator: boardWidth,
        styleRatio: {
          height: 3.47,
          width: 3.47,
        },
      });
    };

    scaleBoardFromWidth();
    matchDropdownWidthToBoard();
  }

  runResizeListener() {
    const gameContainer = this.parentEl;

    const changeHeight = ({ init }: { init: boolean } = { init: false }) => {
      const browserInnerHeight =
        window.innerHeight || document.documentElement.clientHeight;
      const browserInnerWidth =
        window.innerWidth || document.documentElement.clientWidth;

      const boardTopRatio = 4.02493321460374;
      const heightSlice =
        browserInnerHeight - browserInnerHeight / boardTopRatio;

      // viewport has greater width
      if (heightSlice < browserInnerWidth) {
        const paddingBottom = round(heightSlice / 8, 0);
        const boardWidth = heightSlice - paddingBottom;

        gameContainer.style.width = px(boardWidth);

        this.resizeElements(boardWidth);
      }
      // viewport has greater height
      if (heightSlice > browserInnerWidth) {
        const paddingLR = round(browserInnerWidth / 5, 0);
        const boardWidth = browserInnerWidth - paddingLR;

        gameContainer.style.width = px(boardWidth);

        this.resizeElements(boardWidth);
      }
    };

    // init height
    changeHeight({ init: true });

    // const debouncedChangeHeight = debounce(changeHeight, 200);
    window.addEventListener("resize", () => {
      changeHeight();
      // to cover for changing device viewport on Chrome devtools
      // debouncedChangeHeight();
    });
  }

  // overrides to do nothing
  render() {
    return;
  }
}

const px = (num: number, decimal: number = 1) => `${round(num, decimal)}px`;
export default new GameContainerView();
