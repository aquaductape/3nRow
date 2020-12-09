import { TControlSettings, TMoveAi } from "../../controller/controller";
import onFocusOut from "../../lib/onFocusOut/onFocusOut";
import { TState } from "../../model/state";
import { svg } from "../constants/constants";
import overlayView from "../overlay/overlayView";
import { hideElement, showElement } from "../utils/index";
import View from "../View";
import { focusTree } from "./keyboardInteraction";
import { buildSettings } from "./settingsData";

// Common
//  restartBtn resetScoreBtn
// Gameplay
//  toggle player 2 as ai
//  choose ai difficulty
//  choose first move
// UI
//  toggle enable animations
//  toggle dark mode
// About
//  name
//  about
//  github

class SettingsView extends View {
  protected data: TState;
  private settingsBtn: HTMLElement;
  private settingsDropdown: HTMLElement;
  private closeButton: HTMLElement;
  private isOpen: boolean;
  private handlerSettings: TControlSettings;
  private handlerMoveAi: TMoveAi;

  constructor() {
    super({ root: "#settings" });
    this.data = {} as TState;
    this.settingsBtn = {} as HTMLElement;
    this.settingsDropdown = {} as HTMLElement;
    this.closeButton = {} as HTMLElement;
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

    this.closeButton.addEventListener("keydown", (e) => {
      if (e.key !== "Tab") return;
      const treeItem = this.parentEl.querySelector(
        '.settings-tree [tabindex="0"]'
      ) as HTMLElement;
      // debugger;
      treeItem.focus();
      e.preventDefault();
      e.stopPropagation();
    });
    this.settingsDropdown.addEventListener("keydown", (e) => {
      if (e.key !== "Tab") return;
      if (document.activeElement !== this.settingsDropdown) return;

      const treeItem = this.parentEl.querySelector(
        '.settings-tree [tabindex="0"]'
      ) as HTMLElement;
      // debugger;
      treeItem.focus();
      e.preventDefault();
      e.stopPropagation();
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

    focusTree({
      el: this.parentEl.querySelector(".settings-tree") as HTMLElement,
    });
  }

  protected initQuerySelectors() {
    this.settingsBtn = this.parentEl.querySelector(
      ".settings-btn"
    ) as HTMLElement;
    this.settingsDropdown = this.parentEl.querySelector(
      ".settings-dropdown"
    ) as HTMLElement;
    this.closeButton = this.parentEl.querySelector(".btn-close") as HTMLElement;
  }

  private btnCloseMarkup() {
    return `
    <button data-next-focus="true" class="btn-close" aria-label="close settings dropdown">
      ${svg.close}
    </button>
    `;
  }

  private settingsMarkup() {
    const {
      game: { difficulties },
    } = this.data;

    return `
    <div class="settings-tree" role="tree" aria-label="Settings">
    ${buildSettings()}
    </div>
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
    <button class="btn settings-btn" aria-label="open settings" >${
      svg.cevron
    }</button>
    <div class="settings-dropdown" role="dialog" aria-hidden="true" tabindex="-1">
      <div class="settings-inner">
        ${this.settingsMarkup()}
        ${this.btnCloseMarkup()}
      </div>
    </div>
    `;
  }

  private openDropdown() {
    const { settingsDropdown } = this;

    showElement({
      el: settingsDropdown,
      display: "block",
      onStart: (el) => {
        el.classList.add("active");
      },
    });
    overlayView.show();
    settingsDropdown.setAttribute("aria-hidden", "false");
    settingsDropdown.focus();
  }

  private closeDropdown() {
    const { settingsDropdown } = this;

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

    settingsDropdown.setAttribute("aria-hidden", "true");
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
