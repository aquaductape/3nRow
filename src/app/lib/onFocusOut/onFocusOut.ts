import { IOS, IOS13 } from "./browserInfo";

interface IOnFocusOut {
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
  onExit: (customE?: ICustomEvent) => void;
  /**
   * runs when click or keydown event starts. Is run before `allow` or `not` selectors are evaluated
   *
   * if callback returns false, onExit runs
   *
   * if callback returns true, onExit is bypassed
   *
   * callback parameter holds a custom Event, that does have native event property "event"
   *
   */
  onStart?: (customE: ICustomEvent) => boolean;
  /**
   * list to allow focus on
   *
   * Example: A dropdown selector. Place a {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/closest|string selector} inside allow list, so it will allow interaction
   */
  allow?: string[];
  /**
   * list to run onExit when focused on
   *
   * Place a {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/closest|string selector} inside not list, so that it will run onExit on interaction. Example: A close button within a dropdown.
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
  /**
   * pass event
   */
  event?: Event;
}

type ICustomEvent = {
  firedByReselectButton: boolean;
  event: MouseEvent | TouchEvent | KeyboardEvent;
  element?: Element | null;
  parentOfRemovedElement?: Element | null;
  keepElementRef?: () => void;
  runAllExits?: () => void;
};

type ICallBackList = {
  id: string;
  button: HTMLElement;
  stopWhenTargetIsRemoved: boolean;
  isInit: () => boolean;
  allow: string[];
  not: string[];
  onExit: (customE?: ICustomEvent) => void;
  onStart?: (customE: ICustomEvent) => boolean;
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
   *
   * Case when Tab key is long pressed and not let go.
   *
   * Because keyup will only fire when Tab key is let go, this will leave dropdown open while focus is navigating outside of dropdown until Tab key is let go. Worse if Tab is held until focus moves outside of page and into the browser UI, such as the Address bar, no event is fired
   */
  onKeyDown?: (e: KeyboardEvent) => void;
};

export type TManualExit = {
  runAllExits: () => void;
  runExit: (e?: ICustomEvent) => void;
};

if (IOS && !IOS13) {
  const html = document.querySelector("html")!;
  html.style.cursor = "pointer";
  // @ts-ignore
  html.style.webkitTapHighlightColor = "rgba(0, 0, 0, 0)";
}

// listener that holds callback's reference in order to
// delete them from eventListeners
const globalListener: IGlobalListener = {};
let listeners: ICallBackList[] = [];

// to filter
let markedListener: string[] = [];
let isGlobalListenerAdded = false;

/**
 * events for dropdown.
 *
 * Listens when dropdown loses focus, such as clicking/Tabing outside or pressing Escape key.
 *
 * Works with nested dropdowns. Since this function uses shared state and every invokation appends a listener to a list which is then iterated over when the Document target fires
 */
export default function onFocusOut({
  button,
  onExit,
  onStart,
  run,
  allow = [],
  not = [],
  toggle = true,
  stopWhenTargetIsRemoved = true,
  event,
}: IOnFocusOut) {
  const id = uuid();
  const customEvent = <ICustomEvent>{
    runAllExits: runAllExitsAndDestroy,
    event,
  };

  const manualExit: TManualExit = {
    runAllExits: runAllExitsAndDestroy,
    runExit: () => {
      onExit();
      markListener(id);
      removeListeners();
      removeGlobalListener();
    },
  };

  if (reSelectButton({ button, toggle, customEvent })) {
    // TODO: should return null if there are no listeners
    return manualExit; // returns a reference, in case you want to manually remove the listeners
  }

  // create dropdown, popover, tooltip ect
  run();

  let init = true;
  const isInit = () => {
    if (init) {
      init = false;
      return true;
    }
    return false;
  };

  listeners.push({
    id,
    button: button as HTMLElement,
    stopWhenTargetIsRemoved,
    isInit,
    allow,
    not,
    onStart,
    onExit,
  });

  if (isGlobalListenerAdded) {
    return manualExit;
  }

  globalListener.onClick = (e: TouchEvent | MouseEvent) => {
    const clickedTarget = e.target as HTMLElement;
    const listenersLength = listeners.length;
    const customEvent = <ICustomEvent>{
      event: e,
      runAllExits: runAllExitsAndDestroy,
      firedByReselectButton: false,
    };

    for (let i = 0; i < listenersLength; i++) {
      const {
        id,
        onStart,
        onExit,
        stopWhenTargetIsRemoved,
        allow,
        not,
        isInit,
      } = listeners[i];
      if (isInit()) continue;

      if (onStart && onStart(customEvent)) continue;
      if (
        not.length &&
        not.some((selector) => clickedTarget.closest(selector))
      ) {
        onExit(customEvent);
        markListener(id);
        continue;
      }
      if (allow.some((selector) => clickedTarget.closest(selector))) continue;

      onExit(customEvent);
      markListener(id);
      // if (stopWhenTargetIsRemoved && !clickedTarget.isConnected) return null;
    }

    removeListeners();
    customEvent.parentOfRemovedElement = null;
    removeGlobalListener();
  };

  globalListener.onKeyDown = (e: KeyboardEvent) => {
    const clickedTarget = e.target as HTMLElement;
    const listenersLength = listeners.length;
    const customEvent = <ICustomEvent>{
      event: e,
      runAllExits: runAllExitsAndDestroy,
      firedByReselectButton: false,
    };

    if (e.key.match(/escape/i)) {
      const idx = listeners.length - 1;
      const { id, button, onExit } = listeners[idx];
      onExit(customEvent);
      button.focus();

      customEvent.parentOfRemovedElement = null;

      markListener(id);

      removeListeners();
      removeGlobalListener();
    }

    // work in progress, add more guards to fire less on useless strokes
    if (e.shiftKey && !e.key.match(/tab/i)) return;

    if (!e.key.match(/tab/i)) return null;

    for (let i = 0; i < listenersLength; i++) {
      const { id, button, onStart, onExit, allow, isInit } = listeners[i];
      if (isInit()) continue;
      // even when a previous click event fires within dropdown, if no focusable element is clicked, then activeElement is set to body
      if (document.activeElement === document.body) continue;

      // if (stopWhenTargetIsRemoved && !clickedTarget.isConnected) return null;

      // allow focus on dropdown button
      if (button.contains(clickedTarget)) continue;
      if (onStart && onStart(customEvent)) continue;
      if (allow.some((selector) => clickedTarget.closest(selector))) continue;

      onExit(customEvent);
      markListener(id);
    }
    removeListeners();
    removeGlobalListener();
  };

  globalListener.onKeyUp = (e: KeyboardEvent) => {
    const clickedTarget = e.target as HTMLElement;
    const listenersLength = listeners.length;
    const customEvent = <ICustomEvent>{
      event: e,
      runAllExits: runAllExitsAndDestroy,
      firedByReselectButton: false,
    };
    // // console.log("keyup", clickedTarget);

    if (!e.key.match(/tab/i)) return null;

    for (let i = 0; i < listenersLength; i++) {
      const {
        id,
        button,
        onStart,
        onExit,
        stopWhenTargetIsRemoved,
        allow,
        not,
        isInit,
      } = listeners[i];
      if (isInit()) continue;

      // if (stopWhenTargetIsRemoved && !clickedTarget.isConnected) return null;

      // allow focus on dropdown button
      if (button.contains(clickedTarget)) continue;
      if (onStart && onStart(customEvent)) continue;
      if (allow.some((selector) => clickedTarget.closest(selector))) continue;

      onExit(customEvent);
      markListener(id);
    }
    removeListeners();
    removeGlobalListener();
  };

  addGlobalListener();

  return manualExit;
}

const removeListeners = () => {
  if (!markedListener.length) return;
  listeners = listeners.filter(({ id }) => !markedListener.includes(id));
  markedListener = [];
};

const markListener = (idx: string) => {
  markedListener.push(idx);
};

const runAllExitsAndDestroy = () => {
  const listenersLength = listeners.length;
  for (let i = 0; i < listenersLength; i++) {
    const { onExit } = listeners[i];
    onExit();
  }

  listeners = [];

  removeGlobalListener();
};

const removeGlobalListener = () => {
  if (listeners.length) return;

  const { onClick, onKeyDown, onKeyUp } = globalListener;

  isGlobalListenerAdded = false;
  document.removeEventListener("click", onClick!);
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

// TODO replace to remove with id instead
const findButton = (element: Element) => {
  return listeners.findIndex((listener) => listener.button.contains(element));
};

const removeListenersSliceFromIdx = (idx: number) => {
  listeners.splice(idx, 1);
};

const clickEventFiredByKeyboard = (e: MouseEvent) => {
  return e.detail === 0;
};

const reSelectButton = ({
  button,
  toggle,
  customEvent,
}: {
  button: Element;
  toggle: boolean;
  customEvent: ICustomEvent;
}) => {
  const buttonIdx = findButton(button);
  if (buttonIdx > -1) {
    if (!toggle) return true;
    customEvent.firedByReselectButton = true;

    const { onExit } = listeners[buttonIdx];
    onExit(customEvent);
    removeListenersSliceFromIdx(buttonIdx);

    removeGlobalListener();
    return true;
  }

  return false;
};

// https://gist.github.com/jed/982883
// https://stackoverflow.com/a/2117523/8234457
const uuid = () => {
  // @ts-ignore
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c: number) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
};
