import data from "./gameData";

const line = document.querySelector(".line-svg");
const gameStart = <HTMLDivElement>document.querySelector(".game-start");
const stats = document.querySelector(".stats");
const box = document.querySelectorAll("[data-row]");

export const animateLine = (animate: string | null) => {
  if (!animate || !line) {
    return null;
  }

  if (animate === "diagTopLeft") {
    line.innerHTML = data.lines.lineLong;
  }
  if (animate === "diagBotLeft") {
    line.innerHTML = data.lines.lineLong;
    const lineLong = <HTMLElement | null>line.querySelector(".line-long");

    if (!lineLong) return null;

    lineLong.style.transform = "rotate(90deg)";
  }
  if (animate === "row0") {
    line.innerHTML = data.lines.lineShort;
    const lineShort = <HTMLElement | null>line.querySelector(".line-short");

    if (!lineShort) return null;

    lineShort.style.transform = "translateY(-33.4%)";
  }
  if (animate === "row1") {
    line.innerHTML = data.lines.lineShort;
  }
  if (animate === "row2") {
    line.innerHTML = data.lines.lineShort;
    const lineShort = <HTMLElement | null>line.querySelector(".line-short");

    if (!lineShort) return null;

    lineShort.style.transform = "translateY(33.4%)";
  }
  if (animate === "col0") {
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
  if (animate === "col1") {
    line.innerHTML = data.lines.lineShort;
    const lineShort = <HTMLElement | null>line.querySelector(".line-short");

    if (!lineShort) return null;

    lineShort.style.transform = "rotate(90deg)";
  }

  if (animate === "col2") {
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

export const addStartBtn = () => {
  gameStart.innerHTML = `<button class="btn btn-start">Play Again?</button>`;

  const btn = <HTMLDivElement>document.querySelector(".btn-start");

  btn.addEventListener("click", e => {
    e.preventDefault();

    box.forEach(item => {
      item.removeAttribute("aria-label");

      const itemChild = item.firstElementChild;
      if (itemChild) {
        itemChild.innerHTML = "";
      }
    });

    if (!stats || !line) return null;
    stats.innerHTML = "";
    line.innerHTML = "";

    data.gameOver = false;
    data.board = data.board.map(item => item.map(item => (item = null)));

    gameStart.innerHTML = "";
  });
};
