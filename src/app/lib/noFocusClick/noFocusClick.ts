// my own scuffed library that accomplishes the same goal as the proposed CSS `:focus-visible` and the pollyfill https://github.com/WICG/focus-visible

// even though visible focus indication is a must, the current css pseudo class `:focus` is annoying for mouse driven users (who are not aware of the aspects of focus/keyboard navigation) since it miscommunicates that the element is continually active, or just looks visually "unpleasing".
let prevEl = null as HTMLElement | null;
let hasClicked = false;
const className = "noFocusClick";

const ARROW_DOWN = "ArrowDown";
const ARROW_UP = "ArrowUp";
const ARROW_LEFT = "ArrowLeft";
const ARROW_RIGHT = "ArrowRight";
const TAB = "Tab";
const ENTER = "Enter";
const SPACE = " ";
const HOME = "Home";
const END = "End";
const keys = [
  ARROW_DOWN,
  ARROW_UP,
  ARROW_LEFT,
  ARROW_RIGHT,
  TAB,
  ENTER,
  SPACE,
  HOME,
  END,
];

document.addEventListener("click", (e) => {
  // detect if fired by keyboard
  if (e.detail === 0) return;

  if (prevEl) {
    prevEl.classList.remove(className);
  }

  const activeElement = document.activeElement as HTMLElement;

  if (activeElement === document.body) return;
  activeElement.classList.add(className);
  prevEl = activeElement;
  hasClicked = true;
});

document.addEventListener("keydown", (e) => {
  if (!hasClicked) return;
  if (!prevEl) return;
  if (!keys.includes(e.key)) return;
  prevEl.classList.remove(className);
  hasClicked = false;
});
