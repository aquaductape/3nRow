# ARIA

2. board should be navigated by arrow keys instead of tab, cells are rowved
3. Easier introduction/navigation when user first loads the page
4. ARIA Live Region for updates on game
5. Use focus-visible for board.
6. Cell aria example: "Column 3, Row 1. Player 2"

# UI

### Change Theme!!!!

1. On choosing AI or Human Player
   1. Have option to set Player as AI or Human on both player options
      - can be cool since you could have AIs play against each other
      - downside, might be weird that you have to play as Player 2 if you set P1 to AI
   2. Or don't provide AI option in player btn options and have a general menu where you can set Player 2 as AI or Human.
      - downside, as of now, general menu won't have enough content to justify having it. Also it breaks the simplicity of having 3 elements: A board, and two buttons.
   3. Only have P2 have AI options
      - on game init, make sure to have aria labels to specify to set P2 as AI or Human, this way at minimum when they navigate the buttons, they'll remember that AI options belong to P2,
      - when selecting the player options, mention that if it has AI options or not mention that P2 has the AI options
2. Currently doesn't have an option which player goes FIRST!
   1. Alternate turns. On local mode, P1 goes first. On multiplayer, first player that starts is random. The rest of the gameplay is alternate turns
3. Icon on player 2 (or either) indicating that it's an AI
4. Favicon
5. Since both player option dropdowns share a "general" options, label that section as General Options
6. Provide cell label choice in General Options. Mark cell label choice as a11y to not confuse visual users. Choices:
   1. Row and Column (Default). Row as numbers [1,2,3]. Column as numbers [1,2,3]. Ex -> "Row 1. Column 3"
   <!-- 2. Algebriac Notation. Row as numbers [1,2,3]. Column as characters [a,b,c]. Ex -> "C1!" -->
7. If option dropdown height is greater than viewport, match viewport height and use scrollbars, same with inner list width
8. ✅ Responsive for Apple Watch. Display 272 x 340
9. Better contrast for board
10. option button shouldn't display score due to aria

# Logic

## Issue: when dropdown is opened, you can't select the other player button

## Solution

set dropdown container same size as button: by setting button container to position relative since dropdown size context is based on button container's parent

replace fake button highlights with just one button highlight

dropdown container size is based on board size, so listen to resize events and update dropdown size
button highlight size is based on button, so listen to resize events and update button size

## Drawback

Not a big deal, but no more seamless inexpensive transition when resizing page. Transition will still be seemless, but since it will trigger reflow, it will penalize low cpu users. If debounced is used there will be janky updates.

Throttle seems like the best answer
