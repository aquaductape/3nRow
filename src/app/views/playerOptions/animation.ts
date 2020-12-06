import { getElement } from "../utils/index";

const clamp = (value: number, min: number, max: number) => {
  return Math.max(min, Math.min(max, value));
};

const ease = (v: number, pow = 4) => {
  v = clamp(v, 0, 1);

  return 1 - Math.pow(1 - v, pow);
};

export const easeInOutQuad = (x: number) =>
  x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
// expand: call other function and listen to it, if called again, interrupt current function and either end or start again
const expand = (elementRadius: number) => {
  for (let i = 0; i <= 100; i++) {}
};

let runningInstances: {
  el: HTMLElement;
  refs: { canceled: boolean; prevFrom: number };
}[] = [];

const findRunningInstance = (el: HTMLElement) => {
  let foundIdx = 0;
  const instance = runningInstances.find((instance, idx) => {
    if (el === instance.el) {
      foundIdx = idx;
      return true;
    }
  });
  if (!instance) return null;

  return { idx: foundIdx, instance: instance };
};

const removeRunningInstance = (el: HTMLElement) => {
  const sameRunningInstance = findRunningInstance(el);

  if (sameRunningInstance) {
    const { instance, idx } = sameRunningInstance;
    instance.refs.canceled = true;
    runningInstances.splice(idx, 1);
    return instance;
  }
  return null;
};

// data animation running attr on element
export const animateDropdown = ({
  el,
  from,
  to,
  duration,
  onDraw,
  onCancel,
  onEnd,
  onStart,
}: {
  el: string | HTMLElement;
  from: number;
  to: number;
  duration: number;
  onDraw: (value: number) => void;
  onEnd?: (value: number) => void;
  onCancel?: (value: number) => void;
  onStart?: () => void;
}) => {
  const timestamp = Date.now();
  el = getElement(el);

  // remove if running instance has same element
  const prevInstance = removeRunningInstance(el);
  // if (prevInstance) return;

  let refs = { canceled: false, prevFrom: from };

  runningInstances.push({
    el,
    refs,
  });

  onStart && onStart();

  const startx = prevInstance ? prevInstance.refs.prevFrom : from;
  const destx = to;
  let start: number | null = null;
  let end = null;
  let x = 0;

  const animate = (timeStamp: number) => {
    start = timeStamp;
    end = start + duration;
    draw(timeStamp);
  };

  // const isCanceled = () => timestamp !== animationTimeStamp; // won't work, its a primitive, needs to be getting prop from object

  const draw = (now: number) => {
    if (refs.canceled) {
      onCancel && onCancel(x);

      console.log("interrupted!", {
        timestamp,
      });
      return;
    }

    if (now - start! > duration) {
      onEnd && onEnd(x);
      removeRunningInstance(el as HTMLElement);
      return;
    }
    const p = (now - start!) / duration;
    const val = easeInOutQuad(p);
    x = startx + (destx - startx) * val;

    refs.prevFrom = x;
    onDraw(x);
    requestAnimationFrame(draw);
  };

  requestAnimationFrame(animate);
};
