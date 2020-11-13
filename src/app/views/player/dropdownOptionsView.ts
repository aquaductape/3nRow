import {
  TControlPlayerColor,
  TControlPlayerShape,
} from "../../controller/controller";
import { TPlayer } from "../../model/state";
import { colorMap, colors, shapes, svg } from "../constants/constants";
import { diagonalLengthOfElement } from "../utils/index";
import View from "../View";

export default class DropdownOptionsView extends View {
  data: TPlayer;
  dropdownOptions: HTMLElement;
  playerBtnHighlight: HTMLElement;

  constructor({ root, data }: { data: TPlayer; root: string | HTMLElement }) {
    super({ root });

    this.data = data;
    this.dropdownOptions = {} as HTMLElement;
    this.playerBtnHighlight = {} as HTMLElement;
  }

  protected initQuerySelectors() {
    const { id } = this.data;

    this.dropdownOptions = this.parentEl.querySelector(
      ".dropdown-options"
    ) as HTMLElement;
    this.playerBtnHighlight = this.parentEl.querySelector(
      `[data-player-id="${id}"]`
    ) as HTMLElement;
  }

  private generateBtnHighlight() {
    return `
      <div class="fake-player-btns">
        <div data-player-id="P1" class="player-btn-highlight"></div>
        <div data-player-id="P2" class="player-btn-highlight"></div>
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
    const { shapes } = this.data;
    if (type === "colors") {
      const [primaryColor, secondaryColor] = item.split(",");
      const [primaryColorHex, secondaryColorHex] = colorMap[item];
      return `<li><button class="color-item" data-color="${item}" aria-label="chose gradient color of shape. Primary Color ${primaryColor}, Secondary Color ${secondaryColor}"><div style="background: ${primaryColorHex};"class="primary-color"></div><div style="background: ${secondaryColorHex}; "class="secondary-color"></div></button></li>`;
    }

    return `<li><button class="shape-item" data-shape="${item}" aria-label="chose shape: ${item}">${shapes[item]}</button></li>`;
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

    <div class="dropdown-options ${id}-options">
      <div class="options-shape">
        <h2 class="options-title">Shape</h2>
        <hr>
        <ul class="shape-group">${this.renderGroup({ type: "shapes" })}</ul>
      </div>
      <div class="options-color">
        <h2 class="options-title">Color</h2>
        <hr>
        <ul class="color-group">${this.renderGroup({ type: "colors" })}</ul>
      </div>
      <!-- AI Options -->
      <div class="options-gameplay">
        <hr> <button id="options-restart" class="btn btn-secondary options-btn">Restart</button> <button
          id="options-reset-scores" class="btn btn-secondary options-btn">Reset Scores</button> </div>
    </div>
    `;

    return markup;
  }

  addHandlerChangeShape(handler: TControlPlayerShape) {
    this.parentEl.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      const shapeItem = target.closest(".shape-item") as HTMLElement;
      if (!shapeItem) return;
      const { shape } = shapeItem.dataset;

      handler({ player: this.data, shape: shape! });
    });
  }

  addHandlerChangeColor(handler: TControlPlayerColor) {
    this.parentEl.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      const colorItem = target.closest(".color-item") as HTMLElement;
      if (!colorItem) return;
      const { color } = colorItem.dataset;

      handler({ player: this.data, color: color! });
    });
  }

  removeDropdown() {
    this.leaveEnter();

    setTimeout(() => {
      this.parentEl.classList.add("hidden");
      this.playerBtnHighlight.classList.remove("active");
    }, 450);
  }

  addDropdown() {
    this.parentEl.classList.remove("hidden");
    this.playerBtnHighlight.classList.add("active");
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
