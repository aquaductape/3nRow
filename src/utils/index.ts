import { TFlattenBoard, ItoggleAriaExpanded } from "../models/index";

export const flattenArr = <T>(arr: T[]): any[] => {
  const flatArr: any[] = [];
  arr.forEach(item => {
    if (Array.isArray(item)) {
      flatArr.push(...flattenArr(item));
    } else {
      flatArr.push(item);
    }
  });

  return flatArr;
};

export const convertToRowCol = (idx: number) => {
  const column = idx % 3;
  let row = 0;

  if (idx > 5) {
    row = 2;
    return { row, column };
  }
  if (idx > 2) {
    row = 1;
    return { row, column };
  }

  return { row, column };
};

// older browsers such as IE do not support template elements
// as of 2019, 94% of users are using browsers that support template
export const createHTMLFromString = (string: string): Element => {
  const template = document.createElement("template");
  string = string.trim(); // Never return a text node of whitespace as the result
  template.innerHTML = string;
  return <Element>template.content.firstChild;
};

export const debounce = (cb: Function, time: number = 500) => {
  let timeout = 0;

  return function() {
    clearTimeout(timeout);
    timeout = window.setTimeout(cb, time);
  };
};

export const randomRoundAmount = (rounds: number = 0) => {
  return Math.floor(Math.random() * rounds);
};

// returns the available spots on the board
export const emptyIndexies = (board: TFlattenBoard) => {
  return board.filter(s => s !== "O" && s !== "X");
};

interface IUniqueIds {
  svg: string;
  id: string;
  ignoreClass?: string[];
  ignoreUrl?: string[];
}
export const uniqueIds = ({ svg, id, ignoreClass, ignoreUrl }: IUniqueIds) => {
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

export const randomItemFromArr = (arr: any[]) => {
  return Math.floor(Math.random() * arr.length);
};

export const toggleAriaExpanded = ({
  el,
  closeLabel,
  openLabel,
  label
}: ItoggleAriaExpanded) => {
  const result = el.getAttribute("aria-expanded");

  if (result === "true") {
    el.setAttribute("aria-expanded", "false");
    el.setAttribute("aria-label", `open ${label}` || openLabel || "open");
  } else {
    el.setAttribute("aria-expanded", "true");
    el.setAttribute("aria-label", `close ${label}` || closeLabel || "close");
  }
};

export const collapseAria = ({
  el,
  label
}: Pick<ItoggleAriaExpanded, "el" | "label">) => {
  el.setAttribute("aria-expanded", "false");
  el.setAttribute("aria-label", `open ${label}` || "open");
};

export const expandAria = ({
  el,
  label
}: Pick<ItoggleAriaExpanded, "el" | "label">) => {
  el.setAttribute("aria-expanded", "true");
  el.setAttribute("aria-label", `close ${label}` || "close");
};
