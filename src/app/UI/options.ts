import { dom } from "./dom";
import { createHTMLFromString, removeChild } from "../../utils/index";
import { IPlayer } from "../../models/index";
import gameData from "../gameData";

const shapes = ["circle", "cross", "triangle"];

interface Options {
  e: MouseEvent;
  playerId: string;
  aiHTML?: string;
}
export const toggleOptions = ({ e, playerId, aiHTML = "" }: Options) => {
  const className = `.${playerId}-options`;
  const optionsExist = <HTMLElement>document.querySelector(className);

  if (optionsExist) {
    removeChild(optionsExist);
    return null;
  }

  const optionsMenuStr = dom.html.options
    .replace("%PLAYERID%", playerId)
    .replace("%AI%", aiHTML);
  const optionsMenu = createHTMLFromString(optionsMenuStr);

  const target = <HTMLElement>e.currentTarget;
  const parent = <HTMLElement>target.parentElement;

  parent.appendChild(optionsMenu);
  const shapeGroup = <HTMLElement>(
    optionsMenu.querySelector("." + dom.class.shapeGroup)
  );
  renderShapeList(shapeGroup, playerId);
};

const renderShapeList = (shapeGroup: HTMLElement, playerId: string) => {
  const player = playerId === "P1" ? gameData.player1 : gameData.player2;

  for (let shape of shapes) {
    const str = `<li class="shape-list">${player.allShapes[shape]}</li>`;

    const el = createHTMLFromString(str);
    shapeGroup.appendChild(el);
  }
};

export const setPlayerSettings = (player: IPlayer) => {
  const playerBtn = <Element>(
    document.getElementById(player.id + "-btn-options")
  );
  const playerMark = <Element>(
    playerBtn.querySelector("." + dom.class.playerMark)
  );

  playerMark.innerHTML = player.svgMark;
};

export const removePlayerOptions = (playerId: string) => {
  const className = `.${playerId}-options`;
  const el = document.querySelector(className);
  if (!el) return null;
  const parent = <HTMLElement>el.parentElement;
  parent.removeChild(el);
};

export const removeOptions = () => {
  const className = `.${dom.class.options}`;
  const el = <HTMLElement>document.querySelector(className);
  if (!el) return null;
  const parent = <HTMLElement>el.parentElement;
  parent.removeChild(el);
};
