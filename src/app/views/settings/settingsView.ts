import { TControlSettings, TMoveAi } from "../../controller/controller";
import onFocusOut from "../../lib/onFocusOut/onFocusOut";
import { TState } from "../../model/state";
import { svg } from "../constants/constants";
import overlayView from "../overlay/overlayView";
import { hideElement, showElement } from "../utils/index";
import View from "../View";

class SettingsView extends View {
  data: TState;
  settingsBtn: HTMLElement;
  settingsDropdown: HTMLElement;
  isOpen: boolean;
  handlerSettings: TControlSettings;
  handlerMoveAi: TMoveAi;

  constructor() {
    super({ root: "#settings" });
    this.data = {} as TState;
    this.settingsBtn = {} as HTMLElement;
    this.settingsDropdown = {} as HTMLElement;
    this.isOpen = false;
    this.handlerSettings = () => {};
    this.handlerMoveAi = () => {};
  }

  protected initEventListeners() {
    this.settingsBtn.addEventListener("click", () => {
      onFocusOut({
        button: this.settingsBtn,
        run: this.openDropdown.bind(this),
        onExit: this.closeDropdown.bind(this),
        allow: [".settings-dropdown"],
        not: [".btn-close"],
      });
    });

    // clicking label triggers new click https://stackoverflow.com/a/61878865/8234457
    // it's better to use onchange event on inputs rather than click
    this.parentEl.addEventListener("change", (e) => {
      const target = e.target as HTMLElement;

      const aiRadio = target.closest(".ai-radio") as HTMLElement;
      const aiEnable = target.closest(".toggle-ai") as HTMLElement;

      if (aiRadio) {
        const difficulty = aiRadio.dataset.difficulty!;
        this.handlerSettings({ ai: { enabled: true, difficulty } });
      }

      if (aiEnable) {
        const checkbox = aiEnable.querySelector("input") as HTMLInputElement;
        this.toggleDisableDifficultyContainer();
        this.handlerSettings({ ai: { enabled: checkbox.checked } });
      }
    });
  }

  initQuerySelectors() {
    this.settingsBtn = this.parentEl.querySelector(
      ".settings-btn"
    ) as HTMLElement;
    this.settingsDropdown = this.parentEl.querySelector(
      ".settings-dropdown"
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

  private quickSettingsMarkup() {
    return `
      <li>
        <!-- enabled in multiplayer  -->
        <button aria-label="leave game">Leave</button>
        <!-- disabled in multiplayer?  -->
        <button aria-label="restart game">Restart</button>
        <!-- disabled in multiplayer  -->
        <button>Reset Scores</button>
      </li>
    `;
  }

  private btnCloseMarkup() {
    return `
    <button class="btn-close" aria-label="close settings dropdown">
      ${svg.close}
    </button>
    `;
  }

  private settingsMarkup() {
    const {
      game: { difficulties },
    } = this.data;

    return `
    <nav>
      <ul>
        <li>
          <!-- disable ai toggle in multiplayer -->
          <div class="player">
            <h3 class="settings-h3">Player 2 "O"</h3> <!-- should add badge as human or ai?-->
            <div class="toggle-ai">
              <label class="toggle-control">
              Set Player 2 as Ai
                <span class="toggle-container">
                  <input id="enable-ai" type="checkbox" >
                  <span class="control"></span>
                </span>
              </label>
            </div>
            <div class="ai-difficulty disabled">
              <h4 class="settings-h4">Difficulty</h4>
              <div role="radiogroup" aria-label="Ai Difficulty" class="ai-difficulty-inner">
              ${difficulties
                .map((difficulty) => this.radioMarkup(difficulty))
                .join("")}
              </div>
            </div>
          </div>
        </li>

      </ul>
      ${this.btnCloseMarkup()}
    </nav> 
    `;
  }
  private multiplayerMarkup() {
    return `
    <li>
    <!-- disabled in multiplayer -->
    <div class="multiplayer">
      <h3 class="settings-h3">Multiplayer</h3>
      <!-- <div>Must leave to start a new game</div> -->
      <div class="multiplayer-btns">
        <button class="btn btn-secondary btn-multiplayer">Share Private Game</button>
        <button class="btn btn-secondary btn-multiplayer">Join with random Player</button>
      </div>
    </div>
  </li> 
    `;
  }

  protected generateMarkup() {
    return `
    <button class="btn settings-btn" aria-label="settings dropdown" aria-expanded="false">${
      svg.cevron
    }</button>
    <div class="settings-dropdown" tabindex="-1">
      ${this.settingsMarkup()}
    </div>
    `;
  }

  private openDropdown() {
    const { settingsBtn, settingsDropdown } = this;
    settingsBtn.setAttribute("aria-expanded", "true");

    showElement({
      el: settingsDropdown,
      display: "block",
      onStart: (el) => {
        el.classList.add("active");
      },
    });
    overlayView.show();
    settingsDropdown.focus();
  }

  private closeDropdown() {
    const { settingsBtn, settingsDropdown } = this;
    settingsBtn.setAttribute("aria-expanded", "false");

    hideElement({
      el: settingsDropdown,
      onStart: (el) => {
        el.classList.remove("active");
      },
      onEnd: (el) => {
        el.style.display = "none";
      },
    });
    overlayView.hide();

    this.handlerMoveAi({ delay: 200 });
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

  addHandlers({
    handlerSettings,
    handlerMoveAi,
  }: {
    handlerSettings: TControlSettings;
    handlerMoveAi: TMoveAi;
  }) {
    this.handlerSettings = handlerSettings;
    this.handlerMoveAi = handlerMoveAi;
  }

  private toggleDisableDifficultyContainer() {
    const difficultyContainer = this.parentEl.querySelector(
      ".ai-difficulty"
    ) as HTMLElement;
    const inputs = difficultyContainer.querySelectorAll(
      "input"
    ) as NodeListOf<HTMLElement>;

    difficultyContainer.classList.toggle("disabled");
    inputs.forEach((input) => {
      input.toggleAttribute("disabled");
    });
  }

  updateAi(data: TState) {
    const { game, players } = data;

    const ai = players[1];
    const toggleInput = this.parentEl.querySelector(
      "#enable-ai"
    ) as HTMLInputElement;
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
      toggleInput.checked = true;
      return;
    }

    difficultyContainer.classList.add("disabled");
    toggleInput.checked = false;
  }
}

export default new SettingsView();
