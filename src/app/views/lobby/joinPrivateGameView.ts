import {
  TControlExitMultiplayer,
  TControlJoinRoom,
} from "../../controllers/onlineMultiplayer";
import { TPlayer } from "../../model/state";
import { loaderEllipsis } from "../components/loaders";
import gameContainerView from "../gameContainer/gameContainerView";
import { hideElement, showElement } from "../utils/animation";
import View from "../View";

type TProps = {
  mainPlayer: TPlayer;
  firstPlayer: TPlayer;
  players: TPlayer[];
  isLocating?: boolean;
  roomCode?: null | string;
};

type TStages = "connect-server" | "join-room";
class JoinPrivateGameView extends View {
  protected data: TProps;
  private onJoinRoom: TControlJoinRoom = () => {};
  private codeInputEl = {} as HTMLInputElement;
  private roomErrorEl = {} as HTMLElement;
  private formEl = {} as HTMLElement;
  private btnJoinContainer = {} as HTMLElement;
  private btnJoinEl = {} as HTMLElement;
  private locatingRoomEl = {} as HTMLElement;
  private roomErrorTimeout = 0;

  constructor() {
    super({ root: "#game-menu .lobby" });
    this.data = { isLocating: false, roomCode: null } as TProps;
    console.log(this.data);
  }

  protected markupDidGenerate() {
    const { roomCode } = this.data;
    console.log(this.data);

    this.codeInputEl = this.parentEl.querySelector(
      ".room-code-input"
    ) as HTMLInputElement;
    this.roomErrorEl = this.parentEl.querySelector(
      ".room-error"
    ) as HTMLElement;
    this.btnJoinContainer = this.parentEl.querySelector(
      ".btn-join-container"
    ) as HTMLElement;
    this.btnJoinEl = this.parentEl.querySelector(".btn-join") as HTMLElement;
    this.locatingRoomEl = this.parentEl.querySelector(
      ".locating-room"
    ) as HTMLElement;
    this.roomErrorEl = this.parentEl.querySelector(
      ".room-error span"
    ) as HTMLElement;

    if (roomCode) {
      this.codeInputEl.value = roomCode;
    }

    const parentForeign = this.parentEl.parentElement?.parentElement
      ?.parentElement as HTMLElement;
    this.formEl = this.parentEl.querySelector("form") as HTMLElement;
    const navigationBackBtnForeign = parentForeign.querySelector(
      ".btn-navigation-back"
    ) as HTMLElement;

    const onNavigationBackBtnForeign = () => {
      window.history.replaceState("", "", location.origin);
      this.destroy();
      navigationBackBtnForeign.removeEventListener(
        "click",
        onNavigationBackBtnForeign
      );
    };

    navigationBackBtnForeign.addEventListener(
      "click",
      onNavigationBackBtnForeign
    );

    this.formEl.addEventListener("submit", this.onSubmit);
    this.codeInputEl.addEventListener("input", this.onKeydownCleanCodeInput);

    gameContainerView.scaleElementsToProportionToBoard({
      selectors: ["lobbyTitle"],
    });
  }

  private onSubmit = async (e: Event) => {
    const { isLocating } = this.data;
    e.preventDefault();
    e.stopPropagation();

    if (isLocating) return;

    const value = this.codeInputEl.value;

    if (!this.validateForm(value)) return;

    this.data.isLocating = true;
    this.displaySubmitArea({ type: "locating-room-text" });
    this.onJoinRoom({ type: "private", password: value });
    window.history.replaceState("", "", location.origin);
  };

  private onKeydownCleanCodeInput = (e: Event) => {
    const prevValue = this.codeInputEl.value;
    const newValue = prevValue.replace(
      /([^a-z0-9])|([a-z])/gi,
      (_, nonMatch: string, alphaChars: string) => {
        if (nonMatch) {
          this.displayRoomError("Alpha/Number characters only");
          return "";
        }
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
    if (value.length !== 5) {
      this.displayRoomError("Must have 5 characters");
      return false;
    }
    if (value.match(/^([a-z]|[0-9]){5}$/)) {
      this.displayRoomError("Alpha/Number characters only");
      return;
    }

    return true;
  }

  private clearRoomErrorUponTimeout() {
    clearTimeout(this.roomErrorTimeout);
    this.roomErrorTimeout = window.setTimeout(() => {
      this.roomErrorEl.textContent = "";
    }, 2500);
  }

  displayRoomError(msg: string) {
    this.roomErrorEl.textContent = msg;
    this.clearRoomErrorUponTimeout();
  }

  private joinRoomMarkup = () => {
    return `
    <div class="room-section join-private-room">
      <div class="lobby-title">Join Private Room</div>
      ${this.roomErrorMarkup()}
      <form aria-label="Enter Private Room by Room Code">
      ${this.roomCodeInputMarkup()}
        <div class="btn-join-container">
          ${this.joinBtnMarkup()}
          ${this.locatingRoomMarkup()}
        </div>
      </form>
    </div>
    `;
  };

  private roomErrorMarkup() {
    return `
    <div class="room-error-container">
      <div class="room-error"><span></span></div>
    </div>
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
  private locatingRoomMarkup() {
    return `
    <div class="locating-room" style="opacity: 0;">Locating Room ${loaderEllipsis(
      {
        delay: 0,
      }
    )}</div>
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

  async displaySubmitArea({
    type,
  }: {
    type: "join-btn" | "locating-room-text";
  }) {
    if (type === "join-btn") {
      // console.log("joinbtn: before hiding");
      await hideElement({
        el: this.locatingRoomEl,
        onEnd: (el) => {
          el.style.opacity = "0";
          el.style.transition = "";
          // console.log("onEnd joinbtn: hide thislocation end");
        },
      });

      await showElement({
        el: this.btnJoinEl,
        onEnd: () => {
          // console.log("onEnd joinbtn: show btnJoinEl end");
        },
      });
      return;
    }

    if (type === "locating-room-text") {
      // console.log("before locationroom showing");
      await hideElement({
        el: this.btnJoinEl,
        onEnd: () => {
          // console.log("onEnd locationroom: hide btnjoinel");
        },
      });

      await showElement({
        el: this.locatingRoomEl,
        onStart: (el) => {
          el.style.opacity = "0";
          el.style.transition = "opacity 200ms";
          // TODO really understand what triggers restyle. I thought anything expensive, such as appendChild, would force the next actions for the next "pipeline" iteration
          // this.btnJoinContainer.appendChild(el);
          this.reflow();
          el.style.opacity = "1";
        },
        onEnd: (el) => {
          el.style.opacity = "";
          el.style.transition = "";
          console.log("onEnd locationroom: show btnjoinel");
        },
      });
      return;
    }
  }

  removeEventListeners() {
    this.formEl.removeEventListener("submit", this.onSubmit);
    this.codeInputEl.removeEventListener("input", this.onKeydownCleanCodeInput);
  }

  addHandlers({ handlerJoinRoom }: { handlerJoinRoom: TControlJoinRoom }) {
    this.onJoinRoom = handlerJoinRoom;
  }

  destroy() {
    this.removeEventListeners();
    super.destroy();
  }

  render(data?: TProps) {
    super.render(data);
  }

  setData(data: Partial<TProps>) {
    super.setData(data);
  }
}

export default new JoinPrivateGameView();
