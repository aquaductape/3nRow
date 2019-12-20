import { onList } from "../views/list";

export const controllerList = (list: HTMLElement) => {
  list.addEventListener("click", onList);
};
