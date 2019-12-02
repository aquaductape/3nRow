const changeHeight = () => {
  const gameContainer = <HTMLDivElement | null>(
    document.querySelector(".game-container")
  );
  if (!gameContainer) return null;
  const browserInnerHeight = window.innerHeight;

  gameContainer.style.maxWidth = `${browserInnerHeight - 200}px`;
  // }
};
// init height
changeHeight();
window.addEventListener("resize", changeHeight);
