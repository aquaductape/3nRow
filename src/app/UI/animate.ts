import gameData, { Player } from "../gameData";

const line = document.querySelector(".line-svg");

export const animateLine = () => {
  if (!line) {
    return null;
  }
  const animate = gameData.winPosition;

  if (animate === "DIAG_TOP_LEFT") {
    line.innerHTML = gameData.lines.lineLong;
  }
  if (animate === "DIAG_BOT_LEFT") {
    line.innerHTML = gameData.lines.lineLong;
    const lineLong = <HTMLElement | null>(
      line.querySelector(".animate__line-long")
    );

    if (!lineLong) return null;

    lineLong.style.transform = "rotate(90deg)";
  }
  if (animate === "ROW_0") {
    line.innerHTML = gameData.lines.lineShort;
    const lineShort = <HTMLElement | null>(
      line.querySelector(".animate__line-short")
    );

    if (!lineShort) return null;

    lineShort.style.transform = "translateY(-33.4%)";
  }
  if (animate === "ROW_1") {
    line.innerHTML = gameData.lines.lineShort;
  }
  if (animate === "ROW_2") {
    line.innerHTML = gameData.lines.lineShort;
    const lineShort = <HTMLElement | null>(
      line.querySelector(".animate__line-short")
    );

    if (!lineShort) return null;

    lineShort.style.transform = "translateY(33.4%)";
  }
  if (animate === "COL_0") {
    line.innerHTML = gameData.lines.lineShort;
    const lineShort = <HTMLElement | null>(
      line.querySelector(".animate__line-short")
    );
    const lineShortInner = <HTMLElement | null>(
      line.querySelector(".animate__line-short-inner")
    );

    if (!lineShort || !lineShortInner) return null;

    lineShort.style.transform = "rotate(90deg)";
    lineShortInner.style.transform = "translateY(33.4%)";
    "rotate(90deg)";
  }
  if (animate === "COL_1") {
    line.innerHTML = gameData.lines.lineShort;
    const lineShort = <HTMLElement | null>(
      line.querySelector(".animate__line-short")
    );

    if (!lineShort) return null;

    lineShort.style.transform = "rotate(90deg)";
  }

  if (animate === "COL_2") {
    line.innerHTML = gameData.lines.lineShort;
    const lineShort = <HTMLElement | null>(
      line.querySelector(".animate__line-short")
    );
    const lineShortInner = <HTMLElement | null>(
      line.querySelector(".animate__line-short-inner")
    );

    if (!lineShort || !lineShortInner) return null;

    lineShort.style.transform = "rotate(90deg)";
    lineShortInner.style.transform = "translateY(-33.4%)";
  }
};

export const changeLineColor = (player: Player) => {
  if (gameData.gameOver && player !== gameData.winner) return null;
  const lineColorPrimaryAll = <NodeListOf<HTMLElement>>(
    document.querySelectorAll(".line-color-primary")
  );
  const lineColorSecondaryAll = <NodeListOf<HTMLElement>>(
    document.querySelectorAll(".line-color-secondary")
  );

  lineColorPrimaryAll.forEach(line => {
    line.style.stopColor = player.primaryColor;
  });
  lineColorSecondaryAll.forEach(line => {
    line.style.stopColor = player.secondaryColor;
  });
};

export const blockAnimation = (mark: Element) => {
  const animationNames = [
    "circle-left",
    "circle-right",
    "right-dot",
    "left-dot",
    "right-line",
    "left-line",
    "first-line",
    "second-line",
    "third-line",
    "heart"
  ];

  for (let animationName of animationNames) {
    const node = <HTMLElement>mark.querySelector(`.animate__${animationName}`);
    if (node) {
      node.classList.add("block-animation");
    }
  }
};
