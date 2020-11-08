import { IPlayer } from "../../../../models/index";
import { createHTMLFromString } from "../../../../utils/index";
import { controllerColorList } from "../controllers/colorList";
import gameData from "../../../models/gameData";

export const colors = [
  ["#0cf", "#5fd"],
  ["#39f300", "#f3ff08"],
  ["#ff0051", "#ffc300"],
  ["#ff005b", "#ff00e4"],
  ["#e600ff", "#5f55ff"],
  ["#fff", "#ccc"],
];

export const renderColorsList = (colorGroup: HTMLElement, playerId: string) => {
  const player = playerId === "P1" ? gameData.player1 : gameData.player2;
  for (let [primaryColor, secondaryColor] of colors) {
    const elStr = `<li><div class="color-list" tabindex="0" role="button" aria-label="chose gradient color of shape. Primary Color ${primaryColor}, Secondary Color ${secondaryColor}"><div style="background: ${primaryColor}; height: 50%;"class="primary-color"></div><div style="background: ${secondaryColor}; height: 50%;"class="secondary-color"></div></div></li>`;
    const el = createHTMLFromString(elStr);

    controllerColorList(el, primaryColor, secondaryColor, player);

    colorGroup.appendChild(el);
  }
};
