import { TBoard, IallShapes } from "../models/index";
import { dom } from "./UI/dom";
import { uniqueIds } from "../utils/index";

const ignoreTriangleClasses = [
  "animate__first-line",
  "animate__second-line",
  "animate__third-line"
];
const ignoreHeartClasses = ["animate__heart"];
const ignoreCrossClasses = [
  "animate__right-dot",
  "animate__left-dot",
  "animate__right-line",
  "animate__left-line"
];
const ignoreCircleClasses = ["animate__circle-left", "animate__circle-right"];
const ignoreUrl = ["%crossLeftDot%", "%crossRightDot%"];

export class Player {
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
    this.allShapes = {
      circle: uniqueIds({
        svg: dom.svg.circle,
        id: `-circle-${id}`,
        ignoreClass: ignoreCircleClasses
      }),
      cross: uniqueIds({
        svg: dom.svg.cross,
        id: `-cross-${id}`,
        ignoreClass: ignoreCrossClasses,
        ignoreUrl
      })
        .replace("%crossLeftDot%", `#a-crossLeftDot-${id}`)
        .replace("%crossRightDot%", `#a-crossRightDot-${id}`),
      triangle: uniqueIds({
        svg: dom.svg.triangle,
        id: `-triangle-${id}`,
        ignoreClass: ignoreTriangleClasses
      }),
      heart: uniqueIds({
        svg: dom.svg.heart,
        id: `-heart-${id}`,
        ignoreClass: ignoreHeartClasses
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
    this.score = 0;
  }
  changeShape(shape: string) {
    this.shape = shape;
    this.svgMark = this.allShapes[shape];
  }

  addScore() {
    this.score++;
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
  winner: <Player | null>null,
  aiFinished: true,
  firstPlayerStart: "P1",
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
