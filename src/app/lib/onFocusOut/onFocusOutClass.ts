import { IOS, IOS13 } from "./browserInfo";

interface TOnFocusOut {
  /**
   * button that toggles dropdown/menu
   *
   * if dropdown is not a descendant of button then provide dropdown's selector in "allow" property. Or use "onStart" callback
   */
  button: Element;
  /**
   * runs callback immediately
   */
  run: Function;
  /**
   * callback to hold actions to remove dropdown/menu
   *
   * runs when Escape is pressed or focused outside of intented target
   */
  onExit: () => void;
  /**
   * runs when click or keydown event starts
   *
   * if callback returns false, onExit runs
   *
   * if callback returns true, onExit is bypassed
   *
   * callback parameter holds a custom Event, that does have native event property "event"
   *
   */
  onStart?: (e: IEvent) => boolean;
  /**
   * list to allow focus on
   *
   * Example: A dropdown selector. Place a {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/closest|string selector} inside allow list, so it will allow interaction
   */
  allow?: string[];
  /**
   * list to run onExit when focused on
   *
   * Example: A close button within a dropdown. Place a {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/closest|string selector} inside not list, so that it will run onExit on interaction
   */
  not?: string[];
  /**
   * @defaultValue `true`
   *
   * allow toggle on button
   *
   * if false, reclicking button will keep the dropdown open
   */
  toggle?: boolean;
  /**
   * @defaultValue `true`
   *
   * if in a nested dropdown situation, if focused only removes one dropdown, it will stop
   */
  stopWhenTargetIsRemoved?: boolean;
}

type IEvent = {
  event: MouseEvent | TouchEvent | KeyboardEvent;
  element: Element | null;
  parentOfRemovedElement: Element | null;
  keepElementRef: () => void;
  runAllExits: () => void;
};

type ICallBackList = {
  button: Element;
  stopWhenTargetIsRemoved: boolean;
  isInit: () => boolean;
  allow: string[];
  not: string[];
  onExit: () => void;
  onStart?: (e: IEvent) => boolean;
};

type IGlobalListener = {
  /**
   * click event to simulate focus out
   */
  onClick?: (e: TouchEvent | MouseEvent) => void;
  /**
   * key event to simulate focus out
   */
  onKeyUp?: (e: KeyboardEvent) => void;
  /**
   * key event to simulate focus out
   * Needed when Tab key is long pressed and not let go.
   * Because keyup will only fire when Tab key is let go, this will leave dropdown open while focus is navigating outside of dropdown until Tab key is let go. Worse if Tab is held until focus moves outside of page and into the browser UI, such as the Address bar, no event is fired
   */
  onKeyDown?: (e: KeyboardEvent) => void;
};

if (IOS && !IOS13) {
  const html = document.querySelector("html")!;
  html.style.cursor = "pointer";
  html.style.webkitTapHighlightColor = "rgba(0, 0, 0, 0)";
}

// listener that holds callback's reference in order to
// delete them from eventListeners
const globalListener: IGlobalListener = {};
const listeners: ICallBackList[] = [];

let isGlobalListenerAdded = false;
let currentIdx = 0;
let hasMarkedListener = false;

class OnFocusOu {
  // params
  private button: Element;
  private onExit: () => void;
  private onStart?: (e: IEvent) => boolean;
  private allow?: string[];
  private not?: string[];
  private stopWhenTargetIsRemoved?: boolean;
  private toggle?: boolean;

  private init: boolean;

  // let init = true;
  // const isInit = () => {
  // };
  constructor({
    button,
    run,
    onExit,
    onStart,
    allow = [],
    not = [],
    stopWhenTargetIsRemoved = true,
    toggle = true,
  }: TOnFocusOut) {
    this.button = button;
    this.onExit = onExit;
    this.onStart = onStart;
    this.allow = allow;
    this.not = not;
    this.stopWhenTargetIsRemoved = stopWhenTargetIsRemoved;
    this.toggle = toggle;
    this.init = true;

    if (reClickButton({ button, toggle })) {
      return;
    }

    // create dropdown, popover, tooltip ect
    run();
  }

  private isInit() {
    if (this.init) {
      this.init = false;
      return true;
    }
    return false;
  }

  runCurrentExit() {
    this.onExit();
  }

  runAllExits() {
    runAllExitsAndDestroy();
  }
}

// export default OnFocusOutt;

const runExitAndTearDownListener = () => {
  // const idx = listeners.length - 1;
  if (!listeners.length) return null;
  // const { onExit } = listeners[idx];
  const { onExit } = listeners[0];
  if (onExit) onExit();
  // listeners.pop();
  listeners.shift();
};

const removeListeners = () => {
  if (!hasMarkedListener) return;
  listeners.splice(0, currentIdx + 1);
  hasMarkedListener = false;
};

const markListener = (idx: number) => {
  hasMarkedListener = true;
  currentIdx = idx;
};

const runAllExitsAndDestroy = () => {
  for (let i = listeners.length - 1; i >= 0; i--) {
    runExitAndTearDownListener();
  }

  removeGlobalListener();
};

const removeGlobalListener = () => {
  if (listeners.length) return;

  const { onClick, onKeyDown, onKeyUp } = globalListener;

  isGlobalListenerAdded = false;
  document.removeEventListener("click", onClick!);
  // debounce
  document.removeEventListener("keydown", onKeyDown!);
  document.removeEventListener("keyup", onKeyUp!);
};

const addGlobalListener = () => {
  const { onClick, onKeyDown, onKeyUp } = globalListener;
  isGlobalListenerAdded = true;
  document.addEventListener("click", onClick!);
  document.addEventListener("keydown", onKeyDown!);
  document.addEventListener("keyup", onKeyUp!);
};

// optional manual remove as opposed to events
const manualExit = {
  runAllExits() {
    runAllExitsAndDestroy();
  },
};

const parentContains = (element: Element) => {
  if (!listeners.length) return false;

  const parent = listeners[listeners.length - 1].button;

  return parent.contains(element);
};

const reClickButton = ({
  button,
  toggle,
}: {
  button: Element;
  toggle: boolean;
}) => {
  if (parentContains(button)) {
    // if (!toggle) return manualExit;
    if (!toggle) return true;
    // console.log("on toggle exit");
    runExitAndTearDownListener();
    if (!listeners.length) {
      removeGlobalListener();
    }

    // return manualExit;
    return true;
  }

  return false;
};
