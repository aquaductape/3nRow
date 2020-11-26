import onFocusOut from "../../lib/onFocusOut/onFocusOut";
import { TState } from "../../model/state";
import { svg } from "../constants/constants";
import View from "../View";

class MenuView extends View {
  data: TState;
  menuBtn: HTMLElement;
  menuDropdown: HTMLElement;
  isOpen: boolean;
  constructor() {
    super({ root: "#menu" });
    this.data = {} as TState;
    this.menuBtn = {} as HTMLElement;
    this.menuDropdown = {} as HTMLElement;
    this.isOpen = false;
  }

  protected initEventListeners() {
    this.parentEl.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      const menuBtn = target.closest(".menu-btn") as HTMLElement;
      const aiRadio = target.closest(".ai-radio") as HTMLElement;

      if (menuBtn) {
        onFocusOut({
          button: menuBtn,
          run: this.openDropdown.bind(this),
          onExit: this.closeDropdown.bind(this),
          allow: [".menu-dropdown"],
        });
        return;
      }

      if (aiRadio) {
        const difficulty = aiRadio.dataset.difficulty;
        console.log(difficulty);
      }
    });
  }

  initQuerySelectors() {
    this.menuBtn = this.parentEl.querySelector(".menu-btn") as HTMLElement;
    this.menuDropdown = this.parentEl.querySelector(
      ".menu-dropdown"
    ) as HTMLElement;
  }

  private radioMarkup(value: string) {
    const valueUpperCase = value.toUpperCase();
    const valueLowerCase = value.toLowerCase();
    const valueCapitalize =
      value[0].toUpperCase() + value.slice(1).toLowerCase();
    const checked = valueUpperCase === "HARD" ? "checked" : "";
    const radioIcon = svg.radio;

    return `
    <div class="ai-radio" data-difficulty="${valueUpperCase}">
      <input type="radio" name="ai-difficulty" id="ai-${valueLowerCase}" ${checked} disabled>
      <label for="ai-${valueLowerCase}">
        <span class="radio-icon">${radioIcon}</span>
        <span class="label-content">
          ${valueCapitalize}
        </span> 
      </label>
    </div>
    `;
  }

  private menuMarkup() {
    const {
      game: { difficulties },
    } = this.data;

    return `
    <nav>
      <ul>
        <li>
          <!-- enabled in multiplayer  -->
          <button aria-label="leave game">Leave</button>
          <!-- disabled in multiplayer?  -->
          <button aria-label="restart game">Restart</button>
          <!-- disabled in multiplayer  -->
          <button>Reset Scores</button>
        </li>
        <li>
          <!-- disable ai toggle in multiplayer -->
          <div class="player">
            <h3 class="menu-h3">Player 2 "O"</h3> <!-- should add badge as human or ai?-->
            <div class="toggle-ai" >
              <label for="enable-ai">
                <div>Player 2 as AI</div>
              </label>
              <input id="enable-ai" type="checkbox">
            </div>
            <div class="ai-difficulty disabled">
              <h4 id="ai-difficulty" class="menu-h4">Difficulty</h4>
              <div role="radiogroup" aria-label="Ai Difficulty" class="ai-difficulty-inner">
              ${difficulties
                .map((difficulty) => this.radioMarkup(difficulty))
                .join("")}
              </div>
            </div>
          </div>
        </li>
        <li>
          <!-- disabled in multiplayer -->
          <div class="multiplayer">
            <h3 class="menu-h3">Multiplayer</h3>
            <!-- <div>Must leave to start a new game</div> -->
            <div class="multiplayer-btns">
              <button class="btn btn-secondary btn-multiplayer">Share Private Game</button>
              <button class="btn btn-secondary btn-multiplayer">Join with random Player</button>
            </div>
          </div>
        </li>
      </ul>
    </nav> 
    `;
  }

  protected generateMarkup() {
    return `
    <button class="btn menu-btn" aria-expanded="false">${svg.cevron}</button>
    <div class="menu-dropdown" tabindex="-1">
      ${this.menuMarkup()}
    </div>
    `;
  }

  private openDropdown() {
    const { menuBtn, menuDropdown } = this;
    menuBtn.setAttribute("aria-expanded", "true");
    menuDropdown.classList.add("active");
    menuDropdown.focus();
  }

  private closeDropdown() {
    const { menuBtn, menuDropdown } = this;
    menuBtn.setAttribute("aria-expanded", "false");
    menuDropdown.classList.remove("active");
  }

  private toggleDropdown() {
    if (this.isOpen) {
      this.closeDropdown();
      this.isOpen = false;
      return;
    }
    this.isOpen = true;
    this.openDropdown();
  }

  addHandlers() {}
  handlerAiDifficulty() {}
  handlerToggleAi() {}

  updateSettings(data: TState) {
    const { game, players } = data;

    const ai = players[1];
    const toggleInput = this.parentEl.querySelector("#enable-ai")!;
    const difficultyContainer = this.parentEl.querySelector(
      ".ai-difficulty"
    ) as HTMLElement;
    const inputs = difficultyContainer.querySelectorAll(
      "input"
    ) as NodeListOf<HTMLElement>;

    if (ai.isAI) {
      inputs.forEach((input) => {
        input.removeAttribute("checked");
        input.removeAttribute("disabled");
      });
      const radioEl = this.parentEl.querySelector(
        `[data-difficulty="${ai.difficulty}"]`
      )!;
      const radioInput = radioEl.querySelector("input")!;

      difficultyContainer.classList.remove("disabled");
      radioInput.setAttribute("checked", "true");
      toggleInput.setAttribute("checked", "true");
      return;
    }

    difficultyContainer.classList.add("disabled");
    // toggleInput.removeAttribute("checked");
  }
}

export default new MenuView();
