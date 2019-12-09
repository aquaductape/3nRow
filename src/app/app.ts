import gameData from "./gameData";
import { startGame, moveHuman } from "./gameLogic";
import { isAiFinished, isAiEnabled, startAi } from "./ai/ai";
import { dom } from "./UI/dom";
import { IPlayer } from "../models/index";
import { setTilesAriaAll } from "./UI/aria";
import { toggleDropDown, onDropDownSettings } from "./UI/dropDown";
import { cleanUpGameStart, getColumnRow } from "./UI/board";
import { addSVGDefs } from "./UI/svgDefs";
import {
  toggleOptions,
  setPlayerSettings,
  removePlayerOptions,
  removeOptions
} from "./UI/options";
import {
  otherEventsTriggered,
  resetOtherEventsTriggered,
  eventListenerOrder
} from "./eventTriggers";

const btnBot = <HTMLDivElement>document.getElementById(dom.id.btnBot);
const btnHuman = <HTMLDivElement>document.getElementById(dom.id.btnHuman);
const cells: NodeListOf<HTMLDivElement> = document.querySelectorAll(
  dom.query.column
);

const player1BtnOptions = <HTMLElement>(
  document.getElementById(dom.id.P1BtnOptions)
);
const player2BtnOptions = <HTMLElement>(
  document.getElementById(dom.id.P2BtnOptions)
);

const closeAnyDropDowns = (e: Event) => {
  // closes any dropdowns when clicked outside
  // in order for this logic to work, this event
  // needs to be fired last, since some browsers don't guarantee
  // eventlisteners to be fired based on order of registration
  // it's now depending on simple state object
  if (otherEventsTriggered()) {
    resetOtherEventsTriggered();
    return null;
  }

  const el = <HTMLElement>e.target;
  const options = el.closest("." + dom.class.options);
  if (!options) {
    removeOptions();
  }
};

const appInit = () => {
  setPlayerSettings(gameData.player1);
  setPlayerSettings(gameData.player2);
  setTilesAriaAll({ init: true });
  addSVGDefs();
};

document.addEventListener("click", closeAnyDropDowns);
document.addEventListener("keydown", closeAnyDropDowns);

player1BtnOptions.addEventListener("click", e => {
  eventListenerOrder.player1BtnOptions = "clicked";
  const playerId = gameData.player1.id;

  removePlayerOptions(gameData.player2.id);
  toggleOptions({ e, playerId });
});
player2BtnOptions.addEventListener("click", e => {
  eventListenerOrder.player2BtnOptions = "clicked";
  const playerId = gameData.player2.id;

  removePlayerOptions(gameData.player1.id);
  toggleOptions({ e, playerId, aiHTML: dom.html.optionsAI });
});

btnBot.addEventListener("click", () => {
  toggleDropDown();
  onDropDownSettings();
});

btnHuman.addEventListener("click", () => {
  startGame();
  cleanUpGameStart();
});

const onAction = (e: Event) => {
  if (gameData.gameOver || !isAiFinished()) return null;

  const { row, column, cell } = getColumnRow(e);
  moveHuman(row, column, cell);

  if (isAiEnabled()) {
    startAi();
  }
};

cells.forEach(cell => {
  // mark cell when user clicks
  cell.addEventListener("click", onAction);
  // mark cell when user presses Enter/Space
  cell.addEventListener("keydown", e => {
    const key = e.key;
    if (key === "Enter" || key === " ") {
      onAction(e);
    }
  });
});

appInit();
