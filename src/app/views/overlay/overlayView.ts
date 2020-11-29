import View from "../View";

class OverlayView extends View {
  constructor() {
    super({ root: "#overlay" });
  }

  show() {
    this.parentEl.classList.add("active");
  }
  hide() {
    this.parentEl.classList.remove("active");
  }
}

export default new OverlayView();
