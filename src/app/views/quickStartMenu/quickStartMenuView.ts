import {
  TControlSettings,
  TControlPlayAgain,
  TControlStartGame,
} from "../../controller/controller";
import { TPlayer } from "../../model/state";
import { svg } from "../constants/constants";
import { hideElement, showElement } from "../utils/index";
import View from "../View";

class QuickStartMenuView extends View {
  data: TPlayer[];
  constructor() {
    super({ root: ".quick-start-menu" });
    this.data = [] as TPlayer[];
  }

  protected generateMarkup() {
    return `
    <div class="menu">
      ${this.startMenuMarkup()}
      ${this.aiMenuMarkup()}
      ${this.playAgainMarkup()}
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

  private aiMenuMarkup() {
    return `
    <div class="section section-slide-2 hidden">
      <div id="ai-difficulty" class="title" aria-label="AI difficulty">Difficulty</div>
      <ul class="menu-buttons">
        <li class="menu-item">
          <a 
            class="btn btn-primary btn-pick"
            aria-describedby="ai-difficulty" 
            data-play="ai" 
            data-difficulty="MEDIUM"
            href="javascript:void(0)"
          >
          Medium
          </a>
        </li>
        <li class="menu-item">
          <a 
            class="btn btn-primary btn-pick"
            aria-describedby="ai-difficulty" 
            data-play="ai" 
            data-difficulty="HARD"
            href="javascript:void(0)"
          >
          Hard
          </a>
        </li>
        <li class="menu-item">
          <a 
            class="btn btn-primary btn-pick"
            aria-describedby="ai-difficulty" 
            data-play="ai" 
            data-difficulty="CHEATER"
            href="javascript:void(0)"
          >
          Cheater
          </a>
        </li>
      </ul>
    </div>
    `;
  }

  private buttonLink() {
    const describedby = "ai-difficulty";
    const navigational = true;
    const dataAttribute = navigational ? "data-transition" : "data-play";
    const dataValue = "ai";
    const content = "Medium";
    // href to board cell row 1 column 1 on last
    return `
    
        <a 
        class="btn btn-primary btn-pick"
        aria-describedby="${describedby}" 
        ${dataAttribute}="${dataValue}" 
        data-difficulty="MEDIUM"
        href=""
        >
          Medium
        </a>
    `;
  }

  private startMenuMarkup() {
    return `
    <div class="section section-slide-1" tabindex="-1">
      <p class="game-start-info">Play Against</p>
      <div class="tutorial">
        <!-- 3 images -->
        <!-- image 1 alt="On turn 2. Player 1 has filled 1 cell on row 1 and column 1. Player 2 has filled 1 cell ect ect" -->
      </div>
      <ul class="menu-buttons">
        <li class="menu-item">
          <a 
            class="btn btn-primary btn-pick" 
            data-transition-to="ai" 
            aria-label="Play against ai"
            href="javascript:void(0)"
          >
          AI
          </a>
        </li>
        <li class="menu-item">
          <a 
            class="btn btn-primary btn-pick" 
            data-play="human" 
            aria-label="Play against human"
            href="javascript:void(0)"
          >
          Human
          </a>
        </li>
      </ul>
    </div>
    `;
  }

  private transitionToAiMenu(handlerMenuSettings: TControlSettings) {
    const sectionSlide1 = this.parentEl.querySelector(
      ".section-slide-1"
    ) as HTMLElement;
    const sectionSlide2 = this.parentEl.querySelector(
      ".section-slide-2"
    ) as HTMLElement;

    handlerMenuSettings({ ai: { enabled: true } });

    // *sigh* callback hell
    hideElement({
      el: sectionSlide1,
      transition: "300ms",
      onEnd: (el) => {
        el.style.display = "none";
        showElement({
          el: sectionSlide2,
          transition: "300ms",
          onEnd: (el) => {
            const firstItem = el.querySelector(".btn") as HTMLElement;
            el.classList.remove("hidden");
            el.style.display = "";
          },
        });
      },
    });
  }

  private playAgainMarkup() {
    return `
      <div class="section hidden">
        <button class="btn btn-primary btn-play-again" aria-label="play again" data-play="again">
          ${svg.playAgainCircleBtn}
        </button>
      </div>
    `;
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

  addHandlers({
    handlerPlayAgain,
    handlerStartGame,
    handlerMenuSettings,
  }: {
    handlerStartGame: TControlStartGame;
    handlerPlayAgain: TControlPlayAgain;
    handlerMenuSettings: TControlSettings;
  }) {
    const players = this.data;
    const { id } = players[1];

    this.parentEl.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      const btn = target.closest(".btn") as HTMLElement;
      if (!btn) return;
      const play = btn.dataset.play;
      const difficulty = btn.dataset.difficulty;
      const transitionTo = btn.dataset.transitionTo;

      if (transitionTo === "ai") {
        this.transitionToAiMenu(handlerMenuSettings);
        return;
      }

      if (play === "human") {
        this.hideMenu();
        handlerStartGame({ id, ai: false });
        return;
      }

      if (play === "ai") {
        this.hideMenu();
        handlerStartGame({ id, ai: true, difficulty });
        return;
      }

      if (play === "again") {
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
    this.initQuerySelectors();
  }
}

export default new QuickStartMenuView();
