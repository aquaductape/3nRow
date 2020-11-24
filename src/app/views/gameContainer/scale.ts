import { round } from "../../utils/index";

const px = (num: number, decimal: number = 1) => `${round(num, decimal)}px`;

type CustomStyle = Partial<
  Exclude<Omit<CSSStyleDeclaration, "length" | "parentRule">, number>
>;
export const scaleStyles = ({
  el,
  numerator,
  styleRatio,
}: {
  el: HTMLElement | HTMLElement[];
  numerator: number;
  styleRatio: {
    [key in keyof CustomStyle]:
      | {
          ratio: number;
          decimalPlaces: number;
        }
      | number
      | ((el: HTMLElement) => string);
  };
}) => {
  for (const key in styleRatio) {
    const value = styleRatio[key];
    let ratio = 0;
    let decimalPlaces = 1;

    if (value != null && typeof value === "object") {
      ratio = value.ratio;
      decimalPlaces = value.decimalPlaces;
    }

    if (typeof value === "number") ratio = value;

    if (Array.isArray(el)) {
      el.forEach((item) => {
        if (typeof value === "function") {
          item.style[key] = value(item);
          return;
        }
        item.style[key] = px(numerator / ratio, decimalPlaces);
      });
      continue;
    }

    if (typeof value === "function") {
      el.style[key] = value(el);
      continue;
    }

    el.style[key] = px(numerator / ratio, decimalPlaces);
  }
};
