import { dom } from "./dom";

const gameStart = <HTMLDivElement>document.getElementById(dom.id.gameStart);

export const renderPlayAgain = () => {
  gameStart.innerHTML = dom.html.btnPlayAgain;
};
