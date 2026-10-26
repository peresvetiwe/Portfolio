import{n as e,r as t,t as n}from"./react-BPeupeul.js";import{n as r,r as i,t as a}from"./vendor-3S7YnCpy.js";(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var o=t(),s=e(),c=n(),l=8,u=1.8,d={up:[0,1],down:[0,-1],left:[-1,0],right:[1,0]},f=`#version 300 es
in vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`,p=`#version 300 es
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
uniform vec3 uColors[${l}];
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
}`,m=(e,t,n)=>Math.min(n,Math.max(t,e)),h=(e,t,n)=>{let r=e.createShader(t);return r?(e.shaderSource(r,n),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(e.deleteShader(r),null)):null},g=e=>{let t=h(e,e.VERTEX_SHADER,f),n=h(e,e.FRAGMENT_SHADER,p),r=e.createProgram();if(!t||!n||!r)return null;if(e.attachShader(r,t),e.attachShader(r,n),e.bindAttribLocation(r,0,`aPosition`),e.linkProgram(r),e.deleteShader(t),e.deleteShader(n),!e.getProgramParameter(r,e.LINK_STATUS))return e.deleteProgram(r),null;let i={},a=e.getProgramParameter(r,e.ACTIVE_UNIFORMS);for(let t=0;t<a;t++){let n=e.getActiveUniform(r,t);n&&(i[n.name.replace(`[0]`,``)]=e.getUniformLocation(r,n.name))}return{program:r,uniforms:i}},_=({colors:e=[`#ffffff`,`#ffffff`,`#ffffff`],speed:t=.5,scale:n=1.6,turbulence:r=1,fluidity:i=.1,rimWidth:a=.2,sharpness:s=2.5,shimmer:f=1.5,glow:p=2,lineWidth:h=1,flowDirection:_=`down`,opacity:v=1,mouseInteraction:y=!0,mouseStrength:b=1,mouseRadius:x=.35,mouseDampening:S=.15,clickSwirl:C=!0,intro:w=!0,lightMode:T=!1,transparent:E=!0,backgroundColor:D,paused:O=!1,dpr:k,mixBlendMode:A,className:j=``,style:M,...N})=>{let P=(0,o.useRef)(null),ee=(0,o.useRef)(null),F=(0,o.useRef)(null),I={colors:Array.isArray(e)&&e.length?e.slice(0,l):[`#ffffff`],speed:t,scale:Math.max(.05,n),turbulence:r,fluidity:Math.max(.001,i),rimWidth:Math.max(.001,a),sharpness:Math.max(.1,s),shimmer:Math.max(0,f),glow:Math.max(0,p),lineWidth:Math.max(0,h),flow:d[_]??d.down,opacity:m(v,0,1),mouseInteraction:y,mouseStrength:Math.max(0,b),mouseRadius:Math.max(.01,x),mouseDampening:Math.max(0,S),clickSwirl:C,intro:w,lightMode:T,transparent:E,backgroundColor:D,paused:O,dpr:k},L=(0,o.useRef)(I);return L.current=I,(0,o.useEffect)(()=>{let e=P.current,t=ee.current,n=t?.getContext(`webgl2`,{alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1,stencil:!1});if(!e||!t||!n)return;let r=g(n);if(!r)return;let i=r.uniforms,a=n.createBuffer(),o=n.createVertexArray();n.bindVertexArray(o),n.bindBuffer(n.ARRAY_BUFFER,a),n.bufferData(n.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),n.STATIC_DRAW),n.enableVertexAttribArray(0),n.vertexAttribPointer(0,2,n.FLOAT,!1,0,0);let s=document.createElement(`canvas`).getContext(`2d`,{willReadFrequently:!0}),c=new Map,l=(e,t)=>{if(!e)return t;let n=String(e);if(c.has(n))return c.get(n);let r=t;if(s){s.clearRect(0,0,1,1),s.fillStyle=`#000000`,s.fillStyle=n,s.fillRect(0,0,1,1);let[e,t,i]=s.getImageData(0,0,1,1).data;r=[e/255,t/255,i/255]}return c.set(n,r),r},d=new Float32Array(24),f=window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches??!1,p={x:0,y:0,inside:!1},h={x:0,y:0,active:0},_={x:0,y:0,age:10},v=0,y=L.current.intro&&!f?0:1,b=0,x=0,S=!0,C=()=>{let a=L.current,s=t.width/Math.max(1,e.clientWidth);a.colors.forEach((e,t)=>d.set(l(e,[1,1,1]),t*3));let c=Math.min(1,y);n.viewport(0,0,t.width,t.height),n.useProgram(r.program),n.bindVertexArray(o),n.uniform2f(i.uResolution,t.width,t.height),n.uniform1f(i.uTime,v),n.uniform2f(i.uFlow,a.flow[0],a.flow[1]),n.uniform1f(i.uSpeed,a.speed),n.uniform1f(i.uScale,a.scale),n.uniform1f(i.uTurbulence,a.turbulence),n.uniform1f(i.uFluidity,a.fluidity),n.uniform1f(i.uRimWidth,a.rimWidth),n.uniform1f(i.uSharpness,a.sharpness),n.uniform1f(i.uShimmer,a.shimmer),n.uniform1f(i.uGlow,a.glow),n.uniform1f(i.uLine,a.lineWidth*s*.5),n.uniform1f(i.uMaxHalf,28*s),n.uniform3fv(i.uColors,d),n.uniform1i(i.uColorCount,a.colors.length),n.uniform4f(i.uMagnet,h.x,h.y,h.active*a.mouseStrength,a.mouseRadius);let u=_.age,f=1.9*Math.min(1,u/.23)*Math.exp(-Math.max(0,u-.23)*1.1);n.uniform4f(i.uSwirl,_.x,_.y,t.height*.22*(1+u*.5),u<6?f:0),n.uniform1f(i.uReveal,c*c*(3-2*c)),n.uniform1f(i.uLight,+!!a.lightMode),n.uniform1f(i.uOpaque,+!a.transparent),n.uniform3fv(i.uBackground,l(a.backgroundColor,a.lightMode?[1,1,1]:[.0706,.0588,.0902])),n.uniform1f(i.uOpacity,a.opacity),n.drawArrays(n.TRIANGLES,0,3)},w=e=>{if(b=0,!S||document.hidden)return;let t=L.current,n=x?m((e-x)/1e3,5e-4,.05):1/60;x=e;let r=t.paused||f?0:1;v+=n*r,_.age+=n,t.intro&&!f&&y<1?y=Math.min(1,y+n/u):(!t.intro||f)&&(y=1);let i=t.mouseInteraction&&p.inside,a=t.mouseDampening>0?1-Math.exp(-n/t.mouseDampening):1;i&&(h.x+=(p.x-h.x)*a,h.y+=(p.y-h.y)*a);let o=+!!i;h.active+=(o-h.active)*(1-Math.exp(-n/.3)),Math.abs(o-h.active)<.001&&(h.active=o),C(),r>0||h.active!==o||y<1||_.age<6?b=requestAnimationFrame(w):x=0},T=()=>{!b&&S&&!document.hidden&&(b=requestAnimationFrame(w))},E=()=>{let n=L.current,r=Math.max(1,e.clientWidth),i=Math.max(1,e.clientHeight),a=Math.min(n.dpr||window.devicePixelRatio||1,2);t.width=Math.max(1,Math.round(r*a)),t.height=Math.max(1,Math.round(i*a)),C(),T()},D=n=>{let r=e.getBoundingClientRect(),i=n.clientX-r.left,a=n.clientY-r.top,o=t.width/Math.max(1,r.width);p.inside=i>=0&&a>=0&&i<=r.width&&a<=r.height,p.x=i*o,p.y=(r.height-a)*o},O=e=>{let t=p.inside;D(e),p.inside&&!t&&h.active<.05&&(h.x=p.x,h.y=p.y),T()},k=e=>{O(e),p.inside&&L.current.clickSwirl&&!f&&(_.x=p.x,_.y=p.y,_.age=0,T())},A=e=>{e.pointerType!==`mouse`&&(p.inside=!1)},j=()=>{p.inside=!1},M=()=>{x=0,T()},N=new ResizeObserver(E);N.observe(e);let I=new IntersectionObserver(e=>{S=e.some(e=>e.isIntersecting),S&&(x=0,T())});I.observe(e),window.addEventListener(`pointermove`,O,{passive:!0}),window.addEventListener(`pointerdown`,k,{passive:!0}),window.addEventListener(`pointerup`,A,{passive:!0}),window.addEventListener(`pointercancel`,A,{passive:!0}),document.documentElement.addEventListener(`pointerleave`,j),document.addEventListener(`visibilitychange`,M),E();let R=L.current.dpr;return F.current=()=>{let e=L.current;if(e.dpr!==R){R=e.dpr,E();return}b||C(),T()},()=>{cancelAnimationFrame(b),F.current=null,N.disconnect(),I.disconnect(),window.removeEventListener(`pointermove`,O),window.removeEventListener(`pointerdown`,k),window.removeEventListener(`pointerup`,A),window.removeEventListener(`pointercancel`,A),document.documentElement.removeEventListener(`pointerleave`,j),document.removeEventListener(`visibilitychange`,M),n.deleteProgram(r.program),n.deleteBuffer(a),n.deleteVertexArray(o),n.getExtension(`WEBGL_lose_context`)?.loseContext()}},[]),(0,o.useEffect)(()=>{F.current?.()}),(0,c.jsx)(`div`,{ref:P,className:`flux-lines-container${j?` ${j}`:``}`,style:A?{...M,mixBlendMode:A}:M,...N,children:(0,c.jsx)(`canvas`,{ref:ee,className:`flux-lines-canvas`,"aria-hidden":`true`})})},v={ru:{nav_about:`Обо мне`,nav_skills:`Стек`,nav_interactive:`Интерактив`,nav_projects:`Проекты`,nav_contacts:`Контакты`,hero_subtitle:`Студент ВКТУ им. Д. Серикбаева.`,hero_btn:`Связаться со мной`,badge_name:`Крикуненко Данил`,badge_role:`Студент & Разработчик`,skills_title:`Стек технологий & Инструменты`,skills_subtitle:`Наведите на стикер для информации`,int_title:`Интерактивные модули`,int_subtitle:`Демонстрация работы скриптов в реальном времени`,card_term:`⌨️ Bash Terminal`,term_ready:`System ready. Type 'help' to see commands.`,card_hash:`🔐 SHA-256 Хеширование`,hash_desc:`Лавинный эффект в реальном времени.`,card_pass:`🛡️ Анализатор пароля`,pass_desc:`Оценка стойкости к брутфорсу.`,pass_short:`Слишком короткий`,card_css:`🎨 Live CSS Editor`,css_desc:`Введите цвет (например: #ff4444) для акцентов:`,css_btn:`Применить стиль`,card_game:`🎮 Мини-игра: Угадай число`,game_desc:`Компьютер загадал число от 1 до 50.`,game_btn:`Угадать`,game_msg:`Введите число и нажмите кнопку`,card_browser:`🕵️ Лог окружения (Browser Sniffer)`,browser_desc:`Авто-сбор расширенных данных о вашем устройстве:`,proj_title:`⚠️️ Все проекты утеряны!`,proj_desc:`Но весь необходимый функционал и мои навыки программирования вы можете оценить прямо здесь, в интерактивах выше! 🚀`,contacts_title:`Отправляйте мне письма!`,contacts_desc:`Я с радостью их прочитаю и отвечу.`,toast_email:`Email скопирован!`,toast_discord:`Discord скопирован!`,footer:`© 2026. Разработано для портфолио.`,roles:[`Software engineer_`,`System security_`,`Chill guy_`],tooltips:{python:`Python: Скрипты, криптография`,linux:`Linux: Информационная безопасность`,css:`CSS3: UI-дизайн и анимации`,matlab:`MATLAB & Simscape: Моделирование`,html:`HTML5: Верстка`,js:`JavaScript: Логика и интерактив`,react:`React: Компонентный UI`,node:`Node.js: Серверный JS`,ts:`TypeScript: Строгая типизация`,postgres:`PostgreSQL: Базы данных`,docker:`Docker: Контейнеризация`,nestjs:`NestJS: Бэкенд фреймворк`}},en:{nav_about:`About`,nav_skills:`Stack`,nav_interactive:`Interactive`,nav_projects:`Projects`,nav_contacts:`Contacts`,hero_subtitle:`Student at D. Serikbayev EKTU..`,hero_btn:`Contact Me`,badge_name:`Krikunenko Danil`,badge_role:`Student & Developer`,skills_title:`Tech Stack & Tools`,skills_subtitle:`Hover over a sticker for info`,int_title:`Interactive Modules`,int_subtitle:`Real-time script demonstration`,card_term:`⌨️ Bash Terminal`,term_ready:`System ready. Type 'help' to see commands.`,card_hash:`🔐 SHA-256 Hashing`,hash_desc:`Real-time avalanche effect.`,card_pass:`🛡️ Password Analyzer`,pass_desc:`Brute-force resistance evaluation.`,pass_short:`Too short`,card_css:`🎨 Live CSS Editor`,css_desc:`Enter a color (e.g. #ff4444) for accents:`,css_btn:`Apply Style`,card_game:`🎮 Mini-game: Guess the Number`,game_desc:`The computer picked a number from 1 to 50.`,game_btn:`Guess`,game_msg:`Enter a number and click the button`,card_browser:`🕵️️ Browser Environment Log`,browser_desc:`Auto-collection of extended device info:`,proj_title:`⚠️ All Projects Lost!`,proj_desc:`But you can evaluate all the necessary functionality and my programming skills right here, in the interactives above! 🚀`,contacts_title:`Send mail to my inbox!`,contacts_desc:`I will be happy to read them and answer.`,toast_email:`Email copied!`,toast_discord:`Discord copied!`,footer:`© 2026. Developed for portfolio.`,roles:[`Software engineer_`,`System security_`,`Chill guy_`],tooltips:{python:`Python: Scripts, cryptography`,linux:`Linux: Information security`,css:`CSS3: UI design & animations`,matlab:`MATLAB & Simscape: Modeling`,html:`HTML5: Markup`,js:`JavaScript: Logic & interactivity`,react:`React: Component UI`,node:`Node.js: Server-side JS`,ts:`TypeScript: Strict typing`,postgres:`PostgreSQL: Databases`,docker:`Docker: Containerization`,nestjs:`NestJS: Backend framework`}},kz:{nav_about:`Туралы`,nav_skills:`Стек`,nav_interactive:`Интерактив`,nav_projects:`Жобалар`,nav_contacts:`Байланыс`,hero_subtitle:`Д. Серікбаев атындағы ШҚТУ студенті.`,hero_btn:`Байланысу`,badge_name:`Крикуненко Данил`,badge_role:`Студент & Әзірлеуші`,skills_title:`Технологиялар стегі & Құралдар`,skills_subtitle:`Ақпарат алу үшін стикерге апартыңыз`,int_title:`Интерактивті модульдер`,int_subtitle:`Скрипттердің жұмысын нақты уақытта көрсету`,card_term:`⌨️ Bash Terminal`,term_ready:`System ready. Type 'help' to see commands.`,card_hash:`🔐 SHA-256 Хэштеу`,hash_desc:`Нақты уақыттағы лавинный эффект.`,card_pass:`🛡️ Құпиясөз анализаторы`,pass_desc:`Брутфорсқа төзімділікті бағалау.`,pass_short:`Тым қысқа`,card_css:`🎨 Live CSS Editor`,css_desc:`Акцент үшін түс енгізіңіз (мысалы: #ff4444):`,css_btn:`Стильді қолдану`,card_game:`🎮 Шағын ойын: Санды тап`,game_desc:`Компьютер 1 мен 50 арасында сан ойлады.`,game_btn:`Табу`,game_msg:`Санды енгізіп, батырманы басыңыз`,card_browser:`🕵 Орта туралы лог (Browser Sniffer)`,browser_desc:`Құрылғы туралы кеңейтілген деректерді жинау:`,proj_title:`⚠️ Барлық жобалар жоғалды!`,proj_desc:`Бірақ барлық қажетті функцияларды және менің бағдарламалау дағдыларымды жоғарыдағы интерактивтерде дәл осы жерде бағалай аласыз!🚀`,contacts_title:`Хаттарыңызды жіберіңіз!`,contacts_desc:`Оларды оқып, жауап беруге қуаныштымын.`,toast_email:`Email көшірілді!`,toast_discord:`Discord көшірілді!`,footer:`© 2026. Портфолио үшін әзірленді.`,roles:[`Software engineer_`,`System security_`,`Chill guy_`],tooltips:{python:`Python: Скриптер, криптография`,linux:`Linux: Ақпараттық қауіпсіздік`,css:`CSS3: UI дизайн және анимациялар`,matlab:`MATLAB & Simscape: Модельдеу`,html:`HTML5: Беттеу`,js:`JavaScript: Логика және интерактив`,react:`React: Компонентті UI`,node:`Node.js: Серверлік JS`,ts:`TypeScript: Қатаң типтеу`,postgres:`PostgreSQL: Деректер қоры`,docker:`Docker: Контейнерлеу`,nestjs:`NestJS: Бэкенд фреймворк`}}},y={dark:{"--rc-base":`#1d1c22`,"--rc-shadow":`0 22px 44px -20px rgba(0, 0, 0, 0.8), 0 6px 16px -8px rgba(0, 0, 0, 0.5)`,"--rc-ink":`#f4f4f5`,"--rc-muted":`rgba(244, 244, 245, 0.6)`,"--rc-tile":`linear-gradient(180deg, #3a3644 0%, #27242f 100%)`,"--rc-tile-edge":`rgba(255, 255, 255, 0.07)`,"--rc-tile-highlight":`rgba(255, 255, 255, 0.12)`,"--rc-tile-shadow":`0 4px 10px -4px rgba(0, 0, 0, 0.7)`,"--rc-rim":`rgba(255, 255, 255, 0.07)`,"--rc-rim-highlight":`rgba(255, 255, 255, 0.1)`},light:{"--rc-base":`#e7e7ea`,"--rc-shadow":`0 22px 44px -22px rgba(24, 24, 27, 0.3), 0 6px 16px -10px rgba(24, 24, 27, 0.16)`,"--rc-ink":`#18181b`,"--rc-muted":`rgba(24, 24, 27, 0.6)`,"--rc-tile":`linear-gradient(180deg, #ffffff 0%, #f6f6f8 100%)`,"--rc-tile-edge":`rgba(24, 24, 27, 0.08)`,"--rc-tile-highlight":`rgba(255, 255, 255, 1)`,"--rc-tile-shadow":`0 4px 10px -5px rgba(24, 24, 27, 0.25)`,"--rc-rim":`rgba(24, 24, 27, 0.08)`,"--rc-rim-highlight":`rgba(255, 255, 255, 0.8)`}},b=900,x=1.2,S=1400,C=.35,w=`#version 300 es
in vec2 aPosition;
out vec2 vUv;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`,T=`#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D uVideo;
uniform sampler2D uCam;
uniform vec4 uVideoMap;
uniform vec4 uCamMap;
uniform vec2 uWeights;
uniform vec2 uLod;
float level(sampler2D source) {
  vec3 mean = pow(textureLod(source, vec2(0.5), 14.0).rgb, vec3(2.2));
  return pow(dot(mean, vec3(0.2126, 0.7152, 0.0722)), 1.0 / 2.2);
}
void main() {
  vec3 color = vec3(0.0);
  float mean = 0.0;
  if (uWeights.x > 0.0) {
    color += textureLod(uVideo, vUv * uVideoMap.xy + uVideoMap.zw, uLod.x).rgb * uWeights.x;
    mean += level(uVideo) * uWeights.x;
  }
  if (uWeights.y > 0.0) {
    color += textureLod(uCam, vUv * uCamMap.xy + uCamMap.zw, uLod.y).rgb * uWeights.y;
    mean += level(uCam) * uWeights.y;
  }
  fragColor = vec4(color, mean);
}`,E=`#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D uTexture;
uniform vec2 uStep;
uniform float uSigma;
void main() {
  vec4 sum = texture(uTexture, vUv);
  if (uSigma < 0.35) {
    fragColor = sum;
    return;
  }
  float falloff = -0.5 / (uSigma * uSigma);
  int radius = int(min(ceil(uSigma * 2.8), 40.0));
  float total = 1.0;
  for (int i = 1; i <= 40; i++) {
    if (i > radius) break;
    float offset = float(i);
    float weight = exp(offset * offset * falloff);
    sum += (texture(uTexture, vUv + uStep * offset) + texture(uTexture, vUv - uStep * offset)) * weight;
    total += 2.0 * weight;
  }
  fragColor = sum / total;
}`,D=`#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uEnv;
uniform vec2 uEnvSize;
uniform vec2 uSize;
uniform float uRadius;
uniform float uScale;
uniform mat3 uRotate;
uniform float uCapture;
uniform float uBlur;
uniform float uRough;
uniform float uMetal;
uniform vec3 uTint;
uniform float uGray;
uniform float uWarp;
uniform float uWarpScale;
uniform float uShine;
uniform float uBevel;
uniform float uGlare;
uniform vec2 uPointer;
uniform float uTheme;

const float VIEW = ${b.toFixed(1)};
const float OVERSCAN = ${x.toFixed(2)};
const float CONTENT = 46.0;

float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

vec2 hash2(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.103, 0.0973));
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.xx + p3.yz) * p3.zy) * 2.0 - 1.0;
}

vec3 gradientNoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  vec2 du = 30.0 * f * f * (f * (f - 2.0) + 1.0);
  vec2 ga = hash2(i);
  vec2 gb = hash2(i + vec2(1.0, 0.0));
  vec2 gc = hash2(i + vec2(0.0, 1.0));
  vec2 gd = hash2(i + vec2(1.0, 1.0));
  float va = dot(ga, f);
  float vb = dot(gb, f - vec2(1.0, 0.0));
  float vc = dot(gc, f - vec2(0.0, 1.0));
  float vd = dot(gd, f - vec2(1.0, 1.0));
  float k = va - vb - vc + vd;
  float value = va + u.x * (vb - va) + u.y * (vc - va) + u.x * u.y * k;
  vec2 slope = ga + u.x * (gb - ga) + u.y * (gc - ga) + u.x * u.y * (ga - gb - gc + gd) + du * (u.yx * k + vec2(vb, vc) - va);
  return vec3(value, slope);
}

float valueNoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float erf(float x) {
  float x2 = x * x;
  return sign(x) * sqrt(1.0 - exp(-x2 * (1.2732395 + 0.147 * x2) / (1.0 + 0.147 * x2)));
}

float band(float x, float halfWidth, float sigma) {
  float s = 1.4142136 * max(sigma, 0.0001);
  return 0.5 * (erf((x + halfWidth) / s) - erf((x - halfWidth) / s));
}

float strip(vec2 q, vec2 center, vec2 dir, float halfWidth, vec2 sigma) {
  vec2 normal = vec2(-dir.y, dir.x);
  return band(dot(q - center, normal), halfWidth, length(sigma * normal));
}

const vec2 SWEEP = vec2(0.5, 0.86);
const vec3 LUMA = vec3(0.2126, 0.7152, 0.0722);

float softbox(vec2 q, vec2 sigma) {
  float key = strip(q, vec2(-0.1, -0.16), normalize(SWEEP), 0.022, sigma + 0.018);
  float top = band(q.y + 0.6, 0.12, sigma.y + 0.05);
  float side = band(q.x - 0.46, 0.05, sigma.x + 0.05);
  return key + top * 0.8 + side * 0.35;
}

float room(vec2 q, vec2 sigma) {
  float fall = smoothstep(-0.55, 0.5, q.y);
  float flag = strip(q, vec2(0.24, -0.02), normalize(SWEEP), 0.09, sigma + 0.08);
  return mix(0.85, 0.12, fall) * (1.0 - 0.6 * flag);
}

vec4 sampleEnv(vec2 uv) {
  vec2 st = uv * uEnvSize - 0.5;
  vec2 i = floor(st);
  vec2 f = st - i;
  vec2 f2 = f * f;
  vec2 f3 = f2 * f;
  vec2 w0 = (1.0 - 3.0 * f + 3.0 * f2 - f3) / 6.0;
  vec2 w1 = (4.0 - 6.0 * f2 + 3.0 * f3) / 6.0;
  vec2 w2 = (1.0 + 3.0 * f + 3.0 * f2 - 3.0 * f3) / 6.0;
  vec2 w3 = f3 / 6.0;
  vec2 g0 = w0 + w1;
  vec2 g1 = w2 + w3;
  vec2 c0 = (i + 0.5 + w1 / g0 - 1.0) / uEnvSize;
  vec2 c1 = (i + 0.5 + w3 / g1 + 1.0) / uEnvSize;
  vec4 a = texture(uEnv, c0) * g0.x + texture(uEnv, vec2(c1.x, c0.y)) * g1.x;
  vec4 b = texture(uEnv, vec2(c0.x, c1.y)) * g0.x + texture(uEnv, c1) * g1.x;
  return a * g0.y + b * g1.y;
}

vec3 toLinear(vec3 c) {
  return pow(max(c, 0.0), vec3(2.2));
}

void main() {
  vec2 p = vec2(vUv.x - 0.5, 0.5 - vUv.y) * uSize;
  vec2 halfSize = uSize * 0.5;
  float r = min(uRadius, min(halfSize.x, halfSize.y));
  vec2 corner = abs(p) - halfSize + r;
  vec2 side = vec2(p.x >= 0.0 ? 1.0 : -1.0, p.y >= 0.0 ? 1.0 : -1.0);
  float d;
  vec2 outward;
  if (corner.x > 0.0 && corner.y > 0.0) {
    d = length(corner) - r;
    outward = normalize(corner) * side;
  } else if (corner.x > corner.y) {
    d = corner.x - r;
    outward = vec2(side.x, 0.0);
  } else {
    d = corner.y - r;
    outward = vec2(0.0, side.y);
  }
  float coverage = clamp(0.5 - d * uScale, 0.0, 1.0);

  float chamferWidth = min(uBevel, max(r, 1.0));
  float chamfer = chamferWidth > 0.01 ? 1.0 - smoothstep(0.0, chamferWidth, -d) : 0.0;
  vec2 slope = outward * chamfer;

  vec2 wp = p / (220.0 * uWarpScale);
  vec3 w1 = gradientNoise(wp);
  vec3 w2 = gradientNoise(wp * 2.07 + 13.7);
  vec2 ripple = (w1.yz + w2.yz * 0.5) * uWarp;
  slope += ripple * 0.008;

  float grain = valueNoise(vec2(p.x * 0.008, p.y * 0.55)) * 0.45 + valueNoise(vec2(p.x * 0.019 + 3.7, p.y * 0.23)) * 0.35 + valueNoise(vec2(p.x * 0.004 + 9.2, p.y * 0.09)) * 0.2;
  float brush = uRough * uRough;
  slope.y += (grain - 0.5) * brush * 0.004;

  vec3 normal = uRotate * normalize(vec3(slope, 1.0));
  vec3 position = uRotate * vec3(p, 0.0);
  vec3 view = normalize(position - vec3(0.0, 0.0, VIEW));
  vec3 bounce = reflect(view, normal);
  vec2 q = bounce.xy / max(bounce.z, 0.2);

  vec2 footprint = fwidth(q);
  vec2 sigma = sqrt(vec2(uBlur / VIEW) * vec2(uBlur / VIEW) + footprint * footprint * 0.5);
  sigma += vec2(0.004, 0.05) * uRough;

  vec2 shift = clamp((q - p / VIEW) * CONTENT + ripple * 10.0, -uSize, uSize);
  vec2 cp = (p + shift) / (uSize * OVERSCAN);
  vec4 reflected = uCapture > 0.0 ? sampleEnv(vec2(0.5 + cp.x, 0.5 - cp.y)) : vec4(0.0, 0.0, 0.0, 1.0);
  vec3 captured = toLinear(reflected.rgb) * (0.5 / max(pow(reflected.a, 2.2), 0.02));
  captured = mix(vec3(dot(captured, LUMA)), captured, 1.0 - uGray);
  captured = pow(max(captured * 1.2, 0.0), vec3(mix(2.0, 1.5, uTheme)));

  vec3 scene = mix(vec3(room(q, sigma)), captured, uCapture * (1.0 - chamfer) * mix(1.0, 0.6, uTheme));
  scene *= 1.0 + (grain - 0.5) * brush * 0.3;

  vec2 toPointer = (uPointer - p) / (120.0 + uBlur * 4.0);
  vec2 spread = toPointer * vec2(1.0, 1.0 / (1.0 + 2.5 * uRough));
  float reach = dot(spread, spread);
  float glint = max(1.0 + 3.0 * dot(slope, toPointer), 0.0);
  float glare = (exp(-reach * 1.6) + exp(-reach * 0.35) * 0.15) * glint * uGlare * (1.0 + 0.8 * (grain - 0.5) * brush);
  float highlight = (softbox(q, sigma) * uShine + glare) * mix(0.4, 1.0, uMetal);

  vec3 dark = vec3(0.005, 0.005, 0.006) + uTint * (scene * 0.05 * uMetal + highlight * 0.36);
  vec3 light = uTint * (vec3(0.83, 0.83, 0.85) * (1.0 - 0.45 * uMetal * (1.0 - clamp(scene, 0.0, 1.0))) + highlight * 0.35);
  vec3 color = mix(dark, light, uTheme);
  color = min(color, 0.7) + 0.3 * (1.0 - exp(-max(color - 0.7, 0.0) / 0.3));
  color = pow(clamp(color, 0.0, 1.0), vec3(1.0 / 2.2));

  color += (hash(gl_FragCoord.xy) - 0.5) / 255.0;
  color = clamp(color, 0.0, 1.0);
  fragColor = vec4(color * coverage, coverage);
}`,O=(e,t,n)=>Math.min(n,Math.max(t,e)),k=e=>typeof e==`number`?`${e}px`:e,A=e=>{let t=String(e||``).trim(),n=/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(t);if(n){let e=n[1].length===3?n[1].replace(/./g,e=>e+e):n[1];return[0,2,4].map(t=>parseInt(e.slice(t,t+2),16)/255)}let r=/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/i.exec(t);return r?[r[1],r[2],r[3]].map(e=>O(parseFloat(e)/255,0,1)):[1,1,1]},j=(e,t,n)=>{let r=e.createShader(t);return r?(e.shaderSource(r,n),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(console.error(e.getShaderInfoLog(r)),e.deleteShader(r),null)):null},M=(e,t)=>{let n=j(e,e.VERTEX_SHADER,w),r=j(e,e.FRAGMENT_SHADER,t),i=n&&r?e.createProgram():null;if(!n||!r||!i)return n&&e.deleteShader(n),r&&e.deleteShader(r),null;if(e.attachShader(i,n),e.attachShader(i,r),e.bindAttribLocation(i,0,`aPosition`),e.linkProgram(i),e.deleteShader(n),e.deleteShader(r),!e.getProgramParameter(i,e.LINK_STATUS))return console.error(e.getProgramInfoLog(i)),e.deleteProgram(i),null;let a={},o=e.getProgramParameter(i,e.ACTIVE_UNIFORMS);for(let t=0;t<o;t++){let n=e.getActiveUniform(i,t);n&&(a[n.name]=e.getUniformLocation(i,n.name))}return{program:i,uniforms:a}},N=(e,t,n,r)=>{let i=e/Math.max(1,t),a=i>n?n/i:1,o=i>n?1:i/n,s=r?-a:a;return[s,-o,.5-s*.5,.5+o*.5]},P=(e,t,n,r)=>{let i=e/Math.max(1,t),a=e*(i>r?r/i:1);return Math.max(0,Math.log2(Math.max(1,a/Math.max(1,n)))-.5)},ee=e=>{let t=e.getContext(`webgl2`,{alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1,stencil:!1,powerPreference:`default`});if(!t)return null;let n=M(t,T),r=M(t,E),i=M(t,D);if(!n||!r||!i){for(let e of[n,r,i])e&&t.deleteProgram(e.program);return null}let a=(e,n)=>{let r=t.createTexture();return t.bindTexture(t.TEXTURE_2D,r),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,e?t.LINEAR_MIPMAP_LINEAR:t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,n),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,n),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,1,1,0,t.RGBA,t.UNSIGNED_BYTE,new Uint8Array([0,0,0,255])),r},o=()=>{let e=a(!1,t.MIRRORED_REPEAT),n=t.createFramebuffer();return t.bindFramebuffer(t.FRAMEBUFFER,n),t.framebufferTexture2D(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,e,0),t.bindFramebuffer(t.FRAMEBUFFER,null),{texture:e,framebuffer:n,width:1,height:1}},s=(e,n,r)=>{(e.width!==n||e.height!==r)&&(e.width=n,e.height=r,t.bindTexture(t.TEXTURE_2D,e.texture),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,n,r,0,t.RGBA,t.UNSIGNED_BYTE,null))},c=t.createVertexArray();t.bindVertexArray(c);let l=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,l),t.bufferData(t.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),t.STATIC_DRAW),t.enableVertexAttribArray(0),t.vertexAttribPointer(0,2,t.FLOAT,!1,0,0),t.disable(t.BLEND),t.disable(t.DEPTH_TEST);let u={video:a(!0,t.CLAMP_TO_EDGE),cam:a(!0,t.CLAMP_TO_EDGE)},d=o(),f=o(),p=o(),m=new Float32Array(9),h=(n,r)=>(t.bindFramebuffer(t.FRAMEBUFFER,n?n.framebuffer:null),t.viewport(0,0,n?n.width:e.width,n?n.height:e.height),t.useProgram(r.program),r.uniforms),g=(e,n)=>{t.activeTexture(t.TEXTURE0+e),t.bindTexture(t.TEXTURE_2D,n)};return{upload:(e,n)=>{try{return t.bindTexture(t.TEXTURE_2D,u[e]),t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,!1),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,t.RGBA,t.UNSIGNED_BYTE,n),t.generateMipmap(t.TEXTURE_2D),!0}catch{return!1}},renderEnv:({width:e,height:i,scale:a,blur:o,roughness:c,video:l,cam:m})=>{let _=O(2.5/Math.max(o,.01),.12,a),v=Math.max(8,Math.ceil(e*x*_)),y=Math.max(8,Math.ceil(i*x*_));s(d,v,y),s(f,v,y),s(p,v,y);let b=e/Math.max(1,i),S=1-(1-l.mix)*(1-m.mix),C=S>0?m.mix/S:0,w=h(d,n);g(0,u.video),g(1,u.cam),t.uniform1i(w.uVideo,0),t.uniform1i(w.uCam,1),t.uniform4fv(w.uVideoMap,l.ready?N(l.width,l.height,b,!1):[1,1,0,0]),t.uniform4fv(w.uCamMap,m.ready?N(m.width,m.height,b,!0):[1,1,0,0]),t.uniform2f(w.uWeights,l.ready&&S>0?1-C:0,m.ready?C:0),t.uniform2f(w.uLod,l.ready?P(l.width,l.height,v,b):0,m.ready?P(m.width,m.height,v,b):0),t.drawArrays(t.TRIANGLES,0,3),w=h(f,r),g(0,d.texture),t.uniform1i(w.uTexture,0),t.uniform2f(w.uStep,1/v,0),t.uniform1f(w.uSigma,o*_),t.drawArrays(t.TRIANGLES,0,3),w=h(p,r),g(0,f.texture),t.uniform1i(w.uTexture,0),t.uniform2f(w.uStep,0,1/y),t.uniform1f(w.uSigma,(o*(1+1.5*c)+10*c)*_),t.drawArrays(t.TRIANGLES,0,3)},renderPlate:({width:n,height:r,rotateX:a,rotateY:o,capture:s,glare:c,pointerX:l,pointerY:u,settings:d})=>{let f=Math.cos(a),_=Math.sin(a),v=Math.cos(o),y=Math.sin(o);m.set([v,_*y,-f*y,0,f,_,y,-_*v,f*v]);let b=h(null,i);g(0,p.texture),t.uniform1i(b.uEnv,0),t.uniform2f(b.uEnvSize,p.width,p.height),t.uniform2f(b.uSize,n,r),t.uniform1f(b.uRadius,d.radius),t.uniform1f(b.uScale,e.width/Math.max(1,n)),t.uniformMatrix3fv(b.uRotate,!1,m),t.uniform1f(b.uCapture,s),t.uniform1f(b.uBlur,d.blurStrength),t.uniform1f(b.uRough,d.roughness),t.uniform1f(b.uMetal,d.metalness),t.uniform3fv(b.uTint,d.tint),t.uniform1f(b.uGray,d.grayscale),t.uniform1f(b.uWarp,d.warp),t.uniform1f(b.uWarpScale,d.warpScale),t.uniform1f(b.uShine,d.shine),t.uniform1f(b.uBevel,d.bevel),t.uniform1f(b.uGlare,c),t.uniform2f(b.uPointer,l,u),t.uniform1f(b.uTheme,d.theme),t.drawArrays(t.TRIANGLES,0,3)},dispose:()=>{if(!t.isContextLost()){for(let e of[d,f,p])t.deleteFramebuffer(e.framebuffer),t.deleteTexture(e.texture);t.deleteTexture(u.video),t.deleteTexture(u.cam),t.deleteBuffer(l),t.deleteVertexArray(c);for(let e of[n,r,i])t.deleteProgram(e.program)}}}},F=(0,o.memo)(({name:e=`Alexander Doe`,role:t=`Senior Developer`,badge:n=`Verified`,status:s=`Active`,statusColor:l=`#22c55e`,idLabel:u=`ID number`,idValue:d=`8901 2345 6789`,children:f,theme:p=`dark`,videoSrc:m,webcam:h=!1,onWebcamError:g,tint:_=`#ffffff`,metalness:v=1,roughness:b=.3,blurStrength:x=6,grayscale:w=1,warp:T=.6,warpScale:E=1,shine:D=1,bevel:j=3,glare:M=.5,enableTilt:N=!0,tiltStrength:P=12,intro:F=!0,width:I=320,height:L=500,radius:R=24,className:z=``,style:B})=>{let te=(0,o.useRef)(null),ne=(0,o.useRef)(null),re=(0,o.useRef)(null),V=(0,o.useRef)(null),ie=(0,o.useRef)(null),H=(0,o.useRef)(null),U=(0,o.useRef)(g),[W,ae]=(0,o.useState)(0),G=p===`light`?`light`:`dark`,K={tint:A(_).map(e=>e**2.2),metalness:O(v,0,1),roughness:O(b,0,1),blurStrength:O(x,0,40),grayscale:O(w,0,1),warp:O(T,0,2),warpScale:O(E,.2,4),shine:O(D,0,3),bevel:O(j,0,16),glare:O(M,0,1),enableTilt:N,tiltStrength:O(P,0,30),radius:Math.max(0,R),theme:+(G===`light`),intro:F},q=(0,o.useRef)(K);q.current=K,U.current=g,(0,o.useEffect)(()=>{H.current?.()}),(0,o.useLayoutEffect)(()=>{let e=te.current;e&&q.current.intro&&(window.matchMedia(`(prefers-reduced-motion: reduce)`).matches||(e.style.setProperty(`--rc-presence`,`0`),e.style.setProperty(`--rc-lift`,`14px`)))},[]),(0,o.useEffect)(()=>{let e=te.current,t=ne.current,n=re.current,r=V.current,i=ie.current;if(!e||!t||!n||!r||!i)return;let a=window.matchMedia(`(prefers-reduced-motion: reduce)`).matches,o=ee(n),s={p:0,v:0,target:0},c={p:0,v:0,target:0},l={p:0,target:0},u={x:0,y:0},d={width:t.offsetWidth,height:t.offsetHeight,scale:1},f=e=>({element:e,src:``,time:-1,ready:!1,failed:!1,width:0,height:0,mix:0}),p={video:f(r),cam:f(i)},m=1,h=0,g=0,_=null,v=0,y=0,b=!0,x=document.visibilityState!==`hidden`,w=!1,T=``,E=!1,D=()=>{let{enableTilt:t,tiltStrength:n}=q.current,r=t&&!a?n:0,i=e.style;i.setProperty(`--rc-rotate-x`,`${(c.p*r).toFixed(3)}deg`),i.setProperty(`--rc-rotate-y`,`${(-s.p*r).toFixed(3)}deg`);let o=1-(1-m)**3;i.setProperty(`--rc-presence`,o.toFixed(4)),i.setProperty(`--rc-lift`,`${((1-o)*14).toFixed(2)}px`)},k=(e,t)=>{let n=t.element,r=n.srcObject?`stream`:n.currentSrc;if(r!==t.src&&(t.src=r,t.failed=!1,t.time=-1),!r)return t.ready=!1,!1;if(n.error)return t.failed=!0,!1;if(n.readyState<2||!n.videoWidth)return!1;let i=n.currentTime;return t.ready&&i===t.time?!1:!o||!o.upload(e,n)?(t.failed=!0,!1):(t.time=i,t.width=n.videoWidth,t.height=n.videoHeight,t.ready=!0,!0)},A=(e,t)=>{let n=e.ready&&!e.failed&&e.src?1:0,r=e.mix;return e.mix+=(n-e.mix)*(1-Math.exp(-t/C)),Math.abs(n-e.mix)<.002&&(e.mix=n),e.mix!==r},j=()=>{d.width=t.offsetWidth,d.height=t.offsetHeight,d.scale=Math.min(window.devicePixelRatio||1,2);let e=Math.max(1,Math.round(d.width*d.scale)),r=Math.max(1,Math.round(d.height*d.scale));(n.width!==e||n.height!==r)&&(n.width=e,n.height=r),E=!0},M=e=>{if(v=0,w)return;let t=Math.min(.05,(e-y)/1e3||0);y=e;let n=e<g,r=n?24:120,i=n?9:16,f=Math.max(1,Math.ceil(t/(1/120))),_=t/f;for(let e=0;e<f;e++)for(let e of[s,c])e.v+=(r*(e.target-e.p)-i*e.v)*_,e.p+=e.v*_;let S=l.target>l.p?.18:n?.9:.45;l.p+=(l.target-l.p)*(1-Math.exp(-t/S)),m<1&&(m=O((e-h)/650,0,1));let C=Math.abs(s.target-s.p)>5e-4||Math.abs(c.target-c.p)>5e-4||Math.abs(s.v)>5e-4||Math.abs(c.v)>5e-4||Math.abs(l.target-l.p)>.002||m<1;C||(s.p=s.target,c.p=c.target,s.v=0,c.v=0,l.p=l.target),D();let j=!1;if(o){p.cam.mix<1&&k(`video`,p.video)&&(E=!0),k(`cam`,p.cam)&&(E=!0);for(let e of[p.video,p.cam])e.src&&!e.failed&&!e.element.paused&&(j=!0),A(e,t)&&(E=!0),e.mix>0&&e.mix<1&&(j=!0);let e=q.current,n=`${e.blurStrength}|${e.roughness}|${d.width}|${d.height}|${d.scale}`;n!==T&&(T=n,E=!0),E&&(p.video.mix>0||p.cam.mix>0)&&o.renderEnv({width:d.width,height:d.height,scale:d.scale,blur:e.blurStrength,roughness:e.roughness,video:p.video,cam:p.cam}),E=!1;let r=(e.enableTilt&&!a?e.tiltStrength:0)*(Math.PI/180);o.renderPlate({width:d.width,height:d.height,rotateX:c.p*r,rotateY:-s.p*r,capture:1-(1-p.video.mix)*(1-p.cam.mix),glare:e.glare*l.p,pointerX:u.x,pointerY:u.y,settings:e})}(C||j)&&b&&x&&(v=requestAnimationFrame(M))},N=()=>{!v&&!w&&b&&x&&(y=performance.now(),v=requestAnimationFrame(M))};H.current=N;let P=(e,t,n=!0)=>{s.target=O(e,-1,1),c.target=O(t,-1,1),l.target=+!!n,g=0,N()},F=t=>{let n=e.getBoundingClientRect();if(!n.width||!n.height)return;let r=(t.clientX-n.left)/n.width*2-1,i=(t.clientY-n.top)/n.height*2-1;u.x=r*d.width*.5,u.y=i*d.height*.5,P(r,i)},I=()=>P(0,0,!1),L=e=>{e.pointerType===`mouse`&&F(e)},R=e=>{(e.pointerType===`mouse`||e.pointerId===_)&&F(e)},z=e=>{e.pointerType===`mouse`&&I()},B=e=>{e.pointerType!==`mouse`&&(_=e.pointerId,F(e))},U=e=>{e.pointerId===_&&(_=null,I())};e.addEventListener(`pointerenter`,L),e.addEventListener(`pointermove`,R),e.addEventListener(`pointerleave`,z),e.addEventListener(`pointerdown`,B),e.addEventListener(`pointerup`,U),e.addEventListener(`pointercancel`,U);let G=e=>{e.preventDefault(),w=!0,cancelAnimationFrame(v),v=0},K=()=>ae(e=>e+1);n.addEventListener(`webglcontextlost`,G),n.addEventListener(`webglcontextrestored`,K);let J=new ResizeObserver(()=>{j(),N()});J.observe(t),j();let oe=new IntersectionObserver(e=>{if(b=e.some(e=>e.isIntersecting),!a)for(let e of[r,i])b&&(e.currentSrc||e.srcObject)?e.play().catch(()=>{}):!b&&e.currentSrc&&!e.srcObject&&e.pause();N()});oe.observe(e);let Y=()=>{x=document.visibilityState!==`hidden`,N()};document.addEventListener(`visibilitychange`,Y);let se=()=>N(),ce=[`loadeddata`,`playing`,`seeked`,`emptied`,`error`];for(let e of[r,i])for(let t of ce)e.addEventListener(t,se);return q.current.intro&&!a&&W===0&&(s.p=.62,c.p=-.55,l.p=1,u.x=.62*d.width*.5,u.y=-.55*d.height*.5,m=0,h=performance.now(),g=performance.now()+S),D(),N(),()=>{cancelAnimationFrame(v),H.current=null,J.disconnect(),oe.disconnect(),document.removeEventListener(`visibilitychange`,Y),e.removeEventListener(`pointerenter`,L),e.removeEventListener(`pointermove`,R),e.removeEventListener(`pointerleave`,z),e.removeEventListener(`pointerdown`,B),e.removeEventListener(`pointerup`,U),e.removeEventListener(`pointercancel`,U),n.removeEventListener(`webglcontextlost`,G),n.removeEventListener(`webglcontextrestored`,K);for(let e of[r,i])for(let t of ce)e.removeEventListener(t,se);o?.dispose()}},[W]),(0,o.useEffect)(()=>{let e=V.current;if(e){if(!m){e.removeAttribute(`src`),e.load(),H.current?.();return}return e.src=m,window.matchMedia(`(prefers-reduced-motion: reduce)`).matches||e.play().catch(()=>{}),H.current?.(),()=>e.pause()}},[m]),(0,o.useEffect)(()=>{let e=ie.current;if(!h||!e)return;let t=navigator.mediaDevices;if(!t||!t.getUserMedia){U.current?.(Error(`Camera access is not available in this browser.`));return}let n=null,r=!1;return t.getUserMedia({video:{facingMode:`user`,width:{ideal:640},height:{ideal:480}},audio:!1}).then(t=>{if(r){t.getTracks().forEach(e=>e.stop());return}n=t,e.srcObject=t,e.play().catch(()=>{}),H.current?.()}).catch(e=>{r||U.current?.(e)}),()=>{r=!0,n?.getTracks().forEach(e=>e.stop()),e.srcObject=null,H.current?.()}},[h]);let J=Math.max(0,R),oe={...y[G],"--rc-width":k(I),"--rc-height":k(L),"--rc-radius":`${J}px`,"--rc-pad":`${Math.round(O(J*.8,16,22))}px`,"--rc-tile-radius":`${Math.round(O(J*.5,8,14))}px`,"--rc-status":l};return(0,c.jsxs)(`div`,{ref:te,className:`reflective-card ${z}`.trim(),style:{...oe,...B},children:[(0,c.jsxs)(`div`,{ref:ne,className:`reflective-card__body`,children:[(0,c.jsx)(`canvas`,{ref:re,className:`reflective-card__canvas`,"aria-hidden":`true`}),(0,c.jsx)(`div`,{className:`reflective-card__content`,children:f??(0,c.jsxs)(c.Fragment,{children:[(n||s)&&(0,c.jsxs)(`div`,{className:`reflective-card__header`,children:[n&&(0,c.jsxs)(`span`,{className:`reflective-card__badge`,children:[(0,c.jsx)(i,{icon:r,size:16,strokeWidth:1.8}),n]}),s&&(0,c.jsxs)(`span`,{className:`reflective-card__status`,children:[(0,c.jsx)(`span`,{className:`reflective-card__dot`}),s]})]}),(0,c.jsxs)(`div`,{className:`reflective-card__identity`,children:[e&&(0,c.jsx)(`h3`,{className:`reflective-card__name`,children:e}),t&&(0,c.jsx)(`p`,{className:`reflective-card__role`,children:t})]}),(u||d)&&(0,c.jsxs)(`div`,{className:`reflective-card__footer`,children:[(0,c.jsxs)(`div`,{className:`reflective-card__id`,children:[u&&(0,c.jsx)(`span`,{className:`reflective-card__label`,children:u}),d&&(0,c.jsx)(`span`,{className:`reflective-card__value`,children:d})]}),(0,c.jsx)(`span`,{className:`reflective-card__tile`,children:(0,c.jsx)(i,{icon:a,size:22,strokeWidth:1.6})})]})]})}),(0,c.jsx)(`span`,{className:`reflective-card__rim`})]}),(0,c.jsx)(`video`,{ref:V,className:`reflective-card__media`,muted:!0,loop:!0,playsInline:!0,crossOrigin:`anonymous`,"aria-hidden":`true`}),(0,c.jsx)(`video`,{ref:ie,className:`reflective-card__media`,muted:!0,playsInline:!0,"aria-hidden":`true`})]})}),I=document.getElementById(`badge-wrapper`);I&&(0,s.createRoot)(I).render((0,c.jsx)(F,{name:`Крикуненко Данил`,role:`Студент & Разработчик`,badge:`Verified`,status:`Online`,idLabel:`ВКТУ им. Д. Серикбаева`,idValue:`peresvetiwe`,width:320,height:460}));var L=`ru`,R=null,z=0,B=[];function te(){document.querySelectorAll(`[data-tippy]`).forEach(e=>{let t=e,n=t.dataset.tippy;n&&v[L]?.tooltips?.[n]&&(t.dataset.tooltip=v[L].tooltips[n])})}window.setLanguage=function(e,t){L=e,document.querySelectorAll(`.lang-btn`).forEach(e=>e.classList.remove(`active`)),t&&t.classList.add(`active`),document.querySelectorAll(`[data-i18n]`).forEach(e=>{let t=e,n=t.dataset.i18n;n&&v[L]?.[n]&&(t.textContent=v[L][n])}),document.querySelectorAll(`[data-tippy]`).forEach(e=>{let t=e,n=t.dataset.tippy;n&&v[L]?.tooltips?.[n]&&(t.dataset.tooltip=v[L].tooltips[n])})};function ne(){R&&clearTimeout(R),B[z]||(z=0);let e=[...B[z]],t=function(){let n=document.querySelector(`#typed-output`);e.length>0&&n?(n.innerHTML+=e.shift(),R=setTimeout(t,100)):R=setTimeout(re,2e3)};t()}function re(){B[z]||(z=0);let e=[...B[z]],t=function(){let n=document.querySelector(`#typed-output`);e.length>0&&n?(e.pop(),n.innerHTML=e.join(``),R=setTimeout(t,50)):(B.length>z+1?z++:z=0,R=setTimeout(ne,500))};t()}window.copyToClipboard=function(e,t){navigator.clipboard.writeText(e).then(()=>{let e=t.querySelector(`.copy-toast`);e?.classList.add(`show`),setTimeout(()=>{e?.classList.remove(`show`)},1500)})},document.addEventListener(`DOMContentLoaded`,()=>{B=v[L]?.roles||[`Software engineer_`,`System security_`,`Chill guy_`],te(),ne()}),B=v[L].roles;var V=document.querySelector(`#typed-output`);V&&(V.innerHTML=``),window.copyToClipboard=function(e,t){navigator.clipboard.writeText(e).then(()=>{let e=t.querySelector(`.copy-toast`);e?.classList.add(`show`),setTimeout(()=>{e?.classList.remove(`show`)},1500)})};var ie=document.querySelector(`#term-input`),H=document.querySelector(`#term-history`),U=document.querySelector(`#term-box`);ie?.addEventListener(`keypress`,function(e){if(e.key===`Enter`){let e=this.value.trim().toLowerCase(),t=document.createElement(`div`);t.innerHTML=`<span class="term-prompt">user@vktu:~$</span> ${this.value}`,H?.append(t);let n=document.createElement(`div`);switch(n.style.color=`#8b949e`,e){case`help`:n.innerText=`Commands: help, about, skills, clear, matrix`;break;case`about`:n.innerText=`Student at EKTU. Major: Engineering & Cybersecurity.`;break;case`skills`:n.innerText=`[OK] Python, MATLAB, HTML5, CSS3, JS, Linux.`;break;case`clear`:H&&(H.innerHTML=``);break;case`matrix`:n.innerText=`Wake up, Neo... The Matrix has you.`,n.style.color=`#3fb950`;break;case``:break;default:n.innerText=`Command not found: ${e}`}e!==`clear`&&e!==``&&H&&H.appendChild(n),this.value=``,U&&(U.scrollTop=U.scrollHeight)}});var W=document.querySelector(`#hash-input`),ae=document.querySelector(`#hash-output`);async function G(e){let t=new TextEncoder().encode(e),n=await crypto.subtle.digest(`SHA-256`,t),r=[...new Uint8Array(n)].map(e=>e.toString(16).padStart(2,`0`)).join(``);ae&&(ae.innerText=r)}W?.addEventListener(`input`,e=>G(e.target.value)),W&&G(W.value);var K=document.querySelector(`#pass-input`),q=document.querySelector(`#pass-fill`),J=document.querySelector(`#pass-text`);K?.addEventListener(`input`,e=>{let t=e.target.value,n=0;t.length>5&&n++,t.length>8&&n++,/[A-Z]/.test(t)&&n++,/[0-9]/.test(t)&&n++,/[^A-Za-z0-9]/.test(t)&&n++;let r=`#ff4444`,i=L===`kz`?`Тым әлсіз`:L===`en`?`Very weak`:`Очень слабый`,a=n/5*100;n===0&&t.length===0?a=0:n<=2?(r=`#ff4444`,i=L===`kz`?`Әлсіз құпиясөз`:L===`en`?`Weak password`:`Слабый пароль`):n===3||n===4?(r=`#f1e05a`,i=L===`kz`?`Орташа құпиясөз`:L===`en`?`Medium password`:`Средний пароль`):n>=5&&(r=`#3fb950`,i=L===`kz`?`Сенімді құпиясөз`:L===`en`?`Strong password`:`Надежный пароль`),q&&(q.style.width=a+`%`,q.style.backgroundColor=r),J&&(J.innerText=t.length===0?L===`kz`?`Құпиясөзді енгізіңіз`:L===`en`?`Enter password`:`Введите пароль`:i,J.style.color=r)});var oe=document.querySelector(`#css-input`);document.querySelector(`#css-apply-btn`)?.addEventListener(`click`,()=>{let e=oe?.value.trim();e&&(document.querySelectorAll(`.section-title, .badge-role`).forEach(t=>{t.style.color=e}),alert(`Стиль успешно применен!`))});var Y=Math.floor(Math.random()*50)+1,se=document.querySelector(`#game-input`),ce=document.querySelector(`#game-btn`),X=document.querySelector(`#game-msg`);ce?.addEventListener(`click`,()=>{let e=Number.parseInt(se?.value);if(isNaN(e)){X&&(X.innerText=L===`kz`?`Сан енгізіңіз!`:L===`en`?`Enter a number!`:`Введите число!`);return}e===Y?(X&&(X.innerText=L===`kz`?`🎉 Жеңіс! Жаңа сан ойланды!`:L===`en`?`🎉 Win! New number generated!`:`🎉 Победа! Число угадано. Новое загадано!`),Y=Math.floor(Math.random()*50)+1):e<Y?X&&(X.innerText=L===`kz`?`📈 Жоғарырақ!`:L===`en`?`📈 Go higher!`:`📈 Бери выше!`):X&&(X.innerText=L===`kz`?`📉 Төменірек!`:L===`en`?`📉 Go lower!`:`📉 Бери ниже!`)});var le=document.querySelector(`#browser-log`);setTimeout(()=>{let e=navigator.platform||`Unknown`,t=navigator.hardwareConcurrency?`${navigator.hardwareConcurrency} cores`:`N/A`,n=navigator.deviceMemory?`~${navigator.deviceMemory} GB`:`N/A`,r=`${window.screen.width}x${window.screen.height}`,i=Intl.DateTimeFormat().resolvedOptions().timeZone||`Unknown`,a=navigator.cookieEnabled?`Enabled`:`Disabled`,o=navigator.onLine?`Online`:`Offline`;le&&(le.innerHTML=`
            > OS Platform: ${e}<br>
            > CPU Cores: ${t}<br>
            > Est. RAM: ${n}<br>
            > Resolution: ${r}<br>
            > Language: ${L}<br>
            > Timezone: ${i}<br>
            > Cookies: ${a}<br>
            > Net Status: ${o}
        `)},300);var ue=document.querySelector(`#counter-btn`),de=document.querySelector(`#counter-val`),fe=47201815;ue?.addEventListener(`click`,()=>{fe++,de&&(de.innerText=fe.toLocaleString().replace(/,/g,` `)),ue&&(ue.style.transform=`scale(1.1)`,setTimeout(()=>{ue.style.transform=`scale(1)`},150))}),setInterval(()=>{fe+=Math.floor(Math.random()*3)+1,de&&(de.innerText=fe.toLocaleString().replace(/,/g,` `))},4e3);var pe=document.querySelector(`#badge-wrapper`),Z=document.querySelector(`#badge`);pe?.addEventListener(`mousemove`,e=>{let t=pe.getBoundingClientRect(),n=e.clientX-t.left,r=(e.clientY-t.top-t.height/2)/(t.height/2)*-15,i=(n-t.width/2)/(t.width/2)*15;Z&&(Z.style.transform=`rotateX(${r}deg) rotateY(${i}deg) scale3d(1.05, 1.05, 1.05)`)}),pe?.addEventListener(`mouseleave`,()=>{Z&&(Z.style.transform=`rotateX(0) rotateY(0) scale3d(1, 1, 1)`,Z.style.transition=`transform 0.5s ease-out`)}),pe?.addEventListener(`mouseenter`,()=>{Z&&(Z.style.transition=`transform 0.1s ease-out`)});var Q=document.querySelector(`#bg-canvas`),$=Q?.getContext(`2d`),me,he,ge=[];function _e(){if(Q){he=Q.width=window.innerWidth,me=Q.height=window.innerHeight,ge=[];for(let e=0;e<50;e++)ge.push({x:Math.random()*he,y:Math.random()*me-me,length:Math.random()*80+20,speed:Math.random()*3+1,color:Math.random()>.5?`rgba(88, 166, 255, `:`rgba(139, 148, 158, `})}}function ve(){$&&Q&&($.clearRect(0,0,he,me),ge.forEach(e=>{$.beginPath();let t=$.createLinearGradient(e.x,e.y,e.x,e.y+e.length);t.addColorStop(0,`${e.color}0)`),t.addColorStop(1,`${e.color}0.5)`),$.strokeStyle=t,$.lineWidth=2,$.moveTo(e.x,e.y),$.lineTo(e.x,e.y+e.length),$.stroke(),e.y+=e.speed,e.y>me&&(e.y=-e.length,e.x=Math.random()*he);let n=document.getElementById(`spotlight-card`);n&&n.addEventListener(`mousemove`,e=>{let t=n.getBoundingClientRect(),r=e.clientX-t.left,i=e.clientY-t.top;n.style.setProperty(`--mouse-x`,`${r}px`),n.style.setProperty(`--mouse-y`,`${i}px`)})}),requestAnimationFrame(ve))}var ye=document.getElementById(`color-bends-container`);ye&&(0,s.createRoot)(ye).render((0,o.createElement)(_,{colors:[`#58a6ff`,`#a371f7`,`#58a6ff`],glow:2,rimWidth:.2,lineWidth:1,flowDirection:`down`,mouseInteraction:!0,clickSwirl:!0}));for(var be=document.querySelector(`.marquee-track`).querySelectorAll(`.marquee-group`);be[0].scrollWidth<window.innerWidth;)be[0].innerHTML+=be[0].innerHTML;be[1].innerHTML=be[0].innerHTML,document.querySelector(`.marquee-container`),window.addEventListener(`load`,alignMarquee),window.addEventListener(`resize`,alignMarquee);var xe=document.querySelector(`.laptop-lid`);xe?.addEventListener(`mousemove`,e=>{let t=xe.getBoundingClientRect();xe.style.setProperty(`--mx`,`${e.clientX-t.left}px`),xe.style.setProperty(`--my`,`${e.clientY-t.top}px`)}),window.addEventListener(`resize`,_e),_e(),ve();