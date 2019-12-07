import gameData from "./gameData";
import { startGame, moveHuman } from "./gameLogic";
import { isAiFinished, isAiEnabled, startAi } from "./ai/ai";
import { dom } from "./UI/dom";
import { IPlayer } from "../models/index";
import { setTilesAriaAll } from "./UI/aria";
import { toggleDropDown, onDropDownSettings } from "./UI/dropDown";
import { cleanUpGameStart, getColumnRow } from "./UI/board";

const btnBot = <HTMLDivElement>document.getElementById(dom.id.btnBot);
const btnHuman = <HTMLDivElement>document.getElementById(dom.id.btnHuman);
const cells: NodeListOf<HTMLDivElement> = document.querySelectorAll(
  dom.query.column
);

const appInit = () => {
  setPlayerSettings(gameData.player1);
  setPlayerSettings(gameData.player2);
  setTilesAriaAll({ init: true });
};

const setPlayerSettings = (player: IPlayer) => {
  const playerBtn = <Element>document.getElementById(player.id + "-btn");
  const playerMark = <Element>(
    playerBtn.querySelector("." + dom.class.playerMark)
  );
  // const playerName = <Element>(
  //   playerBtn.querySelector("." + dom.class.playerName)
  // );

  playerMark.innerHTML = player.svgMark;
  // playerName.innerHTML = player.displayName;
};

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
