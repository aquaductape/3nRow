import {
  TControlPlayerColor,
  TControlPlayerShape,
} from "../../controller/controller";
import addGlobalEscape from "../../lib/addGlobalEscape/addGlobalEscape";
import { TState } from "../../model/state";
import { svg } from "../constants/constants";
import { createHTMLFromString } from "../utils/index";
import View from "../View";
import DropdownOptionsView from "./dropdownOptionsView";

type TPlayerDom = {
  [key: string]: {
    playerContainer: HTMLElement;
    playerBtn: HTMLElement;
    playerMark: HTMLElement;
    // dropdownOptionsContainer: DropdownOptionsView;
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

  addHandlerChangeShape(handler: TControlPlayerShape) {
    this.data.players.forEach(({ id }) => {
      const { dropdownOptionsView } = this.playerDom[id];

      dropdownOptionsView.addHandlerChangeShape(handler);
    });
  }

  addHandlerChangeColor(handler: TControlPlayerColor) {
    this.data.players.forEach(({ id }) => {
      const { dropdownOptionsView } = this.playerDom[id];

      dropdownOptionsView.addHandlerChangeColor(handler);
    });
  }

  addToggleDropDown() {
    const onAction = (e: Event) => {
      const btn = (e.target as HTMLElement).closest(
        ".player-btn-options"
      ) as HTMLElement;
      if (!btn) return;
      const { playerId } = btn.dataset;

      const { playerBtn, dropdownOptionsView } = this.playerDom[playerId!];

      addGlobalEscape({
        button: playerBtn,
        run() {
          dropdownOptionsView.addDropdown();
          btn.classList.add("active");
        },
        allow: [".dropdown-options"],
        onExit() {
          dropdownOptionsView.removeDropdown();
          btn.classList.remove("active");
        },
      });
    };

    this.parentEl.addEventListener("click", onAction);
  }

  // override render to avoid wiping container
  render(data: TState) {
    this.data = data;
    const { players } = data;

    players.forEach((player) => {
      const { id, shape, shapes } = player;
      const svgMark = shapes[shape];
      const playerContainer = document.getElementById(`${id}-btn-options`)!;
      const playerBtn = <HTMLElement>(
        playerContainer.querySelector(".player-btn-options")
      );
      const playerMark = <HTMLElement>(
        playerContainer.querySelector(".player-mark")
      );
      const dropDownOptionsContainer = <HTMLElement>(
        playerContainer.querySelector(".dropdown-options-container")
      );
      const dropdownOptionsView = new DropdownOptionsView({
        root: dropDownOptionsContainer,
        data: player,
      });

      this.playerDom[id] = {
        playerContainer,
        playerMark,
        dropdownOptionsView,
        playerBtn,
      };

      dropdownOptionsView.render(player);
      this.generatePlayerMark({ id, svgMark });
    });
    this.generateAntMenu();

    return;
  }

  updateSvgMark(id: string) {
    const { players } = this.data;
    const { shape, shapes } = players.find((player) => player.id === id)!;
    const { playerMark } = this.playerDom[id];
    const svgMark = shapes[shape];

    playerMark.innerHTML = "";
    this.generatePlayerMark({ id, svgMark });
  }
}

export default new PlayerBtnGroup();
