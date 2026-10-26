import{n as e,r as t,t as n}from"./react-DvygzJGv.js";(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var r=t(),i=e(),a=n(),o=8,s=1.8,c={up:[0,1],down:[0,-1],left:[-1,0],right:[1,0]},l=`#version 300 es
in vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`,u=`#version 300 es
precision highp float;
precision highp int;
uniform vec2 uResolution;
uniform float uTime;
uniform vec2 uFlow;
uniform float uSpeed;
uniform float uScale;
uniform float uTurbulence;
uniform float uFluidity;
uniform float uRimWidth;
uniform float uSharpness;
uniform float uShimmer;
uniform float uGlow;
uniform float uLine;
uniform float uMaxHalf;
uniform vec3 uColors[${o}];
uniform int uColorCount;
uniform vec4 uMagnet;
uniform vec4 uSwirl;
uniform float uReveal;
uniform float uLight;
uniform float uOpaque;
uniform vec3 uBackground;
uniform float uOpacity;
out vec4 outColor;

float hash(vec3 p3) {
  p3 = fract(p3 * 0.1031);
  p3 += dot(p3, p3.zyx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float smin(float a, float b, float k) {
  float r = exp2(-a / k) + exp2(-b / k);
  return -k * log2(r);
}

float sinlerp(float a, float b, float w) {
  return mix(a, b, (sin(w * 3.14159265 - 3.14159265 / 2.0) + 1.0) / 2.0);
}

float vn(vec2 p, float s, float seed) {
  vec2 cellp = floor(p / s);
  vec2 relp = mod(p, s);
  float g1 = hash(vec3(cellp, seed));
  float g2 = hash(vec3(cellp.x + 1.0, cellp.y, seed));
  float g3 = hash(vec3(cellp.x + 1.0, cellp.y + 1.0, seed));
  float g4 = hash(vec3(cellp.x, cellp.y + 1.0, seed));
  float bx = sinlerp(g1, g2, relp.x / s);
  float tx = sinlerp(g4, g3, relp.x / s);
  return sinlerp(bx, tx, relp.y / s);
}

float dbn(vec2 p, float s, float seed) {
  float o = s / 2.0;
  float n0 = vn(p, s, seed);
  float n1 = vn(p + vec2(o, o), s, seed + 0.1);
  float n2 = vn(p + vec2(-o, o), s, seed + 0.2);
  float n3 = vn(p + vec2(o, -o), s, seed + 0.3);
  float n4 = vn(p + vec2(-o, -o), s, seed + 0.4);
  return (2.0 * n0 + 1.5 * n1 + 1.25 * n2 + 1.125 * n3 + n4) / 7.0;
}


vec3 palette(float h) {
  float x = clamp(h, 0.0, 1.0) * float(uColorCount - 1);
  int i = int(floor(x));
  int j = min(i + 1, uColorCount - 1);
  return mix(uColors[i], uColors[j], smoothstep(0.0, 1.0, x - float(i)));
}

void main() {
  float ref = 700.0 / max(uScale, 0.05);
  vec2 frag = gl_FragCoord.xy;
  vec2 toMagnet = (frag - uMagnet.xy) / uResolution.y;
  float pull = uMagnet.z * exp(-dot(toMagnet, toMagnet) / (uMagnet.w * uMagnet.w));
  if (pull > 0.001) {
    float angle = pull * 0.55;
    float c = cos(angle);
    float s = sin(angle);
    frag = uMagnet.xy + mat2(c, s, -s, c) * (frag - uMagnet.xy);
  }
  if (uSwirl.w > 0.0) {
    vec2 d = frag - uSwirl.xy;
    float reach = uSwirl.z;
    float angle = uSwirl.w * exp(-dot(d, d) / (reach * reach));
    float c = cos(angle);
    float s = sin(angle);
    frag = uSwirl.xy + mat2(c, s, -s, c) * d;
  }
  vec2 p = frag / uResolution.y * ref;

  float spd = 200.0 * uSpeed;
  float t = uTime;
  vec2 dir = uFlow;
  vec2 perp = vec2(-dir.y, dir.x);
  float distort1 = vn(p + perp * (t * spd), 60.0, 10.0) * 50.0 * uTurbulence;
  float distort2 = vn(p - perp * (t * spd), 120.0, 15.0) * 100.0 * uTurbulence;
  float peaks = dbn(p + distort1 + dir * (t * spd * 0.5), 40.0, 1.0);
  float peaks2 = dbn(p + distort2 - dir * (t * spd * 0.5), 40.0, 0.0);
  float field = smin(peaks, peaks2, max(uFluidity, 0.001));

  float slope = length(vec2(dFdx(field), dFdy(field)));
  float gap = abs(field - 0.4);
  float pixels = gap / max(slope, 1e-6);
  float halfBand = max(uRimWidth, 0.001) * 0.5;
  float across = max(gap / halfBand, pixels / uMaxHalf);
  float band = 5.0 * uRimWidth * (1.0 - across);
  float reveal = smoothstep(0.2, 0.85, pull);
  float shimmer = vn(p + dir * (t * spd * 0.5), 60.0, 12.0) * uShimmer * (1.0 - reveal * 0.75);
  float lit = clamp(band - shimmer, 0.0, 1.0);
  float glow = pow(lit, uSharpness) * uGlow * (1.0 + reveal * 0.25);
  float core = uLine > 0.0 ? smoothstep(uLine + 0.75, uLine - 0.75, pixels) * max(smoothstep(0.08, 0.6, glow), reveal) : 0.0;
  float shine = clamp(glow, 0.0, 1.0);
  float energy = max(shine * shine, core * 0.85) * uReveal;

  float h = clamp(0.5 + (peaks - peaks2) * 0.8, 0.0, 1.0);
  vec3 tint = palette(h);

  if (uLight > 0.5) {
    float chroma = max(tint.r, max(tint.g, tint.b)) - min(tint.r, min(tint.g, tint.b));
    vec3 ink = mix(vec3(0.07, 0.07, 0.08), tint * 0.55, clamp(chroma * 1.6, 0.0, 1.0));
    float cover = energy * uOpacity;
    outColor = uOpaque > 0.5 ? vec4(mix(uBackground, ink, cover), 1.0) : vec4(ink * cover, cover);
    return;
  }

  vec3 light = tint * energy * uOpacity;
  outColor = uOpaque > 0.5 ? vec4(uBackground + light, 1.0) : vec4(light, max(light.r, max(light.g, light.b)));
}`,d=(e,t,n)=>Math.min(n,Math.max(t,e)),f=(e,t,n)=>{let r=e.createShader(t);return r?(e.shaderSource(r,n),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(e.deleteShader(r),null)):null},ee=e=>{let t=f(e,e.VERTEX_SHADER,l),n=f(e,e.FRAGMENT_SHADER,u),r=e.createProgram();if(!t||!n||!r)return null;if(e.attachShader(r,t),e.attachShader(r,n),e.bindAttribLocation(r,0,`aPosition`),e.linkProgram(r),e.deleteShader(t),e.deleteShader(n),!e.getProgramParameter(r,e.LINK_STATUS))return e.deleteProgram(r),null;let i={},a=e.getProgramParameter(r,e.ACTIVE_UNIFORMS);for(let t=0;t<a;t++){let n=e.getActiveUniform(r,t);n&&(i[n.name.replace(`[0]`,``)]=e.getUniformLocation(r,n.name))}return{program:r,uniforms:i}},p=({colors:e=[`#ffffff`,`#ffffff`,`#ffffff`],speed:t=.5,scale:n=1.6,turbulence:i=1,fluidity:l=.1,rimWidth:u=.2,sharpness:f=2.5,shimmer:p=1.5,glow:m=2,lineWidth:h=1,flowDirection:g=`down`,opacity:_=1,mouseInteraction:v=!0,mouseStrength:y=1,mouseRadius:b=.35,mouseDampening:x=.15,clickSwirl:S=!0,intro:C=!0,lightMode:w=!1,transparent:T=!0,backgroundColor:E,paused:D=!1,dpr:O,mixBlendMode:k,className:A=``,style:j,...M})=>{let N=(0,r.useRef)(null),P=(0,r.useRef)(null),F=(0,r.useRef)(null),I={colors:Array.isArray(e)&&e.length?e.slice(0,o):[`#ffffff`],speed:t,scale:Math.max(.05,n),turbulence:i,fluidity:Math.max(.001,l),rimWidth:Math.max(.001,u),sharpness:Math.max(.1,f),shimmer:Math.max(0,p),glow:Math.max(0,m),lineWidth:Math.max(0,h),flow:c[g]??c.down,opacity:d(_,0,1),mouseInteraction:v,mouseStrength:Math.max(0,y),mouseRadius:Math.max(.01,b),mouseDampening:Math.max(0,x),clickSwirl:S,intro:C,lightMode:w,transparent:T,backgroundColor:E,paused:D,dpr:O},L=(0,r.useRef)(I);return L.current=I,(0,r.useEffect)(()=>{let e=N.current,t=P.current,n=t?.getContext(`webgl2`,{alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1,stencil:!1});if(!e||!t||!n)return;let r=ee(n);if(!r)return;let i=r.uniforms,a=n.createBuffer(),o=n.createVertexArray();n.bindVertexArray(o),n.bindBuffer(n.ARRAY_BUFFER,a),n.bufferData(n.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),n.STATIC_DRAW),n.enableVertexAttribArray(0),n.vertexAttribPointer(0,2,n.FLOAT,!1,0,0);let c=document.createElement(`canvas`).getContext(`2d`,{willReadFrequently:!0}),l=new Map,u=(e,t)=>{if(!e)return t;let n=String(e);if(l.has(n))return l.get(n);let r=t;if(c){c.clearRect(0,0,1,1),c.fillStyle=`#000000`,c.fillStyle=n,c.fillRect(0,0,1,1);let[e,t,i]=c.getImageData(0,0,1,1).data;r=[e/255,t/255,i/255]}return l.set(n,r),r},f=new Float32Array(24),p=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches??!1,m={x:0,y:0,inside:!1},h={x:0,y:0,active:0},g={x:0,y:0,age:10},_=0,v=L.current.intro&&!p?0:1,y=0,b=0,x=!0,S=()=>{let a=L.current,s=t.width/Math.max(1,e.clientWidth);a.colors.forEach((e,t)=>f.set(u(e,[1,1,1]),t*3));let c=Math.min(1,v);n.viewport(0,0,t.width,t.height),n.useProgram(r.program),n.bindVertexArray(o),n.uniform2f(i.uResolution,t.width,t.height),n.uniform1f(i.uTime,_),n.uniform2f(i.uFlow,a.flow[0],a.flow[1]),n.uniform1f(i.uSpeed,a.speed),n.uniform1f(i.uScale,a.scale),n.uniform1f(i.uTurbulence,a.turbulence),n.uniform1f(i.uFluidity,a.fluidity),n.uniform1f(i.uRimWidth,a.rimWidth),n.uniform1f(i.uSharpness,a.sharpness),n.uniform1f(i.uShimmer,a.shimmer),n.uniform1f(i.uGlow,a.glow),n.uniform1f(i.uLine,a.lineWidth*s*.5),n.uniform1f(i.uMaxHalf,28*s),n.uniform3fv(i.uColors,f),n.uniform1i(i.uColorCount,a.colors.length),n.uniform4f(i.uMagnet,h.x,h.y,h.active*a.mouseStrength,a.mouseRadius);let l=g.age,d=1.9*Math.min(1,l/.23)*Math.exp(-Math.max(0,l-.23)*1.1);n.uniform4f(i.uSwirl,g.x,g.y,t.height*.22*(1+l*.5),l<6?d:0),n.uniform1f(i.uReveal,c*c*(3-2*c)),n.uniform1f(i.uLight,+!!a.lightMode),n.uniform1f(i.uOpaque,+!a.transparent),n.uniform3fv(i.uBackground,u(a.backgroundColor,a.lightMode?[1,1,1]:[.0706,.0588,.0902])),n.uniform1f(i.uOpacity,a.opacity),n.drawArrays(n.TRIANGLES,0,3)},C=e=>{if(y=0,!x||document.hidden)return;let t=L.current,n=b?d((e-b)/1e3,5e-4,.05):1/60;b=e;let r=t.paused||p?0:1;_+=n*r,g.age+=n,t.intro&&!p&&v<1?v=Math.min(1,v+n/s):(!t.intro||p)&&(v=1);let i=t.mouseInteraction&&m.inside,a=t.mouseDampening>0?1-Math.exp(-n/t.mouseDampening):1;i&&(h.x+=(m.x-h.x)*a,h.y+=(m.y-h.y)*a);let o=+!!i;h.active+=(o-h.active)*(1-Math.exp(-n/.3)),Math.abs(o-h.active)<.001&&(h.active=o),S(),r>0||h.active!==o||v<1||g.age<6?y=requestAnimationFrame(C):b=0},w=()=>{!y&&x&&!document.hidden&&(y=requestAnimationFrame(C))},T=()=>{let n=L.current,r=Math.max(1,e.clientWidth),i=Math.max(1,e.clientHeight),a=Math.min(n.dpr||window.devicePixelRatio||1,2);t.width=Math.max(1,Math.round(r*a)),t.height=Math.max(1,Math.round(i*a)),S(),w()},E=n=>{let r=e.getBoundingClientRect(),i=n.clientX-r.left,a=n.clientY-r.top,o=t.width/Math.max(1,r.width);m.inside=i>=0&&a>=0&&i<=r.width&&a<=r.height,m.x=i*o,m.y=(r.height-a)*o},D=e=>{let t=m.inside;E(e),m.inside&&!t&&h.active<.05&&(h.x=m.x,h.y=m.y),w()},O=e=>{D(e),m.inside&&L.current.clickSwirl&&!p&&(g.x=m.x,g.y=m.y,g.age=0,w())},k=e=>{e.pointerType!==`mouse`&&(m.inside=!1)},A=()=>{m.inside=!1},j=()=>{b=0,w()},M=new ResizeObserver(T);M.observe(e);let I=new IntersectionObserver(e=>{x=e.some(e=>e.isIntersecting),x&&(b=0,w())});I.observe(e),window.addEventListener(`pointermove`,D,{passive:!0}),window.addEventListener(`pointerdown`,O,{passive:!0}),window.addEventListener(`pointerup`,k,{passive:!0}),window.addEventListener(`pointercancel`,k,{passive:!0}),document.documentElement.addEventListener(`pointerleave`,A),document.addEventListener(`visibilitychange`,j),T();let R=L.current.dpr;return F.current=()=>{let e=L.current;if(e.dpr!==R){R=e.dpr,T();return}y||S(),w()},()=>{cancelAnimationFrame(y),F.current=null,M.disconnect(),I.disconnect(),window.removeEventListener(`pointermove`,D),window.removeEventListener(`pointerdown`,O),window.removeEventListener(`pointerup`,k),window.removeEventListener(`pointercancel`,k),document.documentElement.removeEventListener(`pointerleave`,A),document.removeEventListener(`visibilitychange`,j),n.deleteProgram(r.program),n.deleteBuffer(a),n.deleteVertexArray(o),n.getExtension(`WEBGL_lose_context`)?.loseContext()}},[]),(0,r.useEffect)(()=>{F.current?.()}),(0,a.jsx)(`div`,{ref:N,className:`flux-lines-container${A?` ${A}`:``}`,style:k?{...j,mixBlendMode:k}:j,...M,children:(0,a.jsx)(`canvas`,{ref:P,className:`flux-lines-canvas`,"aria-hidden":`true`})})},m={ru:{nav_about:`Обо мне`,nav_skills:`Стек`,nav_interactive:`Интерактив`,nav_projects:`Проекты`,nav_contacts:`Контакты`,hero_subtitle:`Студент ВКТУ им. Д. Серикбаева.`,hero_btn:`Связаться со мной`,badge_name:`Крикуненко Данил`,badge_role:`Студент & Разработчик`,skills_title:`Стек технологий & Инструменты`,skills_subtitle:`Наведите на стикер для информации`,int_title:`Интерактивные модули`,int_subtitle:`Демонстрация работы скриптов в реальном времени`,card_term:`⌨️ Bash Terminal`,term_ready:`System ready. Type 'help' to see commands.`,card_hash:`🔐 SHA-256 Хеширование`,hash_desc:`Лавинный эффект в реальном времени.`,card_pass:`🛡️ Анализатор пароля`,pass_desc:`Оценка стойкости к брутфорсу.`,pass_short:`Слишком короткий`,card_css:`🎨 Live CSS Editor`,css_desc:`Введите цвет (например: #ff4444) для акцентов:`,css_btn:`Применить стиль`,card_game:`🎮 Мини-игра: Угадай число`,game_desc:`Компьютер загадал число от 1 до 50.`,game_btn:`Угадать`,game_msg:`Введите число и нажмите кнопку`,card_browser:`🕵️ Лог окружения (Browser Sniffer)`,browser_desc:`Авто-сбор расширенных данных о вашем устройстве:`,proj_title:`⚠️️ Все проекты утеряны!`,proj_desc:`Но весь необходимый функционал и мои навыки программирования вы можете оценить прямо здесь, в интерактивах выше! 🚀`,contacts_title:`Отправляйте мне письма!`,contacts_desc:`Я с радостью их прочитаю и отвечу.`,toast_email:`Email скопирован!`,toast_discord:`Discord скопирован!`,footer:`© 2026. Разработано для портфолио.`,roles:[`Software engineer_`,`System security_`,`Chill guy_`],tooltips:{python:`Python: Скрипты, криптография`,linux:`Linux: Информационная безопасность`,css:`CSS3: UI-дизайн и анимации`,matlab:`MATLAB & Simscape: Моделирование`,html:`HTML5: Верстка`,js:`JavaScript: Логика и интерактив`,react:`React: Компонентный UI`,node:`Node.js: Серверный JS`,ts:`TypeScript: Строгая типизация`,postgres:`PostgreSQL: Базы данных`,docker:`Docker: Контейнеризация`,nestjs:`NestJS: Бэкенд фреймворк`}},en:{nav_about:`About`,nav_skills:`Stack`,nav_interactive:`Interactive`,nav_projects:`Projects`,nav_contacts:`Contacts`,hero_subtitle:`Student at D. Serikbayev EKTU..`,hero_btn:`Contact Me`,badge_name:`Krikunenko Danil`,badge_role:`Student & Developer`,skills_title:`Tech Stack & Tools`,skills_subtitle:`Hover over a sticker for info`,int_title:`Interactive Modules`,int_subtitle:`Real-time script demonstration`,card_term:`⌨️ Bash Terminal`,term_ready:`System ready. Type 'help' to see commands.`,card_hash:`🔐 SHA-256 Hashing`,hash_desc:`Real-time avalanche effect.`,card_pass:`🛡️ Password Analyzer`,pass_desc:`Brute-force resistance evaluation.`,pass_short:`Too short`,card_css:`🎨 Live CSS Editor`,css_desc:`Enter a color (e.g. #ff4444) for accents:`,css_btn:`Apply Style`,card_game:`🎮 Mini-game: Guess the Number`,game_desc:`The computer picked a number from 1 to 50.`,game_btn:`Guess`,game_msg:`Enter a number and click the button`,card_browser:`🕵️️ Browser Environment Log`,browser_desc:`Auto-collection of extended device info:`,proj_title:`⚠️ All Projects Lost!`,proj_desc:`But you can evaluate all the necessary functionality and my programming skills right here, in the interactives above! 🚀`,contacts_title:`Send mail to my inbox!`,contacts_desc:`I will be happy to read them and answer.`,toast_email:`Email copied!`,toast_discord:`Discord copied!`,footer:`© 2026. Developed for portfolio.`,roles:[`Software engineer_`,`System security_`,`Chill guy_`],tooltips:{python:`Python: Scripts, cryptography`,linux:`Linux: Information security`,css:`CSS3: UI design & animations`,matlab:`MATLAB & Simscape: Modeling`,html:`HTML5: Markup`,js:`JavaScript: Logic & interactivity`,react:`React: Component UI`,node:`Node.js: Server-side JS`,ts:`TypeScript: Strict typing`,postgres:`PostgreSQL: Databases`,docker:`Docker: Containerization`,nestjs:`NestJS: Backend framework`}},kz:{nav_about:`Туралы`,nav_skills:`Стек`,nav_interactive:`Интерактив`,nav_projects:`Жобалар`,nav_contacts:`Байланыс`,hero_subtitle:`Д. Серікбаев атындағы ШҚТУ студенті.`,hero_btn:`Байланысу`,badge_name:`Крикуненко Данил`,badge_role:`Студент & Әзірлеуші`,skills_title:`Технологиялар стегі & Құралдар`,skills_subtitle:`Ақпарат алу үшін стикерге апартыңыз`,int_title:`Интерактивті модульдер`,int_subtitle:`Скрипттердің жұмысын нақты уақытта көрсету`,card_term:`⌨️ Bash Terminal`,term_ready:`System ready. Type 'help' to see commands.`,card_hash:`🔐 SHA-256 Хэштеу`,hash_desc:`Нақты уақыттағы лавинный эффект.`,card_pass:`🛡️ Құпиясөз анализаторы`,pass_desc:`Брутфорсқа төзімділікті бағалау.`,pass_short:`Тым қысқа`,card_css:`🎨 Live CSS Editor`,css_desc:`Акцент үшін түс енгізіңіз (мысалы: #ff4444):`,css_btn:`Стильді қолдану`,card_game:`🎮 Шағын ойын: Санды тап`,game_desc:`Компьютер 1 мен 50 арасында сан ойлады.`,game_btn:`Табу`,game_msg:`Санды енгізіп, батырманы басыңыз`,card_browser:`🕵 Орта туралы лог (Browser Sniffer)`,browser_desc:`Құрылғы туралы кеңейтілген деректерді жинау:`,proj_title:`⚠️ Барлық жобалар жоғалды!`,proj_desc:`Бірақ барлық қажетті функцияларды және менің бағдарламалау дағдыларымды жоғарыдағы интерактивтерде дәл осы жерде бағалай аласыз!🚀`,contacts_title:`Хаттарыңызды жіберіңіз!`,contacts_desc:`Оларды оқып, жауап беруге қуаныштымын.`,toast_email:`Email көшірілді!`,toast_discord:`Discord көшірілді!`,footer:`© 2026. Портфолио үшін әзірленді.`,roles:[`Software engineer_`,`System security_`,`Chill guy_`],tooltips:{python:`Python: Скриптер, криптография`,linux:`Linux: Ақпараттық қауіпсіздік`,css:`CSS3: UI дизайн және анимациялар`,matlab:`MATLAB & Simscape: Модельдеу`,html:`HTML5: Беттеу`,js:`JavaScript: Логика және интерактив`,react:`React: Компонентті UI`,node:`Node.js: Серверлік JS`,ts:`TypeScript: Қатаң типтеу`,postgres:`PostgreSQL: Деректер қоры`,docker:`Docker: Контейнерлеу`,nestjs:`NestJS: Бэкенд фреймворк`}}},h=`ru`,g=null,_=0,v=[];function y(){document.querySelectorAll(`[data-tippy]`).forEach(e=>{let t=e,n=t.dataset.tippy;n&&m[h]?.tooltips?.[n]&&(t.dataset.tooltip=m[h].tooltips[n])})}window.setLanguage=function(e,t){h=e,document.querySelectorAll(`.lang-btn`).forEach(e=>e.classList.remove(`active`)),t&&t.classList.add(`active`),document.querySelectorAll(`[data-i18n]`).forEach(e=>{let t=e,n=t.dataset.i18n;n&&m[h]?.[n]&&(t.textContent=m[h][n])}),document.querySelectorAll(`[data-tippy]`).forEach(e=>{let t=e,n=t.dataset.tippy;n&&m[h]?.tooltips?.[n]&&(t.dataset.tooltip=m[h].tooltips[n])})};function b(){g&&clearTimeout(g),v[_]||(_=0);let e=[...v[_]],t=function(){let n=document.querySelector(`#typed-output`);e.length>0&&n?(n.innerHTML+=e.shift(),g=setTimeout(t,100)):g=setTimeout(x,2e3)};t()}function x(){v[_]||(_=0);let e=[...v[_]],t=function(){let n=document.querySelector(`#typed-output`);e.length>0&&n?(e.pop(),n.innerHTML=e.join(``),g=setTimeout(t,50)):(v.length>_+1?_++:_=0,g=setTimeout(b,500))};t()}window.copyToClipboard=function(e,t){navigator.clipboard.writeText(e).then(()=>{let e=t.querySelector(`.copy-toast`);e?.classList.add(`show`),setTimeout(()=>{e?.classList.remove(`show`)},1500)})},document.addEventListener(`DOMContentLoaded`,()=>{v=m[h]?.roles||[`Software engineer_`,`System security_`,`Chill guy_`],y(),b()}),v=m[h].roles;var S=document.querySelector(`#typed-output`);S&&(S.innerHTML=``),window.copyToClipboard=function(e,t){navigator.clipboard.writeText(e).then(()=>{let e=t.querySelector(`.copy-toast`);e?.classList.add(`show`),setTimeout(()=>{e?.classList.remove(`show`)},1500)})};var C=document.querySelector(`#term-input`),w=document.querySelector(`#term-history`),T=document.querySelector(`#term-box`);C?.addEventListener(`keypress`,function(e){if(e.key===`Enter`){let e=this.value.trim().toLowerCase(),t=document.createElement(`div`);t.innerHTML=`<span class="term-prompt">user@vktu:~$</span> ${this.value}`,w?.append(t);let n=document.createElement(`div`);switch(n.style.color=`#8b949e`,e){case`help`:n.innerText=`Commands: help, about, skills, clear, matrix`;break;case`about`:n.innerText=`Student at EKTU. Major: Engineering & Cybersecurity.`;break;case`skills`:n.innerText=`[OK] Python, MATLAB, HTML5, CSS3, JS, Linux.`;break;case`clear`:w&&(w.innerHTML=``);break;case`matrix`:n.innerText=`Wake up, Neo... The Matrix has you.`,n.style.color=`#3fb950`;break;case``:break;default:n.innerText=`Command not found: ${e}`}e!==`clear`&&e!==``&&w&&w.appendChild(n),this.value=``,T&&(T.scrollTop=T.scrollHeight)}});var E=document.querySelector(`#hash-input`),D=document.querySelector(`#hash-output`);async function O(e){let t=new TextEncoder().encode(e),n=await crypto.subtle.digest(`SHA-256`,t),r=[...new Uint8Array(n)].map(e=>e.toString(16).padStart(2,`0`)).join(``);D&&(D.innerText=r)}E?.addEventListener(`input`,e=>O(e.target.value)),E&&O(E.value);var k=document.querySelector(`#pass-input`),A=document.querySelector(`#pass-fill`),j=document.querySelector(`#pass-text`);k?.addEventListener(`input`,e=>{let t=e.target.value,n=0;t.length>5&&n++,t.length>8&&n++,/[A-Z]/.test(t)&&n++,/[0-9]/.test(t)&&n++,/[^A-Za-z0-9]/.test(t)&&n++;let r=`#ff4444`,i=h===`kz`?`Тым әлсіз`:h===`en`?`Very weak`:`Очень слабый`,a=n/5*100;n===0&&t.length===0?a=0:n<=2?(r=`#ff4444`,i=h===`kz`?`Әлсіз құпиясөз`:h===`en`?`Weak password`:`Слабый пароль`):n===3||n===4?(r=`#f1e05a`,i=h===`kz`?`Орташа құпиясөз`:h===`en`?`Medium password`:`Средний пароль`):n>=5&&(r=`#3fb950`,i=h===`kz`?`Сенімді құпиясөз`:h===`en`?`Strong password`:`Надежный пароль`),A&&(A.style.width=a+`%`,A.style.backgroundColor=r),j&&(j.innerText=t.length===0?h===`kz`?`Құпиясөзді енгізіңіз`:h===`en`?`Enter password`:`Введите пароль`:i,j.style.color=r)});var M=document.querySelector(`#css-input`);document.querySelector(`#css-apply-btn`)?.addEventListener(`click`,()=>{let e=M?.value.trim();e&&(document.querySelectorAll(`.section-title, .badge-role`).forEach(t=>{t.style.color=e}),alert(`Стиль успешно применен!`))});var N=Math.floor(Math.random()*50)+1,P=document.querySelector(`#game-input`),F=document.querySelector(`#game-btn`),I=document.querySelector(`#game-msg`);F?.addEventListener(`click`,()=>{let e=Number.parseInt(P?.value);if(isNaN(e)){I&&(I.innerText=h===`kz`?`Сан енгізіңіз!`:h===`en`?`Enter a number!`:`Введите число!`);return}e===N?(I&&(I.innerText=h===`kz`?`🎉 Жеңіс! Жаңа сан ойланды!`:h===`en`?`🎉 Win! New number generated!`:`🎉 Победа! Число угадано. Новое загадано!`),N=Math.floor(Math.random()*50)+1):e<N?I&&(I.innerText=h===`kz`?`📈 Жоғарырақ!`:h===`en`?`📈 Go higher!`:`📈 Бери выше!`):I&&(I.innerText=h===`kz`?`📉 Төменірек!`:h===`en`?`📉 Go lower!`:`📉 Бери ниже!`)});var L=document.querySelector(`#browser-log`);setTimeout(()=>{let e=navigator.platform||`Unknown`,t=navigator.hardwareConcurrency?`${navigator.hardwareConcurrency} cores`:`N/A`,n=navigator.deviceMemory?`~${navigator.deviceMemory} GB`:`N/A`,r=`${window.screen.width}x${window.screen.height}`,i=Intl.DateTimeFormat().resolvedOptions().timeZone||`Unknown`,a=navigator.cookieEnabled?`Enabled`:`Disabled`,o=navigator.onLine?`Online`:`Offline`;L&&(L.innerHTML=`
            > OS Platform: ${e}<br>
            > CPU Cores: ${t}<br>
            > Est. RAM: ${n}<br>
            > Resolution: ${r}<br>
            > Language: ${h}<br>
            > Timezone: ${i}<br>
            > Cookies: ${a}<br>
            > Net Status: ${o}
        `)},300);var R=document.querySelector(`#counter-btn`),z=document.querySelector(`#counter-val`),B=47201815;R?.addEventListener(`click`,()=>{B++,z&&(z.innerText=B.toLocaleString().replace(/,/g,` `)),R&&(R.style.transform=`scale(1.1)`,setTimeout(()=>{R.style.transform=`scale(1)`},150))}),setInterval(()=>{B+=Math.floor(Math.random()*3)+1,z&&(z.innerText=B.toLocaleString().replace(/,/g,` `))},4e3);var V=document.querySelector(`#badge-wrapper`),H=document.querySelector(`#badge`);V?.addEventListener(`mousemove`,e=>{let t=V.getBoundingClientRect(),n=e.clientX-t.left,r=(e.clientY-t.top-t.height/2)/(t.height/2)*-15,i=(n-t.width/2)/(t.width/2)*15;H&&(H.style.transform=`rotateX(${r}deg) rotateY(${i}deg) scale3d(1.05, 1.05, 1.05)`)}),V?.addEventListener(`mouseleave`,()=>{H&&(H.style.transform=`rotateX(0) rotateY(0) scale3d(1, 1, 1)`,H.style.transition=`transform 0.5s ease-out`)}),V?.addEventListener(`mouseenter`,()=>{H&&(H.style.transition=`transform 0.1s ease-out`)});var U=document.querySelector(`#bg-canvas`),W=U?.getContext(`2d`),G,K,q=[];function J(){if(U){K=U.width=window.innerWidth,G=U.height=window.innerHeight,q=[];for(let e=0;e<50;e++)q.push({x:Math.random()*K,y:Math.random()*G-G,length:Math.random()*80+20,speed:Math.random()*3+1,color:Math.random()>.5?`rgba(88, 166, 255, `:`rgba(139, 148, 158, `})}}function Y(){W&&U&&(W.clearRect(0,0,K,G),q.forEach(e=>{W.beginPath();let t=W.createLinearGradient(e.x,e.y,e.x,e.y+e.length);t.addColorStop(0,`${e.color}0)`),t.addColorStop(1,`${e.color}0.5)`),W.strokeStyle=t,W.lineWidth=2,W.moveTo(e.x,e.y),W.lineTo(e.x,e.y+e.length),W.stroke(),e.y+=e.speed,e.y>G&&(e.y=-e.length,e.x=Math.random()*K);let n=document.getElementById(`spotlight-card`);n&&n.addEventListener(`mousemove`,e=>{let t=n.getBoundingClientRect(),r=e.clientX-t.left,i=e.clientY-t.top;n.style.setProperty(`--mouse-x`,`${r}px`),n.style.setProperty(`--mouse-y`,`${i}px`)})}),requestAnimationFrame(Y))}var X=document.getElementById(`color-bends-container`);X&&(0,i.createRoot)(X).render((0,r.createElement)(p,{colors:[`#58a6ff`,`#a371f7`,`#58a6ff`],glow:2,rimWidth:.2,lineWidth:1,flowDirection:`down`,mouseInteraction:!0,clickSwirl:!0}));for(var Z=document.querySelector(`.marquee-track`).querySelectorAll(`.marquee-group`);Z[0].scrollWidth<window.innerWidth;)Z[0].innerHTML+=Z[0].innerHTML;Z[1].innerHTML=Z[0].innerHTML;var Q=document.querySelector(`.marquee-container`);function $(){Q.style.setProperty(`--marquee-offset`,`0px`);let e=Q.getBoundingClientRect().left;Q.style.setProperty(`--marquee-offset`,`${e}px`)}window.addEventListener(`load`,$),window.addEventListener(`resize`,$),window.addEventListener(`resize`,J),J(),Y();