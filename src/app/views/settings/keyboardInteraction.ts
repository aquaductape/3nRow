import { EdgeLegacy } from "../../lib/onFocusOut/browserInfo";
import { hasAttributeValue } from "../utils";
const ARROW_DOWN = "ArrowDown";
const ARROW_UP = "ArrowUp";
const ARROW_LEFT = "ArrowLeft";
const ARROW_RIGHT = "ArrowRight";
const HOME = "Home";
const END = "End";
const TAB = "Tab";
const ESCAPE = "Escape";
const ENTER = "Enter";
const focusableQueries =
  "a[href], area[href], input[type='checkbox']:not([disabled]), [role='radiogroup']:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]";

const guardKey = (key: string) => {
  const keys = [
    ARROW_DOWN,
    ARROW_UP,
    ARROW_LEFT,
    ARROW_RIGHT,
    HOME,
    END,
    TAB,
    ENTER,
    ESCAPE,
  ];
  return keys.includes(key);
};

type TFocusTreeState = {
  innerWidgets: {
    selected: boolean;
    lastItem: boolean;
  };
  prevFocusedTreeItem: HTMLElement;
};
export const settingsTree = ({ el }: { el: HTMLElement }) => {
  const treeItems = Array.from(
    el.querySelectorAll('[role="treeitem"]')
  ) as HTMLElement[];

  const state: TFocusTreeState = {
    innerWidgets: {
      selected: false,
      lastItem: false,
    },
    prevFocusedTreeItem: treeItems[0],
  };

  el.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    const selectors = ["input", '[role="radiogroup"]', "button", "label"];
    const { prevFocusedTreeItem } = state;

    const interactiveEl = selectors.some((selector) =>
      target.closest(selector)
    );

    const treeItem = target.closest('[role="treeitem"]') as HTMLElement;

    state.innerWidgets.selected = false;
    if (treeItem === prevFocusedTreeItem) {
      treeItem.setAttribute("data-selected", "true");
      return;
    }

    updateElements({
      activeElement: prevFocusedTreeItem,
      nextElement: treeItem,
      focus: !interactiveEl,
    });
  });

  const getSelectedTreeItem = () => {
    return treeItems.find((item) => {
      const focused = item.getAttribute("data-selected");
      if (!focused) return;
      return focused === "true";
    });
  };

  el.addEventListener("keyup", (e) => {
    const target = e.target as HTMLElement;
    if (e.key !== TAB) return;
    // previous focus from outside tree
    // correctly place focus on selected treeitem
    const selectedItem = getSelectedTreeItem();
    if (!selectedItem) return;
    const focusedItem = target.closest('[role="treeitem"]');
    if (selectedItem !== focusedItem) {
      selectedItem.focus();
      e.stopPropagation();
      // without this, onFocusOut triggers focus out exit, must fix
      // e.preventDefault();
      return;
    }
  });

  el.addEventListener("keydown", (e) => {
    const target = e.target as HTMLElement;
    if (!guardKey(e.key)) return;
    // prevent firing inside interactive children
    if (!target.matches('[role="treeitem"]')) {
      if (e.key === ESCAPE) {
        const selectedItem = getSelectedTreeItem()!;
        selectedItem.focus();
        e.stopPropagation();
      }
      if (e.key === TAB) {
        // previous focus while holding down tab from outside tree
        // correctly place focus on selected treeitem
        const selectedItem = getSelectedTreeItem()!;
        const focusedItem = target.closest('[role="treeitem"]');

        if (selectedItem !== focusedItem) {
          selectedItem.focus();
          e.stopPropagation();
          e.preventDefault();
          return;
        }

        const widgets = Array.from(
          selectedItem.querySelectorAll(focusableQueries)
        );
        const total = widgets.length - 1;
        const docActiveElement = document.activeElement as HTMLElement;
        let activeElement = docActiveElement;

        if (isRadioInput(docActiveElement)) {
          activeElement = docActiveElement.closest(
            '[role="radiogroup"]'
          ) as HTMLElement;
        }

        // is last focusable
        if (widgets.indexOf(activeElement) === total || !widgets.length) {
          const nextFocus = document.querySelector(
            '[data-next-focus="true"]'
          ) as HTMLElement;
          nextFocus.focus();
          e.stopPropagation();
          // without this, onFocusOut triggers focus out exit, must fix
          e.preventDefault();
        }
      }

      return;
    }

    target.setAttribute("data-selected", "true");
    const selectedItem = getSelectedTreeItem();

    if (!selectedItem) return;

    // has no children then Tab to next focusable outside of tree

    switch (e.key) {
      case TAB:
        moveFocusInside({ type: "tab", e, selectedItem });
        break;
      case ENTER:
        moveFocusInside({ type: "enter", e, selectedItem });
        break;

      case ARROW_UP:
        traverse({
          activeElement: selectedItem,
          direction: "backwards",
          elements: treeItems,
          roving: false,
        });
        break;
      case ARROW_DOWN:
        traverse({
          activeElement: selectedItem,
          direction: "forwards",
          elements: treeItems,
          roving: false,
        });
        break;
      case ARROW_RIGHT: // focus on parent, if parent do nothing
        traverseLevel({
          activeElement: selectedItem,
          direction: "right",
          elements: treeItems,
          collapse: false,
        });
        break;
      case ARROW_LEFT: // focus on direct child, if child doesn't have children, do nothing
        traverseLevel({
          activeElement: selectedItem,
          direction: "left",
          elements: treeItems,
          collapse: false,
        });
        break;
      case HOME: // first tree item
        updateElements({
          activeElement: selectedItem,
          nextElement: treeItems[0],
        });
        break;
      case END: // last tree item
        updateElements({
          activeElement: selectedItem,
          nextElement: treeItems[treeItems.length - 1],
        });
        break;
    }
  });

  if (!EdgeLegacy) return;
  treeItems.forEach((treeItem) => {
    treeItem.addEventListener("focusin", (e) => {
      treeItem.setAttribute("data-focused", "true");
    });
    treeItem.addEventListener("focusout", (e) => {
      treeItem.removeAttribute("data-focused");
    });
  });
};

const traverseLevel = ({
  activeElement,
  direction,
  elements,
  collapse,
}: {
  direction: "left" | "right";
  activeElement: HTMLElement;
  elements: HTMLElement[];
  collapse: boolean;
}) => {
  if (direction === "left") {
    const parentId = activeElement.getAttribute("data-parent-setting-id")!;
    const element = elements.find((element) =>
      hasAttributeValue(element, { attr: "data-setting-id", val: parentId })
    ) as HTMLElement;

    if (!element) return;
    updateElements({ activeElement, nextElement: element });
    return;
  }

  if (direction === "right") {
    const id = activeElement.getAttribute("data-setting-id")!;
    const element = elements.find((element) =>
      hasAttributeValue(element, { attr: "data-parent-setting-id", val: id })
    ) as HTMLElement;
    if (!element) return;

    updateElements({ activeElement, nextElement: element });
    return;
  }
};

// forked code from 'utils/aria.ts'
// will refactor in the future
const traverse = ({
  activeElement,
  direction,
  elements,
  roving,
}: {
  direction: "forwards" | "backwards";
  activeElement: HTMLElement;
  elements: HTMLElement[];
  roving: boolean;
}) => {
  const currentIdx = elements.findIndex((el) => el === activeElement);
  const lastIdx = elements.length - 1;
  let newIdx = currentIdx;

  if (direction === "forwards") {
    if (currentIdx >= lastIdx) {
      if (!roving)
        return updateElements({
          nextElement: elements[lastIdx],
          activeElement,
        });
      newIdx = 0;
    } else {
      newIdx++;
    }

    for (let i = newIdx; i < elements.length; i++) {
      const element = elements[i];
      if (element.getAttribute("aria-disabled") === "true") {
        // restart loop if enabled treeitem hasn't been found
        if (i === lastIdx) i = -1;
        continue;
      }
      updateElements({ nextElement: elements[i], activeElement });
      return;
    }
    return;
  }

  if (direction === "backwards") {
    if (currentIdx <= 0) {
      if (!roving)
        return updateElements({ nextElement: elements[0], activeElement });
      newIdx = lastIdx;
    } else {
      newIdx--;
    }

    for (let i = newIdx; i >= 0; i--) {
      const element = elements[i];
      if (element.getAttribute("aria-disabled") === "true") {
        // restart loop if enabled treeitem hasn't been found
        if (i === 0) i = lastIdx + 1;
        continue;
      }
      updateElements({ nextElement: elements[i], activeElement });
      return;
    }
    return;
  }
};

// forked code from 'utils/aria.ts'
// will refactor in the future
const updateElements = ({
  activeElement,
  nextElement,
  focus = true,
}: {
  nextElement: HTMLElement;
  activeElement: HTMLElement;
  focus?: boolean;
}) => {
  activeElement.setAttribute("tabindex", "-1");
  activeElement.setAttribute("data-selected", "false");
  nextElement.setAttribute("tabindex", "0");
  nextElement.setAttribute("data-selected", "true");

  if (focus) nextElement.focus();
};

const moveFocusInside = ({
  e,
  selectedItem,
  type,
}: {
  selectedItem: HTMLElement;
  e: KeyboardEvent;
  type: "tab" | "enter";
}) => {
  const widgets = Array.from(
    selectedItem.querySelectorAll(focusableQueries)
  ) as HTMLElement[];

  if (type === "enter") {
    widgets.some((widget) => {
      if (hasAttributeValue(widget, { attr: "role", val: "radiogroup" })) {
        const radios = Array.from(
          widget.querySelectorAll("input")
        ) as HTMLInputElement[];

        radios.some((radio) => {
          if (radio.checked) {
            radio.focus();
            return true;
          }
        });
        return true;
      }
      widget.focus();
      return true;
    });
    return;
  }

  // doesn't have widgets, move focus to outside of tree
  if (!widgets.length) {
    const nextFocus = document.querySelector(
      '[data-next-focus="true"]'
    ) as HTMLElement;
    nextFocus.focus();
    e.stopPropagation();
    // without this, onFocusOut triggers focus out exit, must fix
    e.preventDefault();
  }

  // has widgets
  // but does nothing, this allows browser to pass focus to inside treeitem widgets
  return;
};

const isRadioInput = (el: HTMLElement) => {
  const type = el.getAttribute("type");
  if (!type) return false;
  return type === "radio";
};
