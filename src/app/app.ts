import data from "./gameData";
import { animateLine, addStartBtn } from "./animate";
import { randomGen } from "./dialog";

const cells: NodeListOf<HTMLDivElement> = document.querySelectorAll(
  "[data-column]"
);
const stats = document.querySelector(".stats");
// const line = document.querySelector(".line-svg");

interface IPlayer {
  name: string;
  shape: string;
  score: number;
  turn: boolean;
  mark: number;
}

export const gameInit = () => {
  //Player One goes first
  data.player1.turn = true;
  if (!stats) return null;
  stats.innerHTML = `Go ${data.player1.name}!`;
};

const onAction = (e: Event) => {
  const target = <HTMLDivElement>e.currentTarget;
  const targetParent = target.parentElement;
  if (!targetParent) return;

  const row = targetParent.getAttribute("data-row");
  const column = target.getAttribute("data-column");
  const cell = <HTMLDivElement>e.currentTarget;
  if (!column || !cell || !row) return null;
  // data;

  const player = fillBoard(parseInt(row), parseInt(column), cell);

  const animate = checkBoard(player);
  animateLine(animate);
};

cells.forEach(cell => {
  cell.addEventListener("click", onAction);
  cell.addEventListener("keydown", e => {
    const key = e.key;
    if (key === "Enter" || key === " ") {
      onAction(e);
    }
  });
});

const gameOver = (playerName: string) => {
  addStartBtn();
  announceWinner(playerName);
};

const announceWinner = (name: string) => {
  if (!stats) return null;
  stats.innerHTML = `${name} won!`;
  data.gameOver = true;
};

const checkBoard = (player: IPlayer | null): null | string => {
  if (!stats) return null;
  // returns when game is over or tile is already filled
  if (!player) {
    return null;
  }

  // check row
  for (let row = 0; row < data.board.length; row++) {
    if (data.board[row].every(item => item === player.mark)) {
      gameOver(player.name);
      return `row${row}`;
    }

    // check column
    let count = 0;
    for (let column = 0; column < data.board.length; column++) {
      if (data.board[column][row] === player.mark) {
        count++;
        if (count === data.board.length) {
          gameOver(player.name);
          return `col${row}`;
        }
      }
    }
  }

  //check diagonal
  let diagonal1 = 0;
  let diagonal2 = 0;
  // [0,0][1,1][2,2]
  // [0,2][1,1][2,0]
  for (let i = 0; i < data.board.length; i++) {
    if (data.board[i][i] === player.mark) {
      diagonal1++;
      if (diagonal1 === data.board.length) {
        gameOver(player.name);
        return "diagTopLeft";
      }
    }

    if (data.board[i][data.board.length - 1 - i] === player.mark) {
      diagonal2++;
      if (diagonal2 === data.board.length) {
        gameOver(player.name);
        return "diagBotLeft";
      }
    }
  }

  // check cat's game
  let countBoolean = 0;
  for (let i = 0; i < data.board.length; i++) {
    if (data.board[i].every(item => item !== null)) {
      countBoolean++;
    }
  }

  if (countBoolean === 3) {
    addStartBtn();
    stats.innerHTML = `Cat's game!`;
  }

  return null;
};

const nextPlayerTurn = (player1: IPlayer, player2: IPlayer) => {
  const player = player1.turn ? player2 : player1;

  player1.turn = !player1.turn;
  player2.turn = !player2.turn;

  return player;
};

const fillBoard = (row: number, column: number, cell: HTMLDivElement) => {
  // if board already filled return nothing
  if (data.board[row][column] !== null || data.gameOver) {
    return null;
  }

  const player = nextPlayerTurn(data.player1, data.player2);
  const fillFirstChild = cell.firstElementChild;
  if (!fillFirstChild || !stats) return null;

  fillFirstChild.innerHTML = player.shape;

  addAriaLabel(player, cell);
  stats.innerHTML = randomGen(player.name);

  data.board[row][column] = player.mark;

  return player;
};

const addAriaLabel = (player: IPlayer, cell: HTMLDivElement) => {
  const parent = cell.parentElement;
  if (!parent) return null;
  const row = parent.getAttribute("data-row");
  const col = cell.getAttribute("data-column");
  cell.setAttribute(
    "aria-label",
    `Marked by ${player.name} on row ${row}, column ${col}`
  );
};
