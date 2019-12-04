import {
  IPlayer,
  cellCostItem,
  TCheckBoard,
  TBoard,
  TFlattenBoard,
  IMove
} from "../models/index";
import { copyBoard, maxBy, minBy } from "../utils/index";
import data from "./gameData";

const winning = (board: any[], playerMark: "X" | "O") => {
  if (
    (board[0] == playerMark &&
      board[1] == playerMark &&
      board[2] == playerMark) ||
    (board[3] == playerMark &&
      board[4] == playerMark &&
      board[5] == playerMark) ||
    (board[6] == playerMark &&
      board[7] == playerMark &&
      board[8] == playerMark) ||
    (board[0] == playerMark &&
      board[3] == playerMark &&
      board[6] == playerMark) ||
    (board[1] == playerMark &&
      board[4] == playerMark &&
      board[7] == playerMark) ||
    (board[2] == playerMark &&
      board[5] == playerMark &&
      board[8] == playerMark) ||
    (board[0] == playerMark &&
      board[4] == playerMark &&
      board[8] == playerMark) ||
    (board[2] == playerMark && board[4] == playerMark && board[6] == playerMark)
  ) {
    return true;
  } else {
    return false;
  }
};

// returns the available spots on the board
const emptyIndexies = (board: TFlattenBoard) => {
  return board.filter(s => s !== "O" && s !== "X");
};

const humanPlayer = "X";
const aiPlayer = "O";
const miniMax = (newBoard: any[], player: "X" | "O") => {
  //available spots
  const availSpots = <number[]>emptyIndexies(newBoard);

  // checks for the terminal states such as win, lose, and tie and returning a value accordingly
  if (winning(newBoard, humanPlayer)) {
    return <IMove>{ score: -10 };
  } else if (winning(newBoard, aiPlayer)) {
    return <IMove>{ score: 10 };
  } else if (availSpots.length === 0) {
    return <IMove>{ score: 0 };
  }

  // an array to collect all the objects
  const moves = [];

  // loop through available spots
  for (let i = 0; i < availSpots.length; i++) {
    //create an object for each and store the index of that spot that was stored as a number in the object's index key
    const move = <IMove>{};
    move.index = newBoard[availSpots[i]];

    // set the empty spot to the current player
    newBoard[availSpots[i]] = player;

    //if collect the score resulted from calling minimax on the opponent of the current player
    if (player == aiPlayer) {
      const result = miniMax(newBoard, humanPlayer);
      move.score = result.score;
    } else {
      const result = miniMax(newBoard, aiPlayer);
      move.score = result.score;
    }

    //reset the spot to empty
    newBoard[availSpots[i]] = move.index;

    // push the object to the array
    moves.push(move);
  }

  // if it is the computer's turn loop over the moves and choose the move with the highest score
  let bestMove = 0;
  if (player === aiPlayer) {
    let bestScore = -10000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    // else loop over the moves and choose the move with the lowest score
    let bestScore = 10000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  // return the chosen move (object) from the array to the higher depth
  return moves[bestMove];
};

export default miniMax;

// const miniMax = (
//   board: TBoard,
//   depth: number,
//   player: IPlayer,
//   checkBoard: TCheckBoard
// ) => {
//   const gameState = checkBoard(player, board, { terminal_state: true });
//   const humanPlayer = "HUMAN";
//   const aiPlayer = "AI";
//   const TIE = "TIE";

//   debugger;

//   if (gameState === false) {
//     const values: cellCostItem[] = [];

//     for (let i = 0; i < data.board.length; i++) {
//       for (let j = 0; j < data.board.length; j++) {
//         if (board[i][j] !== null) continue;
//         const boardCopy = copyBoard(board);

//         boardCopy[i][j] = player.mark;
//         const value = miniMax(
//           boardCopy,
//           depth + 1,
//           player.ai ? data.player1 : data.player2,
//           checkBoard
//         );

//         if (typeof value === "number") {
//           values.push({
//             cost: value,
//             cell: {
//               row: i,
//               column: j
//             }
//           });
//         }
//       }
//     }

//     if (player.ai) {
//       const max = maxBy(values);

//       if (depth === 0) {
//         return max.cell;
//       } else {
//         return max.cost;
//       }
//     } else {
//       const min = minBy(values);

//       if (depth === 0) {
//         return min.cell;
//       } else {
//         return min.cost;
//       }
//     }
//   } else if (gameState === TIE) {
//     return 0;
//   } else if (gameState === humanPlayer) {
//     return depth - 10;
//   } else if (gameState === aiPlayer) {
//     return 10 - depth;
//   }
// };
