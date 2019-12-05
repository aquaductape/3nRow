import { TFlattenBoard, IMove } from "../models/index";
import data from "./gameData";

const winning = (board: TFlattenBoard, playerMark: "X" | "O") => {
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
const humanPlayer = data.player1.mark;
const aiPlayer = data.player2.mark;

const miniMax = (newBoard: TFlattenBoard, player: "X" | "O") => {
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
    move.index = <number>newBoard[availSpots[i]];

    // set the empty spot to the current player
    newBoard[availSpots[i]] = player;

    //if collect the score resulted from calling minimax on the opponent of the current player
    if (player === aiPlayer) {
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
    let bestScore = Number.MIN_SAFE_INTEGER;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    // else loop over the moves and choose the move with the lowest score
    let bestScore = Number.MAX_SAFE_INTEGER;
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
