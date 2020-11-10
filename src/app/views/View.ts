export default class View {
  protected data = {};
  protected parentEl: HTMLElement;
  constructor({ root }: { root: string | HTMLElement }) {
    this.data = {};
    this.parentEl = getElement(root);
  }

  protected clear() {
    this.parentEl.innerHTML = "";
  }

  protected generateFallback() {
    return "";
  }

  protected generateMarkup() {
    return "";
  }

  protected reflow() {
    console.log(document.body.offsetWidth);
  }

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
  }
}

const getElement = (root: string | HTMLElement) => {
  if (typeof root !== "string") return root;

  if (root[0] === "#") {
    return document.getElementById(root)!;
  }

  return <HTMLElement>document.querySelector(root)!;
};
