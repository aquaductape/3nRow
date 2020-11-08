import { IPlayer } from "../../../../models/index";
import { dom } from "../../dom";
import { createHTMLFromString } from "../../../../utils/index";
import { blockAnimation } from "../../animate";
import { renderPlayerMark } from "./playerMark";
import { controllerShapeList } from "../controllers/shapeList";
import gameData from "../../../models/gameData";

export const shapes = ["cross", "circle", "heart", "triangle"];

export const renderShapeList = (shapeGroup: HTMLElement, playerId: string) => {
  const player = playerId === "P1" ? gameData.player1 : gameData.player2;

  for (let shape of shapes) {
    const str = `<li><div class="shape-list" tabindex="0" role="button" aria-label="chose shape: ${shape}">${player.allShapes[shape]}</div></li>`;

    const el = <HTMLElement>createHTMLFromString(str);
    controllerShapeList(el, shape, player);
    shapeGroup.appendChild(el);
  }
};

export const replaceShape = (player: IPlayer, mark: Element) => {
  const svgMark = <SVGElement>mark.querySelector("svg");
  const parent = <HTMLElement>svgMark.parentElement;

  if (parent.classList.contains(dom.class.playerMark)) {
    parent.innerHTML = "";
    renderPlayerMark(parent, player);
    return null;
  }

  parent.removeChild(svgMark);
  const newSvgMark = createHTMLFromString(player.svgMark);
  blockAnimation(newSvgMark);

  parent.appendChild(newSvgMark);
};
