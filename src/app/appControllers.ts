import {
  removeAllPlayerOptions,
  removePlayerOptionsById,
  toggleOptions,
  randomShapeAndColorAi,
  removeCurrentPlayerOption
} from "./views/playerOptions/playerOptions";
import { removeDropDown } from "./views/dropDown/dropDown";
import { dom } from "./views/dom";
import {
  isTriggeredDifficultyDD,
  isTriggeredPlayerBtnOptions,
  resetOtherEventsTriggered,
  eventListenerOrder
} from "./views/events/eventTriggers";
import gameData from "./models/gameData";
import { startGame, moveHuman } from "./models/gameLogic";
import {
  cleanUpGameStart,
  getColumnRow,
  cleanUp,
  isCellMarkedDOM
} from "./views/board";
import { isAiFinished, isAiEnabled, startAi } from "./models/ai/ai";

const closeCurrentPopUp = (target: HTMLElement) => {
  let closestTarget = <HTMLElement>(
    target.closest("." + dom.class.btnDifficultyDDContainer)
  );
  const dropDownDifficulty =
    closestTarget &&
    <HTMLElement>(
      closestTarget.querySelector("." + dom.class.dropDownDifficulty)
    );
  if (closestTarget && dropDownDifficulty) {
    removeDropDown({ refocus: true });
    return null;
  }
  closestTarget = <HTMLElement>(
    target.closest("." + dom.class.dropDownOptionsMenu)
  );
  if (closestTarget) {
    removeCurrentPlayerOption(closestTarget);
    return null;
  }
};

export const onCloseAnyDropDowns = (e: Event) => {
  const eventType = e.type;
  const target = e.target;

  // keyup instead of keydown, tabbing with keydown event listens
  // to current element before focusing to next element
  // which would always close the dropdown
  if (eventType === "keyup") {
    const key = (e as KeyboardEvent).key;
    if (key === "Escape") {
      closeCurrentPopUp(target as HTMLElement);
    }
    if (key !== "Tab") {
      resetOtherEventsTriggered();
      return null;
    }
  }

  const el = <HTMLElement>target;
  const dropDownDifficulty = el.closest(
    "." + dom.class.btnDifficultyDDContainer
  );
  const options = el.closest("." + dom.class.dropDownOptions);

  // closes any dropdowns when clicked outside
  // in order for this logic to work, this event
  // needs to be fired last, since some browsers don't guarantee
  // eventlisteners to be fired based on order of registration
  // it's now depending on simple state object
  if (!isTriggeredDifficultyDD() && !dropDownDifficulty) {
    removeDropDown();
  }
  if (!isTriggeredPlayerBtnOptions() && !options) {
    removeAllPlayerOptions();
  }

  resetOtherEventsTriggered();
};

export const valideKeyInput = (e: Event) => {
  const event = <KeyboardEvent>e;
  const eventType = event.type;
  if (eventType === "keydown") {
    const key = event.key;
    if (key !== "Enter" && key !== " ") return false;
  }
  return true;
};

export const onPlayer1BtnOptions = (e: Event) => {
  if (!valideKeyInput(e)) return null;
  eventListenerOrder.player1BtnOptions = true;
  const playerId = gameData.player1.id;

  removePlayerOptionsById(gameData.player2.id);
  toggleOptions({ e, playerId });
};

export const onPlayer2BtnOptions = (e: Event) => {
  if (!valideKeyInput(e)) return null;
  eventListenerOrder.player2BtnOptions = true;
  const playerId = gameData.player2.id;
  const optionsAiStr = dom.html.optionsAI;

  removePlayerOptionsById(gameData.player1.id);
  toggleOptions({ e, playerId, aiHTML: optionsAiStr });
};

export const onBtnAi = (e: Event) => {
  // toggleDropDown();
  // onDropDownSettings();
  startGame({
    ai: true,
    difficulty: "IMPOSSIBLE"
  });
  cleanUpGameStart();
};

export const onBtnHuman = (e: Event) => {
  startGame();
  cleanUpGameStart();
};

export const onAction = (e: Event) => {
  if (!valideKeyInput(e)) return null;
  const target = <HTMLElement>e.target;

  if (gameData.gameOver || !isAiFinished() || isCellMarkedDOM(target)) {
    return null;
  }

  cleanUpGameStart();

  const { row, column, cell } = getColumnRow(e);
  moveHuman(row, column, cell);

  if (isAiEnabled()) {
    startAi();
  }
};

export const onPlayAgain = (e: Event) => {
  cleanUp(e);
  randomShapeAndColorAi();
};
