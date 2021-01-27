export const loaderSquare = () => {
  return `
  <div class="loader-square-container">
    <div class="loader-square"></div>
  </div>
  `;
};

export const loaderEllipsis = ({ delay }: { delay?: number } = {}) => {
  let styleContent = (additional: number) => "";

  if (delay != null) {
    styleContent = (additional: number) =>
      `animation-delay: ${delay + additional}ms;`;
  }
  return `
  <div class="loader-ellipsis-container">
    <div class="dot-1" style="${styleContent(0)}"></div>
    <div class="dot-2" style="${styleContent(100)}"></div>
    <div class="dot-3" style="${styleContent(200)}"></div>
  </div>
  `;
};

export const loaderCircle = () => {
  return `
  <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 13.229 13.229"><circle class="loader-circle" cx="6.615" cy="6.615" r="5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" paint-order="fill markers stroke"/></svg>
  `;
};
