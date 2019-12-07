import { dom } from "./UI/dom";
import { debounce } from "../utils/index";
import { withinViewPort, moveElement } from "./UI/dropDown";

const changeHeight = () => {
  const gameContainer = <HTMLDivElement | null>(
    document.querySelector(".game-container")
  );
  if (!gameContainer) return null;
  const browserInnerHeight =
    window.innerHeight || document.documentElement.clientHeight;

  gameContainer.style.maxWidth = `${browserInnerHeight - 300}px`;
  // }
};

const dropDownPosition = () => {
  const dropDown = document.getElementById(dom.id.btnBotDropdown);
  if (dropDown) {
    const isWithinView = withinViewPort(dropDown, 5);
    moveElement(dropDown, isWithinView ? "bottom" : "top");
  }
};

// init height
changeHeight();

const debounceDropDown = debounce(dropDownPosition, 200);
window.addEventListener("resize", () => {
  changeHeight();
  debounceDropDown();
});
