import { TControlPickSkin } from "../../controllers/lobby";
import {
  TControlCreateRoom,
  TControlExitMultiplayer,
  TControlJoinRoom,
} from "../../controllers/onlineMultiplayer";
import { TPlayer } from "../../model/state";
import { TPosition } from "../../ts";
import { capitalize } from "../../utils";
import { loaderEllipsis, loaderSquare } from "../components/loaders";
import { colors, shapes, svg } from "../constants/constants";
import playerBtnGroupView from "../playerOptions/playerBtnGroupView";
import { hideElement, removeChild, showElement } from "../utils";
import View from "../View";
import { btnItem } from "./skinBtns";

// Pre-game TIMELINE
//
// FindPlayers
//  find-players
//  *opponent joins*
// ReadyPlayers
//  pick skins
//    color
//    shape
// WaitForOpponent
// DeclarePlayers
//  who's who, and who goes first
// Start Game

export type TLobbyType =
  | "enter-pre-game"
  | "share-private-game"
  | "join-private-game";

export type TPreGameType =
  | "connect-server"
  | "find-players"
  | "pick-skins"
  | "declare-players"
  | "wait-for-opponent"
  | "found-players";

type TProps = {
  type: TLobbyType;
  preGameType?: TPreGameType;
  currentPlayer: TPlayer;
  players: TPlayer[];
};

/**
 * When actions take place when tab was inactive.
 * Then revisiting it, race conditions are introduced for certain UI components
 */

class LobbyView extends View {
  data: TProps;
  private hasSelectedSkin: boolean;
  private onJoinRoom: TControlJoinRoom;
  private onCreateRoom: TControlCreateRoom;
  private onPickSkin: TControlPickSkin;
  private onExitMultiplayer: TControlExitMultiplayer;
  private onStartGame: Function;
  private addedEventListeners: boolean;
  private loaderPickSkinTimeoutID: number;
  private opponentPickedSkin: {
    color: string;
    shape: string;
  };

  constructor() {
    super({ root: "#game-menu .section" });
    this.data = { type: "enter-pre-game" } as TProps;
    this.hasSelectedSkin = false;
    this.addedEventListeners = false;
    this.loaderPickSkinTimeoutID = 0;
    this.opponentPickedSkin = { color: "", shape: "" };
    // minigame
    // find random players -> minigame
    // generated code -> **subscribe** -> load players -> minigame
    // enter code -> load players -> minigame
    this.onCreateRoom = () => {};
    this.onJoinRoom = () => {};
    this.onPickSkin = () => {};
    this.onStartGame = () => {};
    this.onExitMultiplayer = () => {};
  }

  exit() {
    // destroy
  }

  private errorMarkup() {}

  private loaderSpinner() {
    return ``;
  }

  private colorsMarkup() {
    const { currentPlayer, players } = this.data;
    const content = colors
      .map((color) =>
        btnItem({
          type: "color",
          item: color,
          playerData: { currentPlayer, players },
          opponentSkin: this.opponentPickedSkin,
        })
      )
      .join("");
    return `
    <ul class="color-group">
    ${content}
    </ul>
    `;
  }

  private shapesMarkup() {
    const { currentPlayer, players } = this.data;
    const content = shapes
      .map((shape) =>
        btnItem({
          type: "shape",
          item: shape,
          playerData: { currentPlayer, players },
          opponentSkin: this.opponentPickedSkin,
        })
      )
      .join("");
    return `
    <ul class="shape-group">
    ${content}
    </ul>
    `;
  }

  private pickSkinsMarkup({ type }: { type: "color" | "shape" }) {
    const content =
      type === "color" ? this.colorsMarkup() : this.shapesMarkup();
    return `
    <div>

    <div class="pick-skin">
      <div class="title">Pick a ${capitalize(type)}</div>
      <div class="items">
        ${content}
      </div>
    </div>

    </div>
    `;
  }

  private waitForOpponent() {
    return `
    <div class="section reveal">
    <div class="title">Waiting for Opponent ${loaderEllipsis()}</div>
    </div>
    `;
  }

  private findPlayersMarkup() {
    return `
    <div class="section reveal">
      <div class="title">Looking for Opponents ${loaderEllipsis()}</div>
      <div class="busy-players">1 player online and it's YOU!</div>
      <div>
      ${this.loaderSpinner()}
      </div>
    </div>
    `;
  }

  private foundPlayersMarkup() {
    return `
     <div>Found an Opponent!</div>
     `;
  }

  private declarePlayersMarkup() {
    return `
    <div>
    You go First!!!!
    </div>
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
  private generateCountDownMarkp() {
    const timerMarkup = `
    <div class="countdown-container">
      <div class="countdown-circle">${svg.countdownCircle}</div>
      <div class="countdown">15</div>
    </div>
    `;
    this.parentEl.insertAdjacentHTML("beforebegin", timerMarkup);
  }

  private connectServerMarkup() {
    this.onJoinRoom({ type: "public" });
    return `
    <div class="section reveal">
      <div class="title">Connecting to Server ${loaderEllipsis()}</div>
    </div>
    `;
  }

  private preGameMarkup({ type }: { type: TPreGameType }) {
    switch (type) {
      case "connect-server":
        return this.connectServerMarkup();
      case "find-players":
        return this.findPlayersMarkup();
      case "found-players":
        return this.foundPlayersMarkup();
      case "pick-skins":
        this.generateCountDownMarkp();
        return this.pickSkinsMarkup({ type: "color" });
      case "declare-players":
        return this.declarePlayersMarkup();
      case "wait-for-opponent":
        return this.waitForOpponent();
    }
  }

  protected generateMarkup() {
    const { type, preGameType } = this.data;
    let content = "";

    switch (type) {
      case "enter-pre-game":
        content = this.preGameMarkup({ type: preGameType! });
        break;
      case "join-private-game":
        content = this.joinPrivateGameMarkup();
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
    const el = this.parentEl.querySelector(".busy-players") as HTMLElement;
    if (!el) return;
    el.textContent = `${amount} online players`;
  }

  updateCountDown(counter: number) {
    const counterStart = 15;
    const strokeDash = 37;
    const counterContainer = this.parentEl.parentElement?.querySelector(
      ".countdown-container"
    ) as HTMLElement;

    if (!counterContainer) return;

    const counterEl = counterContainer.querySelector(
      ".countdown"
    ) as HTMLElement;
    const circle = counterContainer.querySelector("circle") as SVGElement;

    counterEl.textContent = `${counter}`;
    circle.style.strokeDasharray = `${strokeDash}px`;
    circle.style.strokeDashoffset = `${
      ((counterStart - counter) / counterStart) * strokeDash
    }px`;

    if (counter === 0) {
      this.hideAndRemoveCountDownMarkup({ delay: 100 });
    }
  }

  transitionPickSkin({ type }: { type: "color" | "shape" }) {
    const lobbyEl = this.parentEl.querySelector(".lobby") as HTMLElement;

    hideElement({
      el: lobbyEl,
      onStart: (el) => {
        el.style.transition = "transform 200ms, opacity 200ms";
        this.reflow();
        el.style.transform = "translateY(-50px)";
        el.style.opacity = "0";
      },
      onEnd: (el) => {
        this.clearChildren(el);
        el.style.transform = "";
        el.style.opacity = "";
        el.style.transition = "";
        el.style.display = "none";
        el.innerHTML = this.pickSkinsMarkup({ type });
        this.hasSelectedSkin = false;

        showElement({
          el,
          transition: "1000ms",
          onEnd: (el) => {
            el.style.display = "";
          },
        });
      },
    });
  }

  transitionPreGameStage({ type }: { type: TPreGameType }) {
    const lobbyEl = this.parentEl.querySelector(".lobby") as HTMLElement;
    this.data.preGameType = type;
    let onStart: ((el: HTMLElement) => void) | undefined = undefined;
    let onEndClearStyle: ((el: HTMLElement) => void) | undefined = undefined;

    if (type === "declare-players") {
      onStart = (el) => {
        el.style.transition = "transform 200ms, opacity 200ms";
        this.reflow();
        el.style.transform = "translateY(-50px)";
        el.style.opacity = "0";
      };

      onEndClearStyle = (el) => {
        el.style.transform = "";
        el.style.opacity = "";
      };
    }

    hideElement({
      el: lobbyEl,
      onStart,
      onEnd: (el) => {
        this.clearChildren(el);

        onEndClearStyle && onEndClearStyle(el);
        el.style.display = "none";
        el.innerHTML = this.preGameMarkup({ type });

        showElement({
          el,
        });
      },
    });
  }

  hideAndRemoveCountDownMarkup(
    { duration = 200, delay = 0 }: { duration?: number; delay?: number } = {
      duration: 200,
      delay: 0,
    }
  ) {
    if (!this.parentEl) return;

    const foreignParent = this.parentEl.parentElement as HTMLElement;

    if (!foreignParent) return;

    const countDownEl = foreignParent.querySelector(
      ".countdown-container"
    ) as HTMLElement;

    if (!countDownEl) return;

    hideElement({
      el: countDownEl,
      transition: `${duration}ms ${delay}ms`,
      onEnd: (el) => {
        el.style.display = "none";
        removeChild(el);
      },
    });
  }

  markupDidGenerate() {
    const parentForeign = this.parentEl.parentElement as HTMLElement;
    const lobbyEl = this.parentEl.querySelector(".lobby") as HTMLElement;
    const navigationBackBtnForeign = parentForeign.querySelector(
      ".btn-navigation-back"
    ) as HTMLElement;

    const onLobbyEvents = (e: Event) => {
      const target = e.target as HTMLElement;
      const btn = target.closest("button") as HTMLElement;
      const color = btn.dataset.color;
      const shape = btn.dataset.shape;
      const disabled = btn.dataset.disabled === "true";

      if (disabled || this.hasSelectedSkin) return;

      if (color) {
        // send to server
        // 500ms if no confirmation due to lag, show loader
        // return result
        // if picked
        // this.transitionPickSkin({ type: "shape" });
        // this.hasSelectedSkin.color = true;
        // if opponent already picked, show error message
        this.onPickSkin({ type: "color", item: color });
        this.hasSelectedSkin = true;
        // show loader
        this.showPickLoader({ container: btn, delay: 1500 });
      }

      if (shape) {
        // this.transitionPreGameStage({ type: "declare-players" });
        this.onPickSkin({ type: "shape", item: shape });
        this.hasSelectedSkin = true;
        // show loader
        this.showPickLoader({ container: btn, delay: 1500 });
      }
    };

    const onNavigationBackBtnForeign = () => {
      this.onExitMultiplayer();
      // also restore single player shapes from LS
      playerBtnGroupView.showSvgMarks();

      lobbyEl.removeEventListener("click", onLobbyEvents);
      navigationBackBtnForeign.removeEventListener(
        "click",
        onNavigationBackBtnForeign
      );
    };

    navigationBackBtnForeign.addEventListener(
      "click",
      onNavigationBackBtnForeign
    );

    lobbyEl.addEventListener("click", onLobbyEvents);
  }

  showPickLoader({
    container,
    delay,
  }: {
    container: HTMLElement;
    delay: number;
  }) {
    const generateLoader = () => {
      const markup = `
      <div class="pick-loader reveal">
        ${loaderSquare()}
      </div>
      `;
      container.insertAdjacentHTML("afterend", markup);
    };
    console.log("pick loader fired");

    // this.loaderPickSkinTimeoutID = (setTimeout(() => {
    generateLoader();
    // }, delay) as unknown) as number;
  }

  private cancelOrHidePickLoader() {
    clearTimeout(this.loaderPickSkinTimeoutID);
    const pickLoader = this.parentEl.querySelector(
      ".pick-loader"
    ) as HTMLElement;

    if (!pickLoader) return;

    removeChild(pickLoader);
  }

  failedPick() {
    this.cancelOrHidePickLoader();
    this.hasSelectedSkin = false;
  }

  showOpponentClaimedPick({
    type,
    item,
  }: {
    type: "color" | "shape";
    item: string;
    calledByServer?: boolean;
  }) {
    const btn = this.parentEl.querySelector(
      `[data-${type}="${item}"]`
    ) as HTMLElement;

    // as extra garantee, update opponent state that way skinBtn will have it when it renders, mitigating the race condition, this method will still fail but doesn't matter when the updated data will generate the correct markup
    this.opponentPickedSkin[type] = item;

    if (!btn) return;

    btn.setAttribute("aria-disabled", "true");
    btn.setAttribute("data-disabled", "true");
    btn.setAttribute("aria-hidden", "true");
    btn.setAttribute("disabled", "true");
    btn.classList.add("disabled");

    // set tooltip
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
    this.onJoinRoom = handlerJoinRoom;
    this.onCreateRoom = handlerCreateRoom;
    this.onStartGame = handlerStartGame;
    this.onPickSkin = handlerPickSkin;
    this.onExitMultiplayer = handlerExitMultiplayer;
  }

  render(data: TProps) {
    super.render(data);
  }

  setData(data: Partial<TProps>) {
    super.setData(data);
  }
}

export default new LobbyView();
