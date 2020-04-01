import { IOS, IOS13 } from "./browserInfo";

interface IAddEscapeHatch {
  target: Element;
  build: Function;
  onExit?: () => void;
  onRemove?: Function;
  onStart?: (e: IEvent) => boolean;
  toggle?: boolean;
  isKeyDown?: boolean;
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
  }
};

const parentContains = (element: Element) => {
  if (!targets.length) return false;

  const parent = targets[targets.length - 1].element;

  return parent.contains(element);
};

export default function addEscapeHatch({
  target,
  onExit,
  onStart,
  build,
  toggle = true,
  stopWhenTargetIsRemoved = true
}: IAddEscapeHatch) {
  if (parentContains(target)) {
    if (!toggle) return manualExit;
    onExitWithTearDownNode();
    if (!targets.length) {
      removeListeners();
    }

    return manualExit;
  }

  // create dropdown, popover, tooltip ect
  build();

  targets.push({
    element: target,
    stopWhenTargetIsRemoved,
    onStart,
    onExit
  });

  if (areEventListenersAdded) {
    return manualExit;
  }
  // event.stopPropagation doesn't stop created keyup listener from fireing
  stopPropagationOnKeyUp = true;

  const customEvent = <IEvent>{
    runAllExits: runAllExitsAndDestroy
  };

  listener.onClick = (e: TouchEvent | MouseEvent) => {
    const clickedTarget = e.target as HTMLElement;
    customEvent.event = e;

    for (let i = targets.length - 1; i >= 0; i--) {
      const { element, onStart, stopWhenTargetIsRemoved } = targets[i];

      if (onStart && !onStart(customEvent)) continue;
      if (element.contains(clickedTarget)) {
        continue;
      }
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
      const { element, onStart, stopWhenTargetIsRemoved } = targets[i];
      if (!e.key.match(/enter/i)) return null;
      if (stopWhenTargetIsRemoved && !clickedTarget.isConnected) return null;

      if (onStart && !onStart(customEvent)) continue;
      if (element.contains(clickedTarget)) {
        continue;
      }
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
      const { element, onStart, stopWhenTargetIsRemoved } = targets[i];

      if (stopWhenTargetIsRemoved && !clickedTarget.isConnected) return null;
      if (onStart && !onStart(customEvent)) continue;
      if (element.contains(clickedTarget)) {
        continue;
      }
      onExitWithTearDownNode();
    }
    if (!targets.length) {
      removeListeners();
    }
  };

  addListeners();

  return manualExit;
}
