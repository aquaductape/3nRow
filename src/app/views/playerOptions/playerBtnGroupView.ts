import {
  TControlPlayerColor,
  TControlPlayerShape,
} from "../../controller/controller";
import onFocusOut from "../../lib/onFocusOut/onFocusOut";
import { TPlayer, TState } from "../../model/state";
import { svg } from "../constants/constants";
import { createHTMLFromString } from "../utils/index";
import View from "../View";
import DropdownOptionsView from "./dropdownOptionsView";

type TPlayerDom = {
  [key: string]: {
    playerContainer: HTMLElement;
    playerBtn: HTMLElement;
    playerMark: HTMLElement;
    dropdownOptionsMenu: HTMLElement;
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
      const target = e.target as HTMLElement;
      const btn = target.closest(".player-btn-options") as HTMLElement;

      if (target.classList.contains("dropdown-options-container")) {
        return;
      }

      if (!btn) {
        return;
      }

      const { playerId } = btn.dataset;

      const {
        playerBtn,
        dropdownOptionsView,
        playerContainer,
      } = this.playerDom[playerId!];

      onFocusOut({
        button: playerBtn,
        allow: [".dropdown-options-container"],
        run: () => {
          dropdownOptionsView.addDropdown();
          playerBtn.classList.add("active");
        },
        onExit: () => {
          dropdownOptionsView.removeDropdown();
          playerBtn.classList.remove("active");
        },
      });
    };

    this.parentEl.addEventListener("click", onAction);
  }

  updatePlayerBtnsOnGameStart() {
    const { players } = this.data;
    players.forEach(({ id }) => {
      const { playerBtn } = this.playerDom[id];
      playerBtn.classList.remove("pre-game");
    });
  }

  // override render to avoid wiping container
  render(data: TState) {
    this.data = data;
    const { players } = data;

    players.forEach((player) => {
      const { id, shape, svgShapes: shapes } = player;
      const svgMark = shapes[shape];
      const playerContainer = document.getElementById(`${id}-btn-options`)!;
      const playerBtn = <HTMLElement>(
        playerContainer.querySelector(".player-btn-options")
      );
      const playerMark = <HTMLElement>(
        playerContainer.querySelector(".player-mark")
      );
      const dropdownOptionsContainer = <HTMLElement>(
        playerContainer.querySelector(".dropdown-options-container")
      );
      const dropdownOptionsMenu = <HTMLElement>(
        playerContainer.querySelector(".dropdown-options-menu")
      );
      const dropdownOptionsView = new DropdownOptionsView({
        root: dropdownOptionsContainer,
        data: player,
      });

      this.playerDom[id] = {
        playerContainer,
        playerMark,
        dropdownOptionsView,
        dropdownOptionsMenu,
        playerBtn,
      };

      dropdownOptionsView.render(player);
      this.generatePlayerMark({ id, svgMark });
    });
    this.generateAntMenu();
    this.addToggleDropDown();

    return;
  }

  updateSvgMark(player: TPlayer) {
    const { shape, svgShapes: shapes, id } = player;
    const { playerMark } = this.playerDom[id];
    const svgMark = player.getSvgShape();

    playerMark.innerHTML = "";
    this.generatePlayerMark({ id, svgMark });
  }
}

export default new PlayerBtnGroup();
