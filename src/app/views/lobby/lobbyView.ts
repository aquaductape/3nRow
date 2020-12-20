import {
  TControlCreateRoom,
  TControlJoinRoom,
} from "../../controllers/onlineMultiplayer";
import View from "../View";

export type TLobbyType =
  | "pick-skins"
  | "find-players"
  | "load-players"
  | "share-private-game"
  | "join-private-game";
type TProps = {
  type: TLobbyType;
};
class LobbyView extends View {
  data: TProps;
  onJoinRoom: TControlJoinRoom;
  onCreateRoom: TControlCreateRoom;
  onPickSkin: Function;
  onStartGame: Function;
  constructor() {
    super({ root: "#game-menu .section" });
    this.data = { type: "find-players" };
    // minigame
    // find random players -> minigame
    // generated code -> **subscribe** -> load players -> minigame
    // enter code -> load players -> minigame
    this.onCreateRoom = () => {};
    this.onJoinRoom = () => {};
    this.onPickSkin = () => {};
    this.onStartGame = () => {};
  }

  exit() {
    // destroy
  }

  private errorMarkup() {}

  private loaderSpinner() {
    return ``;
  }

  private colorsMarkup() {
    return ``;
  }

  private shapesMarkup() {
    return ``;
  }

  private pickSkinsMarkup() {
    return `
    <div>

    <div class="pick-color">
      <div>Pick a Color</div>
      <div>
        ${this.colorsMarkup()}
      </div>
    </div>
    <div class="pick-shape">
      <div>Pick a Shape</div>
      <div>
        ${this.shapesMarkup()}
      </div>
    </div>

    </div>
    `;
  }
  private findPlayersMarkup() {
    this.onJoinRoom({ type: "public" });
    return `
    <div>
      <div>Looking for Opponents ...</div>
      <div>3 players online</div>
      <div>
      ${this.loaderSpinner()}
      </div>
    </div>
    `;
  }
  private loadPlayersMarkup() {
    return `
     <div>Found an Opponent!</div>
     `;
  }
  private joinPrivateGameMarkup() {
    this.onJoinRoom({ type: "private", password: "hello" });
    return `
    <div>
      <form>
      <label>
        <span>Room Code</span>
        <input type="text" placeholder="Enter Code ..."
      <label>
      <button type="submit" aria-label="Join Room">Join</button>
      </form>
    </div>
    `;
  }
  private sharePrivateGameMarkup() {
    this.onCreateRoom({ type: "private", password: "hello" });
    return `
    <div>
      <div class="private code">J8KS0<div>
    </div>
    `;
  }

  protected generateMarkup() {
    const { type } = this.data;
    let content = "";

    switch (type) {
      case "find-players":
        content = this.findPlayersMarkup();
        break;
      case "join-private-game":
        content = this.joinPrivateGameMarkup();
        break;
      case "load-players":
        content = this.loadPlayersMarkup();
        break;
      case "pick-skins":
        content = this.pickSkinsMarkup();
        break;
      case "share-private-game":
        content = this.sharePrivateGameMarkup();
        break;
    }

    return `
    <div class="lobby">
      ${content}
    </div>
    `;
  }

  updateBusyPlayers(amount: number) {
    const content = this.parentEl.querySelector(".busy-players") as HTMLElement;
    content.textContent = `${amount} online players`;
  }

  setLobbyType(type: TLobbyType) {
    this.data.type = type;
  }

  transitionLobbyType(type: TLobbyType) {}

  addHandlers({
    handlerJoinRoom,
    handlerCreateRoom,
    handlerStartGame,
  }: {
    handlerJoinRoom: TControlJoinRoom;
    handlerCreateRoom: TControlCreateRoom;
    handlerStartGame: Function;
  }) {
    this.onJoinRoom = handlerJoinRoom;
    this.onCreateRoom = handlerCreateRoom;
    this.onStartGame = handlerStartGame;
  }
}

export default new LobbyView();
