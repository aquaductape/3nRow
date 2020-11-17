import { TPlayer } from "../../model/state";
import { colorMap } from "../constants/constants";
import { lines } from "../svg/shapes";

export const renderWinnerSlash = ({
  player,
  line,
  winPosition,
}: {
  player: TPlayer;
  winPosition: string;
  line: HTMLElement;
}) => {
  renderLine({ line, winPosition });
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
  line,
}: {
  winPosition: string;
  line: HTMLElement;
}) => {
  let lineLong = {} as HTMLElement;
  let lineShort = {} as HTMLElement;
  let lineShortInner = {} as HTMLElement;

  switch (winPosition) {
    case "DIAG_TOP_LEFT":
      line.innerHTML = lines.lineLong;
      break;
    case "DIAG_BOT_LEFT":
      line.innerHTML = lines.lineLong;
      lineLong = line.querySelector(".animate__line-long") as HTMLElement;
      lineLong.style.transform = "rotate(90deg)";
      break;
    case "ROW_0":
      line.innerHTML = lines.lineShort;
      lineShort = line.querySelector(".animate__line-short") as HTMLElement;
      lineShort.style.transform = "translateY(-33.4%)";
      break;
    case "ROW_1":
      line.innerHTML = lines.lineShort;
      break;
    case "ROW_2":
      line.innerHTML = lines.lineShort;
      lineShort = line.querySelector(".animate__line-short") as HTMLElement;
      lineShort.style.transform = "translateY(33.4%)";
      break;
    case "COL_0":
      line.innerHTML = lines.lineShort;
      lineShort = line.querySelector(".animate__line-short") as HTMLElement;
      lineShortInner = line.querySelector(
        ".animate__line-short-inner"
      ) as HTMLElement;
      lineShort.style.transform = "rotate(90deg)";
      lineShortInner.style.transform = "translateY(33.4%)";
      "rotate(90deg)";
      break;
    case "COL_1":
      line.innerHTML = lines.lineShort;
      lineShort = line.querySelector(".animate__line-short") as HTMLElement;
      lineShort.style.transform = "rotate(90deg)";
      break;

    case "COL_2":
      line.innerHTML = lines.lineShort;
      lineShort = line.querySelector(".animate__line-short") as HTMLElement;
      lineShortInner = line.querySelector(
        ".animate__line-short-inner"
      ) as HTMLElement;
      lineShort.style.transform = "rotate(90deg)";
      lineShortInner.style.transform = "translateY(-33.4%)";
      break;
  }
};
