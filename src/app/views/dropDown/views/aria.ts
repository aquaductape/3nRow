import { collapseAria, expandAria } from "../../../../utils/index";
import { dom } from "../../dom";

const label = "ai difficulty";

export const ariaExpandDropdown = () => {
  const difficultyDropdown = <HTMLElement>(
    document.querySelector("." + dom.class.btnDifficultyDDContainer)
  );
  if (!difficultyDropdown) return null;
  expandAria({ el: difficultyDropdown, label });
};

export const ariaCollapseDropdown = () => {
  const difficultyDropdown = <HTMLElement>(
    document.querySelector("." + dom.class.btnDifficultyDDContainer)
  );
  if (!difficultyDropdown) return null;
  collapseAria({ el: difficultyDropdown, label });
};
