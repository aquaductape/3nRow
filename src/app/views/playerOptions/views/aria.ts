import { collapseAria, expandAria } from "../../../../utils/index";

export const ariaExpandPlayerOptionsDropdown = (el: HTMLElement) => {
  const label = el.getAttribute("aria-label")?.replace(/(close\s|open\s)/, "");
  expandAria({ el, label });
};

export const ariaCollapsePlayerOptionsDropdown = (el: HTMLElement) => {
  const label = el.getAttribute("aria-label")?.replace(/(close\s|open\s)/, "");
  collapseAria({ el, label });
};
