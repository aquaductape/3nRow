import { round } from "../../utils/index";
import playerBtnGroupView from "../playerOptions/playerBtnGroupView";
import { debounce } from "../utils/index";
import View from "../View";
import { scaleStyles } from "./scale";

type TGetSelectorsProps = {
  all?: boolean;
  pick?: TDomPropNames[];
};

export type TDomOptions<T = HTMLElement> = {
  el?: T;
  selector: string;
  present: boolean;
  queryAll?: boolean;
  getById?: boolean;
  parent?: TDomPropNames;
};

type TDomPropNames = keyof TDom;
export type TGameContainerSelectors = TDomPropNames[];

type TDom = {
  // playerOptionsView
  playerBtnGroup: TDomOptions;
  playerBtns: TDomOptions<HTMLElement[]>;
  p1BtnOptions: TDomOptions;
  fakePlayerBtns: TDomOptions<HTMLElement[]>;
  playerDropdowns: TDomOptions<HTMLElement[]>;
  playerDropdownOptionsContainers: TDomOptions<HTMLElement[]>;
  playerDropdownInners: TDomOptions<HTMLElement[]>;
  playerDropdownShells: TDomOptions<HTMLElement[]>;
  playerDropdownShellShadows: TDomOptions<HTMLElement[]>;
  playerDropdownMasks: TDomOptions<HTMLElement[]>;
  playerIndicators: TDomOptions<HTMLElement[]>;
  // boardView
  rows: TDomOptions<HTMLElement[]>;
  cells: TDomOptions<HTMLElement[]>;
  board: TDomOptions;
  boardBackground: TDomOptions;
  // gameMenuView
  gameMenu: TDomOptions;
  gameMenuTitle: TDomOptions;
  gameMenuBtns: TDomOptions<HTMLElement[]>;
  gameMenuBtnPickPlayer: TDomOptions<HTMLElement[]>;
  gameOverPlayerShape: TDomOptions;
  gameOverPlayerResult: TDomOptions;
  navigationBackBtn: TDomOptions;
  // settingsView
  settingsBtn: TDomOptions;
  settings: TDomOptions;
  // lobbyView
  declarePlayersShape: TDomOptions;
  declarePlayersDeclaration: TDomOptions;
  playerPickSkinCountDown: TDomOptions;
  lobbyTitle: TDomOptions;
  pickSkin: TDomOptions;
  pickSkinBtnsGroup: TDomOptions;
  pickSkinTitle: TDomOptions;
  pickSkinItems: TDomOptions<HTMLElement[]>;
  slideDeclarePlayersStylesheet: TDomOptions;
  onlineCircle: TDomOptions;
  onlineCirclePulse: TDomOptions;
  onlineCircleCircle: TDomOptions;
  codeTitle: TDomOptions;
  codeContent: TDomOptions;
  roomCard: TDomOptions;
  btnCopyLink: TDomOptions;
};

// btnCopyLink
const dom: TDom = {
  // playerOptionsView
  playerBtnGroup: {
    selector: ".player-btn-group",
    present: true,
  },
  playerBtns: {
    selector: ".player-btn-options",
    present: true,
    queryAll: true,
  },
  p1BtnOptions: {
    selector: "#P1-btn-options",
    present: true,
  },
  fakePlayerBtns: {
    selector: ".fake-player-btn",
    present: true,
    queryAll: true,
  },
  playerDropdowns: {
    selector: ".dropdown-options",
    present: true,
    queryAll: true,
  },
  playerDropdownOptionsContainers: {
    selector: ".dropdown-options-container",
    present: true,
    queryAll: true,
  },
  playerDropdownInners: {
    selector: ".dropdown-options-inner",
    present: true,
    queryAll: true,
  },
  playerDropdownShells: {
    selector: ".dropdown-options-shell",
    present: true,
    queryAll: true,
  },
  playerDropdownShellShadows: {
    selector: ".dropdown-options-shell .shell-shadow",
    present: true,
    queryAll: true,
  },
  playerDropdownMasks: {
    selector: ".dropdown-options-mask",
    present: true,
    queryAll: true,
  },
  playerIndicators: {
    selector: ".player-current-indicator",
    present: true,
    queryAll: true,
  },
  // boardView
  board: {
    selector: ".board",
    present: true,
  },
  rows: {
    selector: ".row",
    present: true,
    parent: "board",
    queryAll: true,
  },
  cells: {
    selector: ".cell",
    present: true,
    parent: "board",
    queryAll: true,
  },
  boardBackground: {
    selector: ".board-background",
    present: true,
    parent: "gameMenu",
  },
  // gameMenuView
  gameMenu: {
    selector: "#game-menu",
    present: true,
  },
  gameMenuTitle: {
    selector: ".menu-title",
    present: true,
    parent: "gameMenu",
  },
  gameMenuBtns: {
    selector: ".btn-pick, .btn-leave",
    present: true,
    parent: "gameMenu",
    queryAll: true,
  },
  gameMenuBtnPickPlayer: {
    selector: ".btn-pick-player",
    present: false,
    parent: "gameMenu",
    queryAll: true,
  },
  gameOverPlayerShape: {
    selector: ".game-over-title .player-shape",
    present: false,
    parent: "gameMenu",
  },
  gameOverPlayerResult: {
    selector: ".game-over-title .player-result",
    present: false,
    parent: "gameMenu",
  },
  navigationBackBtn: {
    selector: ".btn-navigation-back",
    present: true,
    parent: "gameMenu",
  },
  // settingsView
  settings: {
    selector: "#settings",
    present: true,
  },
  settingsBtn: {
    selector: ".settings-btn",
    present: true,
    parent: "settings",
  },
  // lobbyView
  pickSkin: {
    selector: ".pick-skin",
    present: false,
  },
  pickSkinBtnsGroup: {
    selector: ".btns-group",
    present: false,
    parent: "pickSkin",
  },
  pickSkinTitle: {
    selector: ".title",
    present: false,
    parent: "pickSkin",
  },
  pickSkinItems: {
    selector: ".color-item, .shape-item",
    present: false,
    queryAll: true,
    parent: "pickSkin",
  },
  declarePlayersShape: {
    selector: ".lobby .player-shape",
    present: false,
  },
  declarePlayersDeclaration: {
    selector: ".lobby .declaration",
    present: false,
  },
  playerPickSkinCountDown: {
    selector: ".player-pick-skin-countdown",
    present: false,
  },
  slideDeclarePlayersStylesheet: {
    selector: "slide-declare-players-animation",
    present: false,
    getById: true,
  },
  lobbyTitle: {
    selector: ".lobby-title",
    present: false,
  },
  roomCard: {
    selector: ".room-card",
    present: false,
  },
  codeTitle: {
    selector: ".code-title",
    parent: "roomCard",
    present: false,
  },
  codeContent: {
    selector: ".code-content",
    parent: "roomCard",
    present: false,
  },
  onlineCircle: {
    selector: ".online-circle",
    present: false,
  },
  onlineCircleCircle: {
    selector: ".circle",
    parent: "onlineCircle",
    present: false,
  },
  onlineCirclePulse: {
    selector: ".pulse",
    parent: "onlineCircle",
    present: false,
  },
  btnCopyLink: {
    selector: ".btn-copy-link",
    present: false,
  },
};

type TGetSelectors = (props: TGetSelectorsProps) => void;
class GameContainerView extends View {
  private dom: TDom = dom as TDom;
  private debouncedGetSelectors: TGetSelectors = () => {};
  private debouncedResizeAnimation = () => {};
  private animationId = 0;
  declarePlayersAnimationRunning = false;
  playerDropdownContentHeight = 0;

  constructor() {
    super({ root: ".game-container" });
    this.init();
  }

  protected init() {
    this.debouncedGetSelectors = debounce(this.getSelectors.bind(this), {
      time: 500,
      leading: true,
    });
    this.debouncedResizeAnimation = debounce(this.resizeAnimation.bind(this), {
      time: 200,
      leading: false,
    });
  }

  private getSelectors({ all, pick }: TGetSelectorsProps) {
    const { dom } = this;
    const getSelector = (
      item: TDomOptions<HTMLElement> | TDomOptions<HTMLElement[]>
    ) => {
      if (!item.present) return;

      let parent: HTMLElement = this.parentEl;

      if (item.parent) {
        const itemParent = dom[item.parent].el;
        if (!itemParent) return;
        // if (itemParent) {
        parent = itemParent as HTMLElement;
        // }
      }

      if (item.getById) {
        item.el = document.getElementById(item.selector) as HTMLElement;
        return;
      }

      if (item.queryAll) {
        item.el = Array.from(
          parent.querySelectorAll(item.selector)
        ) as HTMLElement[];
        return;
      }

      item.el = parent.querySelector(item.selector) as HTMLElement;
    };

    const getAll = () => {
      for (const key in dom) {
        const item = dom[key as TDomPropNames];
        getSelector(item);
      }
    };

    const pickItems = () => {
      for (const str of pick!) {
        const item = dom[str];
        item.present = true;
        getSelector(item);
      }
    };

    if (all) {
      getAll();
      return;
    }

    if (pick) {
      pickItems();
      return;
    }
  }

  private resizeElements(boardWidth: number, { all }: { all: boolean }) {
    if (all) {
      this.debouncedGetSelectors({ all: true });
    }
    // console.log(this.dom);
    // debugger;

    const {
      // boardView
      board,
      rows,
      cells,
      // settingsView
      settings,
      settingsBtn,
      // playerOptionsView
      playerBtnGroup,
      playerIndicators,
      playerBtns,
      p1BtnOptions,
      playerDropdowns,
      playerDropdownOptionsContainers,
      playerDropdownShells,
      playerDropdownShellShadows,
      playerDropdownInners,
      playerDropdownMasks,
      fakePlayerBtns,
      // gameMenuView
      gameMenu,
      gameMenuTitle,
      gameMenuBtns,
      gameMenuBtnPickPlayer,
      navigationBackBtn,
      boardBackground,
      // lobbyView
      lobbyTitle,
      pickSkin,
      pickSkinBtnsGroup,
      pickSkinItems,
      pickSkinTitle,
      slideDeclarePlayersStylesheet,
      declarePlayersDeclaration,
      declarePlayersShape,
      playerPickSkinCountDown,
      gameOverPlayerResult,
      gameOverPlayerShape,
      roomCard,
      codeTitle,
      codeContent,
      onlineCircle,
      onlineCircleCircle,
      onlineCirclePulse,
      btnCopyLink,
    } = this.dom;

    // board.el!.style.transition = "";

    const matchDropdownWidthToBoard = () => {
      playerDropdowns.el!.forEach((playerDropdown) => {
        playerDropdown.style.width = px(boardWidth);
      });
      playerDropdownShells.el!.forEach((playerDropdownShell) => {
        playerDropdownShell.style.width = px(boardWidth);
      });
    };

    const matchFakePlayerBtnWidthToBtnParent = () => {
      const playerBtnWidth = playerBtns.el![0].clientWidth;
      const width = px(boardWidth / 37 + playerBtnWidth);

      fakePlayerBtns.el!.forEach((fakePlayerBtn) => {
        fakePlayerBtn.style.width = width;
      });
    };

    const matchDropdownOuterSizeFromInnerContent = () => {
      playerDropdownOptionsContainers.el?.forEach(
        (playerDropdownOptionsContainer) => {
          playerDropdownOptionsContainer.style.display = "block";
        }
      );
      this.reflow();
      console.log("already ran");
      // should run after width is set from boardWidth, which would update dropdown content's layout
      const playerBtnHeight = playerBtns.el![0].getBoundingClientRect().height;
      const playerDropdownWidth = playerDropdowns.el![0].getBoundingClientRect()
        .width;
      const playerDropdownHeight = playerDropdowns.el![0].getBoundingClientRect()
        .height;
      const playerDropdownMaskHeight = playerDropdownMasks.el![0].getBoundingClientRect()
        .height;
      const shadowHeight = boardWidth / 35.5;
      const totalNewPlayerDropdownHeight =
        playerBtnHeight + playerDropdownHeight + shadowHeight;

      this.playerDropdownContentHeight = totalNewPlayerDropdownHeight;

      playerDropdownInners.el!.forEach((playerDropdownInner) => {
        playerDropdownInner.style.height = px(
          playerDropdownHeight + shadowHeight + playerDropdownMaskHeight * 2
        );
        playerDropdownInner.style.width = px(playerDropdownWidth);
      });
      playerDropdownShells.el!.forEach((playerDropdownShell) => {
        playerDropdownShell.style.height = px(totalNewPlayerDropdownHeight);
      });
      playerDropdownShellShadows.el!.forEach((playerDropdownShellShadow) => {
        playerDropdownShellShadow.style.height = px(
          playerDropdownHeight * 0.95
        );
      });

      playerDropdownOptionsContainers.el?.forEach(
        (playerDropdownOptionsContainer) => {
          playerDropdownOptionsContainer.style.display = ""; // revert to none
        }
      );
    };

    const scaleBoardFromWidth = (boardWidth: number) => {
      if (boardWidth > 1600) boardWidth *= 0.7;
      if (boardWidth > 700) boardWidth *= 0.8;

      // ************* boardView ****************
      scaleStyles({
        name: board,
        numerator: boardWidth,
        styleRatio: {
          gap: { ratio: 46.25, decimalPlaces: 0 },
          borderRadius: 12.33,
          boxShadow: () =>
            `0px ${px(boardWidth / 18.8)} 0px var(--board-shadow)`,
        },
      });
      scaleStyles({
        name: rows,
        numerator: boardWidth,
        styleRatio: {
          gap: { ratio: 46.25, decimalPlaces: 0 },
        },
      });
      scaleStyles({
        name: cells,
        numerator: boardWidth,
        styleRatio: {
          borderRadius: 37,
        },
      });
      // ************* playerOptionsView ****************
      scaleStyles({
        name: playerBtnGroup,
        numerator: boardWidth,
        styleRatio: {
          height: 5.692,
          marginBottom: 12.33,
        },
      });
      scaleStyles({
        name: playerBtns,
        numerator: boardWidth,
        styleRatio: {
          padding: 37,
          borderRadius: 37,
          fontSize: 16.5,
        },
      });
      scaleStyles({
        name: playerIndicators,
        numerator: boardWidth,
        styleRatio: {
          top: 74,
          borderRadius: 37,
          boxShadow: () => `0px ${px(boardWidth / 37)} 0px var(--blue-shadow)`,
        },
      });
      scaleStyles({
        name: p1BtnOptions,
        numerator: boardWidth,
        styleRatio: {
          marginRight: 14.8,
        },
      });
      scaleStyles({
        name: playerDropdownMasks,
        numerator: boardWidth,
        styleRatio: {
          top: 8.06625,
          width: 21.5827,
          height: 21.5827,
        },
      });
      scaleStyles({
        name: playerDropdowns,
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
        name: playerDropdownShellShadows,
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
        name: fakePlayerBtns,
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
      // ************* settingsView ****************
      scaleStyles({
        name: settingsBtn,
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
        name: settings,
        numerator: boardWidth,
        styleRatio: {
          marginBottom: 20.533,
        },
      });

      // ************* gameMenuView ****************
      scaleStyles({
        name: gameMenuTitle,
        numerator: boardWidth,
        styleRatio: {
          fontSize: () => {
            if (boardWidth < 250) return "20px";
            if (boardWidth < 320) return "22px";
            if (boardWidth < 420) return "28px";
            return "38px";
          },
          margin: () => {
            if (boardWidth < 250) return "5px 0";
            if (boardWidth < 320) return "15px 0";
            if (boardWidth < 420) return "25px 0";
            return "40px 0";
          },
        },
      });
      scaleStyles({
        name: gameMenuBtns,
        numerator: boardWidth,
        styleRatio: {
          paddingLeft: 21,
          paddingRight: 21,
          paddingTop: 28,
          paddingBottom: 28,
          maxWidth: () =>
            boardWidth > 500 ? px(boardWidth / 2.1538) : px(boardWidth / 1.5),
          borderRadius: 42,
          fontSize: (el) => {
            // if (!el.classList.contains("btn-multiplayer")) return "";
            if (boardWidth < 250) return px(15);
            if (boardWidth < 320) return px(18);
            return px(22);
          },
        },
      });
      scaleStyles({
        name: gameMenuBtnPickPlayer,
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
        name: navigationBackBtn,
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
        name: gameMenu,
        numerator: boardWidth,
        styleRatio: {
          borderRadius: 12.33,
        },
      });
      scaleStyles({
        name: boardBackground,
        numerator: boardWidth,
        styleRatio: {
          top: 52.85,
        },
      });
      scaleStyles({
        name: gameOverPlayerResult,
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
        name: gameOverPlayerShape,
        numerator: boardWidth,
        styleRatio: {
          width: () =>
            boardWidth < 434 ? px(boardWidth / 4.265) : px(boardWidth / 3.2265),
          height: () =>
            boardWidth < 434 ? px(boardWidth / 4.265) : px(boardWidth / 3.2265),
        },
      });

      // ************* lobbyView ****************
      scaleStyles({
        name: lobbyTitle,
        numerator: boardWidth,
        styleRatio: {
          fontSize: () => {
            if (boardWidth < 250) return "16px";
            if (boardWidth < 290) return "18px";
            if (boardWidth < 320) return "20px";
            if (boardWidth < 420) return "28px";
            return "38px";
          },
          margin: () => {
            if (boardWidth < 250) return "5px 0";
            if (boardWidth < 320) return "15px 0";
            if (boardWidth < 420) return "25px 0";
            return "40px 0";
          },
        },
      });
      scaleStyles({
        name: roomCard,
        numerator: boardWidth,
        styleRatio: {
          margin: () => `${px(boardWidth / 12.9059)} 0`,
        },
      });
      scaleStyles({
        name: playerPickSkinCountDown,
        numerator: boardWidth,
        styleRatio: {
          top: 21.5,
          right: 21.5,
          height: 8.06625,
          width: 8.06625,
          fontSize: 20.1612,
        },
      });

      scaleStyles({
        name: declarePlayersShape,
        numerator: boardWidth,
        styleRatio: {
          width: 2.3465,
          height: 2.3465,
        },
      });
      scaleStyles({
        name: declarePlayersDeclaration,
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

      scaleStyles({
        name: codeContent,
        numerator: boardWidth,
        styleRatio: {
          padding: 10.7549,
          fontSize: 12.906,
          borderBottomLeftRadius: 21.509,
          borderBottomRightRadius: 21.509,
        },
      });

      scaleStyles({
        name: codeTitle,
        numerator: boardWidth,
        styleRatio: {
          padding: 32.265,
          fontSize: 21.509,
          borderTopWidth: 80.6625,
          borderRightWidth: 80.6625,
          borderLeftWidth: 80.6625,
          borderTopLeftRadius: 21.509,
          borderTopRightRadius: 21.509,
        },
      });
      scaleStyles({
        name: onlineCircle,
        numerator: boardWidth,
        styleRatio: {
          top: 11.7327,
          right: 7.5917,
        },
      });

      scaleStyles({
        name: onlineCircleCircle,
        numerator: boardWidth,
        precisionDecimal: 0,
        styleRatio: {
          width: 20.1656,
          height: 20.1656,
          boxShadow: () => `0px 0px 0px ${px(boardWidth / 161.325, 0)} #15a415`,
        },
      });

      scaleStyles({
        name: onlineCirclePulse,
        numerator: boardWidth,
        precisionDecimal: 0,
        styleRatio: {
          width: 20.1656,
          height: 20.1656,
        },
      });
      scaleStyles({
        name: btnCopyLink,
        numerator: boardWidth,
        styleRatio: {
          height: () => (boardWidth < 465 ? "45px" : "55px"),
          width: () => (boardWidth < 465 ? "160%" : ""),
          marginLeft: () => (boardWidth < 465 ? "-30%" : ""),
        },
      });

      if (pickSkin.present && boardWidth <= 285) {
        console.log("pick skin ran");
        pickSkinTitle.el!.style.fontSize = "22px";
        pickSkinBtnsGroup.el!.style.width = "calc(100% + 30px)";
        pickSkinBtnsGroup.el!.style.marginLeft = "-15px";
        pickSkinItems.el!.forEach((item) => {
          item.style.width = "45px";
          item.style.height = "45px";
        });
      }

      if (this.declarePlayersAnimationRunning) {
        console.log("declare player ran");
        const animationName = `DeclarePlayerDeclaration-${++this.animationId}`;

        const styleContent = `
              @keyframes ${animationName}  {
                0% {
                  opacity: 0;
                  transform: translateX(${px(boardWidth / 2)});
                }
                10% {
                  opacity: 1;
                  transform: translateX(${px(boardWidth * 0.025)});
                }
                90% {
                  opacity: 1;
                  transform: translateX(${px(-(boardWidth * 0.025))});
                }
                100% {
                  opacity: 0;
                  transform: translateX(${px(-(boardWidth / 2))});
                }
              }
              `;

        slideDeclarePlayersStylesheet.el!.textContent = styleContent;
        declarePlayersShape.el!.style.animation = `${animationName} 3000ms linear normal forwards`;
        declarePlayersDeclaration.el!.style.animation = `${animationName} 3000ms linear reverse forwards`;
      }
    };

    scaleBoardFromWidth(boardWidth);
    if (!all) return;

    matchDropdownWidthToBoard();
    matchFakePlayerBtnWidthToBtnParent();
    // this.reflow();
    matchDropdownOuterSizeFromInnerContent();
  }

  private resizeAnimation() {
    playerBtnGroupView.recalculateDropdownAnimations();
  }

  scaleElementsToProportionToBoard({
    selectors,
    boardWidth: arg_boardWidth,
  }: {
    selectors: TDomPropNames[];
    boardWidth?: number;
  }) {
    const boardWidth =
      arg_boardWidth == null ? this.parentEl.clientWidth : arg_boardWidth;

    this.getSelectors({ pick: selectors });
    this.resizeElements(boardWidth, { all: false });
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

        this.resizeElements(boardWidth, { all: true });
        this.debouncedResizeAnimation();
      }
      // viewport has greater height
      if (heightSlice > browserInnerWidth) {
        const paddingLR = round(browserInnerWidth / 5, 0);
        const boardWidth = browserInnerWidth - paddingLR;

        gameContainer.style.maxWidth = px(boardWidth);

        this.resizeElements(boardWidth, { all: true });
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
      this.parentEl.style.transition = "opacity 100ms";
      this.parentEl.style.opacity = "1";
      const { playerBtns } = this.dom;

      playerBtns.el!.forEach((playerBtn) => {
        playerBtn.style.background = "";
        playerBtn.style.transition = "none";
      });

      setTimeout(() => {
        document.body.style.overflow = "";
        this.parentEl.style.transition = "";
        this.parentEl.style.opacity = "";

        playerBtns.el!.forEach((playerBtn) => {
          playerBtn.style.transition = "";
        });
      }, 100);
    });
  }
  // overrides to do nothing
  render() {
    return;
  }
}

const px = (num: number, decimal: number = 1) => `${round(num, decimal)}px`;
export default new GameContainerView();
