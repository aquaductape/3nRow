import { dom } from "../../dom";
import { startGame } from "../../../models/gameLogic";
import { cleanUpGameStart } from "../../board";
import { removeAllPlayerOptions } from "../playerOptions";
import { removeDropDown } from "../../dropDown/dropDown";

export const controllerOptionsFriend = () => {
  const btnFriend = <HTMLElement>(
    document.querySelector("." + dom.class.optionsFriend)
  );
  if (!btnFriend) return null;
  btnFriend.addEventListener("click", () => {
    startGame({ continueGame: true });
    cleanUpGameStart();
    removeAllPlayerOptions();
    removeDropDown();
  });
};
