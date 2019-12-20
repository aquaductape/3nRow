import { determineSpeed } from "../../../models/ai/ai";
import { startGame } from "../../../models/gameLogic";
import { removeAllPlayerOptions } from "../../playerOptions/playerOptions";
import { removeDropDown } from "../dropDown";
import { cleanUpGameStart } from "../../board";

export const onList = (e: Event) => {
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
  cleanUpGameStart();
};
