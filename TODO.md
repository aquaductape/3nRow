# FROM NOW ON to animate SVGS with clipping or masking

1. Animating HTMLElements with clip/mask: pre IOS13 don't animate with svg, dont bother please
2. Animating SVG with clip/mask: always use masks, has best browser consistency

# ARIA

1. btn link span items should not be focasable in mobile devices
2. explicit aria rows and columns
3. move "skip content" out of the way 1000px away

# BUGS 🐛

1. shape icon inside color tooltip is not updated when shape is selected, it is only updated when color is selected
2. aria region, support cheater moves, only says one currently
3. can't interact board in IOS. In VoiceOver columns and rows need to explicit, they are set as zero when implicit
4. alternate turns doesn't work when Player 2 goes first

# UI

1. Icon on player 2 (or either) indicating that it's an AI
2. Logo text on quick start menu
3. try catch with localStorage
4. close X hover is rounded bg
5. slide up functionality on settings dropdown
6. Opponent dropdown items are disabled during multiplayer and his/her taken item will be labled as "Opponent has this item".
7. Have 3 color gradients, have a progressive toggle to toggle 1 - 3
8. claimed skin, should have a red x, animation scale
9. disable player buttons, disable dropdowns (provide tooltip), when on multiplayer lobby
10. focus to replay button
11. shape icon inside any tooltip seems misaligned in IOS
12. on online multiplayer, the client state, in their point of view, is always player 1
13. disable opponent dropdown, visually is greyed out, probably have a header content "Cannot edit opponent options"
14. New idea when game over. Menu background (theme "menu") is restored.
