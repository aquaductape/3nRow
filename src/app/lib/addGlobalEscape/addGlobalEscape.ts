import { IOS, IOS13 } from "./browserInfo";

interface IAddGlobalEscape {
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
   * Example: The dropdown is not a descendant of button, so focusing on dropdown will run onExit. To prevent this, place a {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/closest|string selector} inside allow list, so it will allow interaction
   */
  allow?: string[];
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
  element: Element;
  stopWhenTargetIsRemoved: boolean;
  allow?: string[];
  onStart?: (e: IEvent) => boolean;
  onExit?: () => void;
};
type IListener = {
  onClick?: (e: TouchEvent | MouseEvent) => void;
  onKeyDown?: (e: KeyboardEvent) => void;
  onKeyUp?: (e: KeyboardEvent) => void;
};

if (IOS && !IOS13) {
  const html = document.querySelector("html")!;
  html.style.cursor = "pointer";
  html.style.webkitTapHighlightColor = "rgba(0, 0, 0, 0)";
}

// listener that holds callback's reference in order to
// delete them from eventListeners
const listener: IListener = {};
const targets: ICallBackList[] = [];

let areEventListenersAdded = false;
let stopPropagationOnKeyUp = true;

export default function addGlobalEscape({
  button,
  onExit,
  onStart,
  run,
  allow = [],
  toggle = true,
  stopWhenTargetIsRemoved = true,
}: IAddGlobalEscape) {
  if (reClickButton({ button, toggle })) {
    return manualExit; // returns a reference, incase you want to manually remove the listeners
  }

  // create dropdown, popover, tooltip ect
  run();

  targets.push({
    element: button,
    stopWhenTargetIsRemoved,
    allow,
    onStart,
    onExit,
  });

  if (areEventListenersAdded) {
    return manualExit;
  }

  // event.stopPropagation doesn't stop created keyup listener from fireing
  stopPropagationOnKeyUp = true;

  const customEvent = <IEvent>{
    runAllExits: runAllExitsAndDestroy,
  };

  listener.onClick = (e: TouchEvent | MouseEvent) => {
    const clickedTarget = e.target as HTMLElement;
    customEvent.event = e;

    for (let i = targets.length - 1; i >= 0; i--) {
      const { element, onStart, stopWhenTargetIsRemoved, allow } = targets[i];

      if (onStart && onStart(customEvent)) continue;
      if (allow && allow.some((query) => clickedTarget.closest(query)))
        continue;
      if (element.contains(clickedTarget)) continue;

      onExitWithTearDownNode();
      if (stopWhenTargetIsRemoved && !clickedTarget.isConnected) return null;
    }
    customEvent.parentOfRemovedElement = null;
    if (!targets.length) {
      removeListeners();
    }
  };

  listener.onKeyDown = (e: KeyboardEvent) => {
    const clickedTarget = e.target as HTMLElement;
    customEvent.event = e;

    if (e.key.match(/escape/i)) {
      runAllExitsAndDestroy();
      return null;
    }

    for (let i = targets.length - 1; i >= 0; i--) {
      const { element, onStart, stopWhenTargetIsRemoved, allow } = targets[i];

      if (!e.key.match(/enter/i)) return null;
      if (stopWhenTargetIsRemoved && !clickedTarget.isConnected) return null;

      if (onStart && onStart(customEvent)) continue;
      if (allow && allow.some((query) => clickedTarget.closest(query)))
        continue;
      if (element.contains(clickedTarget)) continue;

      onExitWithTearDownNode();
    }
    customEvent.parentOfRemovedElement = null;
    if (!targets.length) {
      removeListeners();
    }
  };

  listener.onKeyUp = (e: KeyboardEvent) => {
    if (stopPropagationOnKeyUp) {
      stopPropagationOnKeyUp = false;
      return null;
    }
    const clickedTarget = e.target as HTMLElement;
    customEvent.event = e;

    if (!e.key.match(/tab/i)) return null;

    for (let i = targets.length - 1; i >= 0; i--) {
      const { element, onStart, stopWhenTargetIsRemoved, allow } = targets[i];

      if (stopWhenTargetIsRemoved && !clickedTarget.isConnected) return null;

      if (onStart && onStart(customEvent)) continue;
      if (allow && allow.some((query) => clickedTarget.closest(query)))
        continue;
      if (element.contains(clickedTarget)) continue;

      onExitWithTearDownNode();
    }
    if (!targets.length) {
      removeListeners();
    }
  };

  addListeners();

  return manualExit;
}

const onExitWithTearDownNode = () => {
  const idx = targets.length - 1;
  if (!targets.length) return null;
  const { onExit } = targets[idx];
  if (onExit) onExit();
  targets.pop();
};

const runAllExitsAndDestroy = () => {
  const { onClick, onKeyDown, onKeyUp } = listener;

  for (let i = targets.length - 1; i >= 0; i--) {
    onExitWithTearDownNode();
  }

  areEventListenersAdded = false;
  document.removeEventListener("click", onClick!, true);
  document.removeEventListener("keydown", onKeyDown!, true);
  document.removeEventListener("keyup", onKeyUp!, true);
};

const removeListeners = () => {
  const { onClick, onKeyDown, onKeyUp } = listener;

  areEventListenersAdded = false;
  document.removeEventListener("click", onClick!, true);
  document.removeEventListener("keydown", onKeyDown!, true);
  document.removeEventListener("keyup", onKeyUp!, true);
};

const addListeners = () => {
  const { onClick, onKeyDown, onKeyUp } = listener;
  areEventListenersAdded = true;
  document.addEventListener("click", onClick!, true);
  document.addEventListener("keydown", onKeyDown!, true);
  document.addEventListener("keyup", onKeyUp!, true);
};

// optional manual remove as opposed to events
const manualExit = {
  runAllExits() {
    runAllExitsAndDestroy();
  },
};

const parentContains = (element: Element) => {
  if (!targets.length) return false;

  const parent = targets[targets.length - 1].element;

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
    onExitWithTearDownNode();
    if (!targets.length) {
      removeListeners();
    }

    // return manualExit;
    return true;
  }

  return false;
};
