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

export const clearChildren = (element: HTMLElement) => {
  // Accomplishes the same result as code below
  // this.parentEl.innerHTML = "";
  // However certain browsers might have optimize clearing elements with innerHTML if the string is empty
  // Generally it's faster to remove last item than the first
  while (element.firstChild) {
    element.removeChild(element.lastChild!);
  }
};

export const debounce = <T>(
  cb: T,
  {
    time,
    leading = false,
    throttle = null,
  }: { time: number; leading: boolean; throttle?: number | null }
): T => {
  let timeoutCb = 0;
  let throttleTimeStamp: number | null = null;
  let fire = true;
  let throttleFired = false;

  const debounced = (...args: any[]) => {
    if (leading && fire) {
      // @ts-ignore
      cb(...args);
      fire = false;
    }

    if (throttle != null) {
      if (throttleTimeStamp == null) {
        throttleTimeStamp = Date.now();
      }

      if (Date.now() - throttleTimeStamp! >= throttle) {
        // @ts-ignore
        cb(...args);
        throttleTimeStamp = null;
        throttleFired = true;
      }
    }

    if (throttleFired) {
      clearTimeout(timeoutCb);
      throttleFired = false;
      return;
    }

    clearTimeout(timeoutCb);
    timeoutCb = window.setTimeout(() => {
      // @ts-ignore
      if (!leading) cb(...args);
      fire = true;
    }, time);
  };

  return (debounced as unknown) as T;
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

export const removeElement = (el: HTMLElement) => {
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

const animationInstances: { [key: string]: Function[] } = {};
let hideRunning = false;
const showInstances: { id: string; show: Function }[] = [];
export const transitionHideThenShow = async ({
  id,
  hide,
  show,
}: {
  id: string;
  hide: Function;
  show: Function;
}) => {
  const animationIdExist = animationInstances[id];
  if (!animationIdExist) {
    animationInstances[id].push(show);
  }

  // if(animationIdExist) {
  //   showInstances.push({id, show})
  // }

  hide().then(() => {
    show().then(() => {
      // animationInstances.slice(animationInstances.indexOf(id), 1);
      // showInstances
    });
  });
};

export const clickEventFiredByKeyboard = (e: MouseEvent) => {
  return e.detail === 0;
};
