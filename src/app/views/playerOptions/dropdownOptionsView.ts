import {
  TControlPlayerColor,
  TControlPlayerShape,
} from "../../controller/controller";
import { TPlayer } from "../../model/state";
import { colorMap, colors, shapes, svg } from "../constants/constants";
import { radioGroup } from "../utils/aria";
import { diagonalLengthOfElement } from "../utils/index";
import View from "../View";

let init = true;

export default class DropdownOptionsView extends View {
  data: TPlayer;
  dropdownOptions: HTMLElement;
  playerBtnHighlight: HTMLElement;
  // dropdownContainer: HTMLElement;
  // dropdown: HTMLElement;
  dropdownBtn: HTMLElement;
  dropdownTimeout: number;
  board: HTMLElement;
  shapeGroup: HTMLElement;
  colorGroup: HTMLElement;
  handlerShape: TControlPlayerShape;
  handlerColor: TControlPlayerColor;

  constructor({ root, data }: { data: TPlayer; root: string | HTMLElement }) {
    super({ root });

    this.data = data;
    this.dropdownOptions = {} as HTMLElement;
    this.playerBtnHighlight = {} as HTMLElement;
    // this.dropdownContainer = {} as HTMLElement;
    // this.dropdown = {} as HTMLElement;
    this.dropdownBtn = {} as HTMLElement;
    this.shapeGroup = {} as HTMLElement;
    this.colorGroup = {} as HTMLElement;
    this.board = document.querySelector(".board") as HTMLElement;
    this.dropdownTimeout = 0;
    this.handlerColor = () => {};
    this.handlerShape = () => {};
    this.listenBoardResize();
  }

  private listenBoardResize() {
    // if (!init) return;
    // init = false;
    const resizeDropdown = () => {
      const { clientWidth } = this.board;
      this.dropdownOptions.style.width = `${clientWidth}px`;
    };
    requestAnimationFrame(resizeDropdown);

    window.addEventListener("resize", () => {
      resizeDropdown();
    });
  }

  protected initQuerySelectors() {
    const { id } = this.data;

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

    this.addRovingRadioGroup();
  }

  private generateBtnHighlight() {
    return `
      <div class="fake-player-btns">
        <div class="player-btn-highlight"></div>
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
    const {
      svgShapes: shapes,
      color: playerColor,
      shape: playerShape,
    } = this.data;

    if (type === "colors") {
      const [primaryColor, secondaryColor] = item.split(",");
      const [primaryColorHex, secondaryColorHex] = colorMap[item];
      const tabindex = playerColor === item ? "0" : "-1";
      const checked = playerColor === item ? "true" : "false";
      const classSelected = playerColor === item ? "color-item--selected" : "";

      return `
      <div>
        <div role="radio" tabindex="${tabindex}" aria-checked="${checked}" class="color-item ${classSelected}" data-color="${item}" aria-label="chose gradient color of shape. Primary Color ${primaryColor}, Secondary Color ${secondaryColor}">
          <div class="thumb-checkbox">
            <div class="badge">
              <div class="checkbox"></div>
            </div>
          </div>
          <div style="background: ${primaryColorHex};" class="primary-color"></div>
          <div style="background: ${secondaryColorHex};" class="secondary-color"></div>
        </div>
      </div>`;
    }

    if (type === "shapes") {
      const tabindex = playerShape === item ? "0" : "-1";
      const checked = playerShape === item ? "true" : "false";
      const classSelected = playerShape === item ? "shape-item--selected" : "";

      return `
      <div>
        <div role="radio" tabindex="${tabindex}" aria-checked="${checked}" class="shape-item ${classSelected}" data-shape="${item}" aria-label="chose shape: ${item}">
          <div class="thumb-checkbox">
            <div class="badge">
              <div class="checkbox"></div>
            </div>
          </div>
          ${shapes[item]}
        </div>
      </div>`;
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
    const { id } = this.data;
    const markup = `

    <!-- btn highlight for player --> 
    ${this.generateBtnHighlight()}

    <ul class="dropdown-options ${id}-options">
      <li>
        <div class="options-shape">
          <h2 id="group_label_shape" class="options-title">Shape</h2>
          <hr>
          <div role="radiogroup" aria-labelledby="group_label_shape" class="shape-group">${this.renderGroup(
            { type: "shapes" }
          )}</div>
        </div>
      </li>
      <li>
      <div class="options-color">
        <h2 id="group_label_color" class="options-title">Color</h2>
        <hr>
        <div role="radiogroup" aria-labelledby="group_label_color" class="color-group">${this.renderGroup(
          { type: "colors" }
        )}</div>
      </div>
      </li>
      <li>
      <!-- AI Options -->
      <div class="options-gameplay">
        <hr> <button id="options-restart" class="btn btn-secondary options-btn">Restart</button> <button
          id="options-reset-scores" class="btn btn-secondary options-btn">Reset Scores</button> </div>
      </li>
    </ul>
    `;

    return markup;
  }

  private generateDropdown(el: HTMLElement, idx: number) {
    console.log(idx);
    const markupList: string[] = [];
    for (let i = idx; i < idx + 3; i++) {
      const markup = `
      <div class="dropdown-container" data-db-container="${i}" style="position:relative">
        <button class="dropdown-btn">Dropdown ${i}</button>
      </div>
      `;
      markupList.push(markup);
    }

    const markup = `
    <ul class="dropdown" data-db-dropdown="${idx}" style=" position: absolute; top: 25px; width: 100%; overflow: visible; display: block; padding: 5px; z-index: 1;">
      ${markupList.join("")}
    </ul>
    `;

    el.insertAdjacentHTML("beforeend", markup);
  }

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

  private addRovingRadioGroup() {
    radioGroup({
      group: this.shapeGroup,
      onSelect: ({ currentElement, prevElement }) => {
        const shape = currentElement.dataset.shape!;
        prevElement.classList.remove("shape-item--selected");
        currentElement.classList.add("shape-item--selected");

        this.handlerShape({ player: this.data, shape });
      },
    });
    radioGroup({
      group: this.colorGroup,
      onSelect: ({ currentElement, prevElement }) => {
        const color = currentElement.dataset.color!;
        prevElement.classList.remove("color-item--selected");
        currentElement.classList.add("color-item--selected");

        this.handlerColor({ player: this.data, color });
      },
    });
  }

  addHandlerChangeShape(handler: TControlPlayerShape) {
    this.handlerShape = handler;
    // this.parentEl.addEventListener("click", (e) => {
    //   const target = e.target as HTMLElement;
    //   const shapeItem = target.closest(".shape-item") as HTMLElement;
    //   if (!shapeItem) return;
    //   const { shape } = shapeItem.dataset;

    //   handler({ player: this.data, shape: shape! });
    // });
  }

  addHandlerChangeColor(handler: TControlPlayerColor) {
    this.handlerColor = handler;
    // this.parentEl.addEventListener("click", (e) => {
    //   const target = e.target as HTMLElement;
    //   const colorItem = target.closest(".color-item") as HTMLElement;
    //   if (!colorItem) return;
    //   const { color } = colorItem.dataset;

    //   handler({ player: this.data, color: color! });
    // });
  }

  removeDropdown(callback: Function) {
    this.leaveEnter();

    this.dropdownTimeout = window.setTimeout(() => {
      this.parentEl.classList.add("hidden");
      callback();
    }, 350);
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
    if (this.data.id === "P1") {
      circleClipHoldElement({
        element: this.dropdownOptions,
        parent: this.parentEl,
        top: "100%",
        left: "0%",
      });
      return;
    }

    // position based on parent
    circleClipHoldElement({
      element: this.dropdownOptions,
      parent: this.parentEl,
      left: "100%",
      top: "100%",
    });
  }

  private leaveEnter() {
    this.parentEl.style.clipPath = "";
  }
}

// just like absolute position, origin of clip circle starts at top 0 and left 0, therefore animation starts at top left
// actually the it will clip the parent, but clip size is based on the element
const circleClipHoldElement = ({
  element,
  parent,
  left = 0,
  top = 0,
}: {
  top?: number | string;
  left?: number | string;
  element: HTMLElement;
  parent: HTMLElement;
}) => {
  // diameter of circle to hold element
  if (typeof top === "number") top = top + "px";
  if (typeof left === "number") left = left + "px";
  const diameter = diagonalLengthOfElement(element);
  parent.style.clipPath = `circle( ${diameter}px at ${left} ${top})`;
};
