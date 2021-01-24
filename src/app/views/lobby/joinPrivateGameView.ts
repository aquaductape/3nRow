import {
  TControlExitMultiplayer,
  TControlJoinRoom,
} from "../../controllers/onlineMultiplayer";
import { TPlayer } from "../../model/state";
import gameContainerView from "../gameContainer/gameContainerView";
import View from "../View";

type TProps = {
  mainPlayer: TPlayer;
  firstPlayer: TPlayer;
  players: TPlayer[];
};

type TStages = "connect-server" | "join-room";
class JoinPrivateGameView extends View {
  protected data: TProps;
  private onJoinRoom: TControlJoinRoom = () => {};
  private onStartGame: Function = () => {};
  private handlerExitMultiplayer: TControlExitMultiplayer = () => {};
  private codeInputEl = {} as HTMLInputElement;
  private roomErrorEl = {} as HTMLElement;

  constructor() {
    super({ root: "#game-menu .lobby" });
    this.data = {} as TProps;
  }

  protected markupDidGenerate() {
    this.codeInputEl = this.parentEl.querySelector(
      ".room-code-input"
    ) as HTMLInputElement;
    this.roomErrorEl = this.parentEl.querySelector(
      ".room-error"
    ) as HTMLElement;

    const parentForeign = this.parentEl.parentElement
      ?.parentElement as HTMLElement;
    const form = this.parentEl.querySelector("form");
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

    form?.addEventListener("submit", this.onSubmit);
    this.codeInputEl.addEventListener("input", this.onKeydownCleanCodeInput);

    gameContainerView.scaleElementsToProportionToBoard({
      selectors: ["lobbyTitle"],
    });
  }

  private onSubmit = (e: Event) => {
    e.preventDefault();
    const value = this.codeInputEl.value;
    if (!this.validateForm(value)) return;
    this.onJoinRoom({ type: "private", password: value });
  };

  private onKeydownCleanCodeInput = (e: Event) => {
    const prevValue = this.codeInputEl.value;
    const newValue = prevValue.replace(
      /([^a-z0-9])|([a-z])/gi,
      (_, nonMatch: string, alphaChars: string) => {
        if (nonMatch) return "";
        if (alphaChars) return alphaChars.toUpperCase();
        return _;
      }
    );
    let position = this.codeInputEl.selectionStart!;
    position = prevValue.length === newValue.length ? position : position - 1;

    this.codeInputEl.value = newValue;
    this.codeInputEl.selectionEnd = position;
  };

  private validateForm(value: string) {
    if (!value) return false;
    if (value.length !== 5) {
      // must have 5 characters
      return false;
    }
    if (value.match(/^([a-z]|[0-9]){5}$/)) {
      //  Only alphabetic characters and numbers
      return;
    }

    return true;
  }

  private joinRoomMarkup = () => {
    return `
    <div class="room-section join-private-room delayed-reveal">
      <div class="lobby-title">Join Private Room</div>
      ${this.roomErrorMarkup()}
      <form aria-label="Enter Private Room by Room Code">
        ${this.roomCodeInputMarkup()}
        ${this.joinBtnMarkup()}
      </form>
    </div>
    `;
  };

  private roomErrorMarkup() {
    return `
    <div class="room-error"></div>
    `;
  }

  private roomCodeInputMarkup() {
    return `
      <input class="room-code-input" type="text" maxlength="5" placeholder="Enter Code">
    `;
  }
  private joinBtnMarkup() {
    return `
    <button type="submit" class="btn btn-primary btn-join">Join</button>
    `;
  }

  private stageMarkup({ type }: { type: TStages }) {
    switch (type) {
      case "join-room":
        return this.joinRoomMarkup();
    }
    return "";
  }

  // private

  protected generateMarkup() {
    return this.stageMarkup({ type: "join-room" });
  }

  removeEventListeners() {
    this.parentEl.removeEventListener("click", this.joinRoomMarkup);
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
