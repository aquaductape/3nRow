import { IPlayer } from "../../../../models/index";
import { valideKeyInput } from "../../../appControllers";
import { setAllColors } from "../../svgDefs";
import { changeLineColor } from "../../animate";

const changeShapeColor = (
  e: Event,
  primaryColor: string,
  secondaryColor: string,
  player: IPlayer
) => {
  if (!valideKeyInput(e)) return null;
  player.primaryColor = primaryColor;
  player.secondaryColor = secondaryColor;
  localStorage.setItem(`${player.id}-primary-color`, primaryColor);
  localStorage.setItem(`${player.id}-secondary-color`, secondaryColor);
  setAllColors(player);
  changeLineColor(player);
};

export const controllerColorList = (
  list: Element,
  primaryColor: string,
  secondaryColor: string,
  player: IPlayer
) => {
  list.addEventListener("click", e =>
    changeShapeColor(e, primaryColor, secondaryColor, player)
  );
  list.addEventListener("keydown", e =>
    changeShapeColor(e, primaryColor, secondaryColor, player)
  );
};
