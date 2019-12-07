import { TBoard } from "../models/index";
import { dom } from "./UI/dom";

class Player {
  id: string;
  displayName: string;
  svgMark: string;
  score: number;
  turn: boolean;
  ai: boolean;
  mark: "X" | "O";
  constructor(
    id: string,
    displayName: string,
    shape: "cross" | "circle",
    mark: "X" | "O",
    ai: boolean = false
  ) {
    this.displayName = displayName;
    this.svgMark = dom.svg[shape];
    this.score = 0;
    this.turn = false;
    this.ai = ai;
    this.mark = mark;
    this.id = id;
  }
}

const gameData = {
  board: <TBoard>[
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8]
  ],
  player1: new Player("P1", "Player1", "cross", "X"),
  player2: new Player("P2", "Player2", "circle", "O"),
  gameOver: false,
  gameTie: false,
  gameStart: false,
  aiFinished: true,
  aiSpeed: 900,
  aiDifficulty: <"HARD" | "IMPOSSIBLE" | "CHEATER">"HARD",
  winPosition: "",
  lines: {
    lineShort: dom.svg.lineShort,
    lineLong: dom.svg.lineLong
  },
  currentPlayer() {
    return this.player1.turn ? this.player1 : this.player2;
  },
  nextPlayer() {
    this.player1.turn = !this.player1.turn;
    this.player2.turn = !this.player2.turn;
  }
};

export default gameData;
