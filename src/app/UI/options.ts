import { dom } from "./dom";
import { createHTMLFromString, removeChild } from "../../utils/index";
import gameData, { Player } from "../gameData";
import { blockAnimation, changeLineColor } from "./animate";
import { valideKeyInput } from "./events/eventListeners";
import { setAllColors } from "./svgDefs";
import { startGame } from "../gameLogic";
import { cleanUpGameStart, cleanUp } from "./board";

const shapes = ["circle", "cross", "heart", "triangle"];

interface Options {
  e: Event;
  playerId: string;
  aiHTML?: string;
}
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

  renderResetScores();
  renderRestart();
};

const renderRestart = () => {
  const restart = <HTMLElement>document.getElementById(dom.id.optionsRestart);
  restart.addEventListener("click", cleanUp);
};

const renderResetScores = () => {
  const resetScores = <HTMLElement>(
    document.getElementById(dom.id.optionsResetScores)
  );
  resetScores.addEventListener("click", () => {
    const scoresDOM = document.querySelectorAll("." + dom.class.playerScore);
    const player1 = gameData.player1;
    const player2 = gameData.player2;
    player1.score = 0;
    player2.score = 0;
    localStorage.setItem(`${player1.id}-score`, "0");
    localStorage.setItem(`${player2.id}-score`, "0");
    scoresDOM.forEach(score => (score.innerHTML = "-"));
  });
};

const renderShapeList = (shapeGroup: HTMLElement, playerId: string) => {
  const player = playerId === "P1" ? gameData.player1 : gameData.player2;

  for (let shape of shapes) {
    const str = `<li class="shape-list" tabindex="0">${player.allShapes[shape]}</li>`;

    const el = <HTMLElement>createHTMLFromString(str);
    addEventsShapeList(el, shape, player);
    shapeGroup.appendChild(el);
  }
};

const renderColorsList = (colorGroup: HTMLElement, player: Player) => {
  const colors = [
    ["#0cf", "#5fd"],
    ["#39f300ff", "#f3ff08ff"],
    ["#ff0051", "#ffc300"],
    ["#ff005b", "#ff00e4"],
    ["#e600ffff", "#5f55ffff"],
    ["#fff", "#ccc"]
  ];

  for (let [primaryColor, secondaryColor] of colors) {
    const elStr = `<li class="color-list" tabindex="0"><div style="background: ${primaryColor}; height: 50%;"class="primary-color"></div><div style="background: ${secondaryColor}; height: 50%;"class="secondary-color"></div>`;
    const el = createHTMLFromString(elStr);
    el.addEventListener("click", e =>
      changeShapeColor(e, primaryColor, secondaryColor, player)
    );
    el.addEventListener("keydown", e =>
      changeShapeColor(e, primaryColor, secondaryColor, player)
    );
    colorGroup.appendChild(el);
  }
};

const changeShapeColor = (
  e: Event,
  primaryColor: string,
  secondaryColor: string,
  player: Player
) => {
  if (!valideKeyInput(e)) return null;
  player.primaryColor = primaryColor;
  player.secondaryColor = secondaryColor;
  localStorage.setItem(`${player.id}-primary-color`, primaryColor);
  localStorage.setItem(`${player.id}-secondary-color`, secondaryColor);
  setAllColors(player);
  changeLineColor(player);
};

const onList = (e: Event, list: Element, shape: string, player: Player) => {
  if (!valideKeyInput(e)) return null;
  player.changeShape(shape);
  const allMarks = document.querySelectorAll(`[data-player="${player.id}"]`);
  localStorage.setItem(`${player.id}-shape`, shape);

  allMarks.forEach(mark => {
    replaceShape(player, mark);
  });
};

const addEventsShapeList = (
  list: HTMLElement,
  shape: string,
  player: Player
) => {
  list.addEventListener("click", e => onList(e, list, shape, player));
  list.addEventListener("keydown", e => onList(e, list, shape, player));
};

const replaceShape = (player: Player, mark: Element) => {
  const svgMark = <SVGElement>mark.querySelector("svg");
  const parent = <HTMLElement>svgMark.parentElement;
  parent.removeChild(svgMark);
  const newSvgMark = createHTMLFromString(player.svgMark);
  blockAnimation(newSvgMark);

  parent.appendChild(newSvgMark);
};

export const setPlayerSettings = (player: Player) => {
  const playerBtn = <Element>(
    document.getElementById(player.id + "-btn-options")
  );
  const playerMark = <Element>(
    playerBtn.querySelector("." + dom.class.playerMark)
  );
  setSettingsFromLocalStorage(player);

  playerMark.innerHTML = player.svgMark;
  renderScore(player);
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

export const removeOptions = () => {
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

export const renderScore = (player?: Player) => {
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
