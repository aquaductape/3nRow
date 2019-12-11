import {
  resetOtherEventsTriggered,
  eventListenerOrder,
  isTriggeredPlayerBtnOptions,
  isTriggeredDifficultyDD
} from "./eventTriggers";
import { dom } from "../dom";
import { removeOptions, removePlayerOptions, toggleOptions } from "../options";
import gameData from "../../gameData";
import {
  toggleDropDown,
  onDropDownSettings,
  removeDropDown
} from "../dropDown";
import { startGame, moveHuman } from "../../gameLogic";
import { cleanUpGameStart, getColumnRow } from "../board";
import { isAiFinished, isAiEnabled, startAi } from "../../ai/ai";

export const onCloseAnyDropDowns = (e: Event) => {
  const eventType = e.type;
  const target = e.target;
  const activeElement = document.activeElement;
  console.log({ target, activeElement });

  // keyup instead of keydown, tabbing with keydown event listens
  // to current element before focusing to next element
  // which would always close the dropdown
  if (eventType === "keyup") {
    const key = (e as KeyboardEvent).key;
    if (key === "Escape") {
      removeOptions();
      removeDropDown();
    }
    if (key !== "Tab") {
      return null;
    }
  }

  const el = <HTMLElement>target;
  const dropDownDifficulty = el.closest("#" + dom.id.btnDifficultyDDContainer);
  const options = el.closest("." + dom.class.options);

  // closes any dropdowns when clicked outside
  // in order for this logic to work, this event
  // needs to be fired last, since some browsers don't guarantee
  // eventlisteners to be fired based on order of registration
  // it's now depending on simple state object
  if (!isTriggeredDifficultyDD() && !dropDownDifficulty) {
    removeDropDown();
  }
  if (!isTriggeredPlayerBtnOptions() && !options) {
    removeOptions();
  }

  resetOtherEventsTriggered();
};

export const valideKeyInput = (e: Event) => {
  const event = <KeyboardEvent>e;
  const eventType = event.type;
  if (eventType === "keydown") {
    const key = event.key;
    if (key !== "Enter" && key !== " ") return null;
  }
  return true;
};

export const onPlayer1BtnOptions = (e: Event) => {
  if (!valideKeyInput(e)) return null;
  eventListenerOrder.player1BtnOptions = true;
  const playerId = gameData.player1.id;

  removePlayerOptions(gameData.player2.id);
  toggleOptions({ e, playerId });
};

export const onPlayer2BtnOptions = (e: Event) => {
  if (!valideKeyInput(e)) return null;
  eventListenerOrder.player2BtnOptions = true;
  const playerId = gameData.player2.id;

  removePlayerOptions(gameData.player1.id);
  toggleOptions({ e, playerId, aiHTML: dom.html.optionsAI });
};

export const onBtnAi = (e: Event) => {
  toggleDropDown();
  onDropDownSettings();
};

export const onBtnHuman = (e: Event) => {
  startGame();
  cleanUpGameStart();
};

export const onAction = (e: Event) => {
  if (!valideKeyInput(e)) return null;

  if (gameData.gameOver || !isAiFinished()) return null;

  const { row, column, cell } = getColumnRow(e);
  moveHuman(row, column, cell);

  if (isAiEnabled()) {
    startAi();
  }
};
