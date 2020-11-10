import { TPlayer } from "../../model/state";
import { colorMap, colors, shapes, svg } from "../constants/constants";
import View from "../View";

export default class DropdownOptionsView extends View {
  data: TPlayer;
  playerOptions: NodeListOf<HTMLElement>;

  constructor({ root, data }: { data: TPlayer; root: string | HTMLElement }) {
    super({ root });
    this.data = data;
    this.playerOptions = document.querySelectorAll(".player-options");
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
      return `<li><div class="color-list" tabindex="0" data-color="${item}" role="button" aria-label="chose gradient color of shape. Primary Color ${primaryColor}, Secondary Color ${secondaryColor}"><div style="background: ${primaryColorHex};"class="primary-color"></div><div style="background: ${secondaryColorHex}; "class="secondary-color"></div></div></li>`;
    }

    return `<li><div class="shape-list" data-shape="${item}" tabindex="0" role="button" aria-label="chose shape: ${item}">${shapes[item]}</div></li>`;
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

  addHandlerChangeShape(handler: Function) {
    this.parentEl.addEventListener("click", () => handler());
  }

  toggleDropdown() {
    console.log(this.parentEl);
    this.parentEl.classList.toggle("hidden");
  }
}
