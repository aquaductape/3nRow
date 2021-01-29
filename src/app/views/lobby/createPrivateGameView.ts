import {
  TControlCreateRoom,
  TControlExitMultiplayer,
} from "../../controllers/onlineMultiplayer";
import { TPlayer } from "../../model/state";
import { loaderEllipsis } from "../components/loaders";
import { Tooltip } from "../components/Tooltip/Tooltip";
import gameContainerView, {
  TGameContainerSelectors,
} from "../gameContainer/gameContainerView";
import { createHTMLFromString } from "../utils";
import { hideElement, showElement } from "../utils/animation";
import { copyTextToClipboard } from "../utils/clipboard";
import View from "../View";

type TProps = {
  mainPlayer: TPlayer;
  firstPlayer: TPlayer;
  players: TPlayer[];
  roomCode?: string;
  roomId?: string;
};
type TStages = "connect-server" | "generating-room" | "room-created";

class CreatePrivateGameView extends View {
  protected data: TProps;
  private onCreateRoom: TControlCreateRoom = () => {};
  private copyLinkText = "";
  private copyLinkTimeout = 0;
  private onlineCircleTooltip: Tooltip | null = null;
  private onlineCircleEl = (null as unknown) as HTMLElement;
  private navigationBackBtnForeign = {} as HTMLElement;

  constructor() {
    super({ root: "#game-menu .lobby" });
    this.data = {} as TProps;
  }

  protected markupDidGenerate() {
    const parentForeign = this.parentEl.parentElement?.parentElement
      ?.parentElement as HTMLElement;
    this.navigationBackBtnForeign = parentForeign.querySelector(
      ".btn-navigation-back"
    ) as HTMLElement;

    const onNavigationBackBtnForeign = () => {
      this.removeOnlineCircle();
      this.navigationBackBtnForeign.removeEventListener(
        "click",
        onNavigationBackBtnForeign
      );
    };

    this.navigationBackBtnForeign.addEventListener(
      "click",
      onNavigationBackBtnForeign
    );

    this.parentEl.addEventListener("click", this.onClickLobby);

    gameContainerView.scaleElementsToProportionToBoard({
      selectors: ["lobbyTitle"],
    });

    console.log("created room");

    this.onCreateRoom();
  }

  private onClickLobby = async (e: Event) => {
    e.stopPropagation();
    const target = e.target as HTMLElement;
    const btnCopyLink = target.closest(".btn-copy-link");
    if (!btnCopyLink) return;

    clearTimeout(this.copyLinkTimeout);
    await copyTextToClipboard(this.copyLinkText);
    this.transitionCopyLinkContent("success");

    this.copyLinkTimeout = window.setTimeout(() => {
      this.transitionCopyLinkContent("default");
    }, 2000);
  };

  private stageMarkup({ type }: { type: TStages }) {
    switch (type) {
      case "generating-room":
        return this.generatingRoomMarkup();
      case "room-created":
        return this.roomCreatedMarkup();
    }
    return "";
  }

  private generatingRoomMarkup() {
    return `
    <div class="section delayed-reveal">
      <div class="lobby-title">Generating Private Room ${loaderEllipsis()}</div>
    </div>
`;
  }
  private roomCreatedMarkup() {
    // let shareBtn = "";
    // if (IOS || Android) {
    //   shareBtn = '<button class="btn share-btn">Share</button>';
    // }

    this.generateOnlineCircle();

    return `
    <div class="room-section delayed-reveal">
      <div class="lobby-title">Private Room</div>
      ${this.roomCardMarkup()}
      ${this.copyLinkBtnMarkup()}
    </div>
`;
  }

  private generateOnlineCircle() {
    this.onlineCircleEl = createHTMLFromString(
      this.onlineCircleMarkup()
    ) as HTMLElement;
    this.parentEl.parentElement?.parentElement?.parentElement?.appendChild(
      this.onlineCircleEl
    );
    const circleEl = this.onlineCircleEl.querySelector(
      ".circle"
    ) as HTMLElement;

    this.onlineCircleTooltip = new Tooltip({
      message: "Room is Online. <br/> Share code and wait here.",
      tooltipTargetEl: circleEl,
    });
  }

  removeOnlineCircle() {
    if (!this.onlineCircleEl) return;
    this.onlineCircleEl.remove();

    if (this.onlineCircleTooltip) {
      this.onlineCircleTooltip.destroy();
    }
    // this.parentEl.parentElement?.parentElement?.remove
  }

  private onlineCircleMarkup() {
    return `
    <div class="online-circle delayed-reveal">
      <div class="pulse"></div>
      <div class="circle"></div>
    </div>
    `;
  }

  private roomCardMarkup() {
    let { roomCode } = this.data;
    roomCode = roomCode || "AA2AA";
    return `
      <div class="room-card">
        <div class="inner">
          <div class="code-title">Code</div>
          <div class="code-content" aria-label="Room code ${roomCode
            .split("")
            .join(" ")}">${roomCode}</div>
        </div>
        <div class="shadow"></div>
      </div>`;
  }

  private copyLinkBtnMarkup() {
    let { roomCode } = this.data;
    roomCode = roomCode || "AA2AA";
    const copyLinkContent = `${
      window.location.origin + window.location.pathname
    }?code=${roomCode}`;
    this.copyLinkText = copyLinkContent;

    return `
    <button class="btn btn-copy-link" aria-label="copy url link that includes room code ${roomCode
      .split("")
      .join(" ")}">
      <div class="btn-copy-link--inner">
        <div class="fake-bar">${copyLinkContent}</div>
        <div class="fake-btn-shadow">
          <div class="fake-corner"></div>
        </div>
        <div class="fake-btn">
          <div class="fake-btn--inner">
            <span>Copy Link</span>
          </div>
        </div>
      </div>
    </button>
    `;
  }

  transitionStages = async ({ type }: { type: TStages }) => {
    await hideElement({
      el: this.parentEl,
      onEnd: (el) => {
        el.innerHTML = this.stageMarkup({ type });
        const titleSelectors: TGameContainerSelectors = ["lobbyTitle"];
        const roomCreatedSelectors: TGameContainerSelectors = [
          "roomCard",
          "lobbyTitle",
          "codeTitle",
          "codeContent",
          "onlineCircle",
          "onlineCircleCircle",
          "onlineCirclePulse",
          "btnCopyLink",
        ];
        const selectors =
          type === "room-created" ? roomCreatedSelectors : titleSelectors;

        gameContainerView.scaleElementsToProportionToBoard({
          selectors,
        });
      },
    });

    await showElement({
      el: this.parentEl,
    });
  };

  private transitionCopyLinkContent = async (
    type: "success" | "fail" | "default"
  ) => {
    const fakeBtn = this.parentEl.querySelector(
      ".fake-btn .fake-btn--inner"
    ) as HTMLElement;
    let content = "";

    switch (type) {
      case "success":
        content = "<span>Copied!</span>"; // use checkmark icon
        break;
      case "fail":
        content = "<span>Failed</span>";
      default:
        content = "<span>Copy Link</span>";
        break;
    }

    await hideElement({
      el: fakeBtn,
      onEnd: (el) => {
        el.innerHTML = content;
      },
    });

    await showElement({
      el: fakeBtn,
    });
  };

  protected generateMarkup() {
    setTimeout(() => {
      gameContainerView.scaleElementsToProportionToBoard({
        selectors: [
          "roomCard",
          "lobbyTitle",
          "codeTitle",
          "codeContent",
          "onlineCircle",
          "onlineCircleCircle",
          "onlineCirclePulse",
          "btnCopyLink",
        ],
      });
    }, 20);
    return this.stageMarkup({ type: "generating-room" });
  }

  removeEventListeners() {
    if (!this.parentEl) return;
    this.parentEl.removeEventListener("click", this.onClickLobby);
  }

  addHandlers({
    handlerCreateRoom,
  }: {
    handlerCreateRoom: TControlCreateRoom;
  }) {
    this.onCreateRoom = handlerCreateRoom;
  }

  destroy() {
    this.removeEventListeners();
    this.removeOnlineCircle();
    super.destroy();
  }

  render(data: TProps) {
    super.render(data);
  }

  setData(data: Partial<TProps>) {
    super.setData(data);
  }
}

export default new CreatePrivateGameView();
