import { TControlPickSkin } from "../../controllers/lobby";
import {
  TControlCreateRoom,
  TControlExitMultiplayer,
  TControlJoinRoom,
} from "../../controllers/onlineMultiplayer";
import { TPlayer } from "../../model/state";
import View from "../View";

type TProps = {
  mainPlayer: TPlayer;
  firstPlayer: TPlayer;
  players: TPlayer[];
};

class JoinPrivateGameView extends View {
  protected data: TProps;
  private onJoinRoom: TControlJoinRoom = () => {};
  private onPickSkin: TControlPickSkin = () => {};
  private onStartGame: Function = () => {};
  private handlerExitMultiplayer: TControlExitMultiplayer = () => {};

  constructor() {
    super({ root: "#game-menu .section" });
    this.data = {} as TProps;
  }

  protected markupDidGenerate() {
    const parentForeign = this.parentEl.parentElement as HTMLElement;
    const navigationBackBtnForeign = parentForeign.querySelector(
      ".btn-navigation-back"
    ) as HTMLElement;

    const onNavigationBackBtnForeign = () => {
      navigationBackBtnForeign.removeEventListener(
        "click",
        onNavigationBackBtnForeign
      );
    };

    navigationBackBtnForeign.addEventListener(
      "click",
      onNavigationBackBtnForeign
    );
  }

  protected generateMarkup() {
    return `
    <div>
    </div>
    `;
  }

  addHandlers({
    handlerJoinRoom,
    handlerExitMultiplayer,
    handlerStartGame,
  }: {
    handlerJoinRoom: TControlJoinRoom;
    handlerExitMultiplayer: TControlExitMultiplayer;
    handlerStartGame: Function;
  }) {
    this.onJoinRoom = handlerJoinRoom;
    this.onStartGame = handlerStartGame;
    this.handlerExitMultiplayer = handlerExitMultiplayer;
  }

  render(data: TProps) {
    super.render(data);
  }

  setData(data: Partial<TProps>) {
    super.setData(data);
  }
}

export default new JoinPrivateGameView();
