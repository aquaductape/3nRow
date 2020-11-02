# ARIA

1. li shouldn't be buttons
2. board should be navigated by arrow keys instead of tab, cells are rowved
3. Easier introduction/navigation when user first loads the page
4. ARIA Live Region for updates on game
5. Use focus-visible for board.
6. Cell aria example: "Column 3, Row 1. Player 2"

# UI

1. Clearer option on choosing AI or Human Player
2. Icon on player 2 indicating that it's an AI
3. Favicon
4. Since both player option dropdowns share a "general" options, label that section as General Options
5. Provide cell label choice in General Options. Mark cell label choice as a11y to not confuse visual users. Choices:
   1. Row and Column (Default). Row as numbers [1,2,3]. Column as numbers [1,2,3]. Ex -> "Column 3, Row 1!"
   2. Algebriac Notation. Row as numbers [1,2,3]. Column as characters [a,b,c]. Ex -> "C1!"
6. If option dropdown height is greater than viewport, match viewport height and use scrollbars, same with inner list width
