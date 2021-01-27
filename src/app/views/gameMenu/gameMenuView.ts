import { TControlPlayAgain, TControlStartGame } from "../../controllers/menu";
import { TControlSettings } from "../../controllers/settings";
import { TPlayer } from "../../model/state";
import { svg } from "../constants/constants";
import gameContainerView from "../gameContainer/gameContainerView";
import { TLobbyType } from "../lobby/lobbyView";
import {
  clickEventFiredByKeyboard,
  convertObjPropsToHTMLAttr,
  createHTMLFromString,
} from "../utils/index";
import View from "../View";
import menuBtns, { TGameMenuState } from "./menuBtns";
import lobbyView from "../lobby/lobbyView";
import svgDefsView from "../svg/svgDefsView";
import { hideElement, showElement } from "../utils/animation";
import { TJoinBy } from "../lobby/preGameView";

type TSections = keyof TGameMenuState;
type TData = {
  players: TPlayer[];
};

class GameMenuView extends View {
  protected data: TData;
  private menuState: TGameMenuState;
  private currentSection: TSections | null;
  private renderInit: boolean;
  private vsPlayer: string;
  private navigationHistory: TSections[];
  private handlerStartGame: TControlStartGame;
  private handlerPlayAgain: TControlPlayAgain;
  private handlerSettings: TControlSettings;
  constructor() {
    super({ root: "#game-menu" });
    this.data = {
      players: [],
    };

    this.currentSection = "start";
    this.renderInit = true;
    this.vsPlayer = "ai";
    this.navigationHistory = [];
    this.menuState = menuBtns;
    this.handlerStartGame = () => {};
    this.handlerPlayAgain = () => {};
    this.handlerSettings = () => {};
  }

  markupDidGenerate() {
    this.updatePlayersMark(this.data.players);
    this.renderInit = false;

    this.parentEl.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      const btn = target.closest(".btn") as HTMLElement;
      let clicked = true;
      if (e.detail === 0) clicked = false;
      if (!btn) return;
      const triggeredByClick = !clickEventFiredByKeyboard(e);
      const navigationBtnBack = btn.dataset.navigationBack;
      const playAgainst = btn.dataset.playAgainst;
      const playAgain = btn.dataset.playAgain;
      const playerId = btn.dataset.playerId!;
      const difficulty = btn.dataset.difficulty;
      const transitionTo = btn.dataset.transitionTo as TSections;
      const currentSection = btn.dataset.section! as TSections;
      const lobbyType = btn.dataset.lobbyType as TLobbyType;
      const joinBy = btn.dataset.joinBy as TJoinBy;
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
        this.updatePlayersMark(this.data.players);
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
            const { players } = this.data;

            lobbyView.render({
              type: lobbyType,
              joinBy,
              mainPlayer: players[0],
              firstPlayer: players[0],
              players,
            });

            this.changeMenuTheme("lobby");
          },
        });
      }

      if (playAgain === "true") {
        this.playAgainAndHideMenu({ triggeredByClick });
        return;
      }

      if (playAgainst === "human") {
        this.startGameAndHideMenu({
          firstMovePlayer: playerId,
          ai: false,
          triggeredByClick,
        });
        return;
      }

      if (playAgainst === "ai") {
        this.startGameAndHideMenu({
          firstMovePlayer: playerId,
          ai: true,
          triggeredByClick,
        });
        return;
      }
    });
  }

  protected generateMarkup() {
    return `
    <div class="menu">
    ${this.backgroundSVGMarkup()}
    ${this.navigationBackMarkup()}
      <div class="section">
      ${this.menuMarkup({ sectionType: "start" })}
      </div>
    </div>
    `;
  }

  private navigationBackMarkup() {
    return `
    <button class="btn btn-navigation-back hidden" data-navigation-back="true" aria-label="go back to previous menu selection">${svg.navigationArrow}</button>
    `;
  }

  private backgroundSVGMarkup() {
    return `
    <div class="background-svg">${svg.menuBg}</div>
    `;
  }

  private menuMarkup({ sectionType }: { sectionType: TSections }) {
    const { titleId, listBtns: btns, title, section } = this.menuState[
      sectionType
    ];
    this.currentSection = sectionType;
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
    <div ${titleMarkupId} class="menu-title" ${ariaLabel}>${title}</div> 
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

  private revealGameOverMenu() {
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

    gameContainerView.scaleElementsToProportionToBoard({
      selectors: [
        "gameMenu",
        "gameMenuTitle",
        "gameOverPlayerResult",
        "gameOverPlayerShape",
      ],
    });

    const showSection = () => {
      showElement({
        el: section,
        onStart: (el) => {
          el.classList.remove("hidden");
          el.style.transition = "opacity 200ms";
          this.reflow();
          el.style.opacity = "1";
        },
      });
    };

    setTimeout(() => {
      showSection();
    }, revealBoardTimeout);
  }

  private async hideMenu() {
    const section = this.parentEl.querySelector(".section") as HTMLElement;

    // hide section
    await hideElement({
      el: section,
      // onStart: (el) => (el.style.display = ""),
      onEnd: (el) => {
        el.style.display = "";
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
        this.hideBtnNavigationBack();
      },
      onEnd: (el) => {
        el.style.display = "none";
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
      currentSection: sectionVisible,
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
    this.data.players = data;
    const players = data;

    players.forEach((player) => this.updatePlayerMark(player));
  }

  renderGameOverMenu({
    declare,
    player,
    tie,
  }: {
    tie: boolean;
    declare: "winner" | "loser";
    player: TPlayer;
  }) {
    this.menuState.playAgain.title = this.gameOverMenuMarkup({
      declare,
      player,
      tie,
    });
    this.revealGameOverMenu();
  }

  private gameOverMenuMarkup({
    declare,
    player,
    tie,
  }: {
    tie: boolean;
    declare: "winner" | "loser";
    player?: TPlayer;
  }) {
    const classMonochrome = declare === "loser" ? "monochrome" : "";
    let declareMessage = declare === "winner" ? "Victory!" : "Defeat!";
    let playerShapeMarkup = player
      ? `<div class="player-shape ${classMonochrome}" aria-hidden="true">${player.getSvgShape()}</div>`
      : "";

    if (tie) {
      declareMessage = "Tie!";
      playerShapeMarkup = "";
    }

    return `
      <div class="game-over-title">
        ${playerShapeMarkup}
        <div class="player-result">${declareMessage}</div>
      </div>
    `;
  }

  // onBack
  private onBtnNavigationBack() {
    const sectionType = this.navigationHistory.pop()! as TSections;

    this.changeMenuTheme("menu");

    if (!this.navigationHistory.length) {
      this.hideBtnNavigationBack();
    }

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
      return;
    }

    await hideElement({
      el: sectionEl,
      displayNone: true,
      onEnd: (el) => {
        this.clearChildren(el);

        if (typeof replaceWith === "string") el.innerHTML = replaceWith;
        if (typeof replaceWith === "function") replaceWith();
        if (type === "section") {
          gameContainerView.scaleElementsToProportionToBoard({
            selectors: [
              "gameMenuBtns",
              "gameMenuTitle",
              "gameMenuBtnPickPlayer",
            ],
          });
        }
      },
    });

    await showElement({
      el: sectionEl,
      removeDisplayNone: true,
      onEnd: () => {
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
    currentSection: TSections;
    clicked: boolean;
  }) {
    this.setNavigationHistory({ currentSection, nextSection: sectionType });

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

  private setNavigationHistory({
    currentSection,
    nextSection,
  }: {
    currentSection: TSections;
    nextSection: TSections;
  }) {
    if (!currentSection) return;

    if (nextSection === "start") {
      // if from single player clear history
      // if from multiplayer set last item in history to lobbyy
      this.navigationHistory = [];
      return;
    }

    const sectionIndex = this.navigationHistory.findIndex(
      (section) => currentSection === section
    );
    const alreadyAdded = sectionIndex > -1;

    if (!alreadyAdded) {
      this.navigationHistory.push(currentSection);
      return;
    }

    this.navigationHistory.splice(sectionIndex);
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
    triggeredByClick = true,
  }: {
    firstMovePlayer: string;
    ai?: boolean;
    difficulty?: string;
    triggeredByClick?: boolean;
  }) {
    this.changeMenuTheme("menu");
    // remove pregame here instead of inside handlerStartGame
    await this.hideMenu();

    if (ai) {
      this.handlerSettings({
        type: "aiEnabled",
        value: true,
      });
    }
    this.handlerStartGame({
      firstMovePlayer,
      ai,
      difficulty,
      triggeredByClick,
    });
  }

  playAgainAndHideMenu({
    triggeredByClick = true,
  }: { triggeredByClick?: boolean } = {}) {
    // remove pregame here instead of inside handlerStartGame
    this.hideMenu();

    this.handlerPlayAgain({ triggeredByClick });
  }

  render(data: TData) {
    super.render(data);
  }
}

export default new GameMenuView();
