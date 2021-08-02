# CODE

1. rename View's data to state
2. In classes when defining properties, set them as well, this will lead less code and seperation of setting properties based from init and constructor

# FROM NOW ON to animate SVGS with clipping or masking

1. Animating HTMLElements with clip/mask: Safaria/iOS don't animate with svg, dont bother please

# ARIA

1. btn link span items should not be focasable in mobile devices
2. explicit aria rows and columns
3. move "skip content" out of the way 1000px away

# BUGS 🐛

2. aria region, support cheater moves, only says one currently
3. can't interact board in IOS. In VoiceOver columns and rows need to explicit, they are set as zero when implicit
4. alternate turns doesn't work when Player 2 goes first

# UI

1. try catch with localStorage
2. close X hover is rounded bg
3. slide up functionality on settings dropdown
4. shape icon inside any tooltip seems misaligned in IOS
5. Maybe. on online multiplayer, the client state, in their point of view, is always player 1
6. Maybe, good case in touch devices. disable opponent dropdown on multiplayer, have a tooltip "Opponent settings cannot be edited"
7. Not sure, trying to avoid "bar" notifications. When it's not your turn and and you tap anyway, show snackbar notification that it's not your turn. It's removed by outside click, timeout or click on close button
8. Good. in player options during multiplayer, upon selection, don't change skin, still show as selected, but show spinner loader (the same one from lobby), then upon confirmation, change skin.
9. "First Move" should have a description
10. Good change favicon based on player turn, which is based on player shape and color, background is black.
    Change document title "Your turn!"
    Only do this when document is not currently viewed
11. have hash in url navigate to sections. Example https:...#multiplayer => go to multiplayer section, https:...#createprivateroom => go to private room. Why? this solves a tag having empty hrefs which lowers SEO score
12. On tooltip, when selected have a visual state that indicates that it was clicked, the candidate is a "black border" with nested filters `drop-shadow(0px 0px 1px #000) drop-shadow(0px 0px 1px #000) drop-shadow(0px 4px 12px rgba(0, 0, 0, 0.5))`. Headaches, touch devices should never activate this, this feature will only be usefull in mouse driven (desktop).
13. In "First Move", have temp red alert text that appears underneath that has "Will apply for next game", when selecting choice
14. On mobile, for Chrome Android, when input is selected, input is scrolled into view. However since in this app, there's no content to scroll (since the content is sized relative to viewport), the viewport is zoomed out until input is in view. So make sure if input is selected in Chrome Android, don't trigger recalc content, maybe add dummy content to overflow viewport, to enable scroll, and scroll into view.
15. "Wait, it's still my turn!"

# Browser Bug: I'm not sure since it requires thorough knowledge/testing, but listing them anyway

1. position fixed will place element in context of root, will ignore parents context. However in this case an element that has position fixed, it's context was set to parent that had transform scale(-1, 1), which swaps the element like a vertical mirror.
