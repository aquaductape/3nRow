import {
  TControlPlayerColor,
  TControlPlayerShape,
} from "../../controllers/playerOptions";
import onFocusOut from "../../lib/onFocusOut/onFocusOut";
import { TPlayer, TState } from "../../model/state";
import { TSkin, TSkinProps } from "../../ts/index";
import { colorMap, svg } from "../constants/constants";
import { hideElement, showElement } from "../utils/animation";
import { createHTMLFromString, getOppositePlayer } from "../utils/index";
import View from "../View";
import DropdownOptionsView, { TPlayAgainst } from "./DropdownOptionsView";

type TPlayerDom = {
  [key: string]: {
    playerContainer: HTMLElement;
    playerBtn: HTMLElement;
    playerMark: HTMLElement;
    playerScore: HTMLElement;
    playerOptionsIcon: HTMLElement;
    playerCurrentIndicator: HTMLElement;
    dropdownOptionsMenu: HTMLElement;
    dropdownOptionsView: DropdownOptionsView;
  };
};

class PlayerBtnGroup extends View {
  protected data: TState;
  private playerOptions: NodeListOf<HTMLElement>;
  private playerDom: TPlayerDom;

  constructor() {
    super({ root: ".player-btn-group" });
    this.data = <TState>{};
    this.playerOptions = document.querySelectorAll(".player-options");
    this.playerDom = <TPlayerDom>{};
  }

  disableBtn(playerId: string) {
    const { playerBtn } = this.playerDom[playerId];
    playerBtn.setAttribute("disabled", "true");
  }

  enableBtn(playerId: string) {
    const { playerBtn } = this.playerDom[playerId];
    playerBtn.removeAttribute("disabled");
  }

  enableBtns() {
    const { players } = this.data;

    players.forEach((player) => {
      this.enableBtn(player.id);
    });
  }

  disableBtns() {
    const { players } = this.data;

    players.forEach((player) => {
      this.disableBtn(player.id);
    });
  }

  private _hideInnerBtn({
    playerId,
    selectors,
  }: {
    playerId: string;
    selectors: ("playerMark" | "playerOptionsIcon")[];
  }) {
    selectors.forEach((selector) => {
      const el = this.playerDom[playerId][selector];
      hideElement({
        el,
        onStart: (el) => {
          el.style.opacity = "1";
          el.style.transform = "scale(1)";
          el.style.transition = "500ms transform, 250ms 250ms opacity";
          this.reflow();
          el.style.opacity = "0";
          el.style.transform = "scale(0)";
        },
      });
    });
  }
  private _showInnerBtn({
    playerId,
    selectors,
  }: {
    playerId: string;
    selectors: ("playerMark" | "playerOptionsIcon")[];
  }) {
    selectors.forEach((selector) => {
      const el = this.playerDom[playerId][selector];

      showElement({
        el,
        onStart: (el) => {
          el.style.transition = "500ms transform, 250ms 250ms opacity";
          this.reflow();
          el.style.opacity = "1";
          el.style.transform = "scale(1)";
        },
        onEnd: (el) => {
          el.style.opacity = "";
          el.style.transform = "";
          el.style.transition = "";
        },
      });
    });
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

      // if (target.classList.contains("dropdown-options-shell")) {
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
        allow: [".dropdown-options", ".tooltip-shell"],
        run: () => {
          this.activateBtnHoverState(playerId!);
          dropdownOptionsView.expandDropdown();
          playerBtn.setAttribute("aria-expanded", "true");
        },
        onExit: () => {
          dropdownOptionsView.collapseDropdown(() =>
            this.deactiveBtnHoverState(playerId!)
          );
          playerBtn.setAttribute("aria-expanded", "false");
        },
      });
    };

    this.parentEl.addEventListener("click", onAction);
  }

  recalculateDropdownAnimations() {
    const { players } = this.data;

    players.forEach(({ id }) => {
      const { dropdownOptionsView } = this.playerDom[id];

      dropdownOptionsView.recalculateDropdownAnimation();
    });
  }
  removeForwardFillOnFinishedExpandedDropdowns() {
    const { players } = this.data;

    players.forEach(({ id }) => {
      const { dropdownOptionsView } = this.playerDom[id];

      dropdownOptionsView.recalculateDropdownAnimation();
    });
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
  updatePlayerBtnsOnPreGame() {
    const { players } = this.data;
    players.forEach(({ id }) => {
      const { playerBtn } = this.playerDom[id];
      playerBtn.classList.add("pre-game");
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
    oppositePlayer,
    type,
  }: {
    id: string;
    oppositePlayer: TPlayer;
    type: TSkinProps;
  }) {
    const { dropdownOptionsView } = this.playerDom[id];

    if (Array.isArray(type)) {
      type.forEach((t) => {
        dropdownOptionsView.updatePlayerSkinDisabled({
          type: t,
          value: oppositePlayer[t],
        });
      });
      return;
    }

    dropdownOptionsView.updatePlayerSkinDisabled({
      type,
      value: oppositePlayer[type],
    });
  }

  updatePlayAgainst({ type }: { type: TPlayAgainst }) {
    const { players } = this.data;
    players.forEach((player) => {
      const { dropdownOptionsView } = this.playerDom[player.id];
      dropdownOptionsView.setPlayAgainst({ type });
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
      const playerOptionsIcon = <HTMLElement>(
        playerContainer.querySelector(".player-options")
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
        playerOptionsIcon,
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

  showInnerBtn({
    playerId,
    selectors,
  }: {
    playerId?: string;
    selectors: ("playerMark" | "playerOptionsIcon")[];
  }) {
    if (playerId) {
      this._showInnerBtn({ playerId, selectors });
      return;
    }

    const { players } = this.data;
    players.forEach((player) => {
      this._showInnerBtn({ playerId: player.id, selectors });
    });
  }
  hideInnerBtn({
    playerId,
    selectors,
  }: {
    playerId?: string;
    selectors: ("playerMark" | "playerOptionsIcon")[];
  }) {
    if (playerId) {
      this._hideInnerBtn({ playerId, selectors });
      return;
    }

    const { players } = this.data;
    players.forEach((player) => {
      this._hideInnerBtn({ playerId: player.id, selectors });
    });
  }

  activateColorShape(playerId: string) {
    const { playerBtn } = this.playerDom[playerId];

    playerBtn.classList.add("active-color-shape");
  }

  deactivateColorShape(playerId: string) {
    const { playerBtn } = this.playerDom[playerId];

    playerBtn.classList.remove("active-color-shape");
  }

  activateBtnHoverState(playerId: string) {
    const { playerBtn } = this.playerDom[playerId];

    playerBtn.classList.add("active");
  }

  deactiveBtnHoverState(playerId: string) {
    const { playerBtn } = this.playerDom[playerId];

    playerBtn.classList.remove("active");
  }
}

export default new PlayerBtnGroup();
