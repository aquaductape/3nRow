import { TMoveAi } from "../../controllers/move";
import { TControlSettings } from "../../controllers/settings";
import onFocusOut from "../../lib/onFocusOut/onFocusOut";
import { TPlayer, TState } from "../../model/state";
import { svg } from "../constants/constants";
import overlayView from "../overlay/overlayView";
import { hideElement, showElement } from "../utils/animation";
import View from "../View";
import matchMediaView from "../windowEvents/matchMediaView";
import { settingsTree } from "./keyboardInteraction";
import { buildSettings } from "./settingsData";

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

  protected markupDidGenerate() {
    this.updateFromLS();

    this.updatePlayerSVGMark(this.data.players[1]);

    this.settingsBtn = this.parentEl.querySelector(
      ".settings-btn"
    ) as HTMLElement;
    this.settingsDropdown = this.parentEl.querySelector(
      ".settings-dropdown"
    ) as HTMLElement;
    this.closeButton = this.parentEl.querySelector(".btn-close") as HTMLElement;

    matchMediaView.subscribe({
      media: "(prefers-reduced-motion: reduce)",
      handler: ({ matches }) => {
        if (localStorage.getItem("(prefers-reduced-motion: reduce)")) return;

        const id = "toggleAnimations";
        const animationToggle = this.parentEl.querySelector(
          `[data-setting-toggle-id="${id}"]`
        ) as HTMLInputElement;

        if (!animationToggle) return;

        animationToggle.checked = !matches;
      },
    });

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
      treeItem.focus();
      e.preventDefault();
      e.stopPropagation();
    });

    // clicking label triggers new click https://stackoverflow.com/a/61878865/8234457
    // it's better to use onchange event on inputs rather than click
    this.parentEl.addEventListener("change", (e) => {
      const target = e.target as HTMLElement;

      const setting = target.closest(
        "[data-setting-input='true']"
      ) as HTMLElement;
      const settingType = setting.dataset.type!;
      const settingValue = setting.dataset.value
        ? setting.dataset.value
        : (setting as HTMLInputElement).checked;
      const settingId = setting.dataset.settingId!;
      const toggleOthersVal = setting.dataset.toggleOthers!;

      if (setting) {
        this.handlerSettings({
          type: settingType as any,
          value: settingValue,
          updatedFromSettingsView: true,
        });
      }

      if (settingType === "animationsEnabled") {
        localStorage.setItem(
          "(prefers-reduced-motion: reduce)",
          `${!settingValue}`
        );
        matchMediaView.fire({
          media: "(prefers-reduced-motion: reduce)",
          matches: !settingValue as boolean,
        });
      }

      if (toggleOthersVal) {
        this.toggleOthers({ settingId, settingValue: settingValue as boolean });
      }
    });

    settingsTree({
      el: this.parentEl.querySelector(".settings-tree") as HTMLElement,
    });
  }

  private updateFromLS() {
    const savedPrefersReducedMotion = localStorage.getItem(
      "(prefers-reduced-motion: reduce)"
    );

    if (savedPrefersReducedMotion) {
      const value = savedPrefersReducedMotion === "true";
      const id = "toggleAnimations";
      const animationToggle = this.parentEl.querySelector(
        `[data-setting-toggle-id="${id}"]`
      ) as HTMLInputElement;

      if (!animationToggle) return;

      animationToggle.checked = !value;
      matchMediaView.fire({
        media: "(prefers-reduced-motion: reduce)",
        matches: value,
      });
    }
  }

  private toggleOthers({
    settingId,
    settingValue,
  }: {
    settingId: string;
    settingValue: boolean;
  }) {
    const settingInputs = Array.from(
      this.parentEl.querySelectorAll(`[data-toggled-by="${settingId}"]`)
    ) as HTMLElement[];

    settingInputs.forEach((settingInput) => {
      // not good, must refactor
      // inputs disabled visually and functionally are differently placed in markup across input types
      if (settingValue) {
        settingInput.removeAttribute("disabled");
        settingInput.classList.remove("disabled");
        return;
      }

      settingInput.setAttribute("disabled", "true");
      settingInput.classList.add("disabled");
    });
  }

  private btnCloseMarkup() {
    return `
    <button data-next-focus="true" class="btn-close" aria-label="close settings dropdown" title="close settings">
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

  protected generateMarkup() {
    return `
    <button class="btn settings-btn" aria-label="open settings" title="open settings">${
      svg.cevron
    }</button>
    <div class="settings-dropdown" style="display: none;" role="dialog" aria-label="settings" aria-hidden="true" tabindex="-1">
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
      removeDisplayNone: true,
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
      displayNone: true,
      onStart: (el) => {
        el.classList.remove("active");
      },
    });
    overlayView.hide();
    window.scrollTo({ top: 0 });

    settingsDropdown.setAttribute("aria-hidden", "true");
    this.handlerMoveAi({ delay: 200 });
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

  updatePlayerSVGMark(player: TPlayer) {
    const shape = player.getSvgShape();
    const svgMark = shape.replace(/filter="url\(#drop-shadow-filter\)"/g, "");
    const svgClass = "mini-svg-mark";
    const query = '[data-setting-id="player2"]';
    const title = this.parentEl.querySelector(`${query} .title`) as HTMLElement;
    const svg = title.querySelector(`.${svgClass}`) as HTMLElement;

    if (!svg) {
      title.innerHTML = `${title.textContent} <span class="${svgClass}">${svgMark}</span>`;
      return;
    }
    svg.innerHTML = svgMark;
  }

  // hard coded
  updateSettings({
    type,
    value,
  }: {
    type: "aiEnabled" | "aiDifficulty" | "firstMove";
    value: string | boolean;
  }) {
    if (typeof value === "boolean") {
      const checkbox = this.parentEl.querySelector(
        `[data-type="${type}"]`
      ) as HTMLInputElement;
      const settingId = checkbox.dataset.settingId!;
      checkbox.checked = value;

      if (type === "aiEnabled") {
        this.toggleOthers({ settingId, settingValue: value });
        return;
      }
      return;
    }

    const radio = this.parentEl.querySelector(
      `[data-type="${type}"][data-value="${value.toLowerCase()}"] input`
    ) as HTMLInputElement;
    radio.checked = true;
  }
}

export default new SettingsView();
