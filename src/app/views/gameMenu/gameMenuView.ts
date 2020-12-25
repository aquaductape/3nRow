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
} from "../utils/index";
import View from "../View";
import menuBtns, { TGameMenuState } from "./menuBtns";
import lobbyView from "../lobby/lobbyView";

type TSections =
  | "aiDifficulty"
  | "start"
  | "goFirst"
  | "multiplayer"
  | "multiplayerChoices";

class GameMenuView extends View {
  data: TPlayer[];
  menuState: TGameMenuState;
  sectionVisible: TSections | null;
  renderInit: boolean;
  vsPlayer: string;
  navigationHistory: string[];
  handlerStartGame: TControlStartGame;
  handlerPlayAgain: TControlPlayAgain;
  handlerSettings: TControlSettings;
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

    const titleMarkupId = titleId ? `id="${titleId}"` : "";
    const titleMarkup = title
      ? `
    <div ${titleMarkupId} class="title" aria-label="AI difficulty">${title}</div> 
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

  private hideMenu() {
    return new Promise((resolve, reject) => {
      const section = this.parentEl.querySelector(".section") as HTMLElement;
      const btnNavigationBack = this.parentEl.querySelector(
        ".btn-navigation-back"
      ) as HTMLElement;
      const backgroundSVG = this.parentEl.querySelector(
        ".background-svg"
      ) as HTMLElement;

      const hideSection = () => {
        hideElement({
          el: section,
          // onStart: (el) => (el.style.display = ""),
          onEnd: (el) => {
            el.classList.add("hidden");
            revealBoard();
          },
        });
      };

      const revealBoard = () => {
        hideElement({
          el: this.parentEl,
          duration: 1100,
          useTransitionEvent: false,
          onStart: (el) => {
            el.classList.add("onExit");
            el.style.background = "none";
            btnNavigationBack.style.display = "none";
          },
          onEnd: (el) => {
            el.style.display = "none";
            el.style.background =
              "radial-gradient(rgb(0 0 0 / 35%), transparent)";
            el.classList.remove("onExit");
            backgroundSVG.style.display = "none";
            lobbyView.hideAndRemoveCountDownMarkup();
            resolve();
          },
        });
      };

      hideSection();
    });
  }

  private changeMenuTheme(theme: "menu" | "lobby") {
    const gameBoard = document.querySelector(".game") as HTMLElement;
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

  renderPlayAgainButton() {
    const btnPlayAgain = this.parentEl.querySelector(
      ".btn-play-again"
    ) as HTMLElement;

    btnPlayAgain.parentElement!.classList.remove("hidden");
    setTimeout(() => {
      showElement({ el: this.parentEl, display: "flex" });
    }, 1000);
  }

  // onBack
  private onBtnNavigationBack() {
    const sectionType = this.navigationHistory.pop()! as TSections;

    this.changeMenuTheme("menu");
    const btnNavigationBack = this.parentEl.querySelector(
      ".btn-navigation-back"
    ) as HTMLElement;

    if (!this.navigationHistory.length) {
      btnNavigationBack.classList.add("hidden");
    }

    lobbyView.hideAndRemoveCountDownMarkup();
    this.transtionToNextGeneralSection({
      type: "section",
      backBtnActivated: true,
      replaceWith: this.menuMarkup({ sectionType }),
    });
  }

  // transitionAnimation
  private transtionToNextGeneralSection({
    type,
    replaceWith,
    backBtnActivated,
    clicked = false,
  }: {
    type: "section" | "lobby";
    replaceWith: (() => void) | string;
    backBtnActivated: boolean;
    clicked?: boolean;
  }) {
    const sectionEl = this.parentEl.querySelector(".section") as HTMLElement;
    hideElement({
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

        showElement({
          el,
          onEnd: (el) => {
            el.style.display = "";
            if (type === "lobby") return;

            const focusBtn = this.parentEl.querySelector(
              '[data-focus="true"]'
            ) as HTMLElement;

            if (backBtnActivated) return;

            // issue in IOS, the focus bg shows on tap
            focusBtn.focus();
            if (!clicked) focusBtn.classList.add("noFocusClick");
          },
        });
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
    const btnNavigationBack = this.parentEl.querySelector(
      ".btn-navigation-back"
    ) as HTMLElement;

    if (currentSection) this.navigationHistory.push(currentSection);
    if (this.navigationHistory.length) {
      btnNavigationBack.classList.remove("hidden");
    }

    this.transtionToNextGeneralSection({
      type: "section",
      backBtnActivated: false,
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
          backBtnActivated: false,
          clicked: true,
          replaceWith: () => {
            const players = this.data;

            lobbyView.render({
              type: lobbyType,
              currentPlayer: players[0],
              players,
              preGameType: "connect-server",
            });
            this.changeMenuTheme("lobby");
          },
        });
      }

      if (playAgainst === "human") {
        this.startGameAndHideMenu({ firstMovePlayer: playerId, ai: false });
        return;
      }

      if (playAgainst === "ai") {
        this.startGameAndHideMenu({ firstMovePlayer: playerId, ai: true });
        return;
      }

      if (playAgainst === "again") {
        this.hideMenu();
        this.handlerPlayAgain();
        return;
      }
    });
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
