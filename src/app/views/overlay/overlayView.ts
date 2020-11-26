import View from "../View";

class OverlayView extends View {
  constructor() {
    super({ root: "#overlay" });
  }

  render() {
    this.parentEl.classList.add("active");
  }
}

export default new OverlayView();
