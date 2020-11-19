import {
  TControlPlayAgain,
  TControlStartGame,
} from "../../controller/controller";
import { TPlayer } from "../../model/state";
import View from "../View";

class MenuView extends View {
  data: TPlayer[];
  constructor() {
    super({ root: ".menu-container" });
    this.data = [] as TPlayer[];
  }

  protected initQuerySelectors() {}

  protected generateMarkup() {
    return this.startMenu();
  }

  private hideMenu() {
    this.parentEl.style.display = "none";
  }

  private startMenu() {
    return `
    <div class="menu">
    <p aria-labelledby="Welcome to 3n-row, a Tic Tac Toe game. To play, you and your opponent take turns to fill one cell on a board that has 3 rows and 3 columns,. To win, you have to fill 3 cells consecutively, either horizontally, vertically or diagionally"
      class="game-start-info">Play Against</p>
    <div class="tutorial">
      <!-- 3 images -->
      <!-- image 1 alt="On turn 2. Player 1 has filled 1 cell on row 1 and column 1. Player 2 has filled 1 cell ect ect" -->
    </div>
    <div class="menu-buttons">
      <button class="btn-ai btn btn-primary btn-pick ">AI</button>
      <button class="btn-human btn btn-primary btn-pick">Friend</button>
    </div>
  </div>
    `;
  }

  renderPlayAgainButton() {
    const markup = `
    <div class="menu play-again">
      <button class="btn btn-primary btn-play-again">Play Again?</button>
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
      if (target.closest(".btn-ai")) {
        this.hideMenu();
        handlerStartGame({ id, ai: true });
        return;
      }

      if (target.closest(".btn-human")) {
        this.hideMenu();
        handlerStartGame({ id, ai: false });
        return;
      }

      if (target.closest(".btn-play-again")) {
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

export default new MenuView();
