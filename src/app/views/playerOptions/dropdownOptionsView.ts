import {
  TControlPlayerColor,
  TControlPlayerShape,
} from "../../controller/controller";
import { IOS, IOS13 } from "../../lib/onFocusOut/browserInfo";
import { TPlayer } from "../../model/state";
import { colorMap, colors, shapes, svg } from "../constants/constants";
import { radioGroup } from "../utils/aria";
import { diagonalLengthOfElement, getOppositePlayer } from "../utils/index";
import View from "../View";
import { animateDropdown } from "./animation";

let debugCounter = 0;

export default class DropdownOptionsView extends View {
  data: { players: TPlayer[]; currentPlayer: TPlayer };
  dropdownOptions: HTMLElement;
  playerBtnHighlight: HTMLElement;
  playerBtnGroup: HTMLElement;
  // dropdownContainer: HTMLElement;
  // dropdown: HTMLElement;
  dropdownBtn: HTMLElement;
  dropdownTimeout: number;
  shapeGroup: HTMLElement;
  colorGroup: HTMLElement;
  dropdownAnimation: {
    canceled: boolean;
    lastPosition: number;
  };
  handlerShape: TControlPlayerShape;
  handlerColor: TControlPlayerColor;

  constructor({
    root,
    data,
  }: {
    data: { players: TPlayer[]; currentPlayer: TPlayer };
    root: string | HTMLElement;
  }) {
    super({ root });

    this.data = data;
    this.dropdownAnimation = {
      canceled: false,
      lastPosition: 0,
    };
    this.dropdownOptions = {} as HTMLElement;
    this.playerBtnHighlight = {} as HTMLElement;
    this.playerBtnGroup = {} as HTMLElement;
    // this.dropdownContainer = {} as HTMLElement;
    // this.dropdown = {} as HTMLElement;
    this.dropdownBtn = {} as HTMLElement;
    this.shapeGroup = {} as HTMLElement;
    this.colorGroup = {} as HTMLElement;
    this.dropdownTimeout = 0;
    this.handlerColor = () => {};
    this.handlerShape = () => {};
  }

  protected initQuerySelectors() {
    const {
      currentPlayer: { id },
    } = this.data;

    this.dropdownOptions = this.parentEl.querySelector(
      ".dropdown-options"
    ) as HTMLElement;
    this.playerBtnHighlight = this.parentEl.querySelector(
      `[data-player-id="${id}"]`
    ) as HTMLElement;

    // this.dropdownContainer = this.parentEl.querySelector(
    //   ".dropdown-container"
    // ) as HTMLElement;
    // this.dropdown = this.parentEl.querySelector(".dropdown") as HTMLElement;
    // this.addDropdownEvents();
    this.dropdownBtn = this.parentEl.querySelector(
      ".dropdown-btn"
    ) as HTMLElement;
    this.colorGroup = this.parentEl.querySelector(
      ".color-group"
    ) as HTMLElement;
    this.shapeGroup = this.parentEl.querySelector(
      ".shape-group"
    ) as HTMLElement;
    this.playerBtnGroup = document.querySelector(
      ".player-btn-group"
    ) as HTMLElement;

    this.onRadioGroup();
  }

  private generateBtnHighlight() {
    const {
      currentPlayer: { id },
    } = this.data;
    return `
      <div class="fake-player-btns">
        <div class="player-btn-highlight ${id}-player-btn-highlight"></div>
      </div>
    `;
  }

  private listItem({
    item,
    type,
  }: {
    item: string;
    type: "shapes" | "colors";
  }) {
    const { currentPlayer, players } = this.data;
    const {
      svgShapes: shapes,
      color: playerColor,
      shape: playerShape,
    } = currentPlayer;

    const oppositePlayer = getOppositePlayer({ id: currentPlayer.id, players });

    if (type === "colors") {
      const [primaryColor, secondaryColor] = item.split(",");
      const [primaryColorHex, secondaryColorHex] = colorMap[item];
      const tabindex = playerColor === item ? "0" : "-1";
      const selected = playerColor === item ? "true" : "false";
      // already selected by other player
      const disabled = oppositePlayer.color === item;
      const classBase = "color-item";
      const classSelected = playerColor === item ? "color-item--selected" : "";
      const classDisabled = disabled ? "disabled" : "";
      const classItem = `${classBase} ${classSelected} ${classDisabled}`;
      const classItemInner = `${classBase}-inner`;
      const classItemBg = `${classBase}-bg`;

      return `
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
            <div class="${classItemInner}">
              <div style="background: ${primaryColorHex};" class="primary-color"></div>
              <div style="background: ${secondaryColorHex};" class="secondary-color"></div>
            </div>
          </div>
        </div>`;
    }

    if (type === "shapes") {
      const tabindex = playerShape === item ? "0" : "-1";
      const selected = playerShape === item ? "true" : "false";
      // already selected by other player
      const disabled = oppositePlayer.shape === item;
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
      `;
    }
  }

  private renderGroup({ type }: { type: "shapes" | "colors" }) {
    if (type === "colors")
      return colors
        .map((color) => this.listItem({ type, item: color }))
        .join("");

    return shapes.map((shape) => this.listItem({ type, item: shape })).join("");
  }

  protected generateMarkup() {
    const {
      currentPlayer: { id },
    } = this.data;
    const markup = `
    <svg class="svg-clip-path-container" xmlns="http://www.w3.org/2000/svg">
      <clipPath id="clipPath-dropdown-${id}">
        <use href="#clipPath-dropdown-${id}-circle">
      </clipPath>
    </svg>
    <!-- btn highlight for player --> 
    ${this.generateBtnHighlight()}

    <ul class="dropdown-options ${id}-options">
      <li>
        <div class="options-shape">
          <h2 id="group_label_shape_${id}" class="options-title">Shape</h2>
          <hr>
          <div role="radiogroup" aria-labelledby="group_label_shape_${id}" class="shape-group">${this.renderGroup(
      { type: "shapes" }
    )}</div>
        </div>
      </li>
      <li>
      <div class="options-color">
        <h2 id="group_label_color_${id}" class="options-title">Color</h2>
        <hr>
        <div role="radiogroup" aria-labelledby="group_label_color_${id}" class="color-group">${this.renderGroup(
      { type: "colors" }
    )}</div>
      </div>
      </li>
    </ul>
    `;

    return markup;
  }

  // private generateDropdown(el: HTMLElement, idx: number) {
  //   console.log(idx);
  //   const markupList: string[] = [];
  //   for (let i = idx; i < idx + 3; i++) {
  //     const markup = `
  //     <div class="dropdown-container" data-db-container="${i}" style="position:relative">
  //       <button class="dropdown-btn">Dropdown ${i}</button>
  //     </div>
  //     `;
  //     markupList.push(markup);
  //   }

  //   const markup = `
  //   <ul class="dropdown" data-db-dropdown="${idx}" style=" position: absolute; top: 25px; width: 100%; overflow: visible; display: block; padding: 5px; z-index: 1;">
  //     ${markupList.join("")}
  //   </ul>
  //   `;

  //   el.insertAdjacentHTML("beforeend", markup);
  // }

  // private addDropdownEvents() {
  //   this.dropdownContainer.addEventListener("click", (e) => {
  //     const target = e.target as HTMLElement;
  //     const btn = target.closest(".dropdown-btn");
  //     const container = target.closest(".dropdown-container") as HTMLElement;
  //     const id = Number(container.dataset.dbContainer!);
  //     if (!btn) return;

  //     onFocusOut({
  //       button: btn,
  //       run: () => {
  //         this.generateDropdown(container, id + 3);
  //       },
  //       allow: [`[data-db-dropdown="${id + 3}"]`],
  //       onExit: () => {
  //         container.innerHTML = "";
  //         container.appendChild(btn);
  //       },
  //     });
  //   });
  // }

  private onRadioGroup() {
    const { currentPlayer: player } = this.data;
    radioGroup({
      group: this.shapeGroup,
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
      group: this.colorGroup,
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

  updatePlayerSkinSelection({
    type,
    value,
  }: {
    type: "color" | "shape";
    value: string;
  }) {
    const group = type === "color" ? this.colorGroup : this.shapeGroup;
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
  }: {
    type: "color" | "shape";
    value: string;
  }) {
    const group = type === "color" ? this.colorGroup : this.shapeGroup;
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
  }

  addHandlerChangeShape(handler: TControlPlayerShape) {
    this.handlerShape = handler;
  }

  addHandlerChangeColor(handler: TControlPlayerColor) {
    this.handlerColor = handler;
  }

  removeDropdown(removeActiveBtn: Function) {
    this.leaveEnter(removeActiveBtn);
  }

  cancelHiddingDropdown() {
    clearTimeout(this.dropdownTimeout);
  }

  addDropdown() {
    this.parentEl.classList.remove("hidden");
    this.reflow();
    this.appearEnter();
  }

  private appearEnter() {
    const {
      currentPlayer: { id },
    } = this.data;

    if (IOS && !IOS13) {
      return;
    }

    const clipPathId = `clipPath-dropdown-${id}`;
    const clipPath = (document.getElementById(
      `${clipPathId}-circle`
    ) as unknown) as SVGElement;
    const circleCY = 60;

    const diagonalLength = diagonalLengthOfElement(this.dropdownOptions);
    const radius = diagonalLength - circleCY + this.playerBtnGroup.clientHeight;

    animateDropdown({
      el: this.parentEl,
      debug: id,
      from: 0,
      to: radius,
      duration: 350,
      onStart: () => {
        this.parentEl.style.clipPath = `url(#${clipPathId})`;
      },
      onDraw: (val) => {
        clipPath.setAttribute("r", `${val}px`);
      },
      onEnd: () => {
        this.parentEl.style.clipPath = "";
        this.dropdownAnimation.canceled = false;
      },
    });
  }

  private leaveEnter(removeActiveBtn: Function) {
    const {
      currentPlayer: { id },
    } = this.data;

    if (IOS && !IOS13) {
      this.parentEl.classList.add("hidden");
      this.parentEl.style.clipPath = "";
      removeActiveBtn();
      return;
    }

    const clipPathId = `clipPath-dropdown-${id}`;
    const clipPath = (document.getElementById(
      `${clipPathId}-circle`
    ) as unknown) as SVGElement;
    const circleCY = 60;

    const diagonalLength = diagonalLengthOfElement(this.dropdownOptions);
    const radius = diagonalLength - circleCY + this.playerBtnGroup.clientHeight;

    animateDropdown({
      el: this.parentEl,
      debug: id,
      from: radius,
      to: 0,
      duration: 350,
      onStart: () => {
        this.parentEl.style.clipPath = `url(#${clipPathId})`;
      },
      onDraw: (val) => {
        clipPath.setAttribute("r", `${val}px`);
      },
      onEnd: () => {
        this.parentEl.classList.add("hidden");
        this.parentEl.style.clipPath = "";
        removeActiveBtn();
      },
    });
  }
}
