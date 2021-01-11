import {
  TControlCreateRoom,
  TControlJoinRoom,
} from "../../controllers/onlineMultiplayer";
import { TControlPlayAgain, TControlStartGame } from "../../controllers/menu";
import { TControlSettings } from "../../controllers/settings";
import { TPlayer } from "../../model/state";
import boardView from "../board/boardView";
import { shapes, svg } from "../constants/constants";
import gameContainerView from "../gameContainer/gameContainerView";
import LobbyView, { TLobbyType } from "../lobby/lobbyView";
import {
  convertObjPropsToHTMLAttr,
  createHTMLFromString,
  hideElement,
  showElement,
  transitionHideThenShow,
} from "../utils/index";
import View from "../View";
import menuBtns, { TGameMenuState } from "./menuBtns";
import lobbyView from "../lobby/lobbyView";
import svgDefsView from "../svg/svgDefsView";

type TSections = keyof TGameMenuState;

class GameMenuView extends View {
  protected data: TPlayer[];
  private menuState: TGameMenuState;
  private sectionVisible: TSections | null;
  private renderInit: boolean;
  private vsPlayer: string;
  private navigationHistory: string[];
  private handlerStartGame: TControlStartGame;
  private handlerPlayAgain: TControlPlayAgain;
  private handlerSettings: TControlSettings;
  constructor() {
    super({ root: "#game-menu" });
    this.data = [] as TPlayer[];

    this.sectionVisible = "start";
    this.renderInit = true;
    this.vsPlayer = "ai";
    this.navigationHistory = [];
    this.menuState = menuBtns;
    this.handlerStartGame = () => {};
    this.handlerPlayAgain = () => {};
    this.handlerSettings = () => {};
  }

  protected generateMarkup() {
    return `
    <div class="menu">
    ${this.backgroundSVG()}
    ${this.navigationBackMarkup()}
      <div class="section">
      ${this.menuMarkup({ sectionType: "start" })}
      </div>
      ${this.playAgainMarkup()}
    </div>
    `;
  }

  private navigationBackMarkup() {
    return `
    <button class="btn btn-navigation-back hidden" data-navigation-back="true" aria-label="go back to previous menu selection">${svg.navigationArrow}</button>
    `;
  }

  private backgroundSVG() {
    return `
    <div class="background-svg">${svg.menuBg}</div>
    `;
  }

  private playAgainMarkup() {
    return `
      <div class="play-again-container hidden">
        <button class="btn btn-primary btn-play-again" aria-label="play again" title="play again" data-play-against="again">
          ${svg.playAgainCircleBtn}
        </button>
      </div>
    `;
  }

  private menuMarkup({ sectionType }: { sectionType: TSections }) {
    const { titleId, listBtns: btns, title, section } = this.menuState[
      sectionType
    ];
    this.sectionVisible = sectionType;
    const btnsMarkup = btns
      .map((item) => {
        const dataAttributes = convertObjPropsToHTMLAttr({
          type: "data",
          obj: item.dataAttributes,
        });
        const ariaAttributes = convertObjPropsToHTMLAttr({
          type: "aria",
          obj: item.aria,
        });

        return `
        <li class="menu-item">
          <a 
            class="${item.classNames.join(" ")}"
            ${dataAttributes}
            ${ariaAttributes}
            data-section="${section}"
            href="javascript:void(0)"
          >
            ${item.content}
          </a>
        </li>
      `;
      })
      .join("");

    const ariaLabel =
      title === "Difficulty" ? 'aria-label="Computer Difficulty"' : "";
    const titleMarkupId = titleId ? `id="${titleId}"` : "";
    const titleMarkup = title
      ? `
    <div ${titleMarkupId} class="title" ${ariaLabel}>${title}</div> 
    `
      : "";

    return `
    <div class="section-menu">
      ${titleMarkup}
      <ul class="menu-buttons">
        ${btnsMarkup}
      </ul>
    </div>
    `;
  }

  private revealMenu() {
    const section = this.parentEl.querySelector(".section") as HTMLElement;
    const revealBoardTimeout = 1000;

    this.transtionToNextGeneralSection({
      type: "section",
      backBtnSelected: true,
      replaceWith: this.menuMarkup({ sectionType: "playAgain" }),
      updateToNextWithoutTransition: true,
    });

    this.parentEl.style.display = "";
    this.reflow();
    this.parentEl.classList.remove("onExit");

    const showSection = () => {
      showElement({
        el: section,
        onEnd(el) {
          section.classList.remove("hidden");
        },
      });
    };

    setTimeout(() => {
      showSection();
    }, revealBoardTimeout);
  }

  private async hideMenu() {
    const section = this.parentEl.querySelector(".section") as HTMLElement;
    const backgroundSVG = this.parentEl.querySelector(
      ".background-svg"
    ) as HTMLElement;

    // hide section
    await hideElement({
      el: section,
      // onStart: (el) => (el.style.display = ""),
      onEnd: (el) => {
        el.classList.add("hidden");
      },
    });

    // hide menu
    await hideElement({
      el: this.parentEl,
      duration: 800,
      useTransitionEvent: false,
      onStart: (el) => {
        el.classList.add("onExit");
        el.style.background = "none";
        this.hideBtnNavigationBack();
      },
      onEnd: (el) => {
        el.style.display = "none";

        lobbyView.hideAndRemoveCountDownMarkup();
      },
    });
  }

  changeMenuTheme(theme: "menu" | "lobby") {
    const gameBoard = document.querySelector(".game") as HTMLElement;
    const board = document.querySelector(".board") as HTMLElement;

    board.style.transition = "box-shadow 500ms";
    this.reflow();

    if (theme === "lobby") {
      gameBoard.classList.add("lobby");
    }
    if (theme === "menu") {
      gameBoard.classList.remove("lobby");
    }
  }

  updatePlayerMark(player: TPlayer) {
    const {
      menuState: { goFirst },
      sectionVisible,
      renderInit,
      vsPlayer,
    } = this;

    const listBtn = goFirst.listBtns.find((btn) => btn.id === player.id)!;
    const prevShape = listBtn!.dataAttributes["shape"];
    const content = player.id === "P1" ? "You" : "Computer";
    const playerSVGShape = player.getSvgShape();
    const spanTextContent =
      vsPlayer === "ai"
        ? `
    <span class="btn-txt-content">${content}</span>
    `
        : "";

    if (vsPlayer === "human") {
      const ariaLabel =
        player.id === "P1" ? "You go first" : "Computer goes first";
      listBtn.dataAttributes = {
        ...listBtn.dataAttributes,
        playAgainst: "human",
      };
      listBtn.aria = { ...listBtn.aria, "aria-label": ariaLabel };
    }
    if (vsPlayer === "ai") {
      const ariaLabel =
        player.id === "P1" ? "Player 1 goes first" : "Player 2 goes first";
      listBtn.dataAttributes = { ...listBtn.dataAttributes, playAgainst: "ai" };
      listBtn.aria = { ...listBtn.aria, "aria-label": ariaLabel };
    }

    listBtn.dataAttributes["shape"] = player.shape;
    listBtn.content = `
    ${spanTextContent}
        <span class="btn-svg-mark">
          ${playerSVGShape}
        </span>
      `;
    if (prevShape === player.shape) return;
    if (sectionVisible !== "goFirst") return;

    const playerBtn = this.parentEl.querySelector(
      `[data-player-id="${player.id}"]`
    ) as HTMLElement;

    if (!renderInit && !playerBtn) return;

    const btnSVGMark = playerBtn.querySelector(".btn-svg-mark svg")!;
    btnSVGMark.replaceWith(createHTMLFromString(playerSVGShape));

    if (vsPlayer !== "ai") return;
    const btnTxtContent = playerBtn.querySelector(".btn-txt-content")!;
    btnTxtContent.textContent = content;
  }

  updatePlayersMark(data: TPlayer[]) {
    this.data = data;
    const players = data;

    players.forEach((player) => this.updatePlayerMark(player));
  }

  //   renderPlayAgainButton() {
  //     const btnPlayAgain = this.parentEl.querySelector(
  //       ".btn-play-again"
  //     ) as HTMLElement;
  //
  //     btnPlayAgain.parentElement!.classList.remove("hidden");
  //     setTimeout(() => {
  //       showElement({ el: this.parentEl, display: "flex" });
  //     }, 1000);
  //   }

  renderResultMenu({
    declare,
    player,
    tie,
  }: {
    tie: boolean;
    declare: "winner" | "loser";
    player: TPlayer;
  }) {
    this.menuState.playAgain.title = this.resultMenuDeclarePlayerMarkup({
      declare,
      player,
      tie,
    });
    this.revealMenu();
  }

  private resultMenuDeclarePlayerMarkup({
    declare,
    player,
    tie,
  }: {
    tie: boolean;
    declare: "winner" | "loser";
    player: TPlayer;
  }) {
    if (tie) {
      return `<div class="player-status">Tie!</div>`;
    }
    const declareMessage = declare === "winner" ? "Victory!" : "Defeat!";

    return `
    <div class="player-shape">${player.getSvgShape()}</div>
    <div class="player-status">${declareMessage}</div>
    `;
  }

  // onBack
  private onBtnNavigationBack() {
    const sectionType = this.navigationHistory.pop()! as TSections;

    this.changeMenuTheme("menu");

    if (!this.navigationHistory.length) {
      this.hideBtnNavigationBack();
    }

    lobbyView.hideAndRemoveCountDownMarkup();
    this.transtionToNextGeneralSection({
      type: "section",
      backBtnSelected: true,
      replaceWith: this.menuMarkup({ sectionType }),
    });
  }

  // transitionAnimation
  private async transtionToNextGeneralSection({
    type,
    replaceWith,
    backBtnSelected,
    clicked = false,
    updateToNextWithoutTransition = false,
  }: {
    type: "section" | "lobby";
    replaceWith: (() => void) | string;
    /**
     * selected such as clicked
     */
    backBtnSelected: boolean;
    clicked?: boolean;
    updateToNextWithoutTransition?: boolean;
  }) {
    const sectionEl = this.parentEl.querySelector(".section") as HTMLElement;

    if (updateToNextWithoutTransition) {
      if (typeof replaceWith === "string") sectionEl.innerHTML = replaceWith;
      if (typeof replaceWith === "function") replaceWith();
    }

    await hideElement({
      el: sectionEl,
      onEnd: (el) => {
        el.style.display = "none";
        this.clearChildren(sectionEl);

        if (typeof replaceWith === "string") sectionEl.innerHTML = replaceWith;
        if (typeof replaceWith === "function") replaceWith();
        if (type === "section") {
          // sectionEl.innerHTML = this.menuMarkup({ sectionType });
          gameContainerView.scaleElementsToProportionToBoard({
            type: "menuBtns",
          });
        }
      },
    });

    await showElement({
      el: sectionEl,
      onEnd: (el) => {
        el.style.display = "";

        console.log("show onEnd");
        if (type === "lobby") return;
        if (backBtnSelected) return;

        const focusBtn = this.parentEl.querySelector(
          '[data-focus="true"]'
        ) as HTMLElement;

        // issue in iOS, the focus bg shows on tap
        focusBtn.focus();
        if (!clicked) focusBtn.classList.add("noFocusClick");
      },
    });
  }

  private transitionToNextMenuSection({
    sectionType,
    currentSection,
    clicked,
  }: {
    sectionType: TSections;
    currentSection: string;
    clicked: boolean;
  }) {
    if (currentSection) this.navigationHistory.push(currentSection);
    if (this.navigationHistory.length) {
      this.showBtnNavigationBack();
    }

    if (sectionType === "goFirst") {
      svgDefsView.updateDropShadow("#000");
    }

    this.transtionToNextGeneralSection({
      type: "section",
      backBtnSelected: false,
      clicked,
      replaceWith: this.menuMarkup({ sectionType }),
    });
  }

  markupDidGenerate() {
    this.updatePlayersMark(this.data);
    this.renderInit = false;

    this.parentEl.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      const btn = target.closest(".btn") as HTMLElement;
      let clicked = true;
      if (e.detail === 0) clicked = false;
      if (!btn) return;
      const navigationBtnBack = btn.dataset.navigationBack;
      const playAgainst = btn.dataset.playAgainst;
      const playAgain = btn.dataset.playAgain;
      const playerId = btn.dataset.playerId!;
      const difficulty = btn.dataset.difficulty;
      const transitionTo = btn.dataset.transitionTo as TSections;
      const currentSection = btn.dataset.section!;
      const lobbyType = btn.dataset.lobbyType as TLobbyType;
      const open = btn.dataset.open!;
      const vs = btn.dataset.vs!;

      if (difficulty) {
        this.handlerSettings({
          type: "aiEnabled",
          value: true,
        });
        this.handlerSettings({
          type: "aiDifficulty",
          value: difficulty,
        });
      }

      if (vs) {
        this.vsPlayer = vs;
        if (vs === "human") {
          this.handlerSettings({
            type: "aiEnabled",
            value: false,
          });
        }
        this.updatePlayersMark(this.data);
      }

      if (transitionTo) {
        this.transitionToNextMenuSection({
          sectionType: transitionTo,
          currentSection,
          clicked,
        });

        this.changeMenuTheme("menu");

        if (transitionTo === "aiDifficulty") {
          this.handlerSettings({
            type: "aiEnabled",
            value: true,
          });
        }
        return;
      }

      if (navigationBtnBack) {
        this.onBtnNavigationBack();
      }

      if (open) {
        this.navigationHistory.push(currentSection);
        this.transtionToNextGeneralSection({
          type: "lobby",
          backBtnSelected: false,
          clicked: true,
          replaceWith: () => {
            const players = this.data;

            lobbyView.render({
              type: lobbyType,
              mainPlayer: players[0],
              firstPlayer: players[0],
              players,
              preGameType: "connect-server",
            });
            this.changeMenuTheme("lobby");
          },
        });
      }

      if (playAgain === "true") {
        this.hideMenu();
        this.handlerPlayAgain();
        return;
      }

      if (playAgainst === "human") {
        this.startGameAndHideMenu({ firstMovePlayer: playerId, ai: false });
        return;
      }

      if (playAgainst === "ai") {
        this.startGameAndHideMenu({ firstMovePlayer: playerId, ai: true });
        return;
      }
    });
  }

  hideBtnNavigationBack() {
    const btnNavigationBack = this.parentEl.querySelector(
      ".btn-navigation-back"
    ) as HTMLElement;
    btnNavigationBack.classList.add("hidden");
  }

  showBtnNavigationBack() {
    const btnNavigationBack = this.parentEl.querySelector(
      ".btn-navigation-back"
    ) as HTMLElement;
    btnNavigationBack.classList.remove("hidden");
  }

  addHandlers({
    handlerPlayAgain,
    handlerStartGame,
    handlerSettings,
  }: {
    handlerStartGame: TControlStartGame;
    handlerPlayAgain: TControlPlayAgain;
    handlerSettings: TControlSettings;
  }) {
    this.handlerStartGame = handlerStartGame;
    this.handlerPlayAgain = handlerPlayAgain;
    this.handlerSettings = handlerSettings;
  }

  async startGameAndHideMenu({
    firstMovePlayer,
    ai = false,
    difficulty,
  }: {
    firstMovePlayer: string;
    ai?: boolean;
    difficulty?: string;
  }) {
    this.changeMenuTheme("menu");
    // remove pregame here instead of inside handlerStartGame
    await this.hideMenu();

    this.sectionVisible = null;

    if (ai) {
      this.handlerSettings({
        type: "aiEnabled",
        value: true,
      });
    }
    this.handlerStartGame({ firstMovePlayer, ai, difficulty });
  }

  render(data: TPlayer[]) {
    super.render(data);
  }
}

export default new GameMenuView();
