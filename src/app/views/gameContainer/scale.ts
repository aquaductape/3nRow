import { round } from "../../utils/index";

const px = (num: number, decimal: number = 1) => `${round(num, decimal)}px`;

type CustomStyle = keyof Omit<CSSStyleDeclaration, "length" | "parentRule">;
export const scaleStyles = ({
  el,
  boardWidth,
  style,
  callback,
}: {
  el: HTMLElement | HTMLElement[];
  boardWidth: number;
  style: {
    [key in CustomStyle]: {
      ratio: number;
      decimalPlaces?: number;
    };
  };
  callback?: (el: HTMLElement) => string;
}) => {
  for (const key in style) {
    const { ratio, decimalPlaces } = style[key];

    if (Array.isArray(el)) {
      el.forEach((item) => {
        if (callback) return (item.style[key] = callback(item));

        item.style[key] = px(boardWidth / ratio, decimalPlaces);
      });
      return;
    }

    if (callback) return (el.style[key] = callback(el));

    el.style[key] = px(boardWidth / ratio, decimalPlaces);
  }
};
