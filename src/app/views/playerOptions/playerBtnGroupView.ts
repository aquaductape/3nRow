import {
  TControlPlayerColor,
  TControlPlayerShape,
} from "../../controller/controller";
import onFocusOut from "../../lib/onFocusOut/onFocusOut";
import { TPlayer, TState } from "../../model/state";
import { TSkin, TSkinProps } from "../../ts/index";
import { colorMap, svg } from "../constants/constants";
import { createHTMLFromString } from "../utils/index";
import View from "../View";
import DropdownOptionsView from "./dropdownOptionsView";

type TPlayerDom = {
  [key: string]: {
    playerContainer: HTMLElement;
    playerBtn: HTMLElement;
    playerMark: HTMLElement;
    playerScore: HTMLElement;
    playerCurrentIndicator: HTMLElement;
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
    svgMark = svgMark.replace(/filter="url\(#drop-shadow-filter\)"/g, "");
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

  addHandlers({
    handlerChangeColor,
    handlerChangeShape,
  }: {
    handlerChangeShape: TControlPlayerShape;
    handlerChangeColor: TControlPlayerColor;
  }) {
    this.data.players.forEach(({ id }) => {
      const { dropdownOptionsView } = this.playerDom[id];

      dropdownOptionsView.addHandlerChangeShape(handlerChangeShape);
      dropdownOptionsView.addHandlerChangeColor(handlerChangeColor);
    });
  }

  addToggleDropDown() {
    const onAction = (e: Event) => {
      const target = e.target as HTMLElement;
      const btn = target.closest(".player-btn-options") as HTMLElement;

      // if (target.classList.contains("dropdown-options-container")) {
      //   return;
      // }

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
          dropdownOptionsView.cancelHiddingDropdown();
          dropdownOptionsView.addDropdown();
          playerBtn.classList.add("active");
        },
        onExit: () => {
          const extra = () => {
            playerBtn.classList.remove("active");
          };
          dropdownOptionsView.removeDropdown(extra);
        },
      });
    };

    this.parentEl.addEventListener("click", onAction);
  }

  resetPlayerIndicators() {
    const { players } = this.data;

    players.forEach(({ id }) => {
      const { playerCurrentIndicator } = this.playerDom[id];
      playerCurrentIndicator.style.background = `var(--blue-shadow)`;
    });
  }

  updatePlayerIndicator(player: TPlayer) {
    const { playerCurrentIndicator } = this.playerDom[player.id];
    const [primaryColor, secondaryColor] = colorMap[player.color];
    this.resetPlayerIndicators();

    playerCurrentIndicator.style.background = `linear-gradient(90deg, ${primaryColor} 35%, ${secondaryColor} 85%)`;
  }

  updatePlayerScore(player: TPlayer) {
    const { playerScore } = this.playerDom[player.id];
    const scoreTxt = player.score ? player.score.toString() : "-";
    playerScore.textContent = scoreTxt;
  }

  updatePlayerBtnsOnGameStart() {
    const { players } = this.data;
    players.forEach(({ id }) => {
      const { playerBtn } = this.playerDom[id];
      playerBtn.classList.remove("pre-game");
    });
  }

  updateSkinSelectionInDropdown({
    player,
    type,
  }: {
    player: TPlayer;
    type: TSkinProps;
  }) {
    const { dropdownOptionsView } = this.playerDom[player.id];

    if (Array.isArray(type)) {
      type.forEach((t) => {
        dropdownOptionsView.updatePlayerSkinSelection({
          type: t,
          value: player[t],
        });
      });
      return;
    }

    dropdownOptionsView.updatePlayerSkinSelection({
      type,
      value: player[type],
    });
  }

  updateSkinDisabledInDropdown({
    id,
    player,
    type,
  }: {
    id: string;
    player: TPlayer;
    type: TSkinProps;
  }) {
    const { dropdownOptionsView } = this.playerDom[id];

    if (Array.isArray(type)) {
      type.forEach((t) => {
        dropdownOptionsView.updatePlayerSkinDisabled({
          type: t,
          value: player[t],
        });
      });
      return;
    }

    dropdownOptionsView.updatePlayerSkinDisabled({
      type,
      value: player[type],
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
      const playerScore = <HTMLElement>(
        playerContainer.querySelector(".player-score")
      );
      const playerCurrentIndicator = <HTMLElement>(
        playerContainer.querySelector(".player-current-indicator")
      );
      const dropdownOptionsContainer = <HTMLElement>(
        playerContainer.querySelector(".dropdown-options-container")
      );
      const dropdownOptionsMenu = <HTMLElement>(
        playerContainer.querySelector(".dropdown-options-menu")
      );
      const dropdownOptionsView = new DropdownOptionsView({
        root: dropdownOptionsContainer,
        data: { players, currentPlayer: player },
      });

      this.playerDom[id] = {
        playerContainer,
        playerMark,
        playerScore,
        playerCurrentIndicator,
        dropdownOptionsView,
        dropdownOptionsMenu,
        playerBtn,
      };

      dropdownOptionsView.render({ players, currentPlayer: player });
      this.generatePlayerMark({ id, svgMark });
      this.updatePlayerScore(player);
    });
    this.generateAntMenu();
    this.addToggleDropDown();

    return;
  }

  updateSvgMark(player: TPlayer) {
    const { shape, svgShapes: shapes, id } = player;
    const { playerMark } = this.playerDom[id];
    const svgMark = player
      .getSvgShape()
      .replace(/filter="url\(#drop-shadow-filter\)"/g, "");
    this.clearChildren(playerMark);
    this.generatePlayerMark({ id, svgMark });
  }
}

export default new PlayerBtnGroup();
