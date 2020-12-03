import View from "../View";

class SkipToGameMenu extends View {
  gameMenuExist: boolean;
  btn: HTMLElement;

  constructor() {
    super({ root: "#skip-to-start-game" });
    this.gameMenuExist = true;
    this.btn = {} as HTMLElement;
  }

  protected generateMarkup() {
    return `
    <a class="btn" href="javascript:void(0)">Skip to Game Menu</a> 
    `;
  }

  protected initQuerySelectors() {
    this.btn = this.parentEl.querySelector(".btn") as HTMLElement;
  }

  protected initEventListeners() {
    this.btn.addEventListener("click", () => {
      const btnAi = document.querySelector(
        ".quick-start-menu [data-id='ai']"
      ) as HTMLElement;
      const boardCell = document.querySelector(
        '.board .cell[tabindex="0"]'
      ) as HTMLElement;
      if (this.gameMenuExist) {
        btnAi.focus();
        return;
      }
      boardCell.focus();
    });
  }

  updateSkipBtnContent() {
    this.gameMenuExist = false;
    this.btn.textContent = "Skip to Game Board";
  }
}

export default new SkipToGameMenu();
