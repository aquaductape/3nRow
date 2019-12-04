!function(e){var t={};function n(r){if(t[r])return t[r].exports;var i=t[r]={i:r,l:!1,exports:{}};return e[r].call(i.exports,i,i.exports,n),i.l=!0,i.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)n.d(r,i,function(t){return e[t]}.bind(null,i));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=2)}([function(e,t,n){"use strict";var r=this&&this.__awaiter||function(e,t,n,r){return new(n||(n=Promise))((function(i,a){function o(e){try{s(r.next(e))}catch(e){a(e)}}function l(e){try{s(r.throw(e))}catch(e){a(e)}}function s(e){var t;e.done?i(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(o,l)}s((r=r.apply(e,t||[])).next())}))},i=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const a=i(n(1)),o=n(6),l=n(7),s=i(n(8)),d=n(9),u=document.querySelectorAll("[data-column]"),f=document.querySelector(".stats");t.gameInit=()=>{if(a.default.player1.turn=!0,a.default.player2.ai=!0,!f)return null;f.innerHTML=`Go ${a.default.player1.name}!`};const c=e=>{if(a.default.gameOver)return null;h(e),a.default.currentPlayer().ai&&m()},p=()=>{if(!f||a.default.gameOver||a.default.gameTie)return null;f.innerHTML=l.randomGen(a.default.currentPlayer().name)};u.forEach(e=>{e.addEventListener("click",c),e.addEventListener("keydown",e=>{const t=e.key;"Enter"!==t&&" "!==t||c(e)})});const y=()=>{o.animateLine(),o.addStartBtn(),g()},g=()=>{if(!f)return null;const e=a.default.currentPlayer();f.innerHTML=`${e.name} won!`,a.default.gameOver=!0},h=e=>{const t=e.currentTarget,n=t.parentElement;if(!n)return;const r=n.getAttribute("data-row"),i=t.getAttribute("data-column"),o=e.currentTarget;if(!i||!o||!r)return null;if(G(parseInt(r),parseInt(i)))return null;const l=a.default.currentPlayer(),s=a.default.board;w(parseInt(r),parseInt(i),o),x(l,s),a.default.nextPlayer(),p()},m=()=>r(void 0,void 0,void 0,(function*(){if(a.default.gameOver)return null;const e=a.default.board,t=a.default.currentPlayer(),n=s.default(d.flattenArr(e),t.mark),{row:r,column:i}=d.convertToRowCol(n.index),o=document.querySelector(`[data-row="${r}"]`).querySelector(`[data-column="${i}"]`);w(r,i,o),x(a.default.currentPlayer(),e),a.default.nextPlayer(),p()})),x=(e,t)=>{if(a.default.gameOver||!f)return null;for(let n=0;n<t.length;n++){if(t[n].every(t=>t===e.mark))return a.default.winPosition=`ROW_${n}`,y(),null;let r=0;for(let i=0;i<t.length;i++)if(t[i][n]===e.mark&&(r++,r===a.default.board.length))return a.default.winPosition=`COL_${n}`,y(),null}let n=0,r=0;for(let i=0;i<t.length;i++){if(t[i][i]===e.mark&&(n++,n===a.default.board.length))return a.default.winPosition="DIAG_TOP_LEFT",y(),null;if(t[i][a.default.board.length-1-i]===e.mark&&(r++,r===a.default.board.length))return a.default.winPosition="DIAG_BOT_LEFT",y(),null}let i=0;for(let e=0;e<t.length;e++)t[e].every(e=>"number"!=typeof e)&&i++;3===i&&(o.addStartBtn(),a.default.gameTie=!0,f.innerHTML="Cat's game!")},G=(e,t)=>"number"!=typeof a.default.board[e][t],w=(e,t,n)=>{if(G(e,t)||a.default.gameOver)return null;const r=a.default.currentPlayer(),i=n.firstElementChild;if(!i||!f)return null;i.innerHTML=r.shape,v(r,n),a.default.board[e][t]=r.mark},v=(e,t)=>{const n=t.parentElement;if(!n)return null;const r=n.getAttribute("data-row"),i=t.getAttribute("data-column");t.setAttribute("aria-label",`Marked by ${e.name} on row ${r}, column ${i}`)}},function(e,t,n){"use strict";var r=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const i=r(n(5));class a{constructor(e,t,n,r=!1){this.name=e,this.shape=i.default[t],this.score=0,this.turn=!1,this.ai=r,this.mark=n}}const o={board:[[0,1,2],[3,4,5],[6,7,8]],player1:new a("Player1","cross","X"),player2:new a("Player2","circle","O"),gameOver:!1,gameTie:!1,winPosition:"",lines:{lineShort:i.default.lineShort,lineLong:i.default.lineLong},currentPlayer(){return this.player1.turn?this.player1:this.player2},nextPlayer(){this.player1.turn=!this.player1.turn,this.player2.turn=!this.player2.turn}};t.default=o},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),n(3),n(4),n(0),n(0).gameInit()},function(e,t,n){},function(e,t,n){"use strict";const r=()=>{const e=document.querySelector(".game-container");if(!e)return null;const t=window.innerHeight;e.style.maxWidth=`${t-200}px`};r(),window.addEventListener("resize",r)},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const r={circle:'\n<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="100" height="100" viewBox="0 0 26.4583 26.4583" version="1.1" id="svg8">\n  <defs id="defs2">\n    <linearGradient id="linearGradient3789">\n      <stop id="stop3785" offset="0" stop-color="#ff0051" stop-opacity="1"/>\n      <stop id="stop3787" offset="1" stop-color="#ffc300" stop-opacity="1"/>\n    </linearGradient>\n    <linearGradient id="linearGradient3759">\n      <stop offset="0" id="stop3755" stop-color="#ff4900" stop-opacity="1"/>\n      <stop offset="1" id="stop3757" stop-color="#ffc300" stop-opacity="1"/>\n    </linearGradient>\n    <linearGradient xlink:href="#linearGradient3789" id="linearGradient3761" x1="13.8088" y1="247" x2="78.3068" y2="243.7928" gradientUnits="userSpaceOnUse" gradientTransform="matrix(0 .2635 -.2635 0 78.3119 .0543)"/>\n    <linearGradient xlink:href="#linearGradient3759" id="linearGradient3775" gradientUnits="userSpaceOnUse" gradientTransform="matrix(.2635 0 0 .2635 270.596 -51.853)" x1="13.8088" y1="247" x2="86.1912" y2="247"/>\n    <linearGradient y2="259.7645" x2="69.9669" y1="247" x1="13.8088" gradientTransform="matrix(0 .2635 .2635 0 -11.6131 -6.3685)" gradientUnits="userSpaceOnUse" id="linearGradient3736" xlink:href="#linearGradient3759"/>\n    <linearGradient y2="243.7928" x2="78.3068" y1="247" x1="13.8088" gradientTransform="matrix(0 .2635 -.2635 0 118.5518 -6.3685)" gradientUnits="userSpaceOnUse" id="linearGradient3756" xlink:href="#linearGradient3789"/>\n    <linearGradient xlink:href="#linearGradient3789" id="linearGradient841" x1="53.4693" y1="-1.5099" x2="53.4693" y2="13.7502" gradientUnits="userSpaceOnUse"/>\n    <linearGradient xlink:href="#linearGradient3759" id="linearGradient851" x1="53.5009" y1="-2.4148" x2="53.5009" y2="13.775" gradientUnits="userSpaceOnUse"/>\n  </defs>\n  <g transform="translate(-40.2399 6.4228)" id="g3764">\n    <path d="m 53.469328,15.12263 a 8.316061,8.3162622 0 0 0 7.20192,-4.15814 8.316061,8.3162622 0 0 0 0,-8.3162599 8.316061,8.3162622 0 0 0 -7.20192,-4.15813" class="circle-left" id="path14" fill="none" fill-opacity=".9202" stroke="url(#linearGradient851)" stroke-width="2.6458" stroke-linecap="round" stroke-linejoin="miter" stroke-miterlimit="4" stroke-dasharray="none" stroke-opacity="1"/>\n    <path d="m 53.469338,15.12263 a 8.316061,8.3162622 0 0 1 -8.049378,-6.2271099 8.316061,8.3162622 0 0 1 4.005148,-9.35577 8.316061,8.3162622 0 0 1 10.061675,1.52651" class="circle-right" id="path16" opacity="1" fill="none" fill-opacity="1" stroke="url(#linearGradient841)" stroke-width="2.6458" stroke-linecap="round" stroke-linejoin="miter" stroke-miterlimit="4" stroke-dasharray="none" stroke-opacity="1"/>\n  </g>\n</svg>\n',cross:'\n<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="100" height="100" viewBox="0 0 26.4583 26.4583" version="1.1" id="svg8">\n  <defs id="defs2">\n    <linearGradient id="linearGradient3790">\n      <stop id="stop3786" offset="0" stop-color="#0cf" stop-opacity="1"/>\n      <stop id="stop3788" offset="1" stop-color="#5fd" stop-opacity="1"/>\n    </linearGradient>\n    <linearGradient id="linearGradient3782">\n      <stop id="stop3778" offset="0" stop-color="#5fd" stop-opacity="1"/>\n      <stop id="stop3780" offset="1" stop-color="#0cf" stop-opacity="1"/>\n    </linearGradient>\n    <linearGradient id="linearGradient3789">\n      <stop id="stop3785" offset="0" stop-color="#ff0051" stop-opacity="1"/>\n      <stop id="stop3787" offset="1" stop-color="#ffc300" stop-opacity="1"/>\n    </linearGradient>\n    <linearGradient id="linearGradient3759">\n      <stop offset="0" id="stop3755" stop-color="#ff4900" stop-opacity="1"/>\n      <stop offset="1" id="stop3757" stop-color="#ffc300" stop-opacity="1"/>\n    </linearGradient>\n    <linearGradient xlink:href="#linearGradient3789" id="linearGradient3761" x1="13.8088" y1="247" x2="78.3068" y2="243.7928" gradientUnits="userSpaceOnUse" gradientTransform="matrix(0 .2635 -.2635 0 78.3119 .0543)"/>\n    <linearGradient xlink:href="#linearGradient3759" id="linearGradient3775" gradientUnits="userSpaceOnUse" gradientTransform="matrix(.2635 0 0 .2635 270.596 -51.853)" x1="13.8088" y1="247" x2="86.1912" y2="247"/>\n    <linearGradient gradientUnits="userSpaceOnUse" y2="19.9728" x2="6.4856" y1="13.2292" x1="13.2292" id="linearGradient3784" xlink:href="#linearGradient3782"/>\n    <linearGradient gradientUnits="userSpaceOnUse" y2="22.7431" x2="21.9646" y1="11.6221" x1="11.6221" id="linearGradient3792" xlink:href="#linearGradient3790"/>\n  </defs>\n  <g class="left-dot" fill="none" fill-opacity=".9202" stroke="#0cf" stroke-width="2.6458" stroke-linecap="round" stroke-linejoin="round">\n    <path d="m 6.4855042,19.986408 a 9.5368996,9.5368996 0 0 1 5.62e-5,-0.03275"/>\n  </g>\n  <g class="right-dot" fill="none" fill-opacity=".9202" stroke="#5fd" stroke-width="2.6458" stroke-linecap="round" stroke-linejoin="round">\n    <path transform="scale(-1 1)" d="m -19.972774,19.953657 a 9.5368996,9.5368996 0 0 1 -1.1e-5,-0.01438" class="circle3768"/>\n  </g>\n  <g fill="none" stroke-width="2.6458" stroke-linecap="round">\n    <g stroke="url(#linearGradient3792)" transform="translate(0 -.0191)">\n      <path d="M 6.4855595,6.4855597 19.972772,19.972772" class="right-line"/>\n    </g>\n    <g stroke="url(#linearGradient3784)" transform="translate(0 -.0191)">\n      <path d="M 19.972772,6.4855597 6.4855597,19.972772" class="left-line"/>\n    </g>\n  </g>\n</svg>\n',lineShort:'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="svg8" version="1.1" viewBox="0 0 26.4583 26.4583" height="100" width="100">\n  <defs id="defs2">\n    <linearGradient id="linearGradient3722">\n      <stop id="stop3718" offset="0" stop-color="#2a7fff" stop-opacity="1"/>\n      <stop id="stop3720" offset="1" stop-color="#2ae4ff" stop-opacity="1"/>\n    </linearGradient>\n    <linearGradient gradientUnits="userSpaceOnUse" y2="283.7708" x2="25.5937" y1="283.7708" x1=".8646" id="linearGradient3724" xlink:href="#linearGradient3722"/>\n    <linearGradient gradientTransform="rotate(45 10.9613 289.246)" y2="283.7708" x2="25.5937" y1="283.7708" x1=".8646" gradientUnits="userSpaceOnUse" id="linearGradient3738" xlink:href="#linearGradient3722"/>\n  </defs>\n  <g class="line-short" style="transform-origin:13.2291665px 13.2291665px">\n    <g class="line-short-inner translate" style="transform-origin:13.2291665px 13.2291665px">\n      <path class="path3716" d="M 1.5355285,283.77082 H 24.922805" transform="translate(0 -270.5417)" fill="none" stroke="url(#linearGradient3724)" stroke-width="1.3229" stroke-linecap="round"/>\n    </g>\n  </g>\n</svg>',lineLong:'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="svg8" version="1.1" viewBox="0 0 26.4583 26.4583" height="100" width="100">\n  <defs id="defs2">\n    <linearGradient id="linearGradient3722">\n      <stop id="stop3718" offset="0" stop-color="#2a7fff" stop-opacity="1"/>\n      <stop id="stop3720" offset="1" stop-color="#2ae4ff" stop-opacity="1"/>\n    </linearGradient>\n    <linearGradient gradientUnits="userSpaceOnUse" y2="283.7708" x2="25.5937" y1="283.7708" x1=".8646" id="linearGradient3724" xlink:href="#linearGradient3722"/>\n    <linearGradient gradientTransform="rotate(45 10.9613 289.246)" y2="283.7708" x2="25.5937" y1="283.7708" x1=".8646" gradientUnits="userSpaceOnUse" id="linearGradient3738" xlink:href="#linearGradient3722"/>\n  </defs>\n  <g class="line-long" style="transform-origin:13.2291665px 13.2291665px">\n    <path d="M 1.7532815,272.29493 24.705052,295.24671" class="path3726" transform="translate(0 -270.5417)" fill="none" stroke="url(#linearGradient3738)" stroke-width="1.3229" stroke-linecap="round"/>\n  </g>\n</svg>'};t.default=r},function(e,t,n){"use strict";var r=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const i=r(n(1)),a=document.querySelector(".line-svg"),o=document.querySelector(".game-start"),l=document.querySelector(".stats"),s=document.querySelectorAll("[data-column]");t.animateLine=()=>{if(!a)return null;const e=i.default.winPosition;if("DIAG_TOP_LEFT"===e&&(a.innerHTML=i.default.lines.lineLong),"DIAG_BOT_LEFT"===e){a.innerHTML=i.default.lines.lineLong;const e=a.querySelector(".line-long");if(!e)return null;e.style.transform="rotate(90deg)"}if("ROW_0"===e){a.innerHTML=i.default.lines.lineShort;const e=a.querySelector(".line-short");if(!e)return null;e.style.transform="translateY(-33.4%)"}if("ROW_1"===e&&(a.innerHTML=i.default.lines.lineShort),"ROW_2"===e){a.innerHTML=i.default.lines.lineShort;const e=a.querySelector(".line-short");if(!e)return null;e.style.transform="translateY(33.4%)"}if("COL_0"===e){a.innerHTML=i.default.lines.lineShort;const e=a.querySelector(".line-short"),t=a.querySelector(".line-short-inner");if(!e||!t)return null;e.style.transform="rotate(90deg)",t.style.transform="translateY(33.4%)"}if("COL_1"===e){a.innerHTML=i.default.lines.lineShort;const e=a.querySelector(".line-short");if(!e)return null;e.style.transform="rotate(90deg)"}if("COL_2"===e){a.innerHTML=i.default.lines.lineShort;const e=a.querySelector(".line-short"),t=a.querySelector(".line-short-inner");if(!e||!t)return null;e.style.transform="rotate(90deg)",t.style.transform="translateY(-33.4%)"}console.log(e)};const d=e=>{e.preventDefault(),s.forEach(e=>{e.setAttribute("aria-label","empty");const t=e.firstElementChild;t&&(t.innerHTML="")});const t=i.default.player1.turn?i.default.player1:i.default.player2;if(!l||!a)return null;l.innerHTML=`Go ${t.name}!`,a.innerHTML="",i.default.gameOver=!1,i.default.gameTie=!1,i.default.winPosition="";let n=0;i.default.board=i.default.board.map(e=>e.map(e=>{const t=n;return n++,t})),o.innerHTML=""};t.addStartBtn=()=>{o.innerHTML='<button class="btn btn-start">Play Again?</button>',document.querySelector(".btn-start").addEventListener("click",d)}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.randomGen=e=>{const t=[`${e}, your time to shine!`,`Go ${e}!`,`Your move ${e}`],n=t.length;return t[Math.floor(Math.random()*n)]}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const r=(e,t)=>e[0]==t&&e[1]==t&&e[2]==t||e[3]==t&&e[4]==t&&e[5]==t||e[6]==t&&e[7]==t&&e[8]==t||e[0]==t&&e[3]==t&&e[6]==t||e[1]==t&&e[4]==t&&e[7]==t||e[2]==t&&e[5]==t&&e[8]==t||e[0]==t&&e[4]==t&&e[8]==t||e[2]==t&&e[4]==t&&e[6]==t,i=(e,t)=>{const n=(e=>e.filter(e=>"O"!==e&&"X"!==e))(e);if(r(e,"X"))return{score:-10};if(r(e,"O"))return{score:10};if(0===n.length)return{score:0};const a=[];for(let r=0;r<n.length;r++){const o={};if(o.index=e[n[r]],e[n[r]]=t,"O"==t){const t=i(e,"X");o.score=t.score}else{const t=i(e,"O");o.score=t.score}e[n[r]]=o.index,a.push(o)}let o=0;if("O"===t){let e=-1e4;for(let t=0;t<a.length;t++)a[t].score>e&&(e=a[t].score,o=t)}else{let e=1e4;for(let t=0;t<a.length;t++)a[t].score<e&&(e=a[t].score,o=t)}return a[o]};t.default=i},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.maxBy=e=>{let t=Number.MIN_SAFE_INTEGER,n=e[0];for(let r of e)"number"==typeof r.score&&r.score>t&&(t=r.score,n=r);return n},t.minBy=e=>{let t=Number.MAX_SAFE_INTEGER,n=e[0];for(let r of e)"number"==typeof r.score&&r.score<t&&(t=r.score,n=r);return n},t.copyBoard=e=>{const t=[];for(let n of e)t.push([...n]);return t},t.flattenArr=e=>{const n=[];return e.forEach(e=>{Array.isArray(e)?n.push(...t.flattenArr(e)):n.push(e)}),n},t.convertToRowCol=e=>{const t=e%3;let n=0;return e>5?(n=2,{row:n,column:t}):e>2?(n=1,{row:n,column:t}):{row:n,column:t}}}]);