import { dom } from "./dom";
import { ISetTilesAriaAll } from "../../models/index";
import gameData, { Player } from "../models/gameData";
import { isCellMarkedDOM } from "./board";

const cells = document.querySelectorAll(dom.query.dataColumn);

export const setTilesAriaAll = ({ init, restart }: ISetTilesAriaAll = {}) => {
  const playerName = gameData.currentPlayer().displayName;
  let label = `empty, ${playerName} turn`;

  if (init) {
    label = "Game Tile empty. Select AI or Human button to start game";
  }

  cells.forEach(cell => {
    if (restart) {
      const itemChild = cell.firstElementChild;
      if (itemChild) {
        itemChild.innerHTML = "";
      }

      cell.setAttribute("aria-label", label);
      return;
    }

    if (gameData.gameTie) {
      if (isCellMarkedDOM(<HTMLDivElement>cell)) {
        cell.setAttribute(
          "aria-label",
          "Game over. Tie. " + getCurrentLabel(cell)
        );
      } else {
        cell.setAttribute("aria-label", "Game over. Tie. empty");
      }
      return;
    }

    if (gameData.gameOver) {
      if (isCellMarkedDOM(<HTMLDivElement>cell)) {
        cell.setAttribute(
          "aria-label",
          `Game over. ${playerName} won. ` + getCurrentLabel(cell)
        );
      } else {
        cell.setAttribute("aria-label", `Game over. ${playerName} won. empty`);
      }
      return;
    }

    cell.setAttribute("aria-label", label);
  });
};

const getCurrentLabel = (el: Element) => {
  return el.getAttribute("aria-label") || "";
};

export const setTilesAriaPlayerTurn = () => {
  const playerName = gameData.currentPlayer().displayName;
  const label = `empty, ${playerName} turn`;

  cells.forEach(cell => {
    if (!isCellMarkedDOM(<HTMLDivElement>cell)) {
      cell.setAttribute("aria-label", label);
    }
  });
};

export const addAriaLabel = (player: Player, cell: HTMLDivElement) => {
  const parent = cell.parentElement;
  if (!parent) return null;
  const row = parent.getAttribute("data-row");
  const col = cell.getAttribute("data-column");
  cell.setAttribute(
    "aria-label",
    `Marked by ${player.displayName} on row ${row}, column ${col}`
  );
};
