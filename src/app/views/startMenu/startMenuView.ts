import { TControlStartGame } from "../../controller/controller";
import { TPlayer } from "../../model/state";
import View from "../View";

class StartMenuView extends View {
  data: TPlayer[];
  constructor() {
    super({ root: ".start-menu-container" });
    this.data = [] as TPlayer[];
  }

  protected initQuerySelectors() {}

  protected generateMarkup() {
    return `
    <div class="start-menu">
      <h1>3nRow</h1>
      <p aria-labelledby="Welcome to 3n-row, a Tic Tac Toe game. To play, you and your opponent take turns to fill one cell on a board that has 3 rows and 3 columns,. To win, you have to fill 3 cells consecutively, either horizontally, vertically or diagionally"
        class="game-start-info">Play Against</p>
      <div class="tutorial">
        <!-- 3 images -->
        <!-- image 1 alt="On turn 2. Player 1 has filled 1 cell on row 1 and column 1. Player 2 has filled 1 cell ect ect" -->
      </div>
      <button class="btn-ai btn btn-primary btn-pick ">AI</button>
      <button class="btn-human btn btn-primary btn-pick">Friend</button>
    </div>
    `;
  }

  private startGame() {
    this.parentEl.style.display = "none";
  }

  addHandlerStartGame(handler: TControlStartGame) {
    const players = this.data;
    const { id } = players[1];

    this.parentEl.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      if (target.closest(".btn-ai")) {
        this.startGame();
        handler({ id, ai: true });
        return;
      }

      if (target.closest(".btn-human")) {
        this.startGame();
        handler({ id, ai: false });
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

export default new StartMenuView();
