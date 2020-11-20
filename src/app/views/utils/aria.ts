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
    if (currentElement.getAttribute("aria-disabled") === "true") return;

    const activeElement = container.querySelector(
      activeSelector
    ) as HTMLElement;

    activeElement.setAttribute("tabindex", "-1");
    activeElement.setAttribute("aria-checked", "false");
    currentElement.setAttribute("tabindex", "0");
    currentElement.setAttribute("aria-checked", "true");
    currentElement.focus();

    if (onSelect) onSelect({ prevElement: activeElement, currentElement });
  });

  container.addEventListener("keydown", (e) => {
    if (!keys.includes(e.key)) return;

    const activeElement = container.querySelector(
      activeSelector
    ) as HTMLElement;

    // prevent infinit loop if somehow current element's aria-disabled attr was edited while focused then navigated
    if (activeElement.getAttribute("aria-disabled") === "true") return;

    switch (e.key) {
      case ARROW_LEFT:
      case ARROW_UP:
        traverse({ direction: "backwards", activeElement });
        break;
      case ARROW_DOWN:
      case ARROW_RIGHT:
        traverse({ direction: "forwards", activeElement });
        break;
    }
  });

  const traverse = ({
    activeElement,
    direction,
  }: {
    direction: "forwards" | "backwards";
    activeElement: HTMLElement;
  }) => {
    const currentIdx = elements.findIndex((el) => el === activeElement);
    const lastIdx = elements.length - 1;
    let newIdx = currentIdx;

    if (direction === "forwards") {
      if (currentIdx >= lastIdx) {
        newIdx = 0;
      } else {
        newIdx++;
      }

      for (let i = newIdx; i < elements.length; i++) {
        const element = elements[i];
        if (element.getAttribute("aria-disabled") === "true") {
          // restart loop if enabled radio hasn't been found
          if (i === lastIdx) i = -1;
          continue;
        }
        updateElements({ nextIdx: i, activeElement });
        return;
      }
      return;
    }

    if (direction === "backwards") {
      if (currentIdx <= 0) {
        newIdx = lastIdx;
      } else {
        newIdx--;
      }

      for (let i = newIdx; i >= 0; i--) {
        const element = elements[i];
        if (element.getAttribute("aria-disabled") === "true") {
          // restart loop if enabled radio hasn't been found
          if (i === 0) i = lastIdx + 1;
          continue;
        }
        updateElements({ nextIdx: i, activeElement });
        return;
      }
      return;
    }
  };

  const updateElements = ({
    activeElement,
    nextIdx,
  }: {
    nextIdx: number;
    activeElement: HTMLElement;
  }) => {
    let nextElement = elements[nextIdx];

    activeElement.setAttribute("tabindex", "-1");
    activeElement.setAttribute("aria-checked", "false");
    nextElement.setAttribute("tabindex", "0");
    nextElement.setAttribute("aria-checked", "true");
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
