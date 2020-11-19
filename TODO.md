# ARIA

3. Easier introduction/navigation when user first loads the page
4. ARIA Live Region for updates on game
5. Cell aria example: "Column 3, Row 1. Player 2"

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
6. If option dropdown height is greater than viewport, match viewport height and use inner scrollbars, same with inner list width
7. option button shouldn't display score due to aria

# Logic

1. Remove css media queries for board and change css styles based on board size.
