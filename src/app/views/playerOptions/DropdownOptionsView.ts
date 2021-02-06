import {
  TControlPlayerColor,
  TControlPlayerShape,
} from "../../controllers/playerOptions";
import { TPlayer } from "../../model/state";
import { TSkin } from "../../ts";
import { Tooltip } from "../components/Tooltip/Tooltip";
import { colorMap, colors, shapes, svg } from "../constants/constants";
import { radioGroup } from "../utils/aria";
import { getOppositePlayer } from "../utils/index";
import View from "../View";
import matchMediaView from "../windowEvents/matchMediaView";
import { DropdownExpando } from "./DropdownExpando";

type TGroupItem = {
  item: string;
  toolTipActive: boolean;
  toolTip: Tooltip | null;
  ariaLabel: string;
  selected: boolean;
  drafted: boolean;
  disabled: boolean;
};

type TSkinGroups = {
  colors: TGroupItem[];
  shapes: TGroupItem[];
};

export type TPlayAgainst = "multiplayer" | "vsAi" | "vsHuman";

export default class DropdownOptionsView extends View {
  protected data: { players: TPlayer[]; currentPlayer: TPlayer };
  private reducedAnimation = false;
  private dropdownTimeout = 0;
  // The Five Wrappers that enables Dropdown circular animation: container > shell > sub-shell > mask > inner
  private maskEl = {} as HTMLElement;
  private innerEl = {} as HTMLElement;
  private shellEl = {} as HTMLElement;
  private shellShadowEl = {} as HTMLElement;
  private dropdownOptionsEl = {} as HTMLElement;
  private playerBtnHighlightEl = {} as HTMLElement;
  private playerBtnGroupEl = {} as HTMLElement;
  private dropdownBtnEl = {} as HTMLElement;
  private shapeGroupEl = {} as HTMLElement;
  private colorGroupEl = {} as HTMLElement;
  private handlerShape: TControlPlayerShape = () => {};
  private handlerColor: TControlPlayerColor = () => {};
  private onRemoveActiveBtn: Function = () => {};
  private dropdownExpando = {} as DropdownExpando;
  private skinGroups = {} as TSkinGroups;
  private playAgainst: TPlayAgainst = "vsHuman";

  constructor({
    root,
    data,
  }: {
    data: { players: TPlayer[]; currentPlayer: TPlayer };
    root: string | HTMLElement;
  }) {
    super({ root });

    this.data = data;

    this.initSkinGroups();

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
    this.shellEl = this.parentEl.querySelector(
      ".dropdown-options-shell"
    ) as HTMLElement;
    this.shellShadowEl = this.parentEl.querySelector(
      ".shell-shadow"
    ) as HTMLElement;

    this.dropdownExpando = new DropdownExpando({
      id,
      innerEl: this.innerEl,
      maskEl: this.maskEl,
    });

    this.onRadioGroup();

    const disabledEls = this.parentEl.querySelectorAll(
      '[data-disabled="true"]'
    ) as NodeListOf<HTMLElement>;
    disabledEls.forEach((disabledItemEl) => {
      this.prepareTooltip({ disabledItemEl });
    });
  }

  private prepareTooltip({ disabledItemEl }: { disabledItemEl: HTMLElement }) {
    const type = disabledItemEl.dataset.type as TSkin;
    const typePlural = (type + "s") as "colors" | "shapes";
    const item = disabledItemEl.dataset[type];
    const group = this.skinGroups[typePlural].find(
      (group) => group.item === item
    )!;
    const message = this.radioToolTipMessage({
      type,
    });

    if (!group.toolTip) {
      group.toolTip = new Tooltip({
        message,
        tooltipTargetEl: disabledItemEl,
      });
    }
  }

  private initSkinGroups() {
    const { currentPlayer, players } = this.data;
    const { color: playerColor, shape: playerShape } = currentPlayer;

    const oppositePlayer = getOppositePlayer({ id: currentPlayer.id, players });

    this.skinGroups.colors = colors.map((color) => {
      const [primaryColor, secondaryColor] = color.split(",");
      const ariaLabel = `choose gradient color of shape. Primary Color ${primaryColor}, Secondary Color ${secondaryColor}`;
      const disabled = oppositePlayer.color === color;
      return {
        item: color,
        disabled,
        drafted: false,
        selected: playerColor === color,
        ariaLabel,
        toolTip: null,
        toolTipActive: disabled,
      };
    });
    this.skinGroups.shapes = shapes.map((shape) => {
      const ariaLabel = `choose shape: ${shape}`;
      const disabled = oppositePlayer.shape === shape;
      return {
        item: shape,
        disabled,
        drafted: false,
        selected: playerShape === shape,
        ariaLabel,
        toolTip: null,
        toolTipActive: disabled,
      };
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

  radioToolTipMessage = ({ type }: { type: TSkin }) => {
    const {
      currentPlayer: { id },
      players,
    } = this.data;
    const oppositePlayer = getOppositePlayer({ id, players });

    const svgMark = `<span class="mini-svg-mark" aria-hidden="true">${oppositePlayer.getSvgShape()}</span>`;
    let tooltipPlayerContent = `Player ${oppositePlayer.id.replace(
      "P",
      ""
    )} ${svgMark}`;
    let verb = "has";

    if (this.playAgainst === "multiplayer") {
      tooltipPlayerContent = `Opponent ${svgMark}`;
    }

    if (this.playAgainst === "vsAi") {
      tooltipPlayerContent = `${id === "P2" ? "You" : "Computer"} ${svgMark}`;
      verb = id === "P2" ? "have" : "has";
    }

    return `
    <span>
      <span class="tooltip-player">
        ${tooltipPlayerContent}
      </span>
      ${verb} this <strong>${type}</strong>
    </span>`;
  };

  private renderGroup({ type }: { type: TSkin }) {
    const skin = (type + "s") as "colors" | "shapes";

    return this.skinGroups[skin]
      .map((item) => this.listItem(type, item))
      .join("");
  }

  private listItem(type: TSkin, groupItem: TGroupItem) {
    const { currentPlayer } = this.data;
    const { svgShapes } = currentPlayer;
    const { ariaLabel, disabled, drafted, item, selected } = groupItem;
    let itemInnerMarkup = "";

    const tabindex = selected ? "0" : "-1";
    const dataSelected = selected ? "true" : "false";
    const classBase = `${type}-item`;
    const classSelected = selected ? `${type}-item--selected` : "";
    const classDisabled = disabled ? "disabled" : "";
    const classItem = `${classBase} ${classSelected} ${classDisabled}`;
    const classItemInner = `${classBase}-inner`;
    const classItemBg = `${classBase}-bg`;

    if (type === "shape") {
      const shape = svgShapes[item].replace(
        /filter="url\(#drop-shadow-filter\)"/g,
        ""
      );

      itemInnerMarkup = `
      <div class="${classItemInner}">
        ${shape}
      </div>
      `;
    }

    if (type === "color") {
      const [primaryColorHex, secondaryColorHex] = colorMap[item];
      itemInnerMarkup = `
      <div class="${classItemInner}"  style="background: linear-gradient(0deg, ${secondaryColorHex}, ${primaryColorHex});"></div>
      `;
    }

    return `
      <div class="${classBase}-container">
        <div 
          role="radio" 
          tabindex="${tabindex}" 
          class="${classItem}" 
          data-type="${type}"
          data-${type}="${item}" 
          data-value="${item}" 
          data-selected="${dataSelected}"
          data-disabled="${disabled}"
          aria-checked="${selected}" 
          aria-disabled="${disabled}"
          aria-hidden="${disabled}"
          aria-label="${ariaLabel}"
        >
          <div class="${classItemBg}">
            <div class="radio">
              ${svg.radio}
            </div>

            ${itemInnerMarkup}
          </div>
        </div>
      </div>
      `;
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
          <hr aria-hidden="true">
          <div role="radiogroup" aria-labelledby="group_label_shape_${id}" class="shape-group">${this.renderGroup(
      { type: "shape" }
    )}</div>
        </div>
      </li>
      <li>
      <div class="options-color">
        <h2 id="group_label_color_${id}" class="options-title">Color</h2>
        <hr aria-hidden="true">
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
    <div class="dropdown-options-shell" aria-hidden="true">
      <div class="dropdown-options-sub-shell" aria-hidden="true">
        <div class="dropdown-options-mask" aria-hidden="true">
          <div class="dropdown-options-inner" aria-hidden="true">
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
        const prevShape = prevElement.dataset.shape!;
        prevElement.setAttribute("data-selected", "false");
        prevElement.classList.remove("shape-item--selected");
        currentElement.setAttribute("data-selected", "true");
        currentElement.classList.add("shape-item--selected");

        this.handlerShape({ player, shape, prevShape });
      },
    });
    radioGroup({
      group: this.colorGroupEl,
      onSelect: ({ currentElement, prevElement }) => {
        const color = currentElement.dataset.color!;
        const prevColor = prevElement.dataset.color!;
        prevElement.setAttribute("data-selected", "false");
        prevElement.classList.remove("color-item--selected");
        currentElement.setAttribute("data-selected", "true");
        currentElement.classList.add("color-item--selected");

        this.handlerColor({ player, color, prevColor });
      },
    });
  }

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

  updateTooltipMessage() {
    const types = ["colors", "shapes"] as ("colors" | "shapes")[];
    types.forEach((type) => {
      const skinGroup = this.skinGroups[type];
      skinGroup.forEach(({ toolTip }) => {
        if (!toolTip) return;
        toolTip.updateTooltip({
          message: this.radioToolTipMessage({
            type: type === "colors" ? "color" : "shape",
          }),
        });
      });
    });
  }

  updatePlayerSkinDisabled({
    type,
    value,
  }: {
    type: "color" | "shape";
    value: string;
  }) {
    const otherType = type === "color" ? "shape" : "color";
    const typePlural = (type + "s") as "colors" | "shapes";
    const otherTypePlural = typePlural === "colors" ? "shapes" : "colors";
    const group = type === "color" ? this.colorGroupEl : this.shapeGroupEl;
    const otherGroup = type === "color" ? this.shapeGroupEl : this.colorGroupEl;
    const skinGroup = this.skinGroups[typePlural];
    const otherSkinGroup = this.skinGroups[otherTypePlural];
    const currentItem = group.querySelector(
      '[data-disabled="true"]'
    ) as HTMLElement;
    const currentItemOtherSkin = otherGroup.querySelector(
      '[data-disabled="true"]'
    ) as HTMLElement;
    const newItem = group.querySelector(
      `[data-${type}="${value}"]`
    ) as HTMLElement;

    const currentOtherSkinValue = currentItemOtherSkin.dataset.value;
    // console.log({ currentOtherSkinValue });

    if (type === "shape") {
      otherSkinGroup.find((item) => {
        const { toolTip } = item;
        if (item.item === currentOtherSkinValue) {
          if (toolTip) {
            if (toolTip.disabled) toolTip.enable();
            toolTip.updateTooltip({
              message: this.radioToolTipMessage({ type: otherType }),
            });
          }
          return true;
        }
      });
    }

    skinGroup.forEach((item) => {
      const { toolTip } = item;
      if (item.disabled) {
        item.disabled = false;
        if (toolTip) {
          toolTip.disable();
        }
      }
      if (item.item === value) {
        item.disabled = true;

        if (toolTip) {
          toolTip.enable();
          // console.log("correct update");
          toolTip.updateTooltip({
            message: this.radioToolTipMessage({ type }),
          });
          return;
        }

        item.toolTip = new Tooltip({
          tooltipTargetEl: newItem,
          message: this.radioToolTipMessage({ type }),
        });
      }
    });

    currentItem.setAttribute("data-disabled", "false");
    currentItem.setAttribute("aria-disabled", "false");
    currentItem.classList.remove("disabled");

    newItem.setAttribute("data-disabled", "true");
    newItem.setAttribute("aria-disabled", "true");
    newItem.classList.add("disabled");
  }

  setPlayAgainst({ type }: { type: TPlayAgainst }) {
    this.playAgainst = type;
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
    let duration = 600;
    if (this.reducedAnimation) {
      duration = 0;
      // throw new Error("reduced animation");
      // return;
    }

    this.dropdownExpando.play({
      mode: "collapse",
      duration,
      onStart: () => {
        this.shellShadowEl.style.transition = "";
        this.shellShadowEl.style.opacity = "";
      },
      onEnd: () => {
        removeActiveBtn();
        this.parentEl.classList.remove("active");
      },
    });
  }

  expandDropdown() {
    let duration = 600;
    if (this.reducedAnimation) {
      duration = 0;
      // throw new Error("reduced animation");
      // this.
      // return;
    }

    this.dropdownExpando.play({
      mode: "expand",
      duration,
      onStart: () => {
        this.parentEl.classList.add("active");
      },
      onEnd: () => {
        this.shellShadowEl.style.opacity = "1";
        this.shellShadowEl.style.transition = "opacity 400ms";
      },
    });
  }
}
