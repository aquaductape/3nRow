import {
  TControlPlayerColor,
  TControlPlayerShape,
} from "../../controllers/playerOptions";
import { IOS, IOS13, Safari } from "../../lib/onFocusOut/browserInfo";
import onFocusOut from "../../lib/onFocusOut/onFocusOut";
import { TPlayer } from "../../model/state";
import { TSkin } from "../../ts";
import { colorMap, colors, shapes, svg } from "../constants/constants";
import { radioGroup } from "../utils/aria";
import { diagonalLengthOfElement, getOppositePlayer } from "../utils/index";
import View from "../View";
import matchMediaView from "../windowEvents/matchMediaView";
import { animateDropdown } from "./animation";
import { DropdownExpando } from "./dropdownExpando";

export default class DropdownOptionsView extends View {
  protected data: { players: TPlayer[]; currentPlayer: TPlayer };
  private reducedAnimation = false;
  private dropdownTimeout = 0;
  // The Five Wrappers that enables Dropdown circular animation: container > shell > sub-shell > mask > inner
  private maskEl: HTMLElement = {} as HTMLElement;
  private innerEl: HTMLElement = {} as HTMLElement;
  private shellShadow: HTMLElement = {} as HTMLElement;
  private dropdownOptionsEl: HTMLElement = {} as HTMLElement;
  private playerBtnHighlightEl: HTMLElement = {} as HTMLElement;
  private playerBtnGroupEl: HTMLElement = {} as HTMLElement;
  private dropdownBtnEl: HTMLElement = {} as HTMLElement;
  private shapeGroupEl: HTMLElement = {} as HTMLElement;
  private colorGroupEl: HTMLElement = {} as HTMLElement;
  private handlerShape: TControlPlayerShape = () => {};
  private handlerColor: TControlPlayerColor = () => {};
  private onRemoveActiveBtn: Function = () => {};
  private dropdownExpando: DropdownExpando = {} as DropdownExpando;

  constructor({
    root,
    data,
  }: {
    data: { players: TPlayer[]; currentPlayer: TPlayer };
    root: string | HTMLElement;
  }) {
    super({ root });

    this.data = data;

    matchMediaView.subscribe({
      media: "(prefers-reduced-motion: reduce)",
      handler: ({ matches }) => {
        this.reducedAnimation = matches;
      },
    });
  }

  protected markupDidGenerate() {
    const {
      currentPlayer: { id },
    } = this.data;

    this.dropdownOptionsEl = this.parentEl.querySelector(
      ".dropdown-options"
    ) as HTMLElement;
    this.playerBtnHighlightEl = this.parentEl.querySelector(
      `[data-player-id="${id}"]`
    ) as HTMLElement;

    this.dropdownBtnEl = this.parentEl.querySelector(
      ".dropdown-btn"
    ) as HTMLElement;
    this.colorGroupEl = this.parentEl.querySelector(
      ".color-group"
    ) as HTMLElement;
    this.shapeGroupEl = this.parentEl.querySelector(
      ".shape-group"
    ) as HTMLElement;
    this.playerBtnGroupEl = this.parentEl.querySelector(
      ".player-btn-group"
    ) as HTMLElement;
    this.maskEl = this.parentEl.querySelector(
      ".dropdown-options-mask"
    ) as HTMLElement;
    this.innerEl = this.parentEl.querySelector(
      ".dropdown-options-inner"
    ) as HTMLElement;
    this.shellShadow = this.parentEl.querySelector(
      ".shell-shadow"
    ) as HTMLElement;

    this.dropdownExpando = new DropdownExpando({
      id,
      innerEl: this.innerEl,
      maskEl: this.maskEl,
    });

    this.onRadioGroup();

    this.parentEl.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      const disabledItem = target.closest('[data-disabled="true"]');
      if (!disabledItem) return;
      const itemContainer = disabledItem.parentElement as HTMLElement;
      const toolTipContainer = itemContainer.querySelector(
        ".tooltip-container"
      ) as HTMLElement;

      onFocusOut({
        button: itemContainer,
        run: () => {
          toolTipContainer.classList.add("active");
        },
        onExit: () => {
          toolTipContainer.classList.remove("active");
        },
      });
    });
  }

  private generateBtnHighlight() {
    const {
      currentPlayer: { id },
    } = this.data;
    return `
      <div class="fake-player-btn ${id}-player-btn-highlight"></div>
    `;
  }

  private toolTipInnerMarkup({ msg }: { msg: string }) {
    return `
      <div class="arrow-up"></div>
      <div class="tooltip" role="tooltip">${msg}</div>
    `;
  }

  private toolTipMarkup({
    enabled,
    player,
    type,
  }: {
    type: "color" | "shape";
    enabled: boolean;
    player: TPlayer;
  }) {
    const msg = this.radioToolTipMessage({ type, player });
    const innerTooltip = this.toolTipInnerMarkup({ msg });
    return `
    <div class="tooltip-container ${enabled ? "ready" : ""}">
      ${enabled ? innerTooltip : ""}
    </div>
    `;
  }

  private listItem({ item, type }: { item: string; type: TSkin }) {
    const { currentPlayer, players } = this.data;
    const {
      svgShapes: shapes,
      color: playerColor,
      shape: playerShape,
    } = currentPlayer;

    const oppositePlayer = getOppositePlayer({ id: currentPlayer.id, players });

    if (type === "color") {
      const [primaryColor, secondaryColor] = item.split(",");
      const [primaryColorHex, secondaryColorHex] = colorMap[item];
      const tabindex = playerColor === item ? "0" : "-1";
      const selected = playerColor === item ? "true" : "false";
      // already selected by other player
      const disabled = oppositePlayer.color === item;
      const toolTip = this.toolTipMarkup({
        type,
        player: oppositePlayer,
        enabled: disabled,
      });
      const classBase = "color-item";
      const classSelected = playerColor === item ? "color-item--selected" : "";
      const classDisabled = disabled ? "disabled" : "";
      const classItem = `${classBase} ${classSelected} ${classDisabled}`;
      const classItemInner = `${classBase}-inner`;
      const classItemBg = `${classBase}-bg`;

      return `
      <div class="${classBase}-container">
        <div 
          role="radio"
          tabindex="${tabindex}"
          class="${classItem}"
          data-selected="${selected}"
          data-disabled="${disabled}"
          data-color="${item}"
          aria-checked="${selected}"
          aria-disabled="${disabled}"
          aria-hidden="${disabled}"
          aria-label="choose gradient color of shape. Primary Color ${primaryColor}, Secondary Color ${secondaryColor}"
        >
          <div class="${classItemBg}">
            <div class="radio">
              ${svg.radio}
            </div>
            <div class="${classItemInner}"  style="background: linear-gradient(0deg, ${secondaryColorHex}, ${primaryColorHex});">
            </div>
          </div>
        </div>
        
        ${toolTip}

      </div>
        `;
    }

    if (type === "shape") {
      const tabindex = playerShape === item ? "0" : "-1";
      const selected = playerShape === item ? "true" : "false";
      // already selected by other player
      const disabled = oppositePlayer.shape === item;
      const toolTip = this.toolTipMarkup({
        type,
        player: oppositePlayer,
        enabled: disabled,
      });
      const classBase = "shape-item";
      const classSelected = playerShape === item ? "shape-item--selected" : "";
      const classDisabled = disabled ? "disabled" : "";
      const classItem = `${classBase} ${classSelected} ${classDisabled}`;
      const classItemInner = `${classBase}-inner`;
      const classItemBg = `${classBase}-bg`;
      const shape = shapes[item].replace(
        /filter="url\(#drop-shadow-filter\)"/g,
        ""
      );

      return `
      <div class="${classBase}-container">
        <div 
          role="radio" 
          tabindex="${tabindex}" 
          class="${classItem}" 
          data-selected="${selected}"
          data-disabled="${disabled}"
          data-shape="${item}" 
          aria-checked="${selected}" 
          aria-disabled="${disabled}"
          aria-hidden="${disabled}"
          aria-label="choose shape: ${item}"
        >
          <div class="${classItemBg}">
            <div class="radio">
              ${svg.radio}
            </div>
            <div class="${classItemInner}">
              ${shape}
            </div>
          </div>
        </div>

        ${toolTip}

      </div>
      `;
    }
  }

  private renderGroup({ type }: { type: TSkin }) {
    if (type === "color")
      return colors
        .map((color) => this.listItem({ type, item: color }))
        .join("");

    return shapes.map((shape) => this.listItem({ type, item: shape })).join("");
  }

  private dropdownContentMarkup() {
    const {
      currentPlayer: { id },
    } = this.data;
    return `
    <ul class="dropdown-options ${id}-options">
      <li>
        <div class="options-shape">
          <h2 id="group_label_shape_${id}" class="options-title">Shape</h2>
          <hr>
          <div role="radiogroup" aria-labelledby="group_label_shape_${id}" class="shape-group">${this.renderGroup(
      { type: "shape" }
    )}</div>
        </div>
      </li>
      <li>
      <div class="options-color">
        <h2 id="group_label_color_${id}" class="options-title">Color</h2>
        <hr>
        <div role="radiogroup" aria-labelledby="group_label_color_${id}" class="color-group">${this.renderGroup(
      { type: "color" }
    )}</div>
      </div>
      </li>
    </ul>
    `;
  }

  protected generateMarkup() {
    const {
      currentPlayer: { id },
    } = this.data;
    // The Five Wrappers that enables Dropdown circular animation: container > shell > sub-shell > mask > inner

    // container - to allow to generate keyframes while still visibly hidding dropdown by keeping it's layout to 0 size and overflow hidden, this will prevent overflow activating scrollbars (such as viewport). When dropdown animtion starts, its overflow property changes to visible to allow content to be displayed

    // shell       - has same size as content and provides shadow (shell-shadow el) when dropdown is finished animated

    // sub-shell   - has same size as shell and clips finished circular animation mask, otherwise dropdown geometry would be huge and act as an overlay (prevent clicking other elements)

    // mask        - to attach expand circular animation
    // inner       - to attach inverse scale animtion in order for circular animtion to work with mask

    const markup = `
    <div class="dropdown-options-shell">
      <div class="dropdown-options-sub-shell">
        <div class="dropdown-options-mask">
          <div class="dropdown-options-inner">
            <!-- btn highlight for player --> 
            ${this.generateBtnHighlight()}

            ${this.dropdownContentMarkup()}
          </div>
        </div>
      </div>
      <div class="shell-shadow ${id}"></div>
    </div>
    `;

    return markup;
  }

  private onRadioGroup() {
    const { currentPlayer: player } = this.data;
    radioGroup({
      group: this.shapeGroupEl,
      onSelect: ({ currentElement, prevElement }) => {
        const shape = currentElement.dataset.shape!;
        prevElement.setAttribute("data-selected", "false");
        prevElement.classList.remove("shape-item--selected");
        currentElement.setAttribute("data-selected", "true");
        currentElement.classList.add("shape-item--selected");

        this.handlerShape({ player, shape });
      },
    });
    radioGroup({
      group: this.colorGroupEl,
      onSelect: ({ currentElement, prevElement }) => {
        const color = currentElement.dataset.color!;
        prevElement.setAttribute("data-selected", "false");
        prevElement.classList.remove("color-item--selected");
        currentElement.setAttribute("data-selected", "true");
        currentElement.classList.add("color-item--selected");

        this.handlerColor({ player, color });
      },
    });
  }

  private addToolTip({
    item,
    toolTipMsg,
  }: {
    toolTipMsg: string;
    item: HTMLElement;
  }) {
    const toolTipContainer = item.querySelector(
      ".tooltip-container"
    ) as HTMLElement;
    toolTipContainer.classList.add("ready");
    toolTipContainer.insertAdjacentHTML(
      "beforeend",
      this.toolTipInnerMarkup({ msg: toolTipMsg })
    );
  }

  private removeToolTip(item: HTMLElement) {
    const toolTipContainer = item.querySelector(
      ".tooltip-container.ready"
    ) as HTMLElement;
    toolTipContainer.classList.remove("ready");
    this.clearChildren(toolTipContainer);
  }

  private updateToolTips({
    currentItem,
    newItem,
    toolTipMsg,
  }: {
    newItem: HTMLElement;
    currentItem: HTMLElement;
    toolTipMsg: string;
  }) {
    const currentItemContainer = currentItem.parentElement as HTMLElement;
    const newItemContainer = newItem.parentElement as HTMLElement;

    this.addToolTip({ item: newItemContainer, toolTipMsg });
    this.removeToolTip(currentItemContainer);
  }

  radioToolTipMessage = ({
    player,
    type,
  }: {
    player: TPlayer;
    type: TSkin;
  }) => {
    const svgMark = `<span class="mini-svg-mark" aria-hidden="true">${player.getSvgShape()}</span>`;

    return `
    <span>
      <span class="tooltip-player">
      Player ${player.id === "P1" ? "1" : "2"} ${svgMark}
      </span>
      has this <strong>${type}</strong>
    </span>`;
  };

  updatePlayerSkinSelection({
    type,
    value,
  }: {
    type: "color" | "shape";
    value: string;
  }) {
    const group = type === "color" ? this.colorGroupEl : this.shapeGroupEl;
    const currentItem = group.querySelector(
      '[data-selected="true"]'
    ) as HTMLElement;
    const newItem = group.querySelector(
      `[data-${type}="${value}"]`
    ) as HTMLElement;

    currentItem.setAttribute("data-selected", "false");
    currentItem.setAttribute("aria-checked", "false");
    currentItem.setAttribute("tabindex", "-1");
    currentItem.classList.remove(`${type}-item--selected`);

    newItem.setAttribute("data-selected", "true");
    newItem.setAttribute("aria-checked", "true");
    newItem.setAttribute("tabindex", "0");
    newItem.classList.add(`${type}-item--selected`);
  }

  updatePlayerSkinDisabled({
    type,
    value,
    toolTipMsg,
  }: {
    type: "color" | "shape";
    value: string;
    toolTipMsg: string;
  }) {
    const group = type === "color" ? this.colorGroupEl : this.shapeGroupEl;
    const currentItem = group.querySelector(
      '[data-disabled="true"]'
    ) as HTMLElement;
    const newItem = group.querySelector(
      `[data-${type}="${value}"]`
    ) as HTMLElement;

    currentItem.setAttribute("data-disabled", "false");
    currentItem.setAttribute("aria-disabled", "false");
    currentItem.classList.remove("disabled");

    newItem.setAttribute("data-disabled", "true");
    newItem.setAttribute("aria-disabled", "true");
    newItem.classList.add("disabled");

    this.updateToolTips({ currentItem, newItem, toolTipMsg });
  }

  addHandlerChangeShape(handler: TControlPlayerShape) {
    this.handlerShape = handler;
  }

  addHandlerChangeColor(handler: TControlPlayerColor) {
    this.handlerColor = handler;
  }

  recalculateDropdownAnimation() {
    const {
      currentPlayer: { id },
    } = this.data;

    if (id === "P1") {
      this.dropdownExpando.calculate();
    } else {
      this.dropdownExpando.calculate({ updateStylesheet: false });
    }
  }

  removeForwardFillOnFinishedExpanded() {
    this.dropdownExpando.removeForwardFillOnFinishedExpanded();
  }

  collapseDropdown(removeActiveBtn: Function) {
    this.dropdownExpando.play({
      mode: "collapse",
      onStart: () => {
        this.shellShadow.style.transition = "";
        this.shellShadow.style.opacity = "";
      },
      onEnd: () => {
        removeActiveBtn();
        this.parentEl.style.overflow = "";
      },
    });
  }

  expandDropdown() {
    this.dropdownExpando.play({
      mode: "expand",
      onStart: () => {
        this.parentEl.style.overflow = "visible";
      },
      onEnd: () => {
        this.shellShadow.style.opacity = "1";
        this.shellShadow.style.transition = "opacity 400ms";
      },
    });
  }
}
