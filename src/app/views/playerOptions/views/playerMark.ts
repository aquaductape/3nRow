import { createHTMLFromString } from "../../../../utils/index";
import { IPlayer } from "../../../../models/index";

// renders two overlapping marks to hide top when active
export const renderPlayerMark = (el: HTMLElement, player: IPlayer) => {
  const fullColor = createHTMLFromString(player.svgMark);
  const monochrome = createHTMLFromString(player.svgMark);
  monochrome.classList.add("monochrome");
  fullColor.classList.add("full-color");

  el.appendChild(fullColor);
  el.appendChild(monochrome);
};
