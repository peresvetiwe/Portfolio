import './index.css'


let currentLang = 'ru';
let timer: any = null;
let i = 0;
let j = 0;
let isDeleting = false;
let words: string[] = [];

const translations: Record<string, any> = {
  ru: {
    nav_about: 'Обо мне',
    nav_skills: 'Стек',
    nav_interactive: 'Интерактив',
    nav_projects: 'Проекты',
    nav_contacts: 'Контакты',
    hero_subtitle:
      'Студент ВКТУ им. Д. Серикбаева.',
    hero_btn: 'Связаться со мной',
    badge_name: 'Крикуненко Данил',
    badge_role: 'Студент & Разработчик',
    skills_title: 'Стек технологий & Инструменты',
    skills_subtitle: 'Наведите на стикер для информации',
    int_title: 'Интерактивные модули (JS & ИБ)',
    int_subtitle: 'Демонстрация работы скриптов в реальном времени',
    card_term: '⌨️ Bash Terminal',
    term_ready: "System ready. Type 'help' to see commands.",
    card_hash: '🔐 SHA-256 Хеширование',
    hash_desc: 'Лавинный эффект в реальном времени.',
    card_pass: '🛡️ Анализатор пароля',
    pass_desc: 'Оценка стойкости к брутфорсу.',
    pass_short: 'Слишком короткий',
    card_css: '🎨 Live CSS Editor',
    css_desc: 'Введите цвет (например: #ff4444) для акцентов:',
    css_btn: 'Применить стиль',
    card_game: '🎮 Мини-игра: Угадай число',
    game_desc: 'Компьютер загадал число от 1 до 50.',
    game_btn: 'Угадать',
    game_msg: 'Введите число и нажмите кнопку',
    card_browser: '🕵️ Лог окружения (Browser Sniffer)',
    browser_desc: 'Авто-сбор расширенных данных о вашем устройстве:',
    proj_title: '⚠️️ Все проекты утеряны!',
    proj_desc:
      'Но весь необходимый функционал и мои навыки программирования вы можете оценить прямо здесь, в интерактивах выше! 🚀',
    contacts_title: 'Отправляйте мне письма!',
    contacts_desc: 'Я с радостью их прочитаю и отвечу.',
    toast_email: 'Email скопирован!',
    toast_discord: 'Discord скопирован!',
    footer: '© 2026. Разработано для портфолио.',
    roles: ['Software engineer_', 'System security_', 'Chill guy_'],
    tooltips: {
      python: 'Python: Скрипты, криптография',
      linux: 'Linux: Информационная безопасность',
      css: 'CSS3: UI-дизайн и анимации',
      matlab: 'MATLAB & Simscape: Моделирование',
      html: 'HTML5: Верстка',
      js: 'JavaScript: Логика и интерактив',
      react: 'React: Компонентный UI',
      node: 'Node.js: Серверный JS',
      ts: 'TypeScript: Строгая типизация',
      postgres: 'PostgreSQL: Базы данных',
      docker: 'Docker: Контейнеризация',
      nestjs: 'NestJS: Бэкенд фреймворк',
    },
  },
  en: {
    nav_about: 'About',
    nav_skills: 'Stack',
    nav_interactive: 'Interactive',
    nav_projects: 'Projects',
    nav_contacts: 'Contacts',
    hero_subtitle:
      'Student at D. Serikbayev EKTU..',
    hero_btn: 'Contact Me',
    badge_name: 'Krikunenko Danil',
    badge_role: 'Student & Developer',
    skills_title: 'Tech Stack & Tools',
    skills_subtitle: 'Hover over a sticker for info',
    int_title: 'Interactive Modules',
    int_subtitle: 'Real-time script demonstration',
    card_term: '⌨️ Bash Terminal',
    term_ready: "System ready. Type 'help' to see commands.",
    card_hash: '🔐 SHA-256 Hashing',
    hash_desc: 'Real-time avalanche effect.',
    card_pass: '🛡️ Password Analyzer',
    pass_desc: 'Brute-force resistance evaluation.',
    pass_short: 'Too short',
    card_css: '🎨 Live CSS Editor',
    css_desc: 'Enter a color (e.g. #ff4444) for accents:',
    css_btn: 'Apply Style',
    card_game: '🎮 Mini-game: Guess the Number',
    game_desc: 'The computer picked a number from 1 to 50.',
    game_btn: 'Guess',
    game_msg: 'Enter a number and click the button',
    card_browser: '🕵️️ Browser Environment Log',
    browser_desc: 'Auto-collection of extended device info:',
    proj_title: '⚠️ All Projects Lost!',
    proj_desc:
      'But you can evaluate all the necessary functionality and my programming skills right here, in the interactives above! 🚀',
    contacts_title: 'Send mail to my inbox!',
    contacts_desc: "I will be happy to read them and answer.",
    toast_email: 'Email copied!',
    toast_discord: 'Discord copied!',
    footer: '© 2026. Developed for portfolio.',
    roles: ['Software engineer_', 'System security_', 'Chill guy_'],
    tooltips: {
      python: 'Python: Scripts, cryptography',
      linux: 'Linux: Information security',
      css: 'CSS3: UI design & animations',
      matlab: 'MATLAB & Simscape: Modeling',
      html: 'HTML5: Markup',
      js: 'JavaScript: Logic & interactivity',
      react: 'React: Component UI',
      node: 'Node.js: Server-side JS',
      ts: 'TypeScript: Strict typing',
      postgres: 'PostgreSQL: Databases',
      docker: 'Docker: Containerization',
      nestjs: 'NestJS: Backend framework',
    },
  },
  kz: {
    nav_about: 'Туралы',
    nav_skills: 'Стек',
    nav_interactive: 'Интерактив',
    nav_projects: 'Жобалар',
    nav_contacts: 'Байланыс',
    hero_subtitle:
      'Д. Серікбаев атындағы ШҚТУ студенті.',
    hero_btn: 'Байланысу',
    badge_name: 'Крикуненко Данил',
    badge_role: 'Студент & Әзірлеуші',
    skills_title: 'Технологиялар стегі & Құралдар',
    skills_subtitle: 'Ақпарат алу үшін стикерге апартыңыз',
    int_title: 'Интерактивті модульдер',
    int_subtitle: 'Скрипттердің жұмысын нақты уақытта көрсету',
    card_term: '⌨️ Bash Terminal',
    term_ready: "System ready. Type 'help' to see commands.",
    card_hash: '🔐 SHA-256 Хэштеу',
    hash_desc: 'Нақты уақыттағы лавинный эффект.',
    card_pass: '🛡️ Құпиясөз анализаторы',
    pass_desc: 'Брутфорсқа төзімділікті бағалау.',
    pass_short: 'Тым қысқа',
    card_css: '🎨 Live CSS Editor',
    css_desc: 'Акцент үшін түс енгізіңіз (мысалы: #ff4444):',
    css_btn: 'Стильді қолдану',
    card_game: '🎮 Шағын ойын: Санды тап',
    game_desc: 'Компьютер 1 мен 50 арасында сан ойлады.',
    game_btn: 'Табу',
    game_msg: 'Санды енгізіп, батырманы басыңыз',
    card_browser: '🕵 Орта туралы лог (Browser Sniffer)',
    browser_desc: 'Құрылғы туралы кеңейтілген деректерді жинау:',
    proj_title: '⚠️ Барлық жобалар жоғалды!',
    proj_desc:
      'Бірақ барлық қажетті функцияларды және менің бағдарламалау дағдыларымды жоғарыдағы интерактивтерде дәл осы жерде бағалай аласыз!🚀',
    contacts_title: 'Хаттарыңызды жіберіңіз!',
    contacts_desc: 'Оларды оқып, жауап беруге қуаныштымын.',
    toast_email: 'Email көшірілді!',
    toast_discord: 'Discord көшірілді!',
    footer: '© 2026. Портфолио үшін әзірленді.',
    roles: ['Software engineer_', 'System security_', 'Chill guy_'],
    tooltips: {
      python: 'Python: Скриптер, криптография',
      linux: 'Linux: Ақпараттық қауіпсіздік',
      css: 'CSS3: UI дизайн және анимациялар',
      matlab: 'MATLAB & Simscape: Модельдеу',
      html: 'HTML5: Беттеу',
      js: 'JavaScript: Логика және интерактив',
      react: 'React: Компонентті UI',
      node: 'Node.js: Серверлік JS',
      ts: 'TypeScript: Қатаң типтеу',
      postgres: 'PostgreSQL: Деректер қоры',
      docker: 'Docker: Контейнерлеу',
      nestjs: 'NestJS: Бэкенд фреймворк',
    },
  },

}
function initTooltips() {
  document.querySelectorAll('[data-tippy]').forEach((el) => {
    const htmlEl = el as HTMLElement;
    const key = htmlEl.dataset.tippy;
    if (key && translations[currentLang]?.tooltips?.[key]) {
      htmlEl.dataset.tooltip = translations[currentLang].tooltips[key];
    }
  });
}

;(window as any).setLanguage = function setLanguage(lang: string, btnElement?: HTMLElement) {
  currentLang = lang;
  
  document
    .querySelectorAll('.lang-btn')
    .forEach((btn) => btn.classList.remove('active'));
  
  // Безопасно вешаем класс на ту кнопку, по которой кликнули
  if (btnElement) {
    btnElement.classList.add('active');
  }

  // Перевод текстов
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const htmlEl = el as HTMLElement;
    const key = htmlEl.dataset.i18n;
    if (key && translations[lang]?.[key]) {
      htmlEl.textContent = translations[lang][key];
    }
  });

  // Обновление тултипов
  document.querySelectorAll('[data-tippy]').forEach((el) => {
    const htmlEl = el as HTMLElement;
    const key = htmlEl.dataset.tippy;
    if (key && translations[lang]?.tooltips?.[key]) {
      htmlEl.dataset.tooltip = translations[lang].tooltips[key];
    }
  });
};


function typingEffect() {
  if (timer) clearTimeout(timer);
  
  if (!words[i]) { i = 0; }
  const word = [...words[i]];
  
  const loopTyping = function () {
    const typedOutput = document.querySelector('#typed-output');
    if (word.length > 0 && typedOutput) {
      typedOutput.innerHTML += word.shift();
      timer = setTimeout(loopTyping, 100);
    } else {
      timer = setTimeout(deletingEffect, 2000);
    }
  };
  loopTyping();
}

function deletingEffect() {
  if (!words[i]) { i = 0; }
  const word = [...words[i]];
  const loopDeleting = function () {
    const typedOutput = document.querySelector('#typed-output');
    if (word.length > 0 && typedOutput) {
      word.pop();
      typedOutput.innerHTML = word.join('');
      timer = setTimeout(loopDeleting, 50);
    } else {
      if (words.length > i + 1) {
        i++;
      } else {
        i = 0;
      }
      timer = setTimeout(typingEffect, 500);
    }
  };
  loopDeleting();
}


;(window as any).copyToClipboard = function copyToClipboard(
  text: string,
  element: HTMLElement
) {
  navigator.clipboard.writeText(text).then(() => {
    const toast = element.querySelector('.copy-toast');
    toast?.classList.add('show');
    setTimeout(() => {
      toast?.classList.remove('show');
    }, 1500);
  });
};


document.addEventListener('DOMContentLoaded', () => {
  words = translations[currentLang]?.roles || ['Software engineer_', 'System security_', 'Chill guy_'];
  initTooltips();
  typingEffect();
});




;(window as any).setLanguage = function  setLanguage(lang: string) {
  currentLang = lang
  document
    .querySelectorAll('.lang-btn')
    .forEach((btn) => btn.classList.remove('active'))
  ;(window.event?.currentTarget as HTMLElement)?.classList.add('active')

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n
    if (key && translations[lang][key]) {
      el.textContent = translations[lang][key]
    }
  })

 
      el.dataset.tooltip = translations[lang].tooltips[key]
    }
  

  words = translations[lang].roles
  const typedOutput = document.querySelector('#typed-output')
  if (typedOutput) {typedOutput.innerHTML = ''}




;(window as any).copyToClipboard = function  copyToClipboard(
  text: string,
  element: HTMLElement
) {
  navigator.clipboard.writeText(text).then(() => {
    const toast = element.querySelector('.copy-toast')
    toast?.classList.add('show')
    setTimeout(() => {
      toast?.classList.remove('show')
    }, 1500)
  })
}


const termInput = document.querySelector('#term-input') as HTMLInputElement
const termHistory = document.querySelector('#term-history')
const termBox = document.querySelector('#term-box')

termInput?.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    const cmd = this.value.trim().toLowerCase()
    const cmdLine = document.createElement('div')
    cmdLine.innerHTML = `<span class="term-prompt">user@vktu:~$</span> ${this.value}`
    termHistory?.append(cmdLine)

    const responseLine = document.createElement('div')
    responseLine.style.color = '#8b949e'

    switch (cmd) {
      case 'help': {
        responseLine.innerText = 'Commands: help, about, skills, clear, matrix'
        break
      }
      case 'about': {
        responseLine.innerText =
          'Student at EKTU. Major: Engineering & Cybersecurity.'
        break
      }
      case 'skills': {
        responseLine.innerText = '[OK] Python, MATLAB, HTML5, CSS3, JS, Linux.'
        break
      }
      case 'clear': {
        if (termHistory) termHistory.innerHTML = ''
        break
      }
      case 'matrix': {
        responseLine.innerText = 'Wake up, Neo... The Matrix has you.'
        responseLine.style.color = '#3fb950'
        break
      }
      case '': {
        break
      }
      default: {
        responseLine.innerText = `Command not found: ${cmd}`
      }
    }

    if (cmd !== 'clear' && cmd !== '' && termHistory)
      {termHistory.appendChild(responseLine)}
    this.value = ''
    if (termBox) {termBox.scrollTop = termBox.scrollHeight}
  }
})

/* 2. БЛОК: ХЕШИРОВАНИЕ (SHA-256) */
const hashInput = document.querySelector('#hash-input') as HTMLInputElement
const hashOutput = document.querySelector('#hash-output')

async function generateHash(text: string) {
  const msgUint8 = new TextEncoder().encode(text)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8)
  const hashArray = [...new Uint8Array(hashBuffer)]
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
  if (hashOutput) {hashOutput.innerText = hashHex}
}
hashInput?.addEventListener('input', (e) =>
  generateHash((e.target as HTMLInputElement).value)
)
if (hashInput) {generateHash(hashInput.value)}


const passInput = document.querySelector('#pass-input') as HTMLInputElement
const passFill = document.querySelector('#pass-fill') as HTMLElement
const passText = document.querySelector('#pass-text')

passInput?.addEventListener('input', (e) => {
  const val = (e.target as HTMLInputElement).value
  let score = 0
  if (val.length > 5) score++
  if (val.length > 8) score++
  if (/[A-Z]/.test(val)) score++
  if (/[0-9]/.test(val)) score++
  if (/[^A-Za-z0-9]/.test(val)) score++

  let color = '#ff4444'
  let text =
    currentLang === 'kz'
      ? 'Тым әлсіз'
      : currentLang === 'en'
        ? 'Very weak'
        : 'Очень слабый'
  let width = (score / 5) * 100

  if (score === 0 && val.length === 0) width = 0
  else if (score <= 2) {
    color = '#ff4444'
    text =
      currentLang === 'kz'
        ? 'Әлсіз құпиясөз'
        : currentLang === 'en'
          ? 'Weak password'
          : 'Слабый пароль'
  } else if (score === 3 || score === 4) {
    color = '#f1e05a'
    text =
      currentLang === 'kz'
        ? 'Орташа құпиясөз'
        : currentLang === 'en'
          ? 'Medium password'
          : 'Средний пароль'
  } else if (score >= 5) {
    color = '#3fb950'
    text =
      currentLang === 'kz'
        ? 'Сенімді құпиясөз'
        : currentLang === 'en'
          ? 'Strong password'
          : 'Надежный пароль'
  }

  if (passFill) {
    passFill.style.width = width + '%'
    passFill.style.backgroundColor = color
  }
  if (passText) {
    passText.innerText =
      val.length === 0
        ? currentLang === 'kz'
          ? 'Құпиясөзді енгізіңіз'
          : currentLang === 'en'
            ? 'Enter password'
            : 'Введите пароль'
        : text
    passText.style.color = color
  }
})


const cssInput = document.querySelector('#css-input') as HTMLInputElement
const cssApplyBtn = document.querySelector('#css-apply-btn')

cssApplyBtn?.addEventListener('click', () => {
  const val = cssInput?.value.trim()
  if (val) {
    document.querySelectorAll('.section-title, .badge-role').forEach((el) => {
      ;(el as HTMLElement).style.color = val
    })
    alert('Стиль успешно применен!')
  }
})


let secretNumber = Math.floor(Math.random() * 50) + 1
const gameInput = document.querySelector('#game-input') as HTMLInputElement
const gameBtn = document.querySelector('#game-btn')
const gameMsg = document.querySelector('#game-msg')

gameBtn?.addEventListener('click', () => {
  const guess = Number.parseInt(gameInput?.value)
  if (isNaN(guess)) {
    if (gameMsg)
      {gameMsg.innerText =
        currentLang === 'kz'
          ? 'Сан енгізіңіз!'
          : currentLang === 'en'
            ? 'Enter a number!'
            : 'Введите число!'}
    return
  }
  if (guess === secretNumber) {
    if (gameMsg)
      {gameMsg.innerText =
        currentLang === 'kz'
          ? '🎉 Жеңіс! Жаңа сан ойланды!'
          : currentLang === 'en'
            ? '🎉 Win! New number generated!'
            : '🎉 Победа! Число угадано. Новое загадано!'}
    secretNumber = Math.floor(Math.random() * 50) + 1
  } else if (guess < secretNumber) {
    if (gameMsg)
      {gameMsg.innerText =
        currentLang === 'kz'
          ? '📈 Жоғарырақ!'
          : currentLang === 'en'
            ? '📈 Go higher!'
            : '📈 Бери выше!'}
  } else {
    if (gameMsg)
      {gameMsg.innerText =
        currentLang === 'kz'
          ? '📉 Төменірек!'
          : currentLang === 'en'
            ? '📉 Go lower!'
            : '📉 Бери ниже!'}
  }
})


const browserLog = document.querySelector('#browser-log')
setTimeout(() => {
  const platform = navigator.platform || 'Unknown'
  const cores = (navigator as any).hardwareConcurrency
    ? `${(navigator as any).hardwareConcurrency} cores`
    : 'N/A'
  const ram = (navigator as any).deviceMemory
    ? `~${(navigator as any).deviceMemory} GB`
    : 'N/A'
  const res = `${window.screen.width}x${window.screen.height}`
  const lang = navigator.language || 'Unknown'
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown'
  const cookies = navigator.cookieEnabled ? 'Enabled' : 'Disabled'
  const online = navigator.onLine ? 'Online' : 'Offline'

  if (browserLog) {
    browserLog.innerHTML = `
            > OS Platform: ${platform}<br>
            > CPU Cores: ${cores}<br>
            > Est. RAM: ${ram}<br>
            > Resolution: ${res}<br>
            > Language: ${lang}<br>
            > Timezone: ${tz}<br>
            > Cookies: ${cookies}<br>
            > Net Status: ${online}
        `
  }
}, 300)


const counterBtn = document.querySelector('#counter-btn')
const counterVal = document.querySelector('#counter-val')
let currentCount = 47_201_815

counterBtn?.addEventListener('click', () => {
  currentCount++
  if (counterVal)
    {counterVal.innerText = currentCount.toLocaleString().replace(/,/g, ' ')}
  if (counterBtn) {
    counterBtn.style.transform = 'scale(1.1)'
    setTimeout(() => {
      counterBtn.style.transform = 'scale(1)'
    }, 150)
  }
})

setInterval(() => {
  currentCount += Math.floor(Math.random() * 3) + 1
  if (counterVal)
    {counterVal.innerText = currentCount.toLocaleString().replace(/,/g, ' ')}
}, 4000)


const wrapper = document.querySelector('#badge-wrapper')
const badge = document.querySelector('#badge')
wrapper?.addEventListener('mousemove', (e: MouseEvent) => {
  const rect = wrapper.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -15
  const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 15
  if (badge)
    {badge.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`}
})
wrapper?.addEventListener('mouseleave', () => {
  if (badge) {
    badge.style.transform = `rotateX(0) rotateY(0) scale3d(1, 1, 1)`
    badge.style.transition = 'transform 0.5s ease-out'
  }
})
wrapper?.addEventListener('mouseenter', () => {
  if (badge) {badge.style.transition = 'transform 0.1s ease-out'}
})


const canvas = document.querySelector('#bg-canvas') as HTMLCanvasElement
const ctx = canvas?.getContext('2d')
let height: number,
  width: number,
  lines: any[] = []

function initCanvas() {
  if (!canvas) {return}
  width = canvas.width = window.innerWidth
  height = canvas.height = window.innerHeight
  lines = []
  for (let i = 0; i < 50; i++)
    {lines.push({
      x: Math.random() * width,
      y: Math.random() * height - height,
      length: Math.random() * 80 + 20,
      speed: Math.random() * 3 + 1,
      color:
        Math.random() > 0.5 ? 'rgba(88, 166, 255, ' : 'rgba(139, 148, 158, ',
    })}
}

function drawLines() {
  if (!ctx || !canvas) {return}
  ctx.clearRect(0, 0, width, height)
  lines.forEach((line) => {
    ctx.beginPath()
    const grad = ctx.createLinearGradient(
      line.x,
      line.y,
      line.x,
      line.y + line.length
    )
    grad.addColorStop(0, `${line.color  }0)`)
    grad.addColorStop(1, `${line.color  }0.5)`)
    ctx.strokeStyle = grad
    ctx.lineWidth = 2
    ctx.moveTo(line.x, line.y)
    ctx.lineTo(line.x, line.y + line.length)
    ctx.stroke()
    line.y += line.speed
    if (line.y > height) {
      line.y = -line.length
      line.x = Math.random() * width
    }
  })
  requestAnimationFrame(drawLines)
}

window.addEventListener('resize', initCanvas)
initCanvas()
drawLines()
