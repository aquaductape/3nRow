import gameData from "./gameData";
import { dom } from "./UI/dom";
import { setTilesAriaAll } from "./UI/aria";
import { addSVGDefs } from "./UI/svgDefs";
import { setPlayerSettings } from "./UI/options";
import {
  onCloseAnyDropDowns,
  onAction,
  onBtnAi,
  onBtnHuman,
  onPlayer1BtnOptions,
  onPlayer2BtnOptions
} from "./UI/events/eventListeners";

const btnAi = <HTMLElement>document.getElementById(dom.id.btnAi);
const btnHuman = <HTMLElement>document.getElementById(dom.id.btnHuman);
const cells: NodeListOf<HTMLElement> = document.querySelectorAll(
  dom.query.dataColumn
);
const player1BtnOptions = <HTMLElement>(
  document.getElementById(dom.id.P1BtnOptions)
);
const player2BtnOptions = <HTMLElement>(
  document.getElementById(dom.id.P2BtnOptions)
);

const appInit = () => {
  gameData.player1.turn = true;
  setPlayerSettings(gameData.player1);
  setPlayerSettings(gameData.player2);
  setTilesAriaAll({ init: true });
  addSVGDefs();
};

document.addEventListener("click", onCloseAnyDropDowns);
document.addEventListener("keyup", onCloseAnyDropDowns);

player1BtnOptions.addEventListener("click", onPlayer1BtnOptions);
player1BtnOptions.addEventListener("keydown", onPlayer1BtnOptions);
player2BtnOptions.addEventListener("click", onPlayer2BtnOptions);
player2BtnOptions.addEventListener("keydown", onPlayer2BtnOptions);

btnAi.addEventListener("click", onBtnAi);
btnHuman.addEventListener("click", onBtnHuman);

cells.forEach(cell => {
  // mark cell when user clicks
  cell.addEventListener("click", onAction);
  // mark cell when user presses Enter/Space
  cell.addEventListener("keydown", onAction);
});

appInit();
