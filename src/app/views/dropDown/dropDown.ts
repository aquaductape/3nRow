import { dom } from "../dom";
import { createHTMLFromString } from "../../../utils/index";
import { eventListenerOrder } from "../events/eventTriggers";
import { controllerList } from "./controllers/list";

export const toggleDropDown = () => {
  eventListenerOrder.dropDownDifficulty = true;
  const btnDropDown = <HTMLDivElement>(
    document.querySelector("." + dom.class.btnDifficultyDDContainer)
  );
  if (!btnDropDown) return null;
  const dropDown = document.querySelector("." + dom.class.dropDownDifficulty);
  if (!dropDown) {
    const string = dom.html.btnBotDropdown;
    const el = <HTMLElement>createHTMLFromString(string);
    btnDropDown.appendChild(el);
    const isWithinView = withinViewPort(el);
    moveElement(el, isWithinView ? "bottom" : "top");
    onDropDownSettings();
  } else {
    btnDropDown.removeChild(dropDown);
  }
};

export const removeDropDown = () => {
  const btnDropDown = <HTMLDivElement>(
    document.querySelector("." + dom.class.btnDifficultyDDContainer)
  );
  const dropDown = document.querySelector("." + dom.class.dropDownDifficulty);
  if (!dropDown || !btnDropDown) return null;
  btnDropDown.removeChild(dropDown);
};

export const onDropDownSettings = () => {
  const settings = document.querySelector(dom.class.dropDownSettings);
  if (!settings) return null;
  const list = settings.childNodes;

  list.forEach(list => controllerList(list as HTMLElement));
};

export const withinViewPort = (el: HTMLElement, spacing: number = 5) => {
  const browserInnerHeight =
    window.innerHeight || document.documentElement.clientHeight;

  const { bottom } = el.getBoundingClientRect();
  const isTop = el.classList.contains("position-top");
  const topTranslate = 1.3;

  if (isTop) {
    console.log(bottom * topTranslate);
    return bottom * topTranslate + spacing < browserInnerHeight;
  }

  return bottom + spacing < browserInnerHeight;
};

export const moveElement = (el: Element, position: "top" | "bottom") => {
  if (position === "top") {
    el.classList.add("position-top");
    el.classList.remove("hide-v");
  } else {
    el.classList.remove("position-top");
    el.classList.remove("hide-v");
  }
};
