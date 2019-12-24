import { valideKeyInput } from "../../../appControllers";
import { determineSpeed } from "../../../models/ai/ai";
import { startGame } from "../../../models/gameLogic";
import { removeAllPlayerOptions } from "../../playerOptions/playerOptions";
import { removeDropDown } from "../dropDown";

export const controllerList = (list: HTMLElement) => {
  list.addEventListener("click", onList);
  list.addEventListener("keydown", onList);
};

const onList = (e: Event) => {
  if (!valideKeyInput(e)) return null;
  e.preventDefault();
  e.stopPropagation();
  const target = <Element>e.target;
  const difficulty = <string>target.textContent;
  const speed = determineSpeed(<any>difficulty);

  startGame({
    ai: true,
    difficulty: <any>difficulty.toUpperCase(),
    aiSpeed: speed,
    continueGame: true
  });
  removeAllPlayerOptions();
  removeDropDown();
  // cleanUpGameStart();
};
