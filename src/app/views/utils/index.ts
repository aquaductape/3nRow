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

export const debounce = (cb: Function, time: number = 500) => {
  let timeout = 0;

  return function () {
    clearTimeout(timeout);
    timeout = window.setTimeout(cb, time);
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
