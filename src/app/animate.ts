import data from "./gameData";

const line = document.querySelector(".line-svg");
const gameStart = <HTMLDivElement>document.querySelector(".game-start");
const stats = document.querySelector(".stats");
const box = document.querySelectorAll("[data-column]");

export const animateLine = () => {
  if (!line) {
    return null;
  }
  const animate = data.winPosition;

  if (animate === "DIAG_TOP_LEFT") {
    line.innerHTML = data.lines.lineLong;
  }
  if (animate === "DIAG_BOT_LEFT") {
    line.innerHTML = data.lines.lineLong;
    const lineLong = <HTMLElement | null>line.querySelector(".line-long");

    if (!lineLong) return null;

    lineLong.style.transform = "rotate(90deg)";
  }
  if (animate === "ROW_0") {
    line.innerHTML = data.lines.lineShort;
    const lineShort = <HTMLElement | null>line.querySelector(".line-short");

    if (!lineShort) return null;

    lineShort.style.transform = "translateY(-33.4%)";
  }
  if (animate === "ROW_1") {
    line.innerHTML = data.lines.lineShort;
  }
  if (animate === "ROW_2") {
    line.innerHTML = data.lines.lineShort;
    const lineShort = <HTMLElement | null>line.querySelector(".line-short");

    if (!lineShort) return null;

    lineShort.style.transform = "translateY(33.4%)";
  }
  if (animate === "COL_0") {
    line.innerHTML = data.lines.lineShort;
    const lineShort = <HTMLElement | null>line.querySelector(".line-short");
    const lineShortInner = <HTMLElement | null>(
      line.querySelector(".line-short-inner")
    );

    if (!lineShort || !lineShortInner) return null;

    lineShort.style.transform = "rotate(90deg)";
    lineShortInner.style.transform = "translateY(33.4%)";
    "rotate(90deg)";
  }
  if (animate === "COL_1") {
    line.innerHTML = data.lines.lineShort;
    const lineShort = <HTMLElement | null>line.querySelector(".line-short");

    if (!lineShort) return null;

    lineShort.style.transform = "rotate(90deg)";
  }

  if (animate === "COL_2") {
    line.innerHTML = data.lines.lineShort;
    const lineShort = <HTMLElement | null>line.querySelector(".line-short");
    const lineShortInner = <HTMLElement | null>(
      line.querySelector(".line-short-inner")
    );

    if (!lineShort || !lineShortInner) return null;

    lineShort.style.transform = "rotate(90deg)";
    lineShortInner.style.transform = "translateY(-33.4%)";
  }

  console.log(animate);
};

const cleanUp = (e: Event) => {
  e.preventDefault();

  box.forEach(item => {
    item.setAttribute("aria-label", "empty");

    const itemChild = item.firstElementChild;
    if (itemChild) {
      itemChild.innerHTML = "";
    }
  });

  const player = data.player1.turn ? data.player1 : data.player2;
  if (!stats || !line) return null;
  stats.innerHTML = `Go ${player.name}!`;
  line.innerHTML = "";

  data.gameOver = false;
  data.gameTie = false;
  data.winPosition = "";

  let count = 0;
  data.board = data.board.map(item =>
    item.map(item => {
      const num = count;
      count++;
      return num;
    })
  );

  gameStart.innerHTML = "";
};

export const addStartBtn = () => {
  gameStart.innerHTML = `<button class="btn btn-start">Play Again?</button>`;

  const btn = <HTMLDivElement>document.querySelector(".btn-start");

  btn.addEventListener("click", cleanUp);
};
