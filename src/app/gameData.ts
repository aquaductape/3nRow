import svg from "./svg";

class Player {
  name: string;
  shape: string;
  score: number;
  turn: boolean;
  fill: number;
  constructor(name: string, shape: "cross" | "circle", fill: number) {
    this.name = name;
    this.shape = svg[shape];
    this.score = 0;
    this.turn = false;
    this.fill = fill;
  }
}

type board = (null | number)[][];

const data = {
  board: <board>[
    [null, null, null],
    [null, null, null],
    [null, null, null]
  ],
  player1: new Player("Player1", "cross", 1),
  player2: new Player("Player2", "circle", 0),
  gameOver: false,
  lines: {
    lineShort: svg.lineShort,
    lineLong: svg.lineLong
  }
};

export default data;
