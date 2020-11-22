import { TPlayer } from "../../model/state";
import { colorMap, svg } from "../constants/constants";

export const renderWinnerSlash = ({
  player,
  line,
  winPosition,
}: {
  player: TPlayer;
  winPosition: string;
  line: HTMLElement;
}) => {
  renderLine({ slash: line, winPosition });
};

const lineColor = (player: TPlayer) => {
  const lineColorPrimaryAll = <NodeListOf<HTMLElement>>(
    document.querySelectorAll(".line-color-primary")
  );
  const lineColorSecondaryAll = <NodeListOf<HTMLElement>>(
    document.querySelectorAll(".line-color-secondary")
  );
  const [primaryColor, secondaryColor] = colorMap[player.color];

  lineColorPrimaryAll.forEach((line) => {
    line.style.stopColor = primaryColor;
  });
  lineColorSecondaryAll.forEach((line) => {
    line.style.stopColor = secondaryColor;
  });
};

const renderLine = ({
  winPosition,
  slash,
}: {
  winPosition: string;
  slash: HTMLElement;
}) => {
  let lineLong = {} as HTMLElement;
  let lineShort = {} as HTMLElement;
  let lineShortInner = {} as HTMLElement;

  switch (winPosition) {
    case "DIAG_TOP_LEFT":
      slash.innerHTML = svg.lineLong;
      break;
    case "DIAG_BOT_LEFT":
      slash.innerHTML = svg.lineLong;
      lineLong = slash.querySelector(".animate__line-long") as HTMLElement;
      lineLong.style.transform = "rotate(90deg)";
      break;
    case "ROW_0":
      slash.innerHTML = svg.lineShort;
      lineShort = slash.querySelector(".animate__line-short") as HTMLElement;
      lineShort.style.transform = "translateY(-33.8%)";
      break;
    case "ROW_1":
      slash.innerHTML = svg.lineShort;
      break;
    case "ROW_2":
      slash.innerHTML = svg.lineShort;
      lineShort = slash.querySelector(".animate__line-short") as HTMLElement;
      lineShort.style.transform = "translateY(33.8%)";
      break;
    case "COL_0":
      slash.innerHTML = svg.lineShort;
      lineShort = slash.querySelector(".animate__line-short") as HTMLElement;
      lineShortInner = slash.querySelector(
        ".animate__line-short-inner"
      ) as HTMLElement;
      lineShort.style.transform = "rotate(90deg)";
      lineShortInner.style.transform = "translateY(33.8%)";
      "rotate(90deg)";
      break;
    case "COL_1":
      slash.innerHTML = svg.lineShort;
      lineShort = slash.querySelector(".animate__line-short") as HTMLElement;
      lineShort.style.transform = "rotate(90deg)";
      break;

    case "COL_2":
      slash.innerHTML = svg.lineShort;
      lineShort = slash.querySelector(".animate__line-short") as HTMLElement;
      lineShortInner = slash.querySelector(
        ".animate__line-short-inner"
      ) as HTMLElement;
      lineShort.style.transform = "rotate(90deg)";
      lineShortInner.style.transform = "translateY(-33.8%)";
      break;
  }
};
