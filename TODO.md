# CODE

1. rename View's data to state
2. In classes when defining properties, set them as well, this will lead less code and seperation of setting properties based from init and constructor

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

2. Logo text on quick start menu
3. try catch with localStorage
4. close X hover is rounded bg
5. slide up functionality on settings dropdown
6. Opponent dropdown items are disabled during multiplayer and his/her taken item will be labled as "Opponent has this item".
7. claimed skin, should have a red x, animation scale
8. disable player buttons, disable dropdowns (provide tooltip), when on multiplayer lobby
9. shape icon inside any tooltip seems misaligned in IOS
10. on online multiplayer, the client state, in their point of view, is always player 1
11. disable opponent dropdown on multiplayer, have a tooltip "Opponent settings cannot be edited"
12. New idea when game over. Menu background (theme "menu") is restored, see menu-prototype in assets
13. while picking shapes in lobby, hide player options shape by scaling down animation
14. When it's not your turn and and you tap anyway, show snackbar notification that it's not your turn. It's removed by outside click, timeout or click on close button
15. in player options during multiplayer, upon selection, don't change skin, still show as selected, but show spinner loader (the same one from lobby), then upon confirmation, change skin.
16. when opponent leaves in lobby, client stays in lobby and get's rematched with someone else and notification bar pops with "Opponent left. Looking for another player to match".
17. Store First Move in server
18. "First Move" should have a description
19. change favicon based on player turn, which is based on player shape and color, background is black
20. Two new shapes: Square and Kite. Why? To match color choices count
