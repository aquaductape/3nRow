export default class View {
  protected data = {};
  protected parentEl: HTMLElement;
  constructor({ root }: { root: string | HTMLElement }) {
    this.data = {};
    this.parentEl = getElement(root);
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
    // Accomplishes the same result as code below
    // this.parentEl.innerHTML = "";
    // However certain browsers might have optimize clearing elements with innerHTML if the string is empty
    // Generally it's faster to remove last item than the first
    while (element.firstChild) {
      element.removeChild(element.lastChild!);
    }
  }

  protected generateFallback() {
    return "";
  }

  protected generateMarkup() {
    return "";
  }

  protected reflow() {
    document.body.offsetWidth;
  }

  // grab elements that are based from string markup, after they are generated
  protected initQuerySelectors() {}

  renderFallback() {
    console.log(this.generateFallback());
    this.clear();
    this.parentEl.insertAdjacentHTML("afterbegin", this.generateFallback());
  }

  // renderSpinner() {
  //   this.clear();
  //   this.parentEl.insertAdjacentHTML('afterbegin', this.generateSpinner());
  // }

  render(data: any) {
    this.data = data;
    this.clear();
    this.parentEl.insertAdjacentHTML("afterbegin", this.generateMarkup());
    this.initQuerySelectors();
  }

  update(markup: string) {
    this.clear();
    this.parentEl.insertAdjacentHTML("afterbegin", markup);
  }
}

const getElement = (root: string | HTMLElement) => {
  if (typeof root !== "string") return root;

  if (root[0] === "#") {
    return document.getElementById(root)!;
  }

  return <HTMLElement>document.querySelector(root)!;
};
