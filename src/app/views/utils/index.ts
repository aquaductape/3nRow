import { TPlayer } from "../../model/state";
import { camelToKebabCase } from "../../utils/index";

export const diagonalLengthOfElement = (el: HTMLElement) =>
  Math.ceil(
    Math.sqrt(Math.pow(el.clientWidth, 2) + Math.pow(el.clientHeight, 2))
  );

// older browsers such as IE do not support template elements
// as of 2019, 94% of users are using browsers that support template
export const createHTMLFromString = (string: string): Element => {
  const template = document.createElement("template");
  string = string.trim(); // Never return a text node of whitespace as the result
  template.innerHTML = string;
  return <Element>template.content.firstChild;
};

export const debounce = (
  cb: Function,
  { time, leading = false }: { time: number; leading: boolean }
) => {
  let timeout = 0;
  let fire = true;

  return function () {
    if (leading && fire) {
      cb();
      fire = false;
    }

    clearTimeout(timeout);
    timeout = window.setTimeout(() => {
      if (!leading) cb();
      fire = true;
    }, time);
  };
};

export const randomRoundAmount = (rounds: number = 0) => {
  return Math.floor(Math.random() * rounds);
};

interface IUniqueIds {
  svg: string;
  id: string;
  ignoreClass?: string[];
  ignoreUrl?: string[];
}
export const svgStringWithUniqueIds = ({
  svg,
  id,
  ignoreClass,
  ignoreUrl,
}: IUniqueIds) => {
  return svg
    .replace(/(id|class)="([^"]*)"/g, (_, attribute, value) => {
      if (ignoreClass) {
        if (attribute === "class") {
          if (ignoreClass.includes(value)) return _;
        }
      }
      return `${attribute}="${value + id}"`;
    })
    .replace(/url\(([^)]*)\)/g, (_, url) => {
      if (ignoreUrl) {
        if (ignoreUrl.includes(url)) return _;
      }
      return `url(${url + id})`;
    })
    .replace(
      /(xlink:)?href="([^"]*)"/g,
      (_, xlink, href) => `${xlink || ""}href="${href + id}"`
    );
};

export const removeChild = (el: HTMLElement) => {
  const parent = el.parentElement;
  if (!parent) return null;
  parent.removeChild(el);
};

export const getOppositePlayer = ({
  players,
  id,
}: {
  id: string;
  players: TPlayer[];
}) => players.filter((player) => player.id !== id)[0];

export const hideElement = ({
  el,
  transition = "200ms",
  duration = 200,
  useTransitionEvent = true,
  onStart,
  onEnd,
}: {
  el: string | HTMLElement;
  transition?: string;
  duration?: number;
  useTransitionEvent?: boolean;
  onStart?: (el: HTMLElement) => void;
  onEnd?: (el: HTMLElement) => void;
}) => {
  // default hides by opacity

  const element = getElement(el);
  transition = transition + " opacity";

  const onTransitionEnd = (e: Event) => {
    const target = e.target;
    if (target !== element) return;
    if (onEnd) {
      onEnd(element);
    }

    element.style.pointerEvents = "";
    element.style.opacity = "";
    element.removeEventListener("transitionend", onTransitionEnd);
  };
  const addTransitionListener = () =>
    element.addEventListener("transitionend", onTransitionEnd);

  const timeOut = () => {
    setTimeout(() => {
      onEnd && onEnd(element);
      element.style.pointerEvents = "";
    }, duration);
  };

  element.style.pointerEvents = "none";

  if (onStart) {
    onStart(element);
    if (!useTransitionEvent) return timeOut();
    addTransitionListener();
    return;
  }

  element.style.webkitTransition = transition;
  element.style.transition = transition;
  element.style.opacity = "1";
  reflow();
  addTransitionListener();

  element.style.opacity = "0";
};

export const showElement = ({
  el,
  display = "block",
  transition = "200ms",
  onStart,
  onEnd,
}: {
  el: string | HTMLElement;
  display?: string;
  onStart?: (el: HTMLElement) => void;
  onEnd?: (el: HTMLElement) => void;
  transition?: string;
}) => {
  const element = getElement(el);
  transition = transition + " opacity";

  const onTransitionEnd = (e: Event) => {
    const target = e.target;
    if (target !== element) return;
    if (onEnd) onEnd(element);
    element.style.opacity = "";
    element.style.webkitTransition = "";
    element.style.transition = "";

    element.removeEventListener("transitionend", onTransitionEnd);
  };
  const addTransitionListener = () =>
    element.addEventListener("transitionend", onTransitionEnd);

  addTransitionListener();

  if (onStart) {
    element.style.display = display;
    reflow();
    onStart(element);
    return;
  }

  element.style.opacity = "0";
  element.style.webkitTransition = transition;
  element.style.transition = transition;
  element.style.display = display;
  reflow();
  element.style.opacity = "1";
};

export const getElement = (root: string | HTMLElement) => {
  if (typeof root !== "string") return root;

  if (root[0] === "#" && !root.match(/#|\.|\[/g)) {
    return document.getElementById(root.slice(1))!;
  }

  return <HTMLElement>document.querySelector(root)!;
};

export const reflow = () => document.body.offsetWidth;

export const convertObjPropsToHTMLAttr = ({
  obj,
  type,
}: {
  obj: { [key: string]: string | undefined };
  type: "data" | "aria";
}) => {
  let result = "";
  for (let key in obj) {
    const value = obj[key];

    if (type === "data") key = camelToKebabCase(key);

    let attribute = `${key}="${value}"`;

    if (type === "data") {
      attribute = "data-" + attribute;
    }
    result += attribute;
  }

  return result;
};

export const hasAttributeValue = (
  el: HTMLElement | Element,
  { attr, val }: { attr: string; val: string }
) => {
  const attrResult = el.getAttribute(attr);
  if (!attrResult) return false;
  return attrResult === val;
};
