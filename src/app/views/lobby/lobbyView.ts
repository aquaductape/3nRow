import { TControlPickSkin } from "../../controllers/lobby";
import {
  TControlCreateRoom,
  TControlExitMultiplayer,
  TControlJoinRoom,
} from "../../controllers/onlineMultiplayer";
import { TPlayer } from "../../model/state";
import playerBtnGroupView from "../playerOptions/playerBtnGroupView";
import View from "../View";
import createPrivateGame from "./createPrivateGame";
import joinPrivateGame from "./joinPrivateGame";
import joinPublicGame, { TPreGameType } from "./joinPublicGameView";
import { btnItem, toolTipMarkup } from "./skinBtns";

export type TLobbyType =
  | "join-public-game"
  | "create-private-game"
  | "join-private-game";

type TProps = {
  type: TLobbyType;
  preGameType?: TPreGameType;
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

  constructor() {
    super({ root: "#game-menu .section" });
    this.data = { type: "join-public-game" } as TProps;
  }

  protected markupDidGenerate() {
    const parentForeign = this.parentEl.parentElement as HTMLElement;
    const navigationBackBtnForeign = parentForeign.querySelector(
      ".btn-navigation-back"
    ) as HTMLElement;

    const onNavigationBackBtnForeign = () => {
      // also restore single player shapes from LS
      playerBtnGroupView.showSvgMarks();

      navigationBackBtnForeign.removeEventListener(
        "click",
        onNavigationBackBtnForeign
      );
    };

    navigationBackBtnForeign.addEventListener(
      "click",
      onNavigationBackBtnForeign
    );

    this.renderLobbyType();
  }

  protected renderLobbyType() {
    const { type, preGameType, firstPlayer, mainPlayer, players } = this.data;

    switch (type) {
      case "join-public-game":
        joinPublicGame.render({
          type,
          preGameType,
          firstPlayer,
          mainPlayer,
          players,
        });
        return;
      case "join-private-game":
        joinPrivateGame.render({
          firstPlayer,
          mainPlayer,
          players,
        });
        return;
      case "create-private-game":
        createPrivateGame.render({
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
    joinPublicGame.addHandlers({
      handlerExitMultiplayer,
      handlerJoinRoom,
      handlerPickSkin,
      handlerStartGame,
    });
    joinPrivateGame.addHandlers({
      handlerExitMultiplayer,
      handlerJoinRoom,
      handlerStartGame,
    });
    createPrivateGame.addHandlers({
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
