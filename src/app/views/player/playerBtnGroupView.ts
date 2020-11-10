import { TState } from "../../model/state";
import { svg } from "../constants/constants";
import { createHTMLFromString } from "../utils/index";
import View from "../View";
import DropdownOptionsView from "./dropdownOptionsView";

type TPlayerDom = {
  [key: string]: {
    container: HTMLElement;
    playerMark: HTMLElement;
    dropdownOptionsView: DropdownOptionsView;
  };
};

class PlayerBtnGroup extends View {
  data: TState;
  playerOptions: NodeListOf<HTMLElement>;
  playerDom: TPlayerDom;

  constructor() {
    super({ root: ".player-btn-group" });
    this.data = <TState>{};
    this.playerOptions = document.querySelectorAll(".player-options");
    this.playerDom = <TPlayerDom>{};

    this.addToggleDropDown();
  }

  private generatePlayerMark({ id, svgMark }: { id: string; svgMark: string }) {
    const { playerMark } = this.playerDom[id];

    const fullColor = createHTMLFromString(svgMark);
    const monochrome = createHTMLFromString(svgMark);

    monochrome.classList.add("monochrome");
    fullColor.classList.add("full-color");

    playerMark.appendChild(fullColor);
    playerMark.appendChild(monochrome);
  }

  private generateAntMenu() {
    this.playerOptions.forEach((option) => (option.innerHTML = svg.antMenu));
  }

  addHandlerChangeShape(handler: Function) {
    this.data.players.forEach(({ id }) => {
      const { dropdownOptionsView } = this.playerDom[id];

      dropdownOptionsView.addHandlerChangeShape(handler);
    });
  }

  addToggleDropDown() {
    const onAction = (e: Event) => {
      const btn = (e.target as HTMLElement).closest(
        ".player-btn-options"
      ) as HTMLElement;
      if (!btn) return;
      const { playerId } = btn.dataset;

      const { dropdownOptionsView } = this.playerDom[playerId!];

      btn.classList.toggle("active");
      dropdownOptionsView.toggleDropdown();
    };

    this.parentEl.addEventListener("click", onAction);
    this.parentEl.addEventListener(
      "keydown",
      (e) => e.code.match(/Enter|Space/i) && onAction(e)
    );
  }

  // override render to avoid wiping container
  render(data: TState) {
    this.data = data;
    const { players } = data;

    players.forEach((player) => {
      const { id, shape, shapes } = player;
      const svgMark = shapes[shape];
      const container = document.getElementById(`${id}-btn-options`)!;
      const playerMark = <HTMLElement>container.querySelector(".player-mark");
      const dropDownOptionsContainer = <HTMLElement>(
        container.querySelector(".dropdown-options-container")
      );

      const dropdownOptionsView = new DropdownOptionsView({
        root: dropDownOptionsContainer,
        data: player,
      });

      this.playerDom[id] = {
        container,
        playerMark,
        dropdownOptionsView,
      };

      dropdownOptionsView.render(player);
      this.generatePlayerMark({ id, svgMark });
    });
    this.generateAntMenu();

    return;
  }
}

export default new PlayerBtnGroup();
