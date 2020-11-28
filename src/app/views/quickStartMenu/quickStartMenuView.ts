import {
  TControlPlayAgain,
  TControlStartGame,
} from "../../controller/controller";
import { TPlayer } from "../../model/state";
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
      ${this.startMenu()}
      ${this.aiMenu()}
    </div>
    `;
  }

  private hideMenu() {
    hideElement({
      el: this.parentEl,
      transition: "900ms",
      onEnd: (el) => {
        el.style.display = "none";
      },
    });
  }

  private aiMenu() {
    return `
    <div class="section section-slide-2 hidden">
      <div class="title">Difficulty</div>
      <div class="menu-buttons">
        <button class="btn btn-primary btn-pick" data-play="ai" data-difficulty="MEDIUM">Medium</button>
        <button class="btn btn-primary btn-pick" data-play="ai" data-difficulty="HARD">Hard</button>
        <button class="btn btn-primary btn-pick" data-play="ai" data-difficulty="CHEATER">Cheater</button>
      </div>
    </div>
    `;
  }

  private startMenu() {
    return `
    <div class="section section-slide-1">
      <p aria-labelledby="Welcome to 3n-row, a Tic Tac Toe game. To play, you and your opponent take turns to fill one cell on a board that has 3 rows and 3 columns,. To win, you have to fill 3 cells consecutively, either horizontally, vertically or diagionally"
        class="game-start-info">Play Against</p>
      <div class="tutorial">
        <!-- 3 images -->
        <!-- image 1 alt="On turn 2. Player 1 has filled 1 cell on row 1 and column 1. Player 2 has filled 1 cell ect ect" -->
      </div>
      <div class="menu-buttons">
        <button class="btn btn-primary btn-pick" data-transition-to="ai">AI</button>
        <button class="btn btn-primary btn-pick" data-play="human">Human</button>
      </div>
    </div>
    `;
  }

  private transitionToAiMenu() {
    const sectionSlide1 = this.parentEl.querySelector(
      ".section-slide-1"
    ) as HTMLElement;
    const sectionSlide2 = this.parentEl.querySelector(
      ".section-slide-2"
    ) as HTMLElement;

    hideElement({
      el: sectionSlide1,
      transition: "300ms",
      onEnd: (el) => {
        el.style.display = "none";
        showElement({ el: sectionSlide2, transition: "1300ms" });
      },
    });
  }

  renderPlayAgainButton() {
    const markup = `
    <div class="menu play-again">
      <button class="btn btn-primary btn-play-again" data-play="again">Play Again?</button>
  </div>
    `;

    this.update(markup);
    this.parentEl.style.display = "flex";
    this.parentEl.classList.add("play-again");
    // return markup;
  }

  addHandlers({
    handlerPlayAgain,
    handlerStartGame,
  }: {
    handlerStartGame: TControlStartGame;
    handlerPlayAgain: TControlPlayAgain;
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
        // this.hideMenu();
        this.transitionToAiMenu();
        // handlerStartGame({ id, ai: true });

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