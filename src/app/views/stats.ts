import { dom } from "./dom";
import gameData from "../models/gameData";
import { randomTurnTexts } from "../models/dialog";

const stats = <HTMLDivElement>document.querySelector(dom.class.stats);
export const postStats = () => {
  if (!stats || gameData.gameOver || gameData.gameTie) return null;
  if (gameData.currentPlayer().ai) {
    stats.innerHTML = "";
    return;
  }
  stats.innerHTML = randomTurnTexts(gameData.currentPlayer().displayName);
};
