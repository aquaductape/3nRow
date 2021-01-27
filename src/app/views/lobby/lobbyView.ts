import { TControlPickSkin } from "../../controllers/lobby";
import {
  TControlCreateRoom,
  TControlExitMultiplayer,
  TControlJoinRoom,
} from "../../controllers/onlineMultiplayer";
import { TPlayer } from "../../model/state";
import playerBtnGroupView from "../playerOptions/playerBtnGroupView";
import { hideElement, showElement } from "../utils/animation";
import View from "../View";
import createPrivateGameView from "./createPrivateGameView";
import joinPrivateGameView from "./joinPrivateGameView";
import preGameView, { TJoinBy, TPreGameType } from "./preGameView";
import { btnItem, toolTipMarkup } from "./skinBtns";

export type TLobbyType =
  | "enter-pre-game"
  | "create-private-game"
  | "join-private-game";

type TProps = {
  type: TLobbyType;
  joinBy: TJoinBy;
  mainPlayer: TPlayer;
  firstPlayer: TPlayer;
  players: TPlayer[];
};

/**
 * When actions take place when tab was inactive.
 * Then revisiting it, race conditions are introduced for certain UI components
 */

class LobbyView extends View {
  protected data: TProps;
  private navigationBackBtnForeign = {} as HTMLElement;
  private onExitMultiplayer: TControlExitMultiplayer = () => {};

  constructor() {
    super({ root: "#game-menu .section" });
    this.data = { type: "enter-pre-game" } as TProps;
  }

  protected markupDidGenerate() {
    const parentForeign = this.parentEl.parentElement as HTMLElement;
    this.navigationBackBtnForeign = parentForeign.querySelector(
      ".btn-navigation-back"
    ) as HTMLElement;

    this.navigationBackBtnForeign.addEventListener(
      "click",
      this.onNavigationBackBtnForeign
    );

    this.renderLobbyType();
  }

  private onNavigationBackBtnForeign = () => {
    // also restore single player shapes from LS
    playerBtnGroupView.showSvgMarks();

    this.onExitMultiplayer();

    this.navigationBackBtnForeign.removeEventListener(
      "click",
      this.onNavigationBackBtnForeign
    );
    // this.destroy();
    this.removeEventListeners();
  };

  removeEventListeners() {
    this.navigationBackBtnForeign.removeEventListener(
      "click",
      this.onNavigationBackBtnForeign
    );
    preGameView.removeEventListeners();
    createPrivateGameView.removeEventListeners();
  }

  async transitionLobbyType({ type }: { type: TLobbyType }) {
    this.data.type = type;
    await hideElement({
      el: this.parentEl,
      onEnd: () => {
        this.renderLobbyType();
      },
    });

    await showElement({
      el: this.parentEl,
    });
  }

  private renderLobbyType() {
    const { type, firstPlayer, mainPlayer, players, joinBy } = this.data;

    this.parentEl.innerHTML = this.generateMarkup();

    if (createPrivateGameView.hasRendered) {
      createPrivateGameView.destroy();
    }
    if (preGameView.hasRendered) {
      preGameView.destroy();
    }
    if (joinPrivateGameView.hasRendered) {
      joinPrivateGameView.destroy();
    }

    switch (type) {
      case "enter-pre-game":
        preGameView.render({
          preGameType: "connect-server",
          joinBy,
          firstPlayer,
          mainPlayer,
          players,
        });
        return;
      case "join-private-game":
        joinPrivateGameView.render({
          firstPlayer,
          mainPlayer,
          players,
        });
        return;
      case "create-private-game":
        createPrivateGameView.render({
          firstPlayer,
          mainPlayer,
          players,
        });
        return;
    }
  }

  protected generateMarkup() {
    return `
    <div class="lobby">
    </div>
    `;
  }

  hideAndRemoveCountDownMarkup(
    {
      duration = 200,
      delay = 0,
      removeDelay = 0,
    }: { duration?: number; delay?: number; removeDelay?: number } = {
      duration: 200,
      delay: 0,
    }
  ) {
    preGameView.hideAndRemoveCountDownMarkup({ delay, duration, removeDelay });
  }

  addHandlers({
    handlerJoinRoom,
    handlerCreateRoom,
    handlerStartGame,
    handlerPickSkin,
    handlerExitMultiplayer,
  }: {
    handlerJoinRoom: TControlJoinRoom;
    handlerCreateRoom: TControlCreateRoom;
    handlerStartGame: Function;
    handlerPickSkin: TControlPickSkin;
    handlerExitMultiplayer: TControlExitMultiplayer;
  }) {
    this.onExitMultiplayer = handlerExitMultiplayer;

    preGameView.addHandlers({
      handlerJoinRoom,
      handlerPickSkin,
      handlerStartGame,
    });
    joinPrivateGameView.addHandlers({
      handlerJoinRoom,
    });
    createPrivateGameView.addHandlers({
      handlerCreateRoom,
    });
  }

  destroy() {
    this.removeEventListeners();
    this.hideAndRemoveCountDownMarkup();
    super.destroy();
  }

  render(data: TProps) {
    super.render(data);
  }

  setData(data: Partial<TProps>) {
    super.setData(data);
  }
}

export default new LobbyView();
