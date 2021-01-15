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

export const shapes = [
  "circle",
  "cross",
  "triangle",
  "heart",
  // "square",
  // "kite",
];

export const svg = {
  circle: `
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="100" height="100" viewBox="0 0 26.4583 26.4583" version="1.1" >
  <g transform="translate(-40.2399 6.4228)" id="g3764" filter="url(#drop-shadow-filter)">
    <path d="m 53.469328,15.12263 a 8.316061,8.3162622 0 0 0 7.20192,-4.15814 8.316061,8.3162622 0 0 0 0,-8.3162599 8.316061,8.3162622 0 0 0 -7.20192,-4.15813" class="animate__circle-left" id="path14" fill="none" fill-opacity=".9202" stroke="url(#b)" stroke-width="2.6458" stroke-linecap="round" stroke-linejoin="miter" stroke-miterlimit="4" stroke-dasharray="none" stroke-opacity="1"/>
    <path d="m 53.469338,15.12263 a 8.316061,8.3162622 0 0 1 -8.049378,-6.2271099 8.316061,8.3162622 0 0 1 4.005148,-9.35577 8.316061,8.3162622 0 0 1 10.061675,1.52651" class="animate__circle-right" id="path16" opacity="1" fill="none" fill-opacity="1" stroke="url(#b)" stroke-width="2.6458" stroke-linecap="round" stroke-linejoin="miter" stroke-miterlimit="4" stroke-dasharray="none" stroke-opacity="1"/>
  </g>
</svg>
`,
  cross: `
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="100" height="100" viewBox="0 0 26.4583 26.4583" version="1.1" >
  <g filter="url(#drop-shadow-filter)">
    <g class="animate__left-dot" fill="url(%primaryColor%)">
      <circle cx="6.4855" cy="19.9915" r="1.3368" />
    </g>
    <g class="animate__right-dot" fill="url(%secondaryColor%)">
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
  square: `
  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="100" height="100" viewBox="0 0 26.458 26.458">
  <g class="animate__square-dot-1" style="opacity: 0;">
    <circle  cx="13.229" cy="13.229" r="1.337" fill="url(%primaryColor%)" fill-rule="evenodd"/>
  </g>
  <g class="animate__square-dot-2" style="opacity: 0;">
    <circle  cx="13.229" cy="13.229" r="1.337" fill="url(%primaryColor%)" fill-rule="evenodd"/>
  </g>
  <g class="animate__square-dot-3" style="opacity: 0;">
    <circle  r="1.337" cy="13.229" cx="13.229" fill="url(%secondaryColor%)" fill-rule="evenodd"/>
  </g>
  <g class="animate__square-dot-4" style="opacity: 0;">
    <circle  r="1.337" cy="13.229" cx="13.229" fill="url(#g)" fill-rule="evenodd"/>
  </g>
  <g filter="url(#drop-shadow-filter)" stroke-width="2.646" stroke-linecap="round">
    <path class="animate__square-line-1" d="M6.486 6.486v13.487" stroke="url(#c)"/>
    <path class="animate__square-line-2" d="M6.486 6.486h13.487" stroke="url(#d)"/>
    <path class="animate__square-line-3" d="M19.973 6.486v13.487" stroke="url(#e)"/>
    <path class="animate__square-line-4" d="M19.973 19.973H6.486" stroke="url(#f)"/>
  </g>
</svg>
  `,
  kite: `
  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="100" height="100" viewBox="0 0 26.458 26.458">
  <g stroke-width="2.646"  stroke-linecap="round">
    <g filter="url(#drop-shadow-filter)" >
      <path d="M51.21 11.514L44.47 1.402" stroke="url(#f)" transform="translate(-37.982 10.182)"/>
      <path d="M19.971 11.582L13.23 21.696" stroke="url(%primaryColor%)"/>
    </g>
    <g filter="url(#drop-shadow-filter)">
      <path d="M57.953 1.4L51.21-5.342" stroke="url(#g)" transform="translate(-37.982 10.182)"/>
      <path d="M6.487 11.582L13.23 4.84" stroke="url(%primaryColor%)"/>
    </g>
  </g>
</svg>
  `,
  lineShort: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"  version="1.1" viewBox="0 0 26.4583 26.4583" height="100" width="100">
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
  lineLong: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"  version="1.1" viewBox="0 0 26.4583 26.4583" height="100" width="100">
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
  cevron: `
<svg xmlns="http://www.w3.org/2000/svg" width="25" height="14.112" viewBox="0 0 6.615 3.734"><path d="M6.188.427l-2.88 2.88M.426.427l2.88 2.88" fill="none" stroke="#5966ca" stroke-width=".853" stroke-linecap="round"/></svg>
`,
  radio: `
<svg xmlns="http://www.w3.org/2000/svg" width="37.795" height="37.795" viewBox="0 0 10 10">
  <circle class="radio-icon-unselected" shape-rendering="geometricPrecision" cx="5" cy="5" r="4.375" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
    <circle class="radio-icon-selected" shape-rendering="geometricPrecision" cx="5" cy="5" r="3.412" fill="#fff" stroke="currentColor" stroke-width="3.175" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`,
  playAgainCircleBtn: `
<svg xmlns="http://www.w3.org/2000/svg" width="287.905" height="313.286" viewBox="0 0 76.175 82.89">
  <circle cx="38.087" cy="44.803" r="38.087"  fill="#1d115f"/>
  <g class="play-again-btn-main">
    <circle cx="38.087" cy="38.087" r="38.087"  fill="#7c4dff"/> 
    <g stroke="#fff" stroke-linecap="round" stroke-linejoin="round">
      <path d="M42.718 19.809a18.843 18.843 0 00-20.12 7.61 18.843 18.843 0 00.126 21.511 18.843 18.843 0 0020.206 7.377 18.843 18.843 0 0013.954-16.37"  fill="none" stroke-width="3.969"/>
      <path d="M56.075 24.098l-6.858 1.604-6.858 1.604 2.04-6.742 2.04-6.74 4.818 5.137z"  fill="#fff" stroke-width="3.44"/>
    </g>
  </g>
</svg>
`,
  close: `
<svg xmlns="http://www.w3.org/2000/svg" width="57.875" height="57.875" viewBox="0 0 15.313 15.313">
  <path d="M14.4.913L.913 14.4m0-13.487L14.4 14.4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
</svg>
`,
  navigationArrow: `
<svg xmlns="http://www.w3.org/2000/svg" width="47.017" height="38.236" viewBox="0 0 12.44 10.117"><g  stroke="currentColor" stroke-width="1.587" stroke-linecap="round"><path d="M.89 5.058l4.327 4.265"/><path d="M.89 5.058L5.216.794"/><path d="M11.646 5.058H.908"/></g></svg>
  `,
  // menuBg: `
  // <svg xmlns="http://www.w3.org/2000/svg" width="518.547" height="518.547" viewBox="0 0 137.199 137.199"><path class="layer-main" fill="var(--menu-bg-main" d="M0 0h137.199v137.199H-.001z"/><path class="layer-2" d="M137.199 66.268c-24.94-.161-89.837 36.196-123.674 42.806-4.588.896-8.896 1.187-13.525-1.11 0 0-10.5-7.695-14.344-4.22-3.845 3.475 2.975 15.866 2.975 15.866L0 126.674 3.37 137.2h133.829s13.75 1.84 17.818-2.571c12.465-13.515 7.896-44.097 3.45-55.049-4.9-12.07-21.268-13.312-21.268-13.312z" fill="var(--menu-bg-layer-2)"/><path class="layer-3" d="M137.199 78.87c-10.07.363-36.395 3.706-61.032 27.196-31.274 29.818-63.977 24.947-63.977 24.947l-6.694-1.48L0 127.004s-18.44-4.624-19.495 1.817C-20.645 135.837 0 137.474 0 137.474l4.26.065 51.924 1.226 81.015-1.566s19.935-19.584 19.54-31.286c-.22-6.543-2.326-17.666-7.647-23.167-4.195-4.336-11.893-3.876-11.893-3.876z" fill="var(--menu-bg-layer-3)"/><path class="layer-1" d="M0 0s-26.709-8.092-34.468.382c-6.755 7.378-5.205 23.313 2.306 29.92C-24.102 37.392 0 28.666 0 28.666c10.585-5.78 29.592-14.754 53.187-19.76 30.069-6.38 67.025-4.153 84.012-2.59 0 0 13.171 3.896 23.115 9.933 12.587 7.642 18.177-8.877 11.254-12.843C164.865-.434 139.58-1.547 137.2 0z" fill="var(--menu-bg-layer-1)"/></svg>
  // `,
  menuBg: `
  <svg xmlns="http://www.w3.org/2000/svg" width="518.547" height="518.547" viewBox="0 0 137.199 137.199"><path class="layer-main" d="M0 3.42s-31.09 60.009-23.087 89.893C-20.242 103.94-.001 116.9-.001 116.9H0c4.629 2.415 8.937 2.109 13.525 1.167 33.837-6.948 98.734-45.162 123.674-44.993 0 0 13.239-4.655 15.426-10.472C159.802 43.52 137.2 3.42 137.2 3.42z" fill="var(--menu-bg-main)"/><path class="layer-2" d="M137.199 66.268c-24.94-.161-89.837 36.196-123.674 42.806-4.588.896-8.896 1.187-13.525-1.11 0 0-10.5-7.695-14.344-4.22-3.845 3.475 2.975 15.866 2.975 15.866L0 126.674 3.37 137.2h133.829s13.75 1.84 17.818-2.571c12.465-13.515 7.896-44.097 3.45-55.049-4.9-12.07-21.268-13.312-21.268-13.312z" fill="var(--menu-bg-layer-2)"/><path class="layer-3" d="M137.199 78.87c-10.07.363-36.395 3.706-61.032 27.196-31.274 29.818-63.977 24.947-63.977 24.947l-6.694-1.48L0 127.004s-18.44-4.624-19.495 1.817C-20.645 135.837 0 137.474 0 137.474l4.26.065 51.924 1.226 81.015-1.566s19.935-19.584 19.54-31.286c-.22-6.543-2.326-17.666-7.647-23.167-4.195-4.336-11.893-3.876-11.893-3.876z" fill="var(--menu-bg-layer-3)"/><path class="layer-1" d="M0 0s-26.709-8.092-34.468.382c-6.755 7.378-5.205 23.313 2.306 29.92C-24.102 37.392 0 28.666 0 28.666c10.585-5.78 29.592-14.754 53.187-19.76 30.069-6.38 67.025-4.153 84.012-2.59 0 0 13.171 3.896 23.115 9.933 12.587 7.642 18.177-8.877 11.254-12.843C164.865-.434 139.58-1.547 137.2 0z" fill="var(--menu-bg-layer-1)"/></svg>
  `,
  countdownCircle: `
<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 13.229 13.229"><circle fill="none" stroke="currentColor" stroke-width="1.314" stroke-linecap="round" stroke-linejoin="round" paint-order="fill markers stroke" transform="matrix(0 -1 -1 0 0 0)" cx="-6.614" cy="-6.614" r="5.958"/></svg>
  `,
};
