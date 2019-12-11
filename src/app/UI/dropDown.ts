import { dom } from "./dom";
import { createHTMLFromString, getElementById } from "../../utils/index";
import { startGame } from "../gameLogic";
import { determineSpeed } from "../ai/ai";
import { cleanUpGameStart } from "./board";
import { eventListenerOrder } from "./events/eventTriggers";

const btnDropDown = <HTMLDivElement>(
  document.getElementById(dom.id.btnDifficultyDDContainer)
);

export const toggleDropDown = () => {
  eventListenerOrder.dropDownDifficulty = true;
  const dropDown = document.getElementById(dom.id.dropDownDifficulty);
  if (!dropDown) {
    const string = dom.html.btnBotDropdown;
    const el = <Element>createHTMLFromString(string);
    btnDropDown.appendChild(el);
    const isWithinView = withinViewPort(getElementById(el.id));
    moveElement(el, isWithinView ? "bottom" : "top");
  } else {
    btnDropDown.removeChild(dropDown);
  }
};

export const removeDropDown = () => {
  const dropDown = document.getElementById(dom.id.dropDownDifficulty);
  if (!dropDown) return null;
  btnDropDown.removeChild(dropDown);
};

export const onDropDownSettings = () => {
  const settings = document.querySelector(dom.class.dropDownSettings);
  if (!settings) return null;
  const list = settings.childNodes;

  list.forEach(list => {
    list.addEventListener("click", e => {
      const target = <Element>e.target;
      const difficulty = <string>target.textContent;
      const speed = determineSpeed(<any>difficulty);

      startGame({
        ai: true,
        difficulty: <any>difficulty.toUpperCase(),
        aiSpeed: speed
      });
      cleanUpGameStart();
    });
  });
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
