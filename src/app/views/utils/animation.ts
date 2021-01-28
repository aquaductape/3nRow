import { getElement, reflow } from ".";

type TInstance = {
  element: HTMLElement;
  transition: Function;
  resolve: (value: boolean | PromiseLike<boolean>) => void;
  onCancel?: Function;
};

type TSentry = {
  cancel: Function;
};
// needed when removing transition events when canceled
const hideInstances: TInstance[] = [];
const showInstances: TInstance[] = [];

/**
 * if transition duration is very low such as 10ms, it fails to fire transitionend event.
 */
const transitionDurationTooLow = (transition: string) => {
  const result = Number(transition.match(/\d+/)![0]);
  return result < 50;
};

const _hideElement = async ({
  el,
  displayNone,
  transition = "200ms",
  duration = 200,
  useTransitionEvent = true,
  delay,
  onStart,
  onEnd,
  onCancel,
  onSentry,
  resolve,
}: {
  el: string | HTMLElement;
  displayNone?: boolean;
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
  onSentry?: TSentry;
  resolve: (value: boolean | PromiseLike<boolean>) => void;
}) => {
  const getTransitionsAmount = () => {
    if (transitionTotal) return transitionTotal;
    const transitionsAmount = element.style.transition.match(/,/g);
    if (!transitionsAmount) return 1;
    return transitionsAmount.length + 1;
  };

  const fireOnEnd = (e?: TransitionEvent) => {
    element.removeEventListener("transitionend", onTransitionEnd);

    if (displayNone) {
      element.style.display = "none";
      element.style.opacity = "";
    }
    onEnd && onEnd(element, e);

    removeInstance({ element, instances: hideInstances });
    element.style.pointerEvents = "";
    resolve(true);
  };

  const onTransitionEnd = (e: TransitionEvent) => {
    const target = e.target;
    if (target !== element) return;
    // fire when all transition properties are done
    transitionCount++;
    if (transitionCount < getTransitionsAmount()) return;

    fireOnEnd(e);
  };

  const addTransitionListener = () =>
    element.addEventListener("transitionend", onTransitionEnd);

  const timeOut = () => {
    setTimeout(() => {
      if (displayNone) element.style.display = "none";
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
    onSentry,
    resolve,
  });

  let transitionCount = 0;
  let transitionTotal = 0;
  // default hides by opacity
  transition = transition + " opacity";

  element.style.pointerEvents = "none";

  if (onStart) {
    if (delay) await delayP(delay);

    onStart(element);
    if (!useTransitionEvent) return timeOut();
    addTransitionListener();

    if (transitionDurationTooLow(transition)) {
      fireOnEnd();
    }
    return;
  }

  if (delay) await delayP(delay);
  element.style.opacity = "1";
  element.style.webkitTransition = transition;
  element.style.transition = transition;
  reflow();

  element.style.opacity = "0";
  addTransitionListener();

  if (transitionDurationTooLow(transition)) {
    fireOnEnd();
  }
};

export const hideElement = ({
  el,
  displayNone,
  transition = "200ms",
  duration = 200,
  useTransitionEvent = true,
  delay,
  onCancel,
  onStart,
  onEnd,
  onSentry,
}: {
  el: string | HTMLElement;
  displayNone?: boolean;
  /** Default `200ms` */
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
  onSentry?: TSentry;
}) =>
  new Promise<boolean>((resolve) =>
    _hideElement({
      el,
      displayNone,
      delay,
      duration,
      onCancel,
      onEnd,
      onStart,
      onSentry,
      transition,
      useTransitionEvent,
      resolve,
    })
  );

const _showElement = async ({
  el,
  removeDisplayNone,
  transition = "200ms",
  delay = 0,
  onSentry,
  onStart,
  onEnd,
  onCancel,
  resolve,
}: {
  el: string | HTMLElement;
  removeDisplayNone?: boolean;
  onStart?: (el: HTMLElement) => void;
  /**
   * Fires when transition is finished. When there are multiple transitions, it will fire until all of them are finished
   */
  onEnd?: (el: HTMLElement) => void;
  onCancel?: (el: HTMLElement) => void;
  onSentry?: TSentry;
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

  const fireOnEnd = (e?: TransitionEvent) => {
    element.removeEventListener("transitionend", onTransitionEnd);

    if (onEnd) onEnd(element);
    element.style.opacity = "";
    element.style.webkitTransition = "";
    element.style.transition = "";
    removeInstance({ element, instances: showInstances });
    resolve(true);
  };

  const onTransitionEnd = (e: TransitionEvent) => {
    const target = e.target;
    if (target !== element) return;

    transitionCount++;
    if (transitionCount < getTransitionsAmount()) return;

    fireOnEnd(e);
  };

  const addTransitionListener = () =>
    element.addEventListener("transitionend", onTransitionEnd);

  const element = getElement(el);

  manageInstances({
    element,
    instances: showInstances,
    onTransitionEnd,
    onCancel,
    onSentry,
    resolve,
  });

  transition = transition + " opacity";
  let transitionCount = 0;
  let transitionTotal = 0;

  if (onStart) {
    if (delay) await delayP(delay);
    if (removeDisplayNone) {
      element.style.display = "";
      reflow();
    }
    onStart(element);
    addTransitionListener();
    if (transitionDurationTooLow(transition)) {
      fireOnEnd();
    }
    return;
  }

  if (delay) await delayP(delay);

  if (removeDisplayNone) element.style.display = "";
  element.style.opacity = "0";
  element.style.webkitTransition = transition;
  element.style.transition = transition;
  reflow();
  element.style.opacity = "1";
  addTransitionListener();
  if (transitionDurationTooLow(transition)) {
    fireOnEnd();
  }
};

export const showElement = ({
  el,
  removeDisplayNone,
  transition = "200ms",
  delay = 0,
  onSentry,
  onStart,
  onCancel,
  onEnd,
}: {
  el: string | HTMLElement;
  removeDisplayNone?: boolean;
  onStart?: (el: HTMLElement) => void;
  /**
   * Fires when transition is finished. When there are multiple transitions, it will fire until all of them are finished
   */
  onEnd?: (el: HTMLElement) => void;
  onCancel?: (el: HTMLElement) => void;
  onSentry?: TSentry;
  delay?: number;
  transition?: string;
}) =>
  new Promise<boolean>((resolve) =>
    _showElement({
      el,
      removeDisplayNone,
      resolve,
      delay,
      onEnd,
      onStart,
      onCancel,
      onSentry,
      transition,
    })
  );

const manageInstances = ({
  instances,
  element,
  onTransitionEnd,
  onCancel,
  onSentry,
  resolve,
}: {
  instances: TInstance[];
  element: HTMLElement;
  onTransitionEnd: Function;
  onCancel?: (el: HTMLElement) => void;
  onSentry?: TSentry;
  resolve: (value: boolean | PromiseLike<boolean>) => void;
}) => {
  manageSingleInstances({ element, instances: hideInstances });
  manageSingleInstances({ element, instances: showInstances });
  const instance = { element, transition: onTransitionEnd, onCancel, resolve };

  const runCancel = () => {
    if (!instance) return;
    const { element, resolve, transition, onCancel } = instance;
    removeInstance({ element, instances });

    element.removeEventListener("transitionend", transition as any);
    onCancel && onCancel(element);
    resolve(true);

    onSentry!.cancel = () => {};
  };

  instances.push(instance);
  if (onSentry) onSentry.cancel = runCancel;
};

const manageSingleInstances = ({
  element,
  instances,
}: {
  instances: TInstance[];
  element: HTMLElement;
}) => {
  const alreadyRunningInstance = removeInstance({ element, instances });

  if (alreadyRunningInstance) {
    const { element, transition, onCancel, resolve } = alreadyRunningInstance;
    element.removeEventListener("transitionend", transition as any);
    onCancel && onCancel(element);
    resolve(true);
  }
};

const removeInstance = ({
  element,
  instances,
}: {
  element: HTMLElement;
  instances: TInstance[];
}) => {
  let alreadyRunningIndex = 0;
  const alreadyRunningInstance = instances.find((instance, idx) => {
    if (instance.element === element) {
      alreadyRunningIndex = idx;
      return true;
    }
  });
  if (alreadyRunningInstance) {
    instances.splice(alreadyRunningIndex, 1);
    return alreadyRunningInstance;
  }

  return null;
};

export const delayP = (delay: number) =>
  new Promise((resolve) => {
    setTimeout(() => {
      return resolve(true);
    }, delay);
  });
