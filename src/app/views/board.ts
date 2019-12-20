import { dom } from "./dom";
import gameData from "../models/gameData";
import { setTilesAriaAll, addAriaLabel, setTilesAriaPlayerTurn } from "./aria";
import { isAiEnabled } from "../models/ai/ai";

const line = document.querySelector(dom.class.line);
const gameStart = <HTMLDivElement>document.getElementById(dom.id.gameStart);
const stats = <HTMLDivElement>document.querySelector(dom.class.stats);

export const cleanUp = (e: Event) => {
  e.preventDefault();

  let player = gameData.player1.turn ? gameData.player1 : gameData.player2;
  if (isAiEnabled()) {
    player = gameData.player1;
    gameData.player1.turn = true;
    gameData.player2.turn = false;
    gameData.aiFinished = true;
  }
  if (!stats || !line) return null;
  stats.innerHTML = `Go ${player.displayName}!`;
  line.innerHTML = "";

  gameData.gameOver = false;
  gameData.gameTie = false;
  gameData.winPosition = "";

  let count = 0;
  gameData.board = gameData.board.map(item => item.map(_ => count++));

  setTilesAriaAll({ restart: true });
  removePlayerDataAttr();
  gameStart.innerHTML = "";
};

const removePlayerDataAttr = () => {
  const board = <HTMLElement>document.querySelector("." + dom.class.board);
  const dataPlayerAll = <NodeListOf<HTMLElement>>(
    board.querySelectorAll("[data-player]")
  );
  dataPlayerAll.forEach(data => {
    data.removeAttribute("data-player");
  });
};

export const isCellMarkedDOM = (cell: HTMLDivElement) => {
  const fillFirstChild = cell.firstElementChild;
  if (!fillFirstChild) return null;

  return fillFirstChild.innerHTML.length > 0;
};

export const markBoardDOM = (cell: HTMLDivElement) => {
  if (isCellMarkedDOM(cell)) {
    return null;
  }
  const player = gameData.currentPlayer();

  cell.setAttribute("data-player", player.id);
  const fillFirstChild = cell.firstElementChild;
  if (!fillFirstChild) return null;
  fillFirstChild.innerHTML = player.svgMark;

  addAriaLabel(player, cell);
  setTilesAriaPlayerTurn();
};

export const cleanUpGameStart = () => {
  gameStart.innerHTML = "";
};

export const announceWinner = () => {
  gameData.gameOver = true;
  if (gameData.gameTie) {
    stats.innerHTML = "Cat's Game!";
    return null;
  }
  const player = gameData.currentPlayer();
  stats.innerHTML = `${player.displayName} won!`;
  setTilesAriaAll();
};

export const getColumnRow = (e: Event) => {
  const target = <HTMLDivElement>e.target;
  const targetParent = <HTMLDivElement>target.parentElement;

  const stringRow = <string>targetParent.dataset.row;
  const stringCol = <string>target.dataset.column;
  const cell = target;
  const row = parseInt(stringRow);
  const column = parseInt(stringCol);

  return { row, column, cell };
};

export const getCell = (row: number, column: number) => {
  const cellParent = <HTMLDivElement>(
    document.querySelector(`[data-row="${row}"]`)
  );
  return <HTMLDivElement>cellParent.querySelector(`[data-column="${column}"]`);
};
