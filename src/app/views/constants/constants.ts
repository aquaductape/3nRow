type TColorMap = {
  [key: string]: [string, string];
};
export const colors = [
  "sky_blue,cyan",
  "green,yellow",
  "red,orange",
  "magenta,pink",
  "purple,blue",
  "white,grey",
];

export const colorMap: TColorMap = {
  "sky_blue,cyan": ["#0cf", "#5fd"],
  "green,yellow": ["#39f300", "#f3ff08"],
  "red,orange": ["#ff0051", "#ffc300"],
  "magenta,pink": ["#ff005b", "#ff00e4"],
  "purple,blue": ["#e600ff", "#5f55ff"],
  "white,grey": ["#fff", "#ccc"],
};

export const shapes = ["circle", "cross", "triangle", "heart"];

export const svg = {
  circle: `
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="100" height="100" viewBox="0 0 26.4583 26.4583" version="1.1" id="svg8">
  <g transform="translate(-40.2399 6.4228)" id="g3764" filter="url(#drop-shadow-filter)">
    <path d="m 53.469328,15.12263 a 8.316061,8.3162622 0 0 0 7.20192,-4.15814 8.316061,8.3162622 0 0 0 0,-8.3162599 8.316061,8.3162622 0 0 0 -7.20192,-4.15813" class="animate__circle-left" id="path14" fill="none" fill-opacity=".9202" stroke="url(#b)" stroke-width="2.6458" stroke-linecap="round" stroke-linejoin="miter" stroke-miterlimit="4" stroke-dasharray="none" stroke-opacity="1"/>
    <path d="m 53.469338,15.12263 a 8.316061,8.3162622 0 0 1 -8.049378,-6.2271099 8.316061,8.3162622 0 0 1 4.005148,-9.35577 8.316061,8.3162622 0 0 1 10.061675,1.52651" class="animate__circle-right" id="path16" opacity="1" fill="none" fill-opacity="1" stroke="url(#b)" stroke-width="2.6458" stroke-linecap="round" stroke-linejoin="miter" stroke-miterlimit="4" stroke-dasharray="none" stroke-opacity="1"/>
  </g>
</svg>
`,
  cross: `
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="100" height="100" viewBox="0 0 26.4583 26.4583" version="1.1" id="svg8">
  <g filter="url(#drop-shadow-filter)">
    <g class="animate__left-dot" fill="url(%crossLeftDot%)">
      <circle cx="6.4855" cy="19.9915" r="1.3368" />
    </g>
    <g class="animate__right-dot" fill="url(%crossRightDot%)">
      <circle r="1.3368" cy="19.9915" cx="19.9756" />
    </g>
  </g>
  <g fill="none" stroke-width="2.6458" stroke-linecap="round" filter="url(#drop-shadow-filter)">
    <g stroke="url(#c)" transform="translate(0 -.0191)">
      <path d="M 6.4855595,6.4855597 19.972772,19.972772" class="animate__right-line"/>
    </g>
    <g stroke="url(#d)" transform="translate(0 -.0191)">
      <path d="M 19.972772,6.4855597 6.4855597,19.972772" class="animate__left-line"/>
    </g>
  </g>
</svg>
`,
  triangle: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 26.4583 26.4583" height="100" width="100">
  <g filter="url(#drop-shadow-filter)">
  <path class="animate__first-line" d="M 21.666126,20.554903 H 4.792205" fill="none" stroke="url(#b)" stroke-width="2.6458" stroke-linecap="round"/>
  <path class="animate__second-line"  d="M 4.792205,20.554903 13.229166,5.941659" fill="none" stroke="url(#c)" stroke-width="2.6458" stroke-linecap="round"/>
  <path class="animate__third-line"  d="m 13.229166,5.941659 8.436959,14.613245" fill="none" stroke="url(#d)" stroke-width="2.6458" stroke-linecap="round"/>
  </g>
</svg>`,
  heart: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 26.4583 26.4583" height="100" width="100">
  <path class="animate__heart" filter="url(#drop-shadow-filter)" d="m 17.32581,6.9713105 c -0.985,0.076646 -1.966443,0.5097125 -2.723879,1.2811742 L 13.230034,9.6509322 11.85814,8.2524847 C 10.351213,6.7175032 7.9449805,6.5197347 6.3838297,7.8320647 4.3324424,9.5589185 4.6270576,12.382265 6.091749,13.875045 l 6.981183,7.111733 v 0.0023 c 0.0507,0.0507 0.102415,0.07966 0.157102,0.07966 0.05469,0 0.106393,-0.02894 0.157105,-0.07966 v -0.0023 l 6.981183,-7.111733 C 21.821206,12.39407 22.123746,9.5545948 20.076241,7.8276394 19.299642,7.1734488 18.310811,6.8946648 17.32581,6.9713105 Z m 0.0023,0.059743 c 0.970403,-0.075607 1.946764,0.1996118 2.710601,0.8430526 2.020533,1.7042057 1.716631,4.5022909 0.287656,5.9588959 l -6.981183,7.111734 c -0.04482,0.04482 -0.08217,0.06417 -0.115062,0.06417 -0.03288,0 -0.06803,-0.01936 -0.11285,-0.06417 L 6.133843,13.833002 C 4.6927958,12.364321 4.3991053,9.5828389 6.4237113,7.8785318 7.9593611,6.5876383 10.329767,6.7804724 11.81615,8.2945263 l 1.413938,1.4427026 1.413938,-1.4427026 c 0.747181,-0.761017 1.713645,-1.1878654 2.684051,-1.2634724 z" style="line-height:normal;font-variant-ligatures:normal;font-variant-position:normal;font-variant-caps:normal;font-variant-numeric:normal;font-variant-alternates:normal;font-feature-settings:normal;text-indent:0;text-align:start;text-decoration-line:none;text-decoration-style:solid;text-decoration-color:#000;text-transform:none;text-orientation:mixed;white-space:normal;shape-padding:0;isolation:auto;mix-blend-mode:normal;solid-color:#000;solid-opacity:1" color="#000" font-weight="400" font-family="sans-serif" overflow="visible" stroke-linecap="round" fill="none" stroke="url(#f)" stroke-width="2.6004"/>
</svg>`,
  lineShort: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="svg8" version="1.1" viewBox="0 0 26.4583 26.4583" height="100" width="100">
  <defs id="defs2">
    <linearGradient id="linearGradient3722">
      <stop id="stop3718" class="line-color-primary" offset="0" stop-color="#2a7fff" stop-opacity="1"/>
      <stop id="stop3720" class="line-color-secondary" offset="1" stop-color="#2ae4ff" stop-opacity="1"/>
    </linearGradient>
    <linearGradient gradientUnits="userSpaceOnUse" y2="283.7708" x2="25.5937" y1="283.7708" x1=".8646" id="linearGradient3724" xlink:href="#linearGradient3722"/>
    <linearGradient gradientTransform="rotate(45 10.9613 289.246)" y2="283.7708" x2="25.5937" y1="283.7708" x1=".8646" gradientUnits="userSpaceOnUse" id="linearGradient3738" xlink:href="#linearGradient3722"/>
  </defs>
  <g filter="url(#drop-shadow-filter-slash)">
    <g class="animate__line-short" style="transform-origin:13.2291665px 13.2291665px">
      <g class="animate__line-short-inner translate" style="transform-origin:13.2291665px 13.2291665px">
        <path class="path3716"  d="M 1.5355285,283.77082 H 24.922805" transform="translate(0 -270.5417)" fill="none" stroke-width="1.3229" stroke="url(#linearGradient3724)"  stroke-linecap="round"/>
      </g>
    </g>
  </g>
</svg>`,
  lineLong: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="svg8" version="1.1" viewBox="0 0 26.4583 26.4583" height="100" width="100">
  <defs id="defs2">
    <linearGradient id="linearGradient3722">
      <stop id="stop3718" class="line-color-primary" offset="0" stop-color="#2a7fff" stop-opacity="1"/>
      <stop id="stop3720" class="line-color-secondary" offset="1" stop-color="#2ae4ff" stop-opacity="1"/>
    </linearGradient>
    <linearGradient gradientUnits="userSpaceOnUse" y2="283.7708" x2="25.5937" y1="283.7708" x1=".8646" id="linearGradient3724" xlink:href="#linearGradient3722"/>
    <linearGradient gradientTransform="rotate(45 10.9613 289.246)" y2="283.7708" x2="25.5937" y1="283.7708" x1=".8646" gradientUnits="userSpaceOnUse" id="linearGradient3738" xlink:href="#linearGradient3722"/>
  </defs>
  <g filter="url(#drop-shadow-filter-slash)">
    <g class="animate__line-long"  style="transform-origin:13.2291665px 13.2291665px">
      <path  d="M 1.7532815,272.29493 24.705052,295.24671" class="path3726" transform="translate(0 -270.5417)" fill="none" stroke="url(#linearGradient3738)" stroke-width="1.3229" stroke-linecap="round"/>
    </g>
  </g>
</svg>`,
  antMenu: `<svg xmlns="http://www.w3.org/2000/svg" width="315.0117" height="1464.7015" viewBox="0 0 83.3469 387.5356">
  <g fill-rule="evenodd" transform="translate(686.7976 -48.9848)">
    <circle fill="currentColor" r="41.6734" cy="90.6583" cx="-645.1242"/>
    <circle fill="currentColor" cx="-645.1242" cy="242.7526" r="41.6734"/>
    <circle fill="currentColor" r="41.6734" cy="394.847" cx="-645.1242"/>
  </g>
</svg>`,
};
