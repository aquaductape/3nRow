import { getElement, reflow } from ".";
import { uuidv4 } from "../../utils";

type TInstance = {
  element: HTMLElement;
  transition: Function;
  onCancel?: Function;
};
// needed when removing transition events when canceled
const hideInstances: TInstance[] = [];
const showInstances: TInstance[] = [];

const _hideElement = ({
  el,
  transition = "200ms",
  duration = 200,
  useTransitionEvent = true,
  onStart,
  onEnd,
  onCancel,
  resolve,
}: {
  el: string | HTMLElement;
  transition?: string;
  duration?: number;
  delay?: number;
  useTransitionEvent?: boolean;
  onStart?: (el: HTMLElement) => void;
  /**
   * Fires when transition is finished. When there are multiple transitions, it will fire until all of them are finished
   */
  onEnd?: (el: HTMLElement, e?: TransitionEvent) => void;
  onCollision?: (props: { el: HTMLElement; cancel: boolean }) => void;
  onCancel?: (el: HTMLElement) => void;
  resolve: (value: boolean | PromiseLike<boolean>) => void;
}) => {
  const getTransitionsAmount = () => {
    if (transitionTotal) return transitionTotal;
    const transitionsAmount = element.style.transition.match(/,/g);
    if (!transitionsAmount) return 1;
    return transitionsAmount.length + 1;
  };

  const onTransitionEnd = (e: TransitionEvent) => {
    const target = e.target;
    if (target !== element) return;
    // fire when all transition properties are done
    transitionCount++;
    if (transitionCount < getTransitionsAmount()) return;

    element.removeEventListener("transitionend", onTransitionEnd);

    onEnd && onEnd(element, e);

    element.style.pointerEvents = "";
    element.style.opacity = "";
    resolve(true);
  };

  const addTransitionListener = () =>
    element.addEventListener("transitionend", onTransitionEnd);

  const timeOut = () => {
    setTimeout(() => {
      onEnd && onEnd(element);

      element.style.pointerEvents = "";
      element.style.opacity = "";
      resolve(true);
    }, duration);
  };

  const element = getElement(el);

  manageInstances({
    element,
    instances: hideInstances,
    onTransitionEnd,
    onCancel,
  });

  let transitionCount = 0;
  let transitionTotal = 0;
  // default hides by opacity
  transition = transition + " opacity";

  element.style.pointerEvents = "none";

  if (onStart) {
    onStart(element);
    if (!useTransitionEvent) return timeOut();
    addTransitionListener();
    return;
  }

  element.style.opacity = "1";
  element.style.webkitTransition = transition;
  element.style.transition = transition;
  reflow();
  addTransitionListener();

  element.style.opacity = "0";
};

export const hideElement = ({
  el,
  transition = "200ms",
  duration = 200,
  useTransitionEvent = true,
  delay,
  onCancel,
  onStart,
  onEnd,
}: {
  el: string | HTMLElement;
  transition?: string;
  duration?: number;
  delay?: number;
  useTransitionEvent?: boolean;
  onStart?: (el: HTMLElement) => void;
  /**
   * Fires when transition is finished. When there are multiple transitions, it will fire until all of them are finished
   */
  onEnd?: (el: HTMLElement, e?: TransitionEvent) => void;
  onCancel?: (el: HTMLElement) => void;
}) =>
  new Promise<boolean>((resolve) =>
    _hideElement({
      el,
      delay,
      duration,
      onCancel,
      onEnd,
      onStart,
      transition,
      useTransitionEvent,
      resolve,
    })
  );

const _showElement = async ({
  el,
  display = "block",
  transition = "200ms",
  delay = 0,
  onStart,
  onEnd,
  onCancel,
  resolve,
}: {
  el: string | HTMLElement;
  display?: string;
  onStart?: (el: HTMLElement) => void;
  /**
   * Fires when transition is finished. When there are multiple transitions, it will fire until all of them are finished
   */
  onEnd?: (el: HTMLElement) => void;
  onCancel?: (el: HTMLElement) => void;
  delay?: number;
  transition?: string;
  // TODO
  /**
   * Choose transition elements to listen to. Default is `el`
   */
  // transitionElements?: (HTMLElement | string)[]
  resolve: (value: boolean | PromiseLike<boolean>) => void;
}) => {
  const getTransitionsAmount = () => {
    if (transitionTotal) return transitionTotal;
    const transitionsAmount = element.style.transition.match(/,/g);
    if (!transitionsAmount) return 1;
    return transitionsAmount.length + 1;
  };

  const onTransitionEnd = (e: TransitionEvent) => {
    const target = e.target;
    if (target !== element) return;

    transitionCount++;
    if (transitionCount < getTransitionsAmount()) return;

    element.removeEventListener("transitionend", onTransitionEnd);
    if (onEnd) onEnd(element);
    element.style.opacity = "";
    element.style.webkitTransition = "";
    element.style.transition = "";
    resolve(true);
  };

  const addTransitionListener = () =>
    element.addEventListener("transitionend", onTransitionEnd);

  const element = getElement(el);

  manageInstances({
    element,
    instances: showInstances,
    onTransitionEnd,
    onCancel,
  });

  transition = transition + " opacity";
  let transitionCount = 0;
  let transitionTotal = 0;

  if (onStart) {
    if (delay) await delayP(delay);
    element.style.display = display;
    reflow();
    onStart(element);
    addTransitionListener();
    return;
  }

  if (delay) await delayP(delay);

  element.style.opacity = "0";
  element.style.webkitTransition = transition;
  element.style.transition = transition;
  element.style.display = display;
  reflow();
  element.style.opacity = "1";
  addTransitionListener();
};

export const showElement = ({
  el,
  display = "block",
  transition = "200ms",
  delay = 0,
  onStart,
  onCancel,
  onEnd,
}: {
  el: string | HTMLElement;
  display?: string;
  onStart?: (el: HTMLElement) => void;
  /**
   * Fires when transition is finished. When there are multiple transitions, it will fire until all of them are finished
   */
  onEnd?: (el: HTMLElement) => void;
  onCancel?: (el: HTMLElement) => void;
  delay?: number;
  transition?: string;
}) =>
  new Promise<boolean>((resolve) =>
    _showElement({
      el,
      resolve,
      delay,
      display,
      onEnd,
      onStart,
      onCancel,
      transition,
    })
  );

const manageInstances = ({
  instances,
  element,
  onTransitionEnd,
  onCancel,
}: {
  instances: TInstance[];
  element: HTMLElement;
  onTransitionEnd: Function;
  onCancel?: (el: HTMLElement) => void;
}) => {
  let alreadyRunningIndex = 0;
  const alreadyRunningInstance = instances.find((instance, idx) => {
    if (instance.element === element) {
      alreadyRunningIndex = idx;
      return true;
    }
  });

  // onInterrupt -> {abort, el}

  if (alreadyRunningInstance) {
    const { element, transition, onCancel } = alreadyRunningInstance;
    element.removeEventListener("transitionend", transition as any);
    instances.splice(alreadyRunningIndex, 1);

    onCancel && onCancel(element);
  }

  instances.push({ element, transition: onTransitionEnd });
};

const delayP = (delay: number) =>
  new Promise((resolve) => {
    setTimeout(() => {
      return resolve(true);
    }, delay);
  });
