import { dom } from "../../dom";
import gameData from "../../../models/gameData";

export const controllerResetScores = () => {
  const resetScores = <HTMLElement>(
    document.getElementById(dom.id.optionsResetScores)
  );
  resetScores.addEventListener("click", () => {
    const scoresDOM = document.querySelectorAll("." + dom.class.playerScore);
    const player1 = gameData.player1;
    const player2 = gameData.player2;
    player1.score = 0;
    player2.score = 0;
    localStorage.setItem(`${player1.id}-score`, "0");
    localStorage.setItem(`${player2.id}-score`, "0");
    scoresDOM.forEach(score => (score.innerHTML = "-"));
  });
};