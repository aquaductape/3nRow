import { dom } from "../../dom";
import { startGame } from "../../../models/gameLogic";

export const controllerOptionsFriend = () => {
  const btnFriend = <HTMLElement>(
    document.querySelector("." + dom.class.optionsFriend)
  );
  if (!btnFriend) return null;
  btnFriend.addEventListener("click", () => {
    startGame({ continueGame: true });
  });
};
