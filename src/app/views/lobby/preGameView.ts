import { TControlPickSkin } from "../../controllers/lobby";
import { TControlJoinRoom } from "../../controllers/onlineMultiplayer";
import { TPlayer } from "../../model/state";
import { capitalize } from "../../utils";
import { loaderCircle, loaderEllipsis } from "../components/loaders";
import { Tooltip } from "../components/Tooltip/Tooltip";
import { colors, shapes, svg } from "../constants/constants";
import gameContainerView from "../gameContainer/gameContainerView";
import playerBtnGroupView from "../playerOptions/playerBtnGroupView";
import { createHTMLFromString, removeElement } from "../utils";
import { hideElement, showElement } from "../utils/animation";
import View from "../View";
import { btnItem } from "./skinBtns";

type TProps = {
  preGameType: TPreGameType;
  mainPlayer: TPlayer;
  firstPlayer: TPlayer;
  players: TPlayer[];
  joinBy?: TJoinBy;
};

export type TPreGameType =
  | "find-players"
  | "found-players"
  | "pick-skins"
  | "preparing-game"
  | "declare-players"
  | "wait-for-opponent"
  | "player-left";

// player leaves during pre-game
//  announce player left
//    private: go back to lobby
//    public: stay and change to find-players stage

export type TJoinBy = "private" | "created-private" | "public";
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
// Preparing Game
// DeclarePlayers
//  who's who, and who goes first
// Start Game
class PreGameView extends View {
  protected data: TProps = {
    preGameType: "find-players",
    joinBy: "public",
  } as TProps;
  private hasSelectedSkin = false;
  private transitionRunning = false;
  private transitionMarkupReplaced = false;
  private currentPreGame: TPreGameType = "find-players";
  private onJoinRoom: TControlJoinRoom = () => {};
  private onPickSkin: TControlPickSkin = () => {};
  private countDownEl = null as unknown as HTMLElement;
  private navigationBackBtnForeign = null as unknown as HTMLElement;
  private loaderPickSkinTimeoutID = 0;
  private onTransitionEndPreGameStageType: TPreGameType = "find-players";
  private opponentPickedSkin: {
    color: string;
    shape: string;
  } = {
    color: "",
    shape: "",
  };
  private countDownElHidden = false;
  private tooltips: Tooltip[] = [];

  constructor() {
    super({ root: "#game-menu .lobby" });
  }

  restartOpponentProps() {
    this.opponentPickedSkin = { color: "", shape: "" };
    this.hasSelectedSkin = false;
    this.countDownElHidden = false;
  }

  protected markupDidGenerate() {
    const { joinBy } = this.data;
    const acendantElForeign = this.parentEl.parentElement?.parentElement
      ?.parentElement as HTMLElement;
    this.navigationBackBtnForeign = acendantElForeign.querySelector(
      ".btn-navigation-back"
    ) as HTMLElement;

    this.navigationBackBtnForeign.addEventListener(
      "click",
      this.onNavigationBackBtnForeign
    );

    this.parentEl.addEventListener("click", this.onLobbyEvents);
    gameContainerView.scaleElementsToProportionToBoard({
      selectors: ["lobbyTitle"],
    });

    if (joinBy === "public") {
      this.onJoinRoom({ type: "public" });
    }
  }

  private onNavigationBackBtnForeign = () => {
    // also restore single player shapes from LS
    playerBtnGroupView.showInnerBtn({
      selectors: ["playerMark", "playerOptionsIcon"],
    });

    this.destroy();
  };

  private onLobbyEvents = (e: Event) => {
    const target = e.target as HTMLElement;
    const btn = target.closest("button") as HTMLElement;

    if (!btn) return;

    const color = btn.dataset.color;
    const shape = btn.dataset.shape;
    const disabled = btn.dataset.disabled === "true";

    if (disabled || this.hasSelectedSkin) return;

    if (color) {
      this.onPickSkin({ type: "color", item: color });
      // show loader
      this.freezeBtnsAndAwaitConfirmation({ pickedBtn: btn });
    }

    if (shape) {
      this.onPickSkin({ type: "shape", item: shape });
      // show loader
      this.freezeBtnsAndAwaitConfirmation({ pickedBtn: btn });
    }
  };

  removeEventListeners() {
    if (!this.parentEl) return;

    this.parentEl.removeEventListener("click", this.onLobbyEvents);

    if (!this.navigationBackBtnForeign) return;

    this.navigationBackBtnForeign.removeEventListener(
      "click",
      this.onNavigationBackBtnForeign
    );
  }

  protected generateMarkup() {
    const { preGameType } = this.data;
    return this.preGameMarkup({ type: preGameType });
  }

  private colorsMarkup() {
    const { mainPlayer, players } = this.data;
    const content = colors
      .map((color) =>
        btnItem({
          type: "color",
          item: color,
          playerData: { currentPlayer: mainPlayer, players },
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
    const { mainPlayer, players } = this.data;
    const content = shapes
      .map((shape) =>
        btnItem({
          type: "shape",
          item: shape,
          playerData: { currentPlayer: mainPlayer, players },
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

    <div class="pick-skin">
      <div class="lobby-title">Pick a ${capitalize(type)}</div>
      <div class="btns-group">
        ${content}
      </div>
    </div>

    `;
  }

  private waitForOpponentMarkup() {
    return `
    <div class="section delayed-reveal">
      <div class="lobby-title">Waiting for Opponent ${loaderEllipsis()}</div>
    </div>
    `;
  }

  private preparingGameMarkup() {
    return `
    <div class="section delayed-reveal">
      <div class="lobby-title">Preparing Game ${loaderEllipsis()}</div>
    </div>
    
    `;
  }

  private findPlayersMarkup() {
    return `
    <div class="section delayed-reveal">
      <div class="lobby-title">Searching for Opponents ${loaderEllipsis()}</div>
    </div>
    `;
  }

  private foundPlayersMarkup() {
    const { joinBy } = this.data;
    let msg = "Found an Opponent!";
    if (joinBy === "created-private") {
      msg = "Your Buddy has Joined the Game!";
    }

    if (joinBy === "private") {
      msg = "You have Joined your Buddy's Game!";
    }

    return `
     <div class="lobby-title">${msg}</div>
     `;
  }

  private declarePlayersMarkup() {
    const { firstPlayer, mainPlayer } = this.data;
    const svgMark = firstPlayer.getSvgShape();
    let msg =
      firstPlayer === mainPlayer
        ? "<span class='which-player'>You</span> go"
        : "<span class='which-player'>Opponent</span> goes";
    msg += " First!";

    return `
    <div class="declare-players">
      <div class="player-shape">${svgMark}</div>
      <div class="declaration">${msg}</div>
    </div>
    `;
  }

  private playerLeftMarkup() {
    return `
    <div class="section">
      <div class="lobby-title">Opponent Left!</div>
    </div>
    `;
  }
  private generateCountDownMarkp() {
    const timerMarkup = `
    <div class="player-pick-skin-countdown countdown-container">
      <div class="countdown-circle">${svg.countdownCircle}</div>
      <div class="countdown">15</div>
    </div>
    `;
    this.countDownEl = createHTMLFromString(timerMarkup) as HTMLElement;
    this.parentEl.parentElement?.parentElement?.parentElement?.appendChild(
      this.countDownEl
    );
    gameContainerView.scaleElementsToProportionToBoard({
      selectors: ["playerPickSkinCountDown"],
    });
  }

  private preGameMarkup({ type }: { type: TPreGameType }) {
    switch (type) {
      case "find-players":
        return this.findPlayersMarkup();
      case "found-players":
        return this.foundPlayersMarkup();
      case "pick-skins":
        if (!this.countDownElHidden) this.generateCountDownMarkp();
        return this.pickSkinsMarkup({ type: "color" });
      case "declare-players":
        return this.declarePlayersMarkup();
      case "wait-for-opponent":
        return this.waitForOpponentMarkup();
      case "preparing-game":
        return this.preparingGameMarkup();
      case "player-left":
        return this.playerLeftMarkup();
    }
  }

  updateBusyPlayers(amount: number) {
    const el = this.parentEl.querySelector(".busy-players") as HTMLElement;
    if (!el) return;
    el.textContent = `${amount} online players`;
  }

  transitionPreGameStage({ type }: { type: TPreGameType }) {
    if (this.data.preGameType === type) return;
    this.data.preGameType = type;

    // pause then resume
    if (type === "declare-players") {
      if (!this.transitionRunning) {
        this.onTransitionEndPreGameStageType = type;
        this._transitionPreGameStage({ type });
        return;
      }
    }

    if (type === "pick-skins" && this.transitionRunning) {
      setTimeout(() => {
        this.onTransitionEndPreGameStageType = type;
        this._transitionPreGameStage({ type });
      }, 1000);
      return;
    }

    if (this.transitionRunning && !this.transitionMarkupReplaced) {
      this.onTransitionEndPreGameStageType = type;
      return;
    }
    // overrides
    this.onTransitionEndPreGameStageType = type;
    this._transitionPreGameStage({ type });
  }

  private _transitionPreGameStage({ type }: { type: TPreGameType }) {
    // if transitioning, wait till it's done. Then pop item, clear queue, and run item transition
    this.currentPreGame = type;
    // exceptions

    this.transitionRunning = true;
    this.transitionMarkupReplaced = false;
    let onStart: ((el: HTMLElement) => void) | undefined = undefined;
    let onEndClearStyle: ((el: HTMLElement) => void) | undefined = undefined;
    let onEnd: (el: HTMLElement) => void = (el) => {
      // hideOnEnd is running
      this.clearChildren(el);

      onEndClearStyle && onEndClearStyle(el);
      this.reflow();

      if (this.onTransitionEndPreGameStageType === "declare-players") {
        onDeclarePlayers(el);
        return;
      }

      el.innerHTML = this.preGameMarkup({
        type: this.onTransitionEndPreGameStageType,
      });

      gameContainerView.scaleElementsToProportionToBoard({
        selectors: ["lobbyTitle"],
      });
      if (type === "pick-skins") {
        gameContainerView.scaleElementsToProportionToBoard({
          selectors: [
            "pickSkin",
            "pickSkinBtnsGroup",
            "pickSkinItems",
            "pickSkinTitle",
          ],
        });
      }
      this.transitionMarkupReplaced = true;
      // hideOnEnd finished

      showElement({
        el,
        removeDisplayNone: true,
        onEnd: () => {
          this.transitionRunning = false;
        },
      });
    };

    const onDeclarePlayers = (el: HTMLElement) => {
      this.clearChildren(el);

      // replaceMarkup
      el.innerHTML = this.preGameMarkup({
        type: this.onTransitionEndPreGameStageType,
      });
      gameContainerView.declarePlayersAnimationRunning = true;
      gameContainerView.scaleElementsToProportionToBoard({
        // type: "declare-players",
        selectors: [
          "declarePlayersDeclaration",
          "declarePlayersShape",
          "slideDeclarePlayersStylesheet",
        ],
      });
      gameContainerView.declarePlayersAnimationRunning = false;
      el.style.display = "";
      this.reflow();
      this.transitionMarkupReplaced = true;

      setTimeout(() => {
        const { firstPlayer } = this.data;

        playerBtnGroupView.updatePlayerIndicator(firstPlayer);
      }, 500);

      showElement({
        el,
        delay: 200,
        removeDisplayNone: true,
        transition: "200ms",
        onEnd: (el) => {
          this.transitionRunning = false;
        },
      });
    };

    if (type === "preparing-game" || type === "wait-for-opponent") {
      onStart = (el) => {
        el.style.transition = "transform 200ms, opacity 200ms";
        this.reflow();
        el.style.transform = "translateY(-50px)";
        el.style.opacity = "0";
        this.tooltips.forEach((tooltip) => tooltip.hide());
      };

      onEndClearStyle = (el) => {
        el.style.transform = "";
        el.style.opacity = "";
      };
    }

    if (type === "declare-players") {
      onEnd = onDeclarePlayers;
    }

    hideElement({
      el: this.parentEl,
      displayNone: true,
      onStart,
      onEnd,
    });
  }

  updateCountDown(counter: number) {
    const counterStart = 15;
    const strokeDash = 37;

    if (counter === 0) {
      this.countDownElHidden = true;
      this.hideAndRemoveCountDownMarkup({ delay: 100 });
    }

    if (!this.countDownEl) return;
    const countDownTxt = this.countDownEl.querySelector(
      ".countdown"
    ) as HTMLElement;
    const circle = this.countDownEl.querySelector("circle") as SVGElement;

    countDownTxt.textContent = `${counter}`;
    circle.style.strokeDasharray = `${strokeDash}px`;
    circle.style.strokeDashoffset = `${
      ((counterStart - counter) / counterStart) * strokeDash
    }px`;
  }

  async transitionPickSkin({ type }: { type: "color" | "shape" }) {
    await hideElement({
      el: this.parentEl,
      displayNone: true,
      // delay: 100,
      onStart: (el) => {
        el.style.opacity = "1";
        el.style.transition = "transform 250ms, opacity 200ms";
        this.reflow();
        el.style.transform = "translateY(-50px)";
        el.style.opacity = "0";
      },
      onEnd: (el) => {
        this.clearChildren(el);
        el.style.transform = "";
        el.style.opacity = "";
        el.style.transition = "";
        el.innerHTML = this.pickSkinsMarkup({ type });

        if (this.opponentPickedSkin[type]) {
          this.showOpponentClaimedPick({
            type,
            item: this.opponentPickedSkin[type],
          });
        }

        gameContainerView.scaleElementsToProportionToBoard({
          selectors: [
            "pickSkin",
            "pickSkinBtnsGroup",
            "pickSkinItems",
            "pickSkinTitle",
          ],
        });
        this.hasSelectedSkin = false;
      },
    });

    await showElement({
      el: this.parentEl,
      delay: 200,
      transition: "1000ms",
      removeDisplayNone: true,
    });
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
    if (!this.parentEl) return;

    if (!this.countDownEl) return;

    hideElement({
      el: this.countDownEl,
      transition: `${duration}ms ${delay}ms`,
      onEnd: (el) => {
        el.style.display = "none";
        this.countDownEl.remove();
      },
    });
  }

  private unfreezeBtns() {
    const btnsContainer = this.parentEl.querySelector(
      ".btns-group"
    ) as HTMLElement;
    const btns = btnsContainer.querySelectorAll("button");

    btns.forEach((btn) => {
      btn.classList.remove("frozen");
      btn.classList.remove("selected");
    });

    this.hasSelectedSkin = false;
  }

  private freezeBtnsAndAwaitConfirmation({
    pickedBtn,
  }: {
    pickedBtn: HTMLElement;
  }) {
    const btnsContainer = this.parentEl.querySelector(
      ".btns-group"
    ) as HTMLElement;
    const btns = btnsContainer.querySelectorAll("button");
    // make grayscale
    // btnsContainer.classList.add("selected");
    btns.forEach((btn) => {
      if (btn !== pickedBtn) {
        btn.classList.add("frozen");
      }
    });

    this.hasSelectedSkin = true;
    // select pick btn
    pickedBtn.classList.add("selected");
    // show loader
    this.showPickLoader({ pickedBtn, delay: 500 });
  }

  private showPickLoader({
    pickedBtn,
    delay,
  }: {
    pickedBtn: HTMLElement;
    delay: number;
  }) {
    const itemInner = pickedBtn.querySelector(
      "[data-pick-item-inner]"
    ) as HTMLElement;
    const generateLoader = () => {
      const markup = `
      <div class="pick-loader delayed-reveal">
        <div class="picker-loader-circle">${loaderCircle()}</div>
      </div>
      `;
      itemInner.insertAdjacentHTML("beforeend", markup);
    };

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

    removeElement(pickLoader);
  }

  failedPick({ type, value }: { type: "color" | "shape"; value: string }) {
    const btn = this.parentEl.querySelector(
      `[data-${type}="${value}"]`
    ) as HTMLElement;

    this.cancelOrHidePickLoader();
    this.unfreezeBtns();
    this.generateTooltip({ type, pickedBtn: btn });
  }

  showOpponentClaimedPick({
    type,
    item,
  }: {
    type: "color" | "shape";
    item: string;
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
    this.generateTooltip({ type, pickedBtn: btn });
  }

  private generateTooltip({
    type,
    pickedBtn,
  }: {
    type: "color" | "shape";
    pickedBtn: HTMLElement;
  }) {
    const message = `Opponent already has this <strong>${type}</strong>`;
    // the button is disabled, which results `mouseenter` and `click` events to be ignored which enables tooltip. So targetEl is its child
    const tooltipTargetEl = pickedBtn.firstElementChild as HTMLElement;

    const tooltip = new Tooltip({
      message,
      tooltipTargetEl,
    });
    this.tooltips.push(tooltip);
  }

  addHandlers({
    handlerJoinRoom,
    // handlerCreateRoom,
    handlerPickSkin,
  }: {
    handlerJoinRoom: TControlJoinRoom;
    // handlerCreateRoom: TControlCreateRoom;
    handlerPickSkin: TControlPickSkin;
  }) {
    this.onJoinRoom = handlerJoinRoom;
    // this.onCreateRoom = handlerCreateRoom;
    this.onPickSkin = handlerPickSkin;
  }

  destroy() {
    this.removeEventListeners();
    this.hideAndRemoveCountDownMarkup();
    // this.tooltips.forEach((tooltip) => tooltip.destroy());
    super.destroy();
  }

  render(data: TProps) {
    super.render(data);
  }

  setData(data: Partial<TProps>) {
    super.setData(data);
  }
}

export default new PreGameView();
