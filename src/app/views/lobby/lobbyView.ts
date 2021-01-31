import { TControlPickSkin } from "../../controllers/lobby";
import {
  TControlCreateRoom,
  TControlExitMultiplayer,
  TControlJoinRoom,
} from "../../controllers/onlineMultiplayer";
import { TPlayer } from "../../model/state";
import { loaderEllipsis } from "../components/loaders";
import gameContainerView from "../gameContainer/gameContainerView";
import gameMenuView from "../gameMenu/gameMenuView";
import playerBtnGroupView from "../playerOptions/playerBtnGroupView";
import { convertObjPropsToHTMLAttr } from "../utils";
import { hideElement, showElement } from "../utils/animation";
import View from "../View";
import createPrivateGameView from "./createPrivateGameView";
import joinPrivateGameView from "./joinPrivateGameView";
import lobbyMenuBtns from "./lobbyMenuBtns";
import preGameView, { TJoinBy } from "./preGameView";

export type TLobbyType =
  | "enter-pre-game"
  | "create-private-game"
  | "join-private-game";

type TProps = {
  type?: TLobbyType;
  joinBy?: TJoinBy;
  jumpIntoSection?: boolean;
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
  private menuBtns = lobbyMenuBtns;
  private handlerExitMultiplayer: TControlExitMultiplayer = () => {};
  private handlerConnectServer: Function = () => {};
  private lobbyEl = {} as HTMLElement;

  constructor() {
    // super({ root: "#game-menu .section" });
    super({ root: "#game-menu .lobby-container" });
    this.data = { type: "enter-pre-game" } as TProps;
  }

  protected markupDidGenerate() {
    const { jumpIntoSection } = this.data;
    const parentForeign = this.parentEl.parentElement
      ?.parentElement as HTMLElement;
    this.navigationBackBtnForeign = parentForeign.querySelector(
      ".btn-navigation-back"
    ) as HTMLElement;
    this.lobbyEl = this.parentEl.querySelector(".lobby") as HTMLElement;

    this.navigationBackBtnForeign.addEventListener(
      "click",
      this.onNavigationBackBtnForeign
    );
    this.parentEl.addEventListener("click", this.onLobbyClick);

    if (jumpIntoSection) {
      setTimeout(() => {
        this.transitionSection({ type: "lobbyRoom" });
      }, 200);
      return;
    }

    gameContainerView.scaleElementsToProportionToBoard({
      selectors: ["gameMenuTitle", "gameMenuBtns", "lobbyTitle"],
    });
    // this.renderLobbyType();
    this.handlerConnectServer();
  }

  private onLobbyClick = async (e: MouseEvent) => {
    if (createPrivateGameView.hasRendered) return;
    const target = e.target as HTMLElement;
    const btn = target.closest(".btn") as HTMLElement;
    let clicked = true;
    if (e.detail === 0) clicked = false;
    if (!btn) return;

    const lobbyType = btn.dataset.lobbyType as TLobbyType;
    const joinBy = btn.dataset.joinBy as TJoinBy;
    if (!lobbyType && !joinBy) return;
    this.data.type = lobbyType;
    this.data.joinBy = joinBy;

    this.transitionSection({ type: "lobbyRoom" });
  };

  private onNavigationBackBtnForeign = (e: MouseEvent) => {
    // also restore single player shapes from LS
    const haveLobbySectionsRendered = [
      createPrivateGameView.hasRendered,
      preGameView.hasRendered,
      joinPrivateGameView.hasRendered,
    ];

    if (haveLobbySectionsRendered.some((section) => section)) {
      e.stopPropagation();

      this.transitionSection({ type: "menuBtns" });
      playerBtnGroupView.showInnerBtn({
        selectors: ["playerMark", "playerOptionsIcon"],
      });
      playerBtnGroupView.enableBtns();
      this.handlerExitMultiplayer();

      return;
    }

    this.navigationBackBtnForeign.removeEventListener(
      "click",
      this.onNavigationBackBtnForeign
    );

    this.destroy();
  };

  /**  Why not fire destroy inside child Views when their backBtn is fired?
   * 
   Because events are fired based on the order they are registered, 
   this means that this lobbyView backBtn will fire before its inner child View backBtn does.
   *
   I could keep the intended order by taking advantage of event bubbling, where the event is registered in a layered containered markup of backBtn, but that requires markup changes of backBtn, and the mechanism relies heavily on markup.
  */
  destoryLobbyRooms() {
    if (createPrivateGameView.hasRendered) {
      createPrivateGameView.destroy();
    }
    if (preGameView.hasRendered) {
      preGameView.destroy();
    }
    if (joinPrivateGameView.hasRendered) {
      joinPrivateGameView.destroy();
    }
  }

  transitionSection({ type }: { type: "menuBtns" | "lobbyRoom" }) {
    let theme: "menu" | "lobby" = "menu";
    let render: Function = () => {
      this.destoryLobbyRooms();
      // this.parentEl.innerHTML = this.generateMarkup();
      this.parentEl.innerHTML = `
      <div class="lobby">
        ${this.lobbyMenuMarkup()}
      </div>
      `;
      gameContainerView.scaleElementsToProportionToBoard({
        selectors: ["gameMenuTitle", "gameMenuBtns"],
      });
    };
    if (type === "lobbyRoom") {
      theme = "lobby";
      render = () => this.renderLobbyType();
    }
    hideElement({
      el: this.parentEl,
      onEnd: (el) => {
        render();
        gameMenuView.changeMenuTheme(theme);

        showElement({
          el,
        });
      },
    });
  }

  async transitionBetweenLobbyTypes({ type }: { type: TLobbyType }) {
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

    this.destoryLobbyRooms();

    this.parentEl.innerHTML = '<div class="lobby"></div>';

    switch (type) {
      case "enter-pre-game":
        preGameView.render({
          preGameType: "find-players",
          joinBy,
          firstPlayer,
          mainPlayer,
          players,
        });
        return;
      case "join-private-game":
        joinPrivateGameView.setData({
          firstPlayer,
          mainPlayer,
          players,
        });
        joinPrivateGameView.render();
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

  private lobbyMenuMarkup() {
    const { titleId, listBtns: btns, title, section } = this.menuBtns;
    const btnsMarkup = btns
      .map((item) => {
        const dataAttributes = convertObjPropsToHTMLAttr({
          type: "data",
          obj: item.dataAttributes,
        });
        const ariaAttributes = convertObjPropsToHTMLAttr({
          type: "aria",
          obj: item.aria,
        });

        return `
        <li class="menu-item">
          <a 
            class="${item.classNames.join(" ")}"
            ${dataAttributes}
            ${ariaAttributes}
            data-section="${section}"
            href="javascript:void(0)"
          >
            ${item.content}
          </a>
        </li>
      `;
      })
      .join("");

    const ariaLabel =
      title === "Difficulty" ? 'aria-label="Computer Difficulty"' : "";
    const titleMarkupId = titleId ? `id="${titleId}"` : "";
    const titleMarkup = title
      ? `
    <div ${titleMarkupId} class="menu-title lobby-menu-title" ${ariaLabel}>${title}</div> 
    `
      : "";

    return `
      ${titleMarkup}
      <ul class="menu-buttons">
        ${btnsMarkup}
      </ul>
    `;
  }

  private connectServerMarkup() {
    return `
    <div class="section delayed-reveal">
      <div class="lobby-title lobby-menu-title">Connecting to Server ${loaderEllipsis()}</div>
    </div>
    `;
  }

  protected generateMarkup() {
    return `
    <div class="lobby">
      ${this.connectServerMarkup()}
    </div>
    `;
    // ${this.lobbyMenuMarkup()}
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
    handlerPickSkin,
    handlerExitMultiplayer,
    handlerConnectServer,
  }: {
    handlerJoinRoom: TControlJoinRoom;
    handlerCreateRoom: TControlCreateRoom;
    handlerPickSkin: TControlPickSkin;
    handlerExitMultiplayer: TControlExitMultiplayer;
    handlerConnectServer: Function;
  }) {
    this.handlerExitMultiplayer = handlerExitMultiplayer;
    this.handlerConnectServer = handlerConnectServer;

    preGameView.addHandlers({
      handlerJoinRoom,
      handlerPickSkin,
    });
    joinPrivateGameView.addHandlers({
      handlerJoinRoom,
    });
    createPrivateGameView.addHandlers({
      handlerCreateRoom,
    });
  }

  destroy() {
    this.navigationBackBtnForeign.removeEventListener(
      "click",
      this.onNavigationBackBtnForeign
    );
    this.destoryLobbyRooms();
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
