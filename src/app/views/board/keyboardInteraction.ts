type TPosition = {
  row: number;
  column: number;
};

const ARROW_DOWN = "ArrowDown";
const ARROW_UP = "ArrowUp";
const ARROW_LEFT = "ArrowLeft";
const ARROW_RIGHT = "ArrowRight";
const HOME = "Home";
const END = "End";

const focusNewCell = ({ column, row }: TPosition) => {
  const cell = document.querySelector(
    `[data-row="${row}"] [data-column="${column}"]`
  ) as HTMLElement;

  cell.focus();
  cell.setAttribute("tabindex", "0");
};

export const prevCellChangeTabindex = (callback: () => Element | null) => {
  const prevCell = callback();
  if (!prevCell) return;
  prevCell.setAttribute("tabindex", "-1");
};

export const guardKey = (key: string) => {
  const keys = [ARROW_DOWN, ARROW_UP, ARROW_LEFT, ARROW_RIGHT, HOME, END];
  return keys.includes(key);
};

/**
 * {@link https://www.w3.org/TR/wai-aria-practices-1.1/#keyboard-interaction-for-data-grids| Grid ARIA}
 */
export const keyboardInteraction = (e: KeyboardEvent) => {
  if (!guardKey(e.key)) return;

  const currentCell = document.activeElement as HTMLElement;
  const row = Number(currentCell.parentElement?.dataset.row!);
  const column = Number(currentCell.dataset.column);
  const minRow = 0;
  const minColumn = 0;
  const maxRow = document.querySelectorAll("[data-row]").length - 1;
  const maxColumn =
    (document.querySelector("[data-row]") as HTMLElement).children.length - 1;

  const updateCells = ({ column, row }: TPosition) => {
    if (row < minRow) return;
    if (row > maxRow) return;
    if (column < minColumn) return;
    if (column > maxColumn) return;

    currentCell.setAttribute("tabindex", "-1");
    focusNewCell({ row, column });
  };

  // Control + Home: moves focus to the first cell in the first row
  if (e.ctrlKey && e.key === HOME) {
    updateCells({ row: 0, column: 0 });
    return;
  }

  // Control + End: moves focus to the last cell in the last row.
  if (e.ctrlKey && e.key === END) {
    updateCells({ row: maxRow, column: maxColumn });
    return;
  }

  switch (e.key) {
    case ARROW_UP:
      return updateCells({ row: row - 1, column });
    case ARROW_DOWN:
      return updateCells({ row: row + 1, column });
    case ARROW_RIGHT:
      return updateCells({ row, column: column + 1 });
    case ARROW_LEFT:
      return updateCells({ row, column: column - 1 });
    // Home: moves focus to the first cell in the row that contains focus.
    case HOME:
      return updateCells({ row, column: minColumn });
    // End: moves focus to the last cell in the row that contains focus.
    case END:
      return updateCells({ row, column: maxColumn });
  }
};
