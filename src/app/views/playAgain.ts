import { dom } from "./dom";

const gameStart = <HTMLDivElement>document.getElementById(dom.id.gameStart);

export const renderPlayAgain = () => {
  gameStart.innerHTML = dom.html.btnPlayAgain;

  gameStart.style.background = "#0009";
  gameStart.style.display = "flex";
  setTimeout(() => {
    gameStart.style.transform = "scale(1)";
  }, 1000);
};
