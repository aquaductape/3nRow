const ARROW_DOWN = "ArrowDown";
const ARROW_UP = "ArrowUp";
const ARROW_LEFT = "ArrowLeft";
const ARROW_RIGHT = "ArrowRight";
const SPACE = " ";

const keys = [ARROW_DOWN, ARROW_LEFT, ARROW_RIGHT, ARROW_UP, SPACE];

type TOnSelect = {
  prevElement: HTMLElement;
  currentElement: HTMLElement;
  // idx: number;
  // totalElements: number;
};

type TRadioGroup = {
  group: HTMLElement | string;
  radioSelector?: string;
  activeSelector?: string;
  onSelect?: ({}: TOnSelect) => void;
};
export const radioGroup = ({
  group,
  radioSelector = "[tabindex]",
  activeSelector = '[tabindex="0"]',
  onSelect,
}: TRadioGroup) => {
  const container = getElement(group);

  const elements = Array.from(
    container.querySelectorAll(radioSelector)
  ) as HTMLElement[];

  container.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    const currentElement = target.closest(radioSelector) as HTMLElement;
    if (!currentElement) return;

    const activeElement = container.querySelector(
      activeSelector
    ) as HTMLElement;

    activeElement.setAttribute("tabindex", "-1");
    activeElement.setAttribute("aria-selected", "false");
    currentElement.setAttribute("tabindex", "0");
    currentElement.setAttribute("aria-selected", "true");
    currentElement.focus();

    if (onSelect) onSelect({ prevElement: activeElement, currentElement });
  });

  container.addEventListener("keydown", (e) => {
    if (!keys.includes(e.key)) return;

    const activeElement = container.querySelector(
      activeSelector
    ) as HTMLElement;
    const idx = elements.findIndex((el) => el === activeElement);

    switch (e.key) {
      case ARROW_UP:
        updateElements({ nextIdx: idx - 1, activeElement });
        break;
      case ARROW_DOWN:
        updateElements({ nextIdx: idx + 1, activeElement });
        break;
      case ARROW_LEFT:
        updateElements({ nextIdx: idx - 1, activeElement });
        break;
      case ARROW_RIGHT:
        updateElements({ nextIdx: idx + 1, activeElement });
        break;
    }
  });

  const updateElements = ({
    activeElement,
    nextIdx,
  }: {
    nextIdx: number;
    activeElement: HTMLElement;
  }) => {
    const lastIdx = elements.length - 1;
    let nextElement = elements[nextIdx];

    if (nextIdx < 0) {
      nextElement = elements[elements.length - 1];
    }
    if (nextIdx > lastIdx) {
      nextElement = elements[0];
    }

    activeElement.setAttribute("tabindex", "-1");
    activeElement.setAttribute("aria-selected", "false");
    nextElement.setAttribute("tabindex", "0");
    nextElement.setAttribute("aria-selected", "true");
    nextElement.focus();

    if (onSelect)
      onSelect({ prevElement: activeElement, currentElement: nextElement });
  };
};

const getElement = (root: string | HTMLElement) => {
  if (typeof root !== "string") return root;

  if (root[0] === "#") {
    return document.getElementById(root)!;
  }

  return <HTMLElement>document.querySelector(root)!;
};
