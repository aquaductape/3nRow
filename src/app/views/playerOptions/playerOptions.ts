import { dom } from "../dom";
import {
  createHTMLFromString,
  removeChild,
  randomItemFromArr
} from "../../../utils/index";
import gameData, { Player } from "../../models/gameData";
import { setAllColors } from "../svgDefs";
import { isAiEnabled } from "../../models/ai/ai";
import { controllerOptionsFriend } from "./controllers/friend";
import { controllerAiDifficulty } from "./controllers/ai";
import { controllerRestart } from "./controllers/restart";
import { controllerResetScores } from "./controllers/resetScores";
import { renderPlayerMark } from "./views/playerMark";
import { renderShapeList, shapes, replaceShape } from "./views/shapeList";
import { renderColorsList, colors } from "./views/colorList";
import { Options } from "../../../models/index";

export const toggleOptions = ({ e, playerId, aiHTML = "" }: Options) => {
  const className = `.${playerId}-options`;
  const optionsExist = <HTMLElement>document.querySelector(className);
  const target = <HTMLElement>e.currentTarget;
  target.classList.add("active");

  if (optionsExist) {
    target.classList.remove("active");
    removeChild(optionsExist);
    return null;
  }

  const optionsMenuStr = dom.html.options
    .replace("%PLAYERID%", playerId)
    .replace("%AI%", aiHTML);
  const optionsMenu = <HTMLElement>createHTMLFromString(optionsMenuStr);

  // inserting adjecent from sibling, that way tabbing is focused to options menu
  target.insertAdjacentElement("afterend", optionsMenu);
  const shapeGroup = <HTMLElement>(
    optionsMenu.querySelector("." + dom.class.shapeGroup)
  );
  const colorGroup = <HTMLElement>(
    optionsMenu.querySelector("." + dom.class.colorGroup)
  );
  renderShapeList(shapeGroup, playerId);
  renderColorsList(
    colorGroup,
    playerId === "P1" ? gameData.player1 : gameData.player2
  );

  controllerAiDifficulty();
  controllerResetScores();
  controllerRestart();
  controllerOptionsFriend();
};

export const setPlayerSettings = (player: Player) => {
  const playerBtn = <Element>(
    document.getElementById(player.id + "-btn-options")
  );
  const playerMark = <HTMLElement>(
    playerBtn.querySelector("." + dom.class.playerMark)
  );
  setSettingsFromLocalStorage(player);

  renderPlayerMark(playerMark, player);
  setScore(player);
};

const setSettingsFromLocalStorage = (player: Player) => {
  const playerId = player.id;
  const shape = localStorage.getItem(`${playerId}-shape`);
  const score = localStorage.getItem(`${playerId}-score`);
  const primaryColor = localStorage.getItem(`${playerId}-primary-color`);
  const secondaryColor = localStorage.getItem(`${playerId}-secondary-color`);
  if (shape) {
    player.changeShape(shape);
  }
  if (score) {
    player.score = parseInt(score);
  }
  if (primaryColor) {
    player.primaryColor = primaryColor;
  }
  if (secondaryColor) {
    player.secondaryColor = secondaryColor;
  }
};

export const removePlayerOptions = (playerId: string) => {
  const className = `.${playerId}-options`;
  const el = document.querySelector(className);
  if (!el) return null;
  const parent = <HTMLElement>el.parentElement;
  parent.removeChild(el);

  const playerBtnOptions = <NodeListOf<HTMLElement>>(
    document.querySelectorAll("." + dom.class.playerBtnOptions)
  );
  playerBtnOptions.forEach(btn => btn.classList.remove("active"));
};

export const removeAllPlayerOptions = () => {
  const className = `.${dom.class.options}`;
  const el = <HTMLElement>document.querySelector(className);
  if (!el) return null;
  const parent = <HTMLElement>el.parentElement;
  parent.removeChild(el);

  const playerBtnOptions = <NodeListOf<HTMLElement>>(
    document.querySelectorAll("." + dom.class.playerBtnOptions)
  );
  playerBtnOptions.forEach(btn => btn.classList.remove("active"));
};

export const setScore = (player?: Player) => {
  const currentPlayer = player || gameData.currentPlayer();
  const playerOption = <HTMLElement>(
    document.getElementById(`${currentPlayer.id}-btn-options`)
  );
  const playerScoreDOM = <HTMLElement>(
    playerOption.querySelector("." + dom.class.playerScore)
  );
  const score = currentPlayer.score;

  if (score !== 0) {
    playerScoreDOM.innerHTML = score.toString();
  }
};

export const randomShapeAndColorAi = () => {
  if (!isAiEnabled()) return null;
  const filteredShapes = shapes.filter(
    shape => shape !== gameData.player1.shape
  );
  const filteredColors = colors.filter(
    ([primaryColor]) => primaryColor !== gameData.player1.primaryColor
  );
  const shape = filteredShapes[randomItemFromArr(filteredShapes)];
  const [primaryColor, secondaryColor] = filteredColors[
    randomItemFromArr(filteredColors)
  ];
  const player = gameData.player2;
  player.changeShape(shape);
  player.primaryColor = primaryColor;
  player.secondaryColor = secondaryColor;

  const allMarks = document.querySelectorAll(`[data-player="${player.id}"]`);

  allMarks.forEach(mark => {
    replaceShape(player, mark);
  });

  setAllColors(player);
};
