import { IPlayer } from "../../../../models/index";
import { valideKeyInput } from "../../../appControllers";
import { setAllColors, removeSVGDefs, addSVGDefs } from "../../svgDefs";
import { changeLineColor } from "../../animate";

const changeShapeColor = (
  e: Event,
  primaryColor: string,
  secondaryColor: string,
  player: IPlayer
) => {
  if (!valideKeyInput(e)) return null;
  e.preventDefault();
  e.stopPropagation();

  player.primaryColor = primaryColor;
  player.secondaryColor = secondaryColor;
  localStorage.setItem(`${player.id}-primary-color`, primaryColor);
  localStorage.setItem(`${player.id}-secondary-color`, secondaryColor);

  // Modern Chrome and Firefox support dynamic interaction with SVG
  // Therefore targeting/updating svg Defs using setAllColors(player) wasn't an issue
  // However browsers such as Safari, svg cannot be updated after it is rendered to the dom
  // Used solution is to remove the defs, then rerender them into the dom
  // Other solutions: rerender all svg player marks, instead of defs, since additional shapes increases defs
  //                  referencing embedded SVG using getSVGDocument
  removeSVGDefs();
  addSVGDefs();
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
