import { TControlPickSkin } from "../../controllers/lobby";
import {
  TControlCreateRoom,
  TControlExitMultiplayer,
  TControlJoinRoom,
} from "../../controllers/onlineMultiplayer";
import { TPlayer } from "../../model/state";
import playerBtnGroupView from "../playerOptions/playerBtnGroupView";
import View from "../View";
import createPrivateGameView from "./createPrivateGameView";
import joinPrivateGameView from "./joinPrivateGameView";
import preGameView, { TPreGameType } from "./preGameView";
import { btnItem, toolTipMarkup } from "./skinBtns";

export type TLobbyType =
  | "join-public-game"
  | "create-private-game"
  | "join-private-game";

type TProps = {
  type: TLobbyType;
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

  constructor() {
    super({ root: "#game-menu .section" });
    this.data = { type: "join-public-game" } as TProps;
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

    createPrivateGameView.removeOnlineCircle();
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

  protected renderLobbyType() {
    const { type, firstPlayer, mainPlayer, players } = this.data;

    switch (type) {
      case "join-public-game":
        preGameView.render({
          preGameType: "connect-server",
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
    preGameView.addHandlers({
      handlerExitMultiplayer,
      handlerJoinRoom,
      handlerPickSkin,
      handlerStartGame,
    });
    joinPrivateGameView.addHandlers({
      handlerExitMultiplayer,
      handlerJoinRoom,
      handlerStartGame,
    });
    createPrivateGameView.addHandlers({
      handlerCreateRoom,
      handlerExitMultiplayer,
      handlerStartGame,
    });
  }

  render(data: TProps) {
    super.render(data);
  }

  setData(data: Partial<TProps>) {
    super.setData(data);
  }
}

export default new LobbyView();
