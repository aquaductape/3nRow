const changeHeight = () => {
  const mainEl = document.querySelector("main");
  const browserInnerHeight = window.innerHeight;
  if (!mainEl) return null;

  const mainHeight = mainEl.clientHeight;

  if (browserInnerHeight < mainHeight + 200) {
    const diff = mainHeight - browserInnerHeight;
    const height = mainHeight - diff;
    console.log({ mainHeight, browserInnerHeight, diff, height });

    mainEl.style.maxWidth = `${browserInnerHeight - 200}px`;
  }
};
// init height
changeHeight();
window.addEventListener("resize", changeHeight);
