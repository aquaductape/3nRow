import { round } from "../../utils/index";
import playerBtnGroupView from "../playerOptions/playerBtnGroupView";
import { debounce } from "../utils/index";
import View from "../View";
import { scaleStyles } from "./scale";

class GameContainerView extends View {
  private dom: {
    playerBtnGroup: HTMLElement;
    playerBtns: HTMLElement[];
    p1BtnOptions: HTMLElement;
    fakePlayerBtns: HTMLElement[];
    playerDropdowns: HTMLElement[];
    playerDropdownInners: HTMLElement[];
    playerDropdownShells: HTMLElement[];
    playerDropdownShellShadows: HTMLElement[];
    playerDropdownMasks: HTMLElement[];
    playerIndicators: HTMLElement[];
    rows: HTMLElement[];
    cells: HTMLElement[];
    board: HTMLElement;
    boardBackground: HTMLElement;
    gameMenu: HTMLElement;
    settingsBtn: HTMLElement;
    settings: HTMLElement;
    playAgainBtn: HTMLElement;
    gameMenuBtns: HTMLElement[];
    gameMenuBtnPickPlayer: HTMLElement[];
    navigationBackBtn: HTMLElement;
    declarePlayersShape: HTMLElement;
    declarePlayersDeclaration: HTMLElement;
    gameOverPlayerShape: HTMLElement;
    gameOverPlayerResult: HTMLElement;
    playerPickSkinCountDown: HTMLElement;
  };
  declarePlayersAnimationRunning: boolean;
  playerDropdownContentHeight: number;
  private debouncedGetSelectors: Function;
  private debouncedResizeAnimation: Function;

  constructor() {
    super({ root: ".game-container" });
    this.dom = {} as any;
    this.debouncedGetSelectors = () => {};
    this.debouncedResizeAnimation = () => {};
    this.declarePlayersAnimationRunning = false;
    this.playerDropdownContentHeight = 0;
    this.init();
  }

  protected init() {
    this.debouncedGetSelectors = debounce(this.getSelectors.bind(this), {
      time: 200,
      leading: true,
    });
    this.debouncedResizeAnimation = debounce(this.resizeAnimation.bind(this), {
      time: 200,
      leading: false,
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
    dom.playerDropdownMasks = Array.from(
      this.parentEl.querySelectorAll(".dropdown-options-mask")
    );
    dom.playerDropdownShells = Array.from(
      this.parentEl.querySelectorAll(".dropdown-options-shell")
    );
    dom.playerDropdownShellShadows = Array.from(
      this.parentEl.querySelectorAll(".dropdown-options-shell .shell-shadow")
    );
    dom.playerDropdownInners = Array.from(
      this.parentEl.querySelectorAll(".dropdown-options-inner")
    );
    dom.fakePlayerBtns = Array.from(
      this.parentEl.querySelectorAll(".fake-player-btn")
    );
    dom.playerDropdowns = Array.from(
      this.parentEl.querySelectorAll(".dropdown-options")
    );
    dom.board = this.parentEl.querySelector(".board") as HTMLElement;
    dom.boardBackground = this.parentEl.querySelector(
      ".board-background"
    ) as HTMLElement;
    dom.gameMenu = this.parentEl.querySelector("#game-menu") as HTMLElement;
    dom.gameMenuBtns = Array.from(
      dom.gameMenu.querySelectorAll(".btn-pick, .btn-leave")
    );
    dom.gameMenuBtnPickPlayer = Array.from(
      dom.gameMenu.querySelectorAll(".btn-pick-player")
    );
    dom.settingsBtn = this.parentEl.querySelector(
      "#settings .settings-btn"
    ) as HTMLElement;
    dom.settings = this.parentEl.querySelector("#settings") as HTMLElement;
    dom.playAgainBtn = this.parentEl.querySelector(
      ".btn-play-again"
    ) as HTMLElement;
    dom.navigationBackBtn = this.parentEl.querySelector(
      ".btn-navigation-back"
    ) as HTMLElement;
    dom.playerPickSkinCountDown = this.parentEl.querySelector(
      ".player-pick-skin-countdown"
    ) as HTMLElement;
    dom.gameOverPlayerShape = this.parentEl.querySelector(
      ".game-over-title .player-shape"
    ) as HTMLElement;
    dom.gameOverPlayerResult = this.parentEl.querySelector(
      ".game-over-title .player-result"
    ) as HTMLElement;
  }

  private resizeElements(boardWidth: number) {
    this.debouncedGetSelectors();

    const {
      board,
      boardBackground,
      settings,
      settingsBtn,
      rows,
      cells,
      playerBtnGroup,
      playerIndicators,
      playerBtns,
      p1BtnOptions,
      playerDropdowns,
      playerDropdownShells,
      playerDropdownShellShadows,
      playerDropdownInners,
      playerDropdownMasks,
      fakePlayerBtns,
      gameMenu,
      gameMenuBtns,
      gameMenuBtnPickPlayer,
      playAgainBtn,
      navigationBackBtn,
      playerPickSkinCountDown,
      gameOverPlayerResult,
      gameOverPlayerShape,
    } = this.dom;

    board.style.transition = "";

    const matchDropdownWidthToBoard = () => {
      playerDropdowns.forEach((playerDropdown) => {
        playerDropdown.style.width = px(boardWidth);
      });
      playerDropdownShells.forEach((playerDropdownShell) => {
        playerDropdownShell.style.width = px(boardWidth);
      });
    };

    const matchFakePlayerBtnWidthToBtnParent = () => {
      const playerBtnWidth = playerBtns[0].clientWidth;
      const width = px(boardWidth / 37 + playerBtnWidth);

      fakePlayerBtns.forEach((fakePlayerBtn) => {
        fakePlayerBtn.style.width = width;
      });
    };

    const matchDropdownOuterSizeFromInnerContent = () => {
      // should run after width is set from boardWidth, which would update dropdown content's layout
      const playerBtnHeight = playerBtns[0].getBoundingClientRect().height;
      const playerDropdownWidth = playerDropdowns[0].getBoundingClientRect()
        .width;
      const playerDropdownHeight = playerDropdowns[0].getBoundingClientRect()
        .height;
      const playerDropdownMaskHeight = playerDropdownMasks[0].getBoundingClientRect()
        .height;
      const shadowHeight = boardWidth / 35.5;
      const totalNewPlayerDropdownHeight =
        playerBtnHeight + playerDropdownHeight + shadowHeight;

      this.playerDropdownContentHeight = totalNewPlayerDropdownHeight;

      playerDropdownInners.forEach((playerDropdownInner) => {
        playerDropdownInner.style.height = px(
          playerDropdownHeight + shadowHeight + playerDropdownMaskHeight * 2
        );
        playerDropdownInner.style.width = px(playerDropdownWidth);
      });
      playerDropdownShells.forEach((playerDropdownShell) => {
        playerDropdownShell.style.height = px(totalNewPlayerDropdownHeight);
      });
      playerDropdownShellShadows.forEach((playerDropdownShellShadow) => {
        playerDropdownShellShadow.style.height = px(
          playerDropdownHeight * 0.95
        );
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
            `0px ${px(boardWidth / 18.8)} 0px var(--board-shadow)`,
        },
      });
      scaleStyles({
        el: gameMenu,
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
        el: playerDropdownMasks,
        numerator: boardWidth,
        styleRatio: {
          top: 8.06625,
          width: 21.5827,
          height: 21.5827,
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
          top: 18.758,
          boxShadow: (el) =>
            el.classList.contains("P1-options")
              ? `0px ${px(boardWidth / 37)} 0px #bbb`
              : `0px ${px(boardWidth / 37)} 0px #bbb`,
        },
      });
      scaleStyles({
        el: playerDropdownShellShadows,
        numerator: boardWidth,
        styleRatio: {
          borderRadius: 12.33,
          boxShadow: (el) =>
            el.classList.contains("P1")
              ? `
               ${px(boardWidth / 113.6)} ${px(boardWidth / 80.6625)} ${px(
                  boardWidth / 47.33
                )} rgba(0, 0, 0, 0.35)`
              : `
               -${px(boardWidth / 113.6)} ${px(boardWidth / 80.6625)} ${px(
                  boardWidth / 47.33
                )} rgba(0, 0, 0, 0.35)`,
        },
      });
      scaleStyles({
        el: fakePlayerBtns,
        numerator: boardWidth,
        styleRatio: {
          top: -10.5097,
          height: 4.29,
          borderRadius: 37,
          borderBottomRightRadius: (el) =>
            el.classList.contains("P1-player-btn-highlight") ? "0" : "",
          borderBottomLeftRadius: (el) =>
            el.classList.contains("P2-player-btn-highlight") ? "0" : "",
        },
      });

      scaleStyles({
        el: settingsBtn,
        numerator: boardWidth,
        styleRatio: {
          height: boardWidth > 400 ? 14.08 : 8.08,
          borderBottomLeftRadius: 17.6,
          borderBottomRightRadius: 17.6,
          padding: () =>
            boardWidth > 400
              ? `${px(boardWidth / 70.4)} 0`
              : `${px(boardWidth / 30.4)} 0`,
        },
      });

      scaleStyles({
        el: settings,
        numerator: boardWidth,
        styleRatio: {
          marginBottom: 20.533,
        },
      });

      // stop at 420px for quickstart btns
      scaleStyles({
        el: gameMenuBtns,
        numerator: boardWidth,
        styleRatio: {
          paddingLeft: 21,
          paddingRight: 21,
          paddingTop: 28,
          paddingBottom: 28,
          maxWidth: () =>
            boardWidth > 500 ? px(boardWidth / 2.1538) : px(boardWidth / 1.5),
          borderRadius: 42,
          marginTop: (el) => {
            if (!el.dataset.firstItem) return "";
            if (boardWidth < 320) return px(30);
            return "";
          },
          fontSize: (el) => {
            if (!el.classList.contains("btn-multiplayer")) return "";
            if (boardWidth < 250) return px(13);
            if (boardWidth < 320) return px(15);
            return "";
          },
        },
      });

      scaleStyles({
        el: gameMenuBtnPickPlayer,
        numerator: boardWidth,
        styleRatio: {
          paddingTop: () => "0px",
          paddingBottom: () => "0px",
          height: () =>
            boardWidth > 500
              ? px(boardWidth / 10.082)
              : px(boardWidth / 5.5875),
          // fontSize: 21,
        },
      });
      scaleStyles({
        el: playAgainBtn,
        numerator: boardWidth,
        styleRatio: {
          height: () =>
            boardWidth > 300 ? px(boardWidth / 3.47) : px(boardWidth / 2.5),
          width: () =>
            boardWidth > 300 ? px(boardWidth / 3.47) : px(boardWidth / 2.5),
        },
      });
      scaleStyles({
        el: navigationBackBtn,
        numerator: boardWidth,
        styleRatio: {
          top: 21.5,
          left: 21.5,
          padding: 64.53,
          height: 8.06625,
          width: 8.06625,
          borderRadius: 64.53,
        },
      });
      scaleStyles({
        el: playerPickSkinCountDown,
        numerator: boardWidth,
        styleRatio: {
          top: 21.5,
          right: 21.5,
          height: 8.06625,
          width: 8.06625,
          fontSize: 20.1612,
        },
      });
    };

    scaleStyles({
      el: gameOverPlayerResult,
      numerator: boardWidth,
      styleRatio: {
        fontSize: 12.906,
        marginBottom: () =>
          boardWidth < 270
            ? px(boardWidth / -54)
            : boardWidth < 434
            ? px(boardWidth / 17.0866)
            : px(boardWidth / 8.604),
        marginTop: () => (boardWidth < 270 ? px(boardWidth / -54) : ""),
      },
    });

    scaleStyles({
      el: gameOverPlayerShape,
      numerator: boardWidth,
      styleRatio: {
        width: () =>
          boardWidth < 434 ? px(boardWidth / 4.265) : px(boardWidth / 3.2265),
        height: () =>
          boardWidth < 434 ? px(boardWidth / 4.265) : px(boardWidth / 3.2265),
      },
    });

    // font
    // 20.1612

    scaleBoardFromWidth();
    matchDropdownWidthToBoard();
    matchFakePlayerBtnWidthToBtnParent();
    if (this.declarePlayersAnimationRunning) {
      this.scaleElementsToProportionToBoard({ type: "declare-players" });
    }
    // this.reflow();
    matchDropdownOuterSizeFromInnerContent();
  }

  private resizeAnimation() {
    playerBtnGroupView.recalculateDropdownAnimations();
  }

  runResizeListener() {
    const gameContainer = this.parentEl;

    const resize = () => {
      playerBtnGroupView.removeForwardFillOnFinishedExpandedDropdowns();

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

        gameContainer.style.maxWidth = px(boardWidth);

        this.resizeElements(boardWidth);
        this.debouncedResizeAnimation();
      }
      // viewport has greater height
      if (heightSlice > browserInnerWidth) {
        const paddingLR = round(browserInnerWidth / 5, 0);
        const boardWidth = browserInnerWidth - paddingLR;

        gameContainer.style.maxWidth = px(boardWidth);

        this.resizeElements(boardWidth);
        this.debouncedResizeAnimation();
      }
    };

    // init height
    resize();

    const debouncedResize = debounce(resize, {
      leading: false,
      time: 200,
      throttle: 200,
    });

    window.addEventListener("resize", () => {
      debouncedResize();
    });
  }

  /**
   * responsive board is utilized by JS instead of CSS, therefore there's a flash of default board size.
   * hiding it for 100ms, hides the flash, giving a clean native feel
   */
  revealAfterPageLoad() {
    requestAnimationFrame(() => {
      this.parentEl.style.transition = "opacity 200ms";
      this.parentEl.style.opacity = "1";
      const { playerBtns } = this.dom;

      playerBtns.forEach((playerBtn) => {
        playerBtn.style.background = "";
        playerBtn.style.transition = "none";
      });

      setTimeout(() => {
        this.parentEl.style.transition = "";
        this.parentEl.style.opacity = "";

        playerBtns.forEach((playerBtn) => {
          playerBtn.style.transition = "";
        });
      }, 100);
    });
  }

  scaleElementsToProportionToBoard({
    type,
  }: {
    type:
      | "menuBtns"
      | "declare-players"
      | "player-pick-skin-countdown"
      | "game-over-title";
  }) {
    const boardWidth = this.parentEl.clientWidth;

    if (type === "menuBtns") {
      const gameMenuBtns = Array.from(
        this.parentEl.querySelectorAll(".btn-pick, .btn-leave")
      ) as HTMLElement[];
      const gameMenuBtnPickPlayer = Array.from(
        this.parentEl.querySelectorAll(".btn-pick-player")
      ) as HTMLElement[];

      scaleStyles({
        el: gameMenuBtns,
        numerator: boardWidth,
        styleRatio: {
          paddingLeft: 21,
          paddingRight: 21,
          paddingTop: 28,
          paddingBottom: 28,
          maxWidth: () =>
            boardWidth > 500 ? px(boardWidth / 2.1538) : px(boardWidth / 1.5),
          borderRadius: 42,
          marginTop: (el) => {
            if (!el.dataset.firstItem) return "";
            if (boardWidth < 320) return px(30);
            return "";
          },
          fontSize: (el) => {
            if (!el.classList.contains("btn-multiplayer")) return "";
            if (boardWidth < 250) return px(13);
            if (boardWidth < 320) return px(15);
            return "";
          },
        },
      });
      scaleStyles({
        el: gameMenuBtnPickPlayer,
        numerator: boardWidth,
        styleRatio: {
          paddingTop: () => "0px",
          paddingBottom: () => "0px",
          height: () =>
            boardWidth > 500
              ? px(boardWidth / 10.082)
              : px(boardWidth / 5.5875),
        },
      });
    }

    if (type === "declare-players") {
      // this will probably fail in safari
      const declarePlayersShape = this.parentEl.querySelector(
        ".lobby .player-shape"
      ) as HTMLElement;
      const declarePlayersDeclaration = this.parentEl.querySelector(
        ".lobby .declaration"
      ) as HTMLElement;
      document.documentElement.style.setProperty(
        "--declareAfterStop",
        px(-(boardWidth * 0.025))
      );
      document.documentElement.style.setProperty(
        "--declareBeforeStop",
        px(boardWidth * 0.025)
      );
      document.documentElement.style.setProperty(
        "--declarePlayerShape",
        px(boardWidth / 2)
      );

      scaleStyles({
        el: declarePlayersShape,
        numerator: boardWidth,
        styleRatio: {
          width: 2.3465,
          height: 2.3465,
        },
      });
      scaleStyles({
        el: declarePlayersDeclaration,
        numerator: boardWidth,
        styleRatio: {
          margin: () =>
            boardWidth < 500
              ? `${px(boardWidth / 18.333)} 0`
              : `${px(boardWidth / 25.8119)} 0`,
          fontSize: () =>
            boardWidth < 500 ? px(boardWidth / 11) : px(boardWidth / 16.1325),
        },
      });
    }

    if (type === "game-over-title") {
      const gameOverPlayerShape = this.parentEl.querySelector(
        ".game-over-title .player-shape"
      ) as HTMLElement;
      const gameOverPlayerResult = this.parentEl.querySelector(
        ".game-over-title .player-result"
      ) as HTMLElement;

      scaleStyles({
        el: gameOverPlayerResult,
        numerator: boardWidth,
        styleRatio: {
          fontSize: 12.906,
          marginBottom: () =>
            boardWidth < 270
              ? px(boardWidth / -54)
              : boardWidth < 434
              ? px(boardWidth / 17.0866)
              : px(boardWidth / 8.604),
          marginTop: () => (boardWidth < 270 ? px(boardWidth / -54) : ""),
        },
      });

      scaleStyles({
        el: gameOverPlayerShape,
        numerator: boardWidth,
        styleRatio: {
          width: () =>
            boardWidth < 434 ? px(boardWidth / 4.265) : px(boardWidth / 3.2265),
          height: () =>
            boardWidth < 434 ? px(boardWidth / 4.265) : px(boardWidth / 3.2265),
        },
      });
    }

    if (type === "player-pick-skin-countdown") {
      const playerPickSkinCountDown = this.parentEl.querySelector(
        ".player-pick-skin-countdown"
      ) as HTMLElement;

      scaleStyles({
        el: playerPickSkinCountDown,
        numerator: boardWidth,
        styleRatio: {
          top: 21.5,
          right: 21.5,
          height: 8.06625,
          width: 8.06625,
          fontSize: 20.1612,
        },
      });
    }
  }
  // overrides to do nothing
  render() {
    return;
  }
}

const px = (num: number, decimal: number = 1) => `${round(num, decimal)}px`;
export default new GameContainerView();
