import { IPlayer } from "../../../../models/index";
import { valideKeyInput } from "../../../appControllers";
import { replaceShape } from "../views/shapeList";

export const controllerShapeList = (
  list: HTMLElement,
  shape: string,
  player: IPlayer
) => {
  list.addEventListener("click", e => onList(e, list, shape, player));
  list.addEventListener("keydown", e => onList(e, list, shape, player));
};

const onList = (e: Event, list: Element, shape: string, player: IPlayer) => {
  if (!valideKeyInput(e)) return null;
  player.changeShape(shape);
  const allMarks = document.querySelectorAll(`[data-player="${player.id}"]`);
  localStorage.setItem(`${player.id}-shape`, shape);

  allMarks.forEach(mark => {
    replaceShape(player, mark);
  });
};
