import svg from "./svg";
import { TBoard } from "../models/index";

class Player {
  name: string;
  shape: string;
  score: number;
  turn: boolean;
  ai: boolean;
  mark: "X" | "O";
  constructor(
    name: string,
    shape: "cross" | "circle",
    mark: "X" | "O",
    ai: boolean = false
  ) {
    this.name = name;
    this.shape = svg[shape];
    this.score = 0;
    this.turn = false;
    this.ai = ai;
    this.mark = mark;
  }
}

const data = {
  board: <TBoard>[
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8]
  ],
  player1: new Player("Player1", "cross", "X"),
  player2: new Player("Player2", "circle", "O"),
  gameOver: false,
  gameTie: false,
  winPosition: "",
  lines: {
    lineShort: svg.lineShort,
    lineLong: svg.lineLong
  },
  currentPlayer() {
    return this.player1.turn ? this.player1 : this.player2;
  },

  nextPlayer() {
    this.player1.turn = !this.player1.turn;
    this.player2.turn = !this.player2.turn;
  }
};

export default data;
