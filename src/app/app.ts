import gameData from "./models/gameData";
import { dom } from "./views/dom";
import { setTilesAriaAll } from "./views/aria";
import { addSVGDefs } from "./views/svgDefs";
import { setPlayerSettings } from "./views/playerOptions/playerOptions";
import {
  onCloseAnyDropDowns,
  onAction,
  onBtnAi,
  onBtnHuman,
  onPlayer1BtnOptions,
  onPlayer2BtnOptions,
  onPlayAgain
} from "./appControllers";
import { renderAntMenu } from "./views/antMenu";

const btnAi = <HTMLElement>document.querySelector("." + dom.class.btnAi);
const btnHuman = <HTMLElement>document.querySelector("." + dom.class.btnHuman);
const cells: NodeListOf<HTMLElement> = document.querySelectorAll(
  dom.query.dataColumn
);
const gameStart = <HTMLElement>document.getElementById(dom.id.gameStart);
const board = <HTMLElement>document.querySelector("." + dom.class.board);
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
  renderAntMenu();
};

document.addEventListener("click", onCloseAnyDropDowns);
document.addEventListener("keyup", onCloseAnyDropDowns);

player1BtnOptions.addEventListener("click", onPlayer1BtnOptions);
player1BtnOptions.addEventListener("keydown", onPlayer1BtnOptions);
player2BtnOptions.addEventListener("click", onPlayer2BtnOptions);
player2BtnOptions.addEventListener("keydown", onPlayer2BtnOptions);

btnAi.addEventListener("click", onBtnAi);
btnHuman.addEventListener("click", onBtnHuman);

gameStart.addEventListener("click", e => {
  const target = <HTMLElement>e.target;

  if (target.closest("#btn-play_again")) {
    onPlayAgain(e);
  }
});

board.addEventListener("click", e => {
  const target = <HTMLElement>e.target;
  if (target.closest(dom.query.dataColumn)) onAction(e);
});

board.addEventListener("keydown", e => {
  const target = <HTMLElement>e.target;
  if (target.closest(dom.query.dataColumn)) onAction(e);
});

appInit();
