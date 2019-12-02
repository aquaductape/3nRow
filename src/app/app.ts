import data from "./gameData";
import { animateLine, addStartBtn } from "./animate";

const box = document.querySelectorAll("[data-row]");
const stats = document.querySelector(".stats");
// const line = document.querySelector(".line-svg");

interface IPlayer {
  name: string;
  shape: string;
  score: number;
  turn: boolean;
  fill: number;
}

//Player One goes first
data.player1.turn = true;

box.forEach(item => {
  item.addEventListener("click", e => {
    const target = <HTMLDivElement>e.currentTarget;
    const targetParent = target.parentElement;
    if (!targetParent) return;

    const column = targetParent.getAttribute("data-column");
    const row = target.getAttribute("data-row");
    const fill = <HTMLDivElement>e.currentTarget;
    if (!column || !fill || !row) return null;

    console.log(row, column);

    const player = fillBoard(parseInt(row), parseInt(column), fill);
    console.log(data.board);

    const animate = checkBoard(player);
    animateLine(animate);
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
    if (data.board[row].every(item => item === player.fill)) {
      gameOver(player.name);
      return `row${row}`;
    }

    // check column
    let count = 0;
    for (let column = 0; column < data.board.length; column++) {
      if (data.board[column][row] === player.fill) {
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
    if (data.board[i][i] === player.fill) {
      diagonal1++;
      if (diagonal1 === data.board.length) {
        gameOver(player.name);
        return "diagTopLeft";
      }
    }

    if (data.board[i][data.board.length - 1 - i] === player.fill) {
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
  const player = player1.turn ? player1 : player2;

  player1.turn = !player1.turn;
  player2.turn = !player2.turn;

  return player;
};

const fillBoard = (row: number, column: number, fill: HTMLDivElement) => {
  // if board already filled return nothing
  if (data.board[row][column] !== null || data.gameOver) {
    return null;
  }
  console.log({ fill });

  const player = nextPlayerTurn(data.player1, data.player2);
  const fillFirstChild = fill.firstElementChild;
  if (!fillFirstChild || !stats) return null;

  fillFirstChild.innerHTML = player.shape;

  // console.log(fill)

  addAriaLabel(player, fill);
  stats.innerHTML = `${player.name}, it's your time to shine!`;

  data.board[row][column] = player.fill;

  return player;
};

const addAriaLabel = (player: IPlayer, fill: HTMLDivElement) => {
  fill.setAttribute("aria-label", `Marked by ${player.name}`);
};
