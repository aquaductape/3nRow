import { round } from "../../utils/index";
import { debounce } from "../utils/index";
import View from "../View";

class GameContainerView extends View {
  playerBtnGroup: HTMLElement;
  playerBtns: HTMLElement[];
  fakePlayerBtns: HTMLElement[];
  fakePlayerBtnsHighlight: HTMLElement[];
  playerDropdowns: HTMLElement[];
  playerIndicators: HTMLElement[];
  rows: HTMLElement[];
  cells: HTMLElement[];
  board: HTMLElement;
  boardBackground: HTMLElement;

  constructor() {
    super({ root: ".game-container" });
    this.playerBtnGroup = this.parentEl.querySelector(
      ".player-btn-group"
    ) as HTMLElement;
    this.rows = Array.from(this.parentEl.querySelectorAll(".row"));
    this.cells = Array.from(this.parentEl.querySelectorAll(".cell"));
    this.playerBtns = Array.from(
      this.parentEl.querySelectorAll(".player-btn-options")
    );
    this.playerIndicators = Array.from(
      this.parentEl.querySelectorAll(".player-current-indicator")
    );
    this.fakePlayerBtns = Array.from(
      this.parentEl.querySelectorAll(".fake-player-btns")
    );
    this.fakePlayerBtnsHighlight = Array.from(
      this.parentEl.querySelectorAll(".player-btn-highlight")
    );
    this.playerDropdowns = Array.from(
      this.parentEl.querySelectorAll(".dropdown-options")
    );
    this.board = this.parentEl.querySelector(".board") as HTMLElement;
    this.boardBackground = this.parentEl.querySelector(
      ".board-background"
    ) as HTMLElement;
  }

  // overrides to do nothing
  render() {
    return;
  }

  runResizeListener() {
    const gapRatio = 46.25;
    const boardBgTopRatio = 52.85;
    const boardBorderRadiusRatio = 12.33;
    const boardShadowRatio = 18.8; // 14.8
    const cellBorderRadiusRatio = 37;
    const playerBtnGroupHeightRatio = 5.692;
    const playerBtnGroupMarginRatio = 12.33;
    const playerBtnGroupBorderRadiusRatio = 37;
    const playerBtnPaddingRatio = 37;
    const playerIndicatorShadowRatio = 37;
    const playerIndicatorPlacementRatio = 74;
    const paddingBottomRatio = 11;
    const dropdownTopRatio = 5.692;
    const dropdownBorderRadiusRatio = 12.33;
    const dropdownShadowRatio = 37;
    const fakePlayerBtnHeightRatio = 5.692;
    const fakePlayerBtnTopRatio = 37;
    const playerBtnHighlightShadowRatio = 37;

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
      playerDropdowns,
      fakePlayerBtns,
      fakePlayerBtnsHighlight,
    } = this;

    const px = (num: number, decimal: number = 1) => `${round(num, decimal)}px`;

    const scaleBoardFromWidth = (boardWidth: number) => {
      if (boardWidth > 1600) boardWidth *= 0.7;
      if (boardWidth > 700) boardWidth *= 0.8;

      board.style.gap = px(boardWidth / gapRatio, 0);
      board.style.borderRadius = px(boardWidth / boardBorderRadiusRatio);
      board.style.boxShadow = `0px ${px(
        boardWidth / boardShadowRatio
      )} 0px var(--blue-shadow)`;
      boardBackground.style.top = px(boardWidth / boardBgTopRatio);

      rows.forEach((row) => {
        row.style.gap = px(boardWidth / gapRatio, 0);
      });

      cells.forEach((cell) => {
        cell.style.borderRadius = px(boardWidth / cellBorderRadiusRatio);
      });

      playerBtnGroup.style.height = px(boardWidth / playerBtnGroupHeightRatio);
      playerBtnGroup.style.marginBottom = px(
        boardWidth / playerBtnGroupMarginRatio
      );

      playerBtns.forEach((btn) => {
        btn.style.padding = px(boardWidth / playerBtnPaddingRatio);
        btn.style.borderRadius = px(
          boardWidth / playerBtnGroupBorderRadiusRatio
        );
      });

      playerIndicators.forEach((indicator) => {
        indicator.style.boxShadow = `0px ${px(
          boardWidth / playerIndicatorShadowRatio
        )} 0px var(--blue-shadow)`;
        indicator.style.top = px(boardWidth / playerIndicatorPlacementRatio);
        indicator.style.borderRadius = px(
          boardWidth / playerBtnGroupBorderRadiusRatio
        );
      });

      // playerDropdowns.forEach(playerDropdown => {
      //   playerDropdown.style.borderRadius = px(boardWidth / )
      // })
    };

    const changeHeight = ({ init }: { init: boolean } = { init: false }) => {
      const browserInnerHeight =
        window.innerHeight || document.documentElement.clientHeight;
      const browserInnerWidth =
        window.innerWidth || document.documentElement.clientWidth;

      const gameContainerPadding =
        Number(getComputedStyle(gameContainer).paddingLeft.match(/-?\d+/)![0]) *
        2;
      const boardWidth = browserInnerWidth - gameContainerPadding;
      let width = 0;
      let padding = round(browserInnerHeight / paddingBottomRatio, 0);
      // padding = 40;
      // padding =

      width =
        browserInnerHeight - playerBtnGroup.clientHeight - margin - padding;

      // if (browserInnerHeight > 800) {
      //   gameContainer.style.maxWidth = `${width - 200}px`;
      //   return;
      // }
      gameContainer.style.maxWidth = px(width);

      if (browserInnerWidth > width) {
        console.log("browserInnerWidth > width");
        console.log({ boardWidth, width });
        scaleBoardFromWidth(width);
        return;
      }
      console.log("browserInnerWidth < width");
      // if (!init && browserInnerHeight > boardWidth + 200) return;
      console.log({ boardWidth, width });
      scaleBoardFromWidth(boardWidth);
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
