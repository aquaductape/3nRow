import { round } from "../../utils/index";
import { TDomOptions } from "./gameContainerView";

const px = (num: number, decimal: number = 1) => `${round(num, decimal)}px`;

type CustomStyle = Partial<
  Exclude<Omit<CSSStyleDeclaration, "length" | "parentRule">, number>
>;

type TStyleRatio = {
  [key in keyof CustomStyle]:
    | {
        ratio: number;
        decimalPlaces: number;
      }
    | number
    | ((el: HTMLElement) => string);
};

type TScaleStyles<T> = {
  name: TDomOptions<T>;
  numerator: number;
  precisionDecimal?: number;
  styleRatio: TStyleRatio;
};

export const scaleStyles = <T = HTMLElement>({
  name,
  numerator,
  precisionDecimal,
  styleRatio,
}: TScaleStyles<T>) => {
  if (!name.present) return;
  const { el } = name;

  if (!el || (Array.isArray(el) && !el.length)) return;

  for (const key in styleRatio) {
    const value = styleRatio[key];
    let ratio = 0;
    let decimalPlaces = precisionDecimal == null ? 1 : precisionDecimal;

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

    const _el = (el as unknown) as HTMLElement;
    if (typeof value === "function") {
      _el.style[key] = value(_el);
      continue;
    }

    _el.style[key] = px(numerator / ratio, decimalPlaces);
  }
};
