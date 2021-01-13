import { TPlayer } from "../../model/state";
import gameContainerView from "../gameContainer/gameContainerView";
import playerBtnGroupView from "../playerOptions/playerBtnGroupView";
import { clearChildren, reflow } from "../utils";
import { hideElement, showElement } from "../utils/animation";
import { TPreGameType } from "./joinPublicGameView";

export const transitionPreGameStage = ({
  type,
  onPreGameMarkup,
  firstPlayer,
  lobbyEl,
}: {
  type: TPreGameType;
  firstPlayer: TPlayer;
  onPreGameMarkup: () => string;
  lobbyEl: HTMLElement;
}) => {
  let onStart: ((el: HTMLElement) => void) | undefined = undefined;
  let onEndClearStyle: ((el: HTMLElement) => void) | undefined = undefined;
  let onEnd: (el: HTMLElement) => void = (el) => {
    // hideOnEnd is running
    clearChildren(el);

    onEndClearStyle && onEndClearStyle(el);
    el.style.display = "none";
    el.innerHTML = onPreGameMarkup();
    // hideOnEnd finished

    showElement({
      el,
      onStart: () => {
        // showAnimation is running
      },
      onEnd: () => {
        // showAnimation finished
      },
    });
  };

  if (type === "preparing-game") {
    onStart = (el) => {
      el.style.transition = "transform 200ms, opacity 200ms";
      reflow();
      el.style.transform = "translateY(-50px)";
      el.style.opacity = "0";
    };

    onEndClearStyle = (el) => {
      el.style.transform = "";
      el.style.opacity = "";
    };
  }

  if (type === "declare-players") {
    onEnd = (el) => {
      clearChildren(el);

      el.style.display = "none";
      el.innerHTML = onPreGameMarkup();
      gameContainerView.declarePlayersAnimationRunning = true;
      gameContainerView.scaleElementsToProportionToBoard({
        type: "declare-players",
      });

      setTimeout(() => {
        playerBtnGroupView.activateColorSvgMark(firstPlayer.id);
        playerBtnGroupView.updatePlayerIndicator(firstPlayer);
      }, 500);

      showElement({
        el,
        delay: 200,
        transition: "200ms",
        onEnd: (el) => {},
      });
    };
  }

  hideElement({
    el: lobbyEl,
    onStart,
    onEnd,
  });
};
