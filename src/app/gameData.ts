import { TBoard, IallShapes } from "../models/index";
import { dom } from "./UI/dom";
import { uniqueIds } from "../utils/index";

class Player {
  id: string;
  displayName: string;
  svgMark: string;
  score: number;
  turn: boolean;
  ai: boolean;
  allShapes: IallShapes;
  shape: string;
  mark: "X" | "O";
  primaryColor: string;
  secondaryColor: string;
  constructor(
    id: string,
    displayName: string,
    shape: string,
    mark: "X" | "O",
    primaryColor: string,
    secondaryColor: string
  ) {
    const ignoreClass = [
      "animate__circle-left",
      "animate__circle-right",
      "animate__right-dot",
      "animate__left-dot",
      "animate__right-line",
      "animate__left-line",
      "animete__first-line",
      "animete__second-line",
      "animete__third-line"
    ];

    this.allShapes = {
      circle: uniqueIds({
        svg: dom.svg.circle,
        id: `-circle-${id}`,
        ignoreClass
      }),
      cross: uniqueIds({ svg: dom.svg.cross, id: `-cross-${id}`, ignoreClass }),
      triangle: uniqueIds({
        svg: dom.svg.triangle,
        id: `-triangle-${id}`,
        ignoreClass
      })
    };
    this.displayName = displayName;
    this.svgMark = this.allShapes[shape];
    this.shape = shape;
    this.score = 0;
    this.turn = false;
    this.ai = false;
    this.mark = mark;
    this.id = id;
    this.primaryColor = primaryColor;
    this.secondaryColor = secondaryColor;
  }
}

const gameData = {
  board: <TBoard>[
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8]
  ],
  player1: new Player("P1", "Player1", "cross", "X", "#0cf", "#5fd"),
  player2: new Player("P2", "Player2", "circle", "O", "#ff0051", "#ffc300"),
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
  },
  changeShape(shape: "circle" | "cross") {
    const player = this.currentPlayer();
    player.svgMark = player.allShapes[shape];
  }
};

export default gameData;
