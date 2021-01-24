import { clearChildren, getElement, reflow } from "./utils/index";

/**
 * scuffed UI Component
 *
 * @param data any
 * UI Component data is mounted from `render`.
 * When the data needs to be updated, it done either through `setData` or public methods in subclasses that update the data's specific properties
 *
 * How it handles data flow to update UI
 *
 * It's manually done by good ol DOM interaction, that are declared in public methods in subclasses,
 * there's no Virtual DOM, nor Proxies to do heavy lifting.
 *
 *
 */
export default class View {
  protected data = {};
  protected parentEl: HTMLElement;
  protected root: string | HTMLElement;
  constructor({ root }: { root: string | HTMLElement }) {
    this.data = {};
    this.parentEl = getElement(root);
    this.root = root;
  }

  protected clear() {
    const parent = this.parentEl;

    // Accomplishes the same result as code below
    // this.parentEl.innerHTML = "";
    // However certain browsers might have optimize clearing elements with innerHTML if the string is empty
    // Generally it's faster to remove last item than the first
    while (parent.firstChild) {
      parent.removeChild(parent.lastChild!);
    }
  }

  protected clearChildren(element: HTMLElement) {
    clearChildren(element);
  }

  protected generateFallback() {
    return "";
  }

  protected generateMarkup() {
    return "";
  }

  protected reflow() {
    reflow();
  }

  // grab elements that are based from string markup, after they are generated
  protected markupDidGenerate() {}

  renderFallback() {
    // console.log(this.generateFallback());
    this.clear();
    this.parentEl.insertAdjacentHTML("afterbegin", this.generateFallback());
  }

  /**
   * pass initial data to component, and generate and loads UI
   * @param data any
   */
  render(data?: any) {
    // if (!this.parentEl) {
    this.parentEl = getElement(this.root);
    // console.log("doesn't exist", this.root, this.parentEl);
    // }

    if (!this.parentEl) return;

    this.data = data;
    this.clear();
    this.parentEl.insertAdjacentHTML("afterbegin", this.generateMarkup());
    this.markupDidGenerate();
  }

  update(markup: string) {
    this.clear();
    this.parentEl.insertAdjacentHTML("afterbegin", markup);
  }

  /**
   * set component data, doesn't trigger UI update
   * @param data any
   */
  setData(data?: object) {
    this.data = { ...this.data, ...data };
  }
}
