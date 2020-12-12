import { TControlPlayAgain, TControlStartGame } from "../../controllers/menu";
import { TControlSettings } from "../../controllers/settings";
import { TPlayer } from "../../model/state";
import { shapes, svg } from "../constants/constants";
import gameContainerView from "../gameContainer/gameContainerView";
import {
  convertObjPropsToHTMLAttr,
  createHTMLFromString,
  hideElement,
  showElement,
} from "../utils/index";
import View from "../View";

// vs Friend
// Online
type TSections = "aiDifficulty" | "start" | "goFirst";
type TBtn = {
  id?: string;
  content: string;
  dataAttributes: {
    [key: string]: string;
  };
  aria: {
    [key: string]: string;
  };
  classNames: string[];
};
type TMenu = {
  titleId?: string;
  title: string | null;
  listBtns: TBtn[];
  btn?: string;
};

type TGameMenuState = {
  start: TMenu;
  aiDifficulty: TMenu;
  goFirst: TMenu;
  // human: TBtn[];
};
class GameMenuView extends View {
  data: TPlayer[];
  menuState: TGameMenuState;
  sectionVisible: TSections | null;
  renderInit: boolean;
  vsPlayer: string;
  constructor() {
    super({ root: "#game-menu" });
    this.data = [] as TPlayer[];

    this.sectionVisible = "start";
    this.renderInit = true;
    this.vsPlayer = "ai";
    this.menuState = {
      start: {
        title: "Play Against",
        listBtns: [
          {
            content: "Computer",
            aria: {
              "aria-label": "Play against Computer",
            },
            dataAttributes: { focus: "true", transitionTo: "aiDifficulty" },
            classNames: ["btn", "btn-primary", "btn-pick"],
          },
          {
            content: "Human",
            aria: {
              "aria-label": "Play against Human",
            },
            dataAttributes: {
              transitionTo: "goFirst",
              vs: "human",
            },
            classNames: ["btn", "btn-primary", "btn-pick"],
          },
        ],
      },
      aiDifficulty: {
        titleId: "ai-difficulty",
        title: "Difficulty",
        listBtns: [
          {
            content: "Medium",
            aria: {
              "aria-describedby": "ai-difficulty",
            },
            dataAttributes: {
              focus: "true",
              difficulty: "MEDIUM",
              transitionTo: "goFirst",
              vs: "ai",
            },
            classNames: ["btn", "btn-primary", "btn-pick"],
          },
          {
            content: "Hard",
            aria: {
              "aria-describedby": "ai-difficulty",
            },
            dataAttributes: {
              difficulty: "HARD",
              transitionTo: "goFirst",
              vs: "ai",
            },
            classNames: ["btn", "btn-primary", "btn-pick"],
          },
          {
            content: "Cheater",
            aria: {
              "aria-describedby": "ai-difficulty",
              "aria-label":
                "Cheater: computer sometimes takes several cells per turn",
            },
            dataAttributes: {
              difficulty: "CHEATER",
              transitionTo: "goFirst",
              vs: "ai",
            },
            classNames: ["btn", "btn-primary", "btn-pick"],
          },
        ],
      },
      goFirst: {
        title: "Who Goes First?",
        listBtns: [
          {
            id: "P1",
            content: "",
            aria: {
              "aria-label": "You go First",
            },
            dataAttributes: {
              playerId: "P1",
              playAgainst: "ai",
              focus: "true",
              shape: "cross",
            },
            classNames: ["btn", "btn-primary", "btn-pick", "btn-pick-player"],
          },
          {
            id: "P2",
            content: "",
            aria: {
              "aria-label": "Computer goes First",
            },
            dataAttributes: {
              playerId: "P2",
              playAgainst: "ai",
              shape: "circle",
            },
            classNames: ["btn", "btn-primary", "btn-pick", "btn-pick-player"],
          },
        ],
      },
    };
  }

  protected generateMarkup() {
    return `
    <div class="menu">
      <div class="section">
      ${this.menuMarkup({ sectionType: "start" })}
      </div>
      ${this.playAgainMarkup()}
    </div>
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
    const { titleId, listBtns: btns, title } = this.menuState[sectionType];
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
    const sections = this.parentEl.querySelectorAll(
      ".section"
    ) as NodeListOf<HTMLElement>;

    hideElement({
      el: this.parentEl,
      transition: "900ms",
      onEnd: (el) => {
        el.style.display = "none";
        el.style.background = "radial-gradient(rgb(0 0 0 / 35%), transparent)";
        sections.forEach((section) => section.classList.add("hidden"));
      },
    });
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

  private transitionToNextSection({
    sectionType,
    clicked,
  }: {
    sectionType: TSections;
    clicked: boolean;
  }) {
    const sectionEl = this.parentEl.querySelector(".section") as HTMLElement;

    hideElement({
      el: sectionEl,
      onEnd: (el) => {
        el.style.display = "none";
        this.clearChildren(sectionEl);
        sectionEl.innerHTML = this.menuMarkup({ sectionType });
        gameContainerView.scaleElementsToProportionToBoard({
          type: "menuBtns",
        });

        showElement({
          el,
          onEnd: (el) => {
            const focusBtn = this.parentEl.querySelector(
              '[data-focus="true"]'
            ) as HTMLElement;

            focusBtn.focus();
            el.style.display = "";
            if (!clicked) focusBtn.classList.add("noFocusClick");
          },
        });
      },
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
    this.parentEl.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      const btn = target.closest(".btn") as HTMLElement;
      let clicked = true;
      if (e.detail === 0) clicked = false;
      if (!btn) return;
      const playAgainst = btn.dataset.playAgainst;
      const playerId = btn.dataset.playerId!;
      const difficulty = btn.dataset.difficulty;
      const transitionTo = btn.dataset.transitionTo as TSections;
      const vs = btn.dataset.vs!;

      if (difficulty) {
        handlerSettings({
          type: "aiEnabled",
          value: true,
        });
        handlerSettings({
          type: "aiDifficulty",
          value: difficulty,
        });
      }

      if (vs) {
        this.vsPlayer = vs;
        if (vs === "human") {
          handlerSettings({
            type: "aiEnabled",
            value: false,
          });
        }
        this.updatePlayersMark(this.data);
      }

      if (transitionTo) {
        this.transitionToNextSection({ sectionType: transitionTo, clicked });

        if (transitionTo === "aiDifficulty") {
          handlerSettings({
            type: "aiEnabled",
            value: true,
          });
        }
        return;
      }

      if (playAgainst === "human") {
        this.hideMenu();
        this.sectionVisible = null;
        handlerSettings({
          type: "aiEnabled",
          value: false,
        });
        handlerStartGame({ firstMovePlayer: playerId, ai: false });
        return;
      }

      if (playAgainst === "ai") {
        this.hideMenu();
        this.sectionVisible = null;
        handlerSettings({
          type: "aiEnabled",
          value: true,
        });
        handlerStartGame({ firstMovePlayer: playerId, ai: true, difficulty });
        return;
      }

      if (playAgainst === "again") {
        this.hideMenu();
        handlerPlayAgain();
        return;
      }
    });
  }

  render(data: TPlayer[]) {
    this.data = data;
    this.clear();
    this.parentEl.insertAdjacentHTML("afterbegin", this.generateMarkup());
    this.updatePlayersMark(data);
    this.renderInit = false;
  }
}

export default new GameMenuView();
