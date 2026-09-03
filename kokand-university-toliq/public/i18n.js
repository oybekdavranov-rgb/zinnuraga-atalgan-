(function () {
  'use strict';

  var DEFAULT_LANGUAGE = 'uz';
  var SUPPORTED_LANGUAGES = { uz: 'UZ', en: 'EN', ru: 'RU' };
  var LANGUAGE_NAMES = { uz: 'O‘zbek', en: 'English', ru: 'Русский' };
  var TRANSLATIONS = {
  "KU Yoshlar Ittifoqi": {
    "uz": "KU Yoshlar Ittifoqi",
    "en": "KU Youth Union",
    "ru": "Молодежный союз KU"
  },
  "Hush Kelibsiz": {
    "uz": "Xush kelibsiz",
    "en": "Welcome",
    "ru": "Добро пожаловать"
  },
  "Welcome To": {
    "uz": "Xush kelibsiz",
    "en": "Welcome To",
    "ru": "Добро пожаловать в"
  },
  "Discover KU": {
    "uz": "Imora AI ni bilib oling",
    "en": "Discover Imora AI",
    "ru": "Узнать об Imora AI"
  },
  "Watch our Video": {
    "uz": "Videoni tomosha qiling",
    "en": "Watch our Video",
    "ru": "Посмотреть видео"
  },
  "close": {
    "uz": "yopish",
    "en": "close",
    "ru": "закрыть"
  },
  "Search": {
    "uz": "Qidirish",
    "en": "Search",
    "ru": "Поиск"
  },
  "Our Tutors": {
    "uz": "Bizning jamoa",
    "en": "Our team",
    "ru": "Наша команда"
  },
  "Results": {
    "uz": "Natijalar",
    "en": "Results",
    "ru": "Результаты"
  },
  "Stories": {
    "uz": "Hikoyalar",
    "en": "Stories",
    "ru": "Истории"
  },
  "Login": {
    "uz": "Kirish",
    "en": "Login",
    "ru": "Войти"
  },
  "Staff Login": {
    "uz": "Xodimlar uchun kirish",
    "en": "Staff Login",
    "ru": "Вход для сотрудников"
  },
  "Programmes": {
    "uz": "Imkoniyatlar",
    "en": "Features",
    "ru": "Возможности"
  },
  "Akademik litsey": {
    "uz": "Akademik litsey",
    "en": "Akademik litsey",
    "ru": "Akademik litsey"
  },
  "Online Sixth Form": {
    "uz": "Onlayn panel",
    "en": "Online dashboard",
    "ru": "Онлайн-панель"
  },
  "A Level Two Year": {
    "uz": "Jonli boshqaruv paneli",
    "en": "Live dashboard",
    "ru": "Живая панель"
  },
  "A Level Fast Track": {
    "uz": "Real vaqtli kuzatuv",
    "en": "Real-time tracking",
    "ru": "Отслеживание в реальном времени"
  },
  "A Level Retakes": {
    "uz": "Auditoriya segmentatsiyasi",
    "en": "Audience segments",
    "ru": "Сегменты аудитории"
  },
  "GCSE Two Year": {
    "uz": "Konversiya tahlili",
    "en": "Conversion analysis",
    "ru": "Анализ конверсии"
  },
  "GCSE Fast Track": {
    "uz": "Sahifa tahlili",
    "en": "Page analytics",
    "ru": "Аналитика страниц"
  },
  "GCSE Retake": {
    "uz": "Xatti-harakat tahlili",
    "en": "Behavior analysis",
    "ru": "Анализ поведения"
  },
  "Revision Courses": {
    "uz": "Aqlli ogohlantirishlar",
    "en": "Smart alerts",
    "ru": "Умные уведомления"
  },
  "Gap Year Programme": {
    "uz": "Hisobotlar va eksport",
    "en": "Reports & export",
    "ru": "Отчёты и экспорт"
  },
  "Private Tuition": {
    "uz": "Moslashuvchan integratsiya",
    "en": "Easy integration",
    "ru": "Простая интеграция"
  },
  "Admissions": {
    "uz": "Boshlash",
    "en": "Get Started",
    "ru": "Начать"
  },
  "How to Apply": {
    "uz": "Qanday boshlash",
    "en": "How to start",
    "ru": "Как начать"
  },
  "How to Transfer to Greene’s": {
    "uz": "Boshqa tizimdan ko‘chib o‘tish",
    "en": "Migrate from another tool",
    "ru": "Переход с другого сервиса"
  },
  "Application & Fees": {
    "uz": "Narxlar va rejalar",
    "en": "Pricing & plans",
    "ru": "Цены и тарифы"
  },
  "Scholarships at Greene’s": {
    "uz": "Bepul reja",
    "en": "Free plan",
    "ru": "Бесплатный тариф"
  },
  "Examinations": {
    "uz": "Qanday ishlaydi",
    "en": "How it works",
    "ru": "Как это работает"
  },
  "Examinations at Greene’s": {
    "uz": "Imora AI qanday ishlaydi",
    "en": "How Imora AI works",
    "ru": "Как работает Imora AI"
  },
  "Application and Fees": {
    "uz": "Ma’lumot qanday yig‘iladi",
    "en": "How data is collected",
    "ru": "Как собираются данные"
  },
  "Registration Deadlines": {
    "uz": "Qonunchilikka muvofiqlik",
    "en": "Compliance (GDPR)",
    "ru": "Соответствие (GDPR)"
  },
  "Trial Examinations": {
    "uz": "Ma’lumot sizniki",
    "en": "You own your data",
    "ru": "Данные принадлежат вам"
  },
  "A Level Science Practicals": {
    "uz": "Aniq va ishonchli hisob",
    "en": "Accurate counting",
    "ru": "Точный подсчёт"
  },
  "GCSE Science Practicals": {
    "uz": "Yengil va tezkor",
    "en": "Lightweight & fast",
    "ru": "Лёгкий и быстрый"
  },
  "Results and Post-Results": {
    "uz": "Ma’lumotdan xulosa va tavsiya",
    "en": "Insights & recommendations",
    "ru": "Выводы и рекомендации"
  },
  "Student Life": {
    "uz": "Yordam",
    "en": "Support",
    "ru": "Поддержка"
  },
  "Term Dates": {
    "uz": "Yordam va qo‘llanma",
    "en": "Help & docs",
    "ru": "Помощь и документация"
  },
  "Academic Support": {
    "uz": "Mijozlarni qo‘llab-quvvatlash",
    "en": "Customer support",
    "ru": "Поддержка клиентов"
  },
  "Student Accommodation": {
    "uz": "Hamjamiyat va yangilanishlar",
    "en": "Community & updates",
    "ru": "Сообщество и обновления"
  },
  "Testimonials": {
    "uz": "Mijozlar fikri",
    "en": "Testimonials",
    "ru": "Отзывы"
  },
  "About Greene’s": {
    "uz": "Imora AI haqida",
    "en": "About Imora AI",
    "ru": "Об Imora AI"
  },
  "Imora AI": {
    "uz": "Imora AI",
    "en": "Imora AI",
    "ru": "Imora AI"
  },
  "The Tutorial Method of Learning": {
    "uz": "Bizning yondashuvimiz",
    "en": "Our approach",
    "ru": "Наш подход"
  },
  "Results & Destinations": {
    "uz": "Natijalar va ta’sir",
    "en": "Results & impact",
    "ru": "Результаты и влияние"
  },
  "Imora AI Onlayn": {
    "uz": "Imora AI Onlayn",
    "en": "Imora AI Onlayn",
    "ru": "Imora AI Onlayn"
  },
  "Vacancies at Greene’s": {
    "uz": "Bo‘sh ish o‘rinlari",
    "en": "Careers",
    "ru": "Вакансии"
  },
  "Join our Professional Network of Tutors": {
    "uz": "Hamkorlik",
    "en": "Partners",
    "ru": "Партнёрство"
  },
  "Contact Us": {
    "uz": "Biz bilan bog‘laning",
    "en": "Contact Us",
    "ru": "Связаться с нами"
  },
  "Members": {
    "uz": "A’zolar",
    "en": "Members",
    "ru": "Участники"
  },
  "Grid": {
    "uz": "Jadval",
    "en": "Grid",
    "ru": "Сетка"
  },
  "Discover Greene’s": {
    "uz": "Imora AI ni kashf eting",
    "en": "Discover Imora AI",
    "ru": "Узнать об Imora AI"
  },
  "Sixth Form College": {
    "uz": "Ko‘p sayt boshqaruvi",
    "en": "Multi-site management",
    "ru": "Управление сайтами"
  },
  "Tuition": {
    "uz": "Moslashuvchan integratsiya",
    "en": "Easy integration",
    "ru": "Простая интеграция"
  },
  "A level retakes": {
    "uz": "Xatti-harakat tahlili",
    "en": "Behavior analysis",
    "ru": "Анализ поведения"
  },
  "Examinations & Tests": {
    "uz": "Imora AI qanday ishlaydi",
    "en": "How Imora AI works",
    "ru": "Как работает Imora AI"
  },
  "WELCOME TO": {
    "uz": "XUSH KELIBSIZ",
    "en": "WELCOME TO",
    "ru": "ДОБРО ПОЖАЛОВАТЬ В"
  },
  "Imora AI oldest tutorial college": {
    "uz": "Imora AI — insonparvar sun’iy intellekt",
    "en": "Imora AI — human-centered artificial intelligence",
    "ru": "Кокандский университет — современный учебный центр"
  },
  "DESIGN YOUR EDUCATION. TRANSFORM YOUR FUTURE.": {
    "uz": "MA’LUMOTNI TUSHUNING. KELAJAKNI YARATING.",
    "en": "UNDERSTAND YOUR DATA. SHAPE THE FUTURE.",
    "ru": "ПОНИМАЙТЕ ДАННЫЕ. СОЗДАВАЙТЕ БУДУЩЕЕ."
  },
  "Bugungi kunda O'zbekiston jadal rivojlanish bosqichiga qadam qo'ymoqda. Iqtisodiyot, ta'lim va innovatsiya sohalaridagi tub islohotlar yangi avlod mutaxassislariga bo'lgan ehtiyojni yanada oshirmoqda.": {
    "uz": "Bugungi kunda ma’lumotlar dunyoni harakatga keltiradi. Har bir sayt, ilova va xizmat ortida — real insonlar, ularning ehtiyojlari va qarorlari turadi.",
    "en": "Today, data drives the world. Behind every website, app and service there are real people — their needs and their decisions.",
    "ru": "Сегодня данные движут миром. За каждым сайтом, приложением и сервисом стоят реальные люди — их потребности и решения."
  },
  "Aynan shunday sharoitda bizning universitetimiz zamon talablariga mos, raqobatbardosh va amaliy bilimga ega kadrlarni tayyorlashni o'z oldiga maqsad qilib qo'ygan.": {
    "uz": "Aynan shu insoniy jihatni Imora AI texnologiya bilan bog‘laydi. Bizning platformamiz saytlar va ilovalar uchun jonli analitika hamda auditoriya tahlilini taqdim etadi.",
    "en": "Imora AI connects this human dimension with technology. Our platform provides live analytics and audience insights for websites and apps.",
    "ru": "Imora AI связывает эту человеческую сторону с технологией. Наша платформа предоставляет живую аналитику и анализ аудитории для сайтов и приложений."
  },
  "Biz ta'limda nazariya va amaliyotni uyg'unlashtirgan holda, talabalarimizga nafaqat bilim, balki real hayotda muvaffaqiyatga erishish uchun zarur bo'lgan ko'nikmalarni ham beramiz. Xalqaro tajriba, zamonaviy o'quv dasturlari, innovatsion yondashuvlar va professional muhit — bularning barchasi talabaning shaxs sifatida shakllanishiga xizmat qiladi.": {
    "uz": "Biz sun’iy intellektni murakkab emas, balki inson uchun tushunarli va foydali qilib yaratamiz. Jonli statistika, aqlli tahlil va maxfiylik himoyasi — barchasi bitta ishonchli platformada. Imora AI bilan siz auditoriyangizni chuqurroq tushunasiz va to‘g‘ri qarorlar qabul qilasiz.",
    "en": "We build artificial intelligence that is not complex, but clear and useful for people. Live statistics, smart analysis and privacy protection — all in one trusted platform. With Imora AI you understand your audience more deeply and make better decisions.",
    "ru": "Мы создаём искусственный интеллект, который не сложен, а понятен и полезен человеку. Живая статистика, умный анализ и защита конфиденциальности — всё на одной надёжной платформе. С Imora AI вы глубже понимаете свою аудиторию и принимаете верные решения."
  },
  ", at any time, regardless of their location.": {
    "uz": ", istalgan vaqtda va joylashuvidan qat’i nazar.",
    "en": ", at any time, regardless of their location.",
    "ru": ", в любое время, независимо от местоположения."
  },
  "Bu yerda har bir talaba o'z salohiyatini kashf etishi, orzularini aniq maqsadlarga aylantirishi mumkin.": {
    "uz": "Bu yerda har bir raqam — real insonni anglatadi. Imora AI sizga ularni yaxshiroq tushunish va e’tibor bilan xizmat ko‘rsatish imkonini beradi.",
    "en": "Here, every number represents a real person. Imora AI helps you understand them better and serve them with care.",
    "ru": "Здесь каждая цифра — это реальный человек. Imora AI помогает вам лучше понимать их и заботливо обслуживать."
  },
  ". Biz bilan birga bilim oling, rivojlaning va kelajagingizni bugundan yarating. Sizning muvaffaqiyatingiz — bizning asosiy qadriyatimiz.": {
    "uz": ". Biz bilan birga bilim oling, rivojlaning va kelajagingizni bugundan yarating. Sizning muvaffaqiyatingiz — bizning asosiy qadriyatimiz.",
    "en": ". Learn with us, grow with us and start building your future today. Your success is our core value.",
    "ru": ". Учитесь вместе с нами, развивайтесь и создавайте свое будущее уже сегодня. Ваш успех — наша главная ценность."
  },
  "Get in touch to find out more.": {
    "uz": "Batafsil ma’lumot olish uchun bog‘laning.",
    "en": "Get in touch to find out more.",
    "ru": "Свяжитесь с нами, чтобы узнать больше."
  },
  "Meet Our team Yunusov Abdulhamid Jamoa Sardori": {
    "uz": "Jamoamiz bilan tanishing: Yunusov Abdulhamid — jamoa sardori",
    "en": "Meet our team: Yunusov Abdulhamid, team leader",
    "ru": "Познакомьтесь с нашей командой: Юнусов Абдулхамид, капитан команды"
  },
  "Greene’s Sixth Form": {
    "uz": "Ko‘p sayt boshqaruvi",
    "en": "Multi-site management",
    "ru": "Управление сайтами"
  },
  "Greene’s Tutorial College": {
    "uz": "Imora AI haqida",
    "en": "About Imora AI",
    "ru": "Об Imora AI"
  },
  "Greene’s Online": {
    "uz": "Bulutli va xavfsiz",
    "en": "Cloud & secure",
    "ru": "Облачно и безопасно"
  },
  "Greene’s Team": {
    "uz": "Universitet jamoasi",
    "en": "Greene’s Team",
    "ru": "Команда Greene’s"
  },
  "What does Imora AI do?": {
    "uz": "Imora AI nimasi bilan",
    "en": "What does Imora AI do?",
    "ru": "Чем выделяется Imora AI?"
  },
  "stand out?": {
    "uz": "ajralib turadi?",
    "en": "stand out?",
    "ru": "выделяется?"
  },
  "Times change: values endure.": {
    "uz": "Zamon o‘zgaradi, qadriyatlar saqlanadi.",
    "en": "Times change: values endure.",
    "ru": "Времена меняются, ценности остаются."
  },
  "Fresh start?": {
    "uz": "Yangi boshlanishmi?",
    "en": "Fresh start?",
    "ru": "Новое начало?"
  },
  "Subject spotlight: A level Further Mathematics": {
    "uz": "Imkoniyat diqqat markazida: Jonli analitika",
    "en": "Feature spotlight: Live analytics",
    "ru": "В фокусе: живая аналитика"
  },
  "Individualised Education": {
    "uz": "Insonparvar yondashuv",
    "en": "Human-centered approach",
    "ru": "Человекоориентированный подход"
  },
  "Learning without Boundaries": {
    "uz": "Chegarasiz tahlil",
    "en": "Analytics without boundaries",
    "ru": "Аналитика без границ"
  },
  "Collaborative Learning": {
    "uz": "Jamoa bilan ishlash",
    "en": "Built for teams",
    "ru": "Создано для команд"
  },
  "Expert Guidance": {
    "uz": "Ishonchli yordam",
    "en": "Reliable support",
    "ru": "Надёжная поддержка"
  },
  "“ Imora AI represents a fresh start because it combines modern education with practical experience. Unlike many traditional universities, Imora AI focuses on real-world skills, technology, international opportunities, and personal development. I believe this environment will help me grow academically and professionally while preparing me for a global career.”": {
    "uz": "“Imora AI menga auditoriyamni haqiqatan tushunish imkonini berdi. Endi qaysi kontent ishlayotganini va tashrifchilar nimaga qiziqishini real vaqtda ko‘raman — hammasi oddiy, tushunarli va maxfiylik saqlangan holda. Bu qaror qabul qilishni ancha osonlashtirdi.”",
    "en": "“Imora AI helped me truly understand my audience. Now I can see in real time what content works and what visitors care about — all simple, clear and privacy-friendly. It made decision-making much easier.”",
    "ru": "«Imora AI помог мне по-настоящему понять свою аудиторию. Теперь я в реальном времени вижу, какой контент работает и что интересно посетителям — всё просто, понятно и с сохранением конфиденциальности. Принимать решения стало намного легче»."
  },
  "Learn more about A level retakes at Greene's": {
    "uz": "Imora AI imkoniyatlari haqida batafsil",
    "en": "Learn more about Imora AI features",
    "ru": "Подробнее о возможностях Imora AI"
  },
  "“I chose A-Level Further Mathematics because it develops advanced problem-solving, logical thinking, and analytical skills. What makes this subject special is that it goes beyond standard mathematics and challenges students to think deeper and apply concepts in complex situations. It also prepares students for fields like engineering, computer science, economics, and technology.”": {
    "uz": "“Imora AI ni tanladim, chunki u murakkab ma’lumotni oddiy va tushunarli qiladi. Jonli statistika, aqlli tahlil va maxfiylik himoyasi — barchasi bir joyda. U menga tashrifchilarni yaxshiroq tushunish va to‘g‘ri qarorlar qabul qilishda kundalik yordam beradi.”",
    "en": "“I chose Imora AI because it makes complex data simple and clear. Live statistics, smart analysis and privacy protection — all in one place. It helps me understand visitors better and make the right decisions every day.”",
    "ru": "«Я выбрал Imora AI, потому что он делает сложные данные простыми и понятными. Живая статистика, умный анализ и защита конфиденциальности — всё в одном месте. Он помогает мне лучше понимать посетителей и каждый день принимать верные решения»."
  },
  "Read more about the A level in Further Mathematics here.": {
    "uz": "Imora AI haqida batafsil shu yerda o‘qing.",
    "en": "Read more about Imora AI here.",
    "ru": "Подробнее об Imora AI читайте здесь."
  },
  "“What makes Imora AI stand out is its individualized education approach. The university pays attention to each student’s strengths, goals, and personal development instead of using only a one-size-fits-all system. This allows students to learn more effectively, build confidence, and prepare for their future careers in a supportive environment.”": {
    "uz": "“Imora AI ni ajratib turadigan jihat — insonga yaqin yondashuvidir. Platforma har bir tashrifchini raqam sifatida emas, real inson sifatida ko‘radi va sizga aniq, tushunarli tahlil beradi. Bu auditoriyani chuqurroq tushunish, ishonch qozonish va to‘g‘ri qarorlar qabul qilish imkonini beradi.”",
    "en": "“What makes Imora AI stand out is its human-centered approach. The platform sees every visitor not as a number but as a real person, and gives you clear, understandable insights. This helps you understand your audience more deeply, build trust and make better decisions.”",
    "ru": "«Imora AI выделяется человекоориентированным подходом. Платформа видит каждого посетителя не как цифру, а как реального человека, и даёт понятную аналитику. Это помогает глубже понимать аудиторию, укреплять доверие и принимать верные решения»."
  },
  "The Tutorial College": {
    "uz": "Tutorial kolleji",
    "en": "The Tutorial College",
    "ru": "Тьюторский колледж"
  },
  "“Learning without Boundaries means having access to education beyond traditional limits. Imora AI stands out by encouraging students to explore global opportunities, modern technologies, practical experiences, and international perspectives. It creates an environment where students can continuously learn, grow, and connect with the world.”": {
    "uz": "“Chegarasiz tahlil — auditoriyangizni istalgan joydan va istalgan qurilmadan kuzatish demakdir. Imora AI saytga qo‘yilgan yengil kod orqali real vaqtda ishlaydi, shuning uchun uydan, ofisdan yoki yo‘lda — hamma joyda ma’lumotni ko‘rasiz. Masofa ham, qurilma ham tahlilingizni cheklamaydi.”",
    "en": "“Analytics without boundaries means watching your audience from anywhere and any device. Imora AI works in real time through a lightweight snippet on your site, so you see your data from home, the office or on the go. Neither distance nor device limits your insight.”",
    "ru": "«Аналитика без границ — это наблюдение за аудиторией из любого места и с любого устройства. Imora AI работает в реальном времени через лёгкий код на сайте, поэтому вы видите данные из дома, офиса или в пути. Ни расстояние, ни устройство не ограничивают ваши инсайты»."
  },
  ", a custom-built online platform, where they can upload their work and review their assessments. Students receive live feedback and can track their progress independently in their own time. Study is in person or online, so geography will not limit academic development.": {
    "uz": " — bulutli, xavfsiz platforma bo‘lib, unda saytlaringiz ma’lumotini real vaqtda tahlil qilib, kuzatib borasiz. Imora AI jonli xulosa beradi va o‘sishingizni mustaqil kuzatishga yordam beradi. Hammasi bulutda — istalgan qurilmadan foydalanish mumkin, shuning uchun masofa tahlilni cheklamaydi.",
    "en": " — a secure, cloud-based platform where you analyze and track your sites' data in real time. Imora AI gives live insights and helps you follow your growth independently. Everything is in the cloud — usable from any device, so distance never limits your analytics.",
    "ru": " — защищённая облачная платформа, где вы анализируете и отслеживаете данные сайтов в реальном времени. Imora AI даёт живые инсайты и помогает самостоятельно следить за ростом. Всё в облаке — доступно с любого устройства, поэтому расстояние не ограничивает аналитику."
  },
  "Learning can take place in our campus in Oxford, UK, or online from anywhere in the world. You can also make use of our campuses in Estoril and Lisbon, Portugal as online study spaces.": {
    "uz": "Imora AI to‘liq bulutda ishlaydi — istalgan joydan va istalgan qurilmadan. Ofisdan, uydan yoki yo‘lda — ma’lumotingiz doim yoningizda va hech narsa o‘rnatish shart emas.",
    "en": "Imora AI runs entirely in the cloud — from anywhere and any device. From the office, home or on the go, your data is always with you, with nothing to install.",
    "ru": "Imora AI полностью работает в облаке — из любого места и с любого устройства. Из офиса, дома или в пути ваши данные всегда с вами, и ничего не нужно устанавливать."
  },
  "Imora AI Haqida koproq bilib oling": {
    "uz": "Imora AI haqida ko‘proq bilib oling",
    "en": "Learn more about Imora AI",
    "ru": "Узнайте больше о Imora AI"
  },
  "“Collaborative learning at Imora AI helps students develop teamwork, communication, and problem-solving skills by working together on projects and discussions. This approach creates a supportive academic environment where students learn not only from teachers, but also from each other.”": {
    "uz": "“Imora AI jamoalar uchun qulay: bitta hisobga bir necha a’zoni qo‘shib, ma’lumotni birga ko‘rish, muhokama qilish va qaror qabul qilish mumkin. Bu yondashuv jamoaviy ish, ochiq muloqot va to‘g‘ri qarorlar qabul qilishga yordam beradi.”",
    "en": "“Imora AI is built for teams: add several members to one account to view data together, discuss it and make decisions. This approach supports teamwork, open communication and better decisions.”",
    "ru": "«Imora AI создан для команд: добавьте несколько участников в один аккаунт, чтобы вместе смотреть данные, обсуждать их и принимать решения. Такой подход поддерживает командную работу, открытое общение и верные решения»."
  },
  "Read more about the tutorial method": {
    "uz": "Bizning yondashuvimiz haqida batafsil o‘qing",
    "en": "Read more about our approach",
    "ru": "Подробнее о нашем подходе"
  },
  "“Imora AI stands out through expert guidance by providing students with support from qualified instructors and mentors who help them both academically and professionally. This guidance helps students build confidence, improve their skills, and prepare for future career opportunities.”": {
    "uz": "“Imora AI ishonchli yordami bilan ajralib turadi: jamoamiz ulash, sozlash va ma’lumotni tushunishda doim yordam beradi. Bu ko‘mak sizga ishonch, tezlik va to‘g‘ri qarorlar qabul qilishda yaqindan yordam beradi.”",
    "en": "“Imora AI stands out through reliable support: our team is always there to help with setup, integration and understanding your data. This support gives you confidence, speed and better decisions.”",
    "ru": "«Imora AI выделяется надёжной поддержкой: наша команда всегда поможет с настройкой, интеграцией и пониманием данных. Такая поддержка даёт уверенность, скорость и верные решения»."
  },
  "OUR DIRECTOR": {
    "uz": "BIZNING JAMOA",
    "en": "OUR TEAM",
    "ru": "НАША КОМАНДА"
  },
  "Your Goals - Our Expertise": {
    "uz": "Imora AI ortidagi insonlar",
    "en": "The people behind Imora AI",
    "ru": "Люди за Imora AI"
  },
  "Direktor": {
    "uz": "Direktor",
    "en": "Director",
    "ru": "Директор"
  },
  "Xalqaro ta’lim standartlari asosida yuksak ma’naviy-axloqiy fazilatli, mustaqil fikrlashga qodir bo‘lgan, bozor sharoitida ishni tashkil etishning usullarini egallagan yuqori ma’lumotli malakali kadrlar tayyorlash; Universitet tarkibiy tuzilmasidagi barcha bo‘linmalar vakolatlarini belgilab berish, faoliyatlarini rejalashtirish, muvofiqlashtirish, boshqarish, marketing xizmatini rivojlantirib, ta’lim yo‘nalishi va ixtisosliklarga talab va ehtiyojni o‘rganish; Bitiruvchilarni amalda ishga joylashishi tahlili, mutaxassislarni maqsadli tayyorlash borasida hamkorlik shartnomalari tuzishni tashkil etish; Xorijiy hamkorlar bilan ilmiy-ijodiy aloqalarni rivojlantirish, investitsiya va grantlar jalb etilishini ta’minlash, qo‘shma korxonalar tashkil etish faoliyatini amalga oshirish.": {
    "uz": "Xalqaro ta’lim standartlari asosida yuksak ma’naviy-axloqiy fazilatli, mustaqil fikrlashga qodir bo‘lgan, bozor sharoitida ishni tashkil etishning usullarini egallagan yuqori ma’lumotli malakali kadrlar tayyorlash; universitet tarkibiy tuzilmasidagi bo‘linmalar vakolatlarini belgilash, faoliyatini rejalashtirish, muvofiqlashtirish va boshqarish; marketing xizmatini rivojlantirish, ta’lim yo‘nalishlari va ixtisosliklarga talabni o‘rganish; bitiruvchilar bandligini tahlil qilish, maqsadli kadrlar tayyorlash bo‘yicha hamkorlik shartnomalarini tashkil etish; xorijiy hamkorlar bilan ilmiy-ijodiy aloqalarni rivojlantirish, investitsiya va grantlar jalb qilish hamda qo‘shma loyihalarni amalga oshirish.",
    "en": "Training highly educated and qualified specialists based on international education standards, with strong moral qualities, independent thinking and the ability to organize work in market conditions; defining the powers of university divisions, planning, coordinating and managing their activities; developing marketing services and studying demand for educational fields and specialties; analyzing graduate employment and organizing cooperation agreements for targeted specialist training; developing scientific and creative relations with foreign partners, attracting investments and grants, and implementing joint projects.",
    "ru": "Подготовка высокообразованных квалифицированных кадров на основе международных стандартов образования, обладающих высокими духовно-нравственными качествами, самостоятельным мышлением и навыками организации работы в рыночных условиях; определение полномочий подразделений университета, планирование, координация и управление их деятельностью; развитие маркетинговой службы и изучение спроса на направления и специальности; анализ трудоустройства выпускников и организация договоров о целевой подготовке специалистов; развитие научно-творческих связей с зарубежными партнерами, привлечение инвестиций и грантов, реализация совместных проектов."
  },
  "Ma'naviy-marifiy va yoshlar bilan ishlash boʻyicha prorektor": {
    "uz": "Ma’naviy-ma’rifiy ishlar va yoshlar bilan ishlash bo‘yicha prorektor",
    "en": "Vice-Rector for Spiritual, Educational and Youth Affairs",
    "ru": "Проректор по духовно-просветительской работе и работе с молодежью"
  },
  "O‘zbekiston Respublikasi qonunlari, Prezident farmonlari va farmoyishlari, Oliy Majlis va Vazirlar Mahkamasining ta’lim va kadrlar tayyorlash sohasidagi qarorlarini amalga oshirish; ma’naviy-ma’rifiy va tarbiya ishlarni tashkil etish; ta’lim qonunchiligining mohiyatini tushuntirish va vazifalarni amalga oshirish.": {
    "uz": "O‘zbekiston Respublikasi qonunlari, Prezident farmonlari va farmoyishlari, Oliy Majlis va Vazirlar Mahkamasining ta’lim va kadrlar tayyorlash sohasidagi qarorlarini amalga oshirish; ma’naviy-ma’rifiy va tarbiya ishlarini tashkil etish; ta’lim qonunchiligining mohiyatini tushuntirish va vazifalarni bajarish.",
    "en": "Implementing the laws of the Republic of Uzbekistan, presidential decrees and orders, and decisions of the Oliy Majlis and the Cabinet of Ministers in education and personnel training; organizing spiritual, educational and upbringing work; explaining the essence of education legislation and fulfilling related tasks.",
    "ru": "Реализация законов Республики Узбекистан, указов и распоряжений Президента, решений Олий Мажлиса и Кабинета Министров в сфере образования и подготовки кадров; организация духовно-просветительской и воспитательной работы; разъяснение сути законодательства об образовании и выполнение соответствующих задач."
  },
  "Rektor yordamchisi": {
    "uz": "Rektor yordamchisi",
    "en": "Assistant to the Rector",
    "ru": "Помощник ректора"
  },
  "Oliy va o‘rta maxsus ta’lim vazirligi va universitet rahbariyati tomonidan zamonaviy talablarga muvofiq belgilanadigan axborot siyosatini shakllantirish va amalga oshirishda ishtirok etadi. Keng jamoatchilikni universitetning faoliyati to‘g‘risida xolisona, sifatli va tezkor xabardor qiladi.": {
    "uz": "Oliy va o‘rta maxsus ta’lim vazirligi hamda universitet rahbariyati tomonidan zamonaviy talablarga muvofiq belgilanadigan axborot siyosatini shakllantirish va amalga oshirishda ishtirok etadi. Keng jamoatchilikni universitet faoliyati to‘g‘risida xolis, sifatli va tezkor xabardor qiladi.",
    "en": "Participates in forming and implementing the information policy defined by the Ministry of Higher and Secondary Specialized Education and the university administration in line with modern requirements. Provides the public with objective, high-quality and timely information about the university’s activities.",
    "ru": "Участвует в формировании и реализации информационной политики, определяемой Министерством высшего и среднего специального образования и руководством университета в соответствии с современными требованиями. Оперативно, качественно и объективно информирует общественность о деятельности университета."
  },
  "Akademik ishlar bo‘yicha prorektori": {
    "uz": "Akademik ishlar bo‘yicha prorektor",
    "en": "Vice-Rector for Academic Affairs",
    "ru": "Проректор по академическим вопросам"
  },
  "O‘zbekiston Respublikasi qonunlari, Prezident farmonlari, Oliy Majlis va Vazirlar Mahkamasining ta’lim va kadrlar tayyorlash sohasidagi qarorlarini amalga oshirishni tashkil etish, davlat ta’lim standartlari asosida o‘quv va o‘quv uslubiy ishlarni tashkil etish hamda malakali kadrlar tayyorlashni ta’minlash, mutasaddi yuqori tashkilotlarning buyruqlari, farmoyishlari va ko‘rsatmalari, o‘quv jarayoniga oid masalalar bo‘yicha Universitet kengashi qarorlari va rektor buyruqlarining bajarilishini ta’minlash, o‘quv jarayonida o‘qitishning ilg‘or shakllarini, shu jumladan masofadan turib o‘qitish, yangi pedagogik va axborot-kommunikatsiya texnologiyalarini joriy etish va ulardan foydalanishni tashkil etish va boshqalardan iborat.": {
    "uz": "O‘zbekiston Respublikasi qonunlari, Prezident farmonlari, Oliy Majlis va Vazirlar Mahkamasining ta’lim va kadrlar tayyorlash sohasidagi qarorlarini amalga oshirishni tashkil etish; davlat ta’lim standartlari asosida o‘quv va o‘quv-uslubiy ishlarni yo‘lga qo‘yish hamda malakali kadrlar tayyorlashni ta’minlash; yuqori tashkilotlar buyruqlari, farmoyishlari, ko‘rsatmalari, Universitet kengashi qarorlari va rektor buyruqlari bajarilishini ta’minlash; o‘quv jarayoniga ilg‘or ta’lim shakllari, masofaviy ta’lim, yangi pedagogik va axborot-kommunikatsiya texnologiyalarini joriy etishdan iborat.",
    "en": "Organizing the implementation of laws of the Republic of Uzbekistan, presidential decrees and decisions of the Oliy Majlis and the Cabinet of Ministers in education and personnel training; organizing educational and methodological work based on state education standards and ensuring the training of qualified personnel; ensuring the fulfillment of orders and instructions of higher organizations, decisions of the University Council and orders of the rector; introducing advanced forms of teaching, including distance learning, new pedagogical and information-communication technologies into the educational process.",
    "ru": "Организация реализации законов Республики Узбекистан, указов Президента, решений Олий Мажлиса и Кабинета Министров в сфере образования и подготовки кадров; организация учебной и учебно-методической работы на основе государственных образовательных стандартов и обеспечение подготовки квалифицированных кадров; обеспечение исполнения приказов и указаний вышестоящих организаций, решений Совета университета и приказов ректора; внедрение передовых форм обучения, включая дистанционное обучение, новые педагогические и информационно-коммуникационные технологии."
  },
  "Rektorning talabalar orasida ma’naviy muhit barqarorligini ta’minlashga mas’ul maslahatchisi": {
    "uz": "Rektorning talabalar orasida ma’naviy muhit barqarorligini ta’minlashga mas’ul maslahatchisi",
    "en": "Rector’s adviser responsible for maintaining a stable spiritual environment among students",
    "ru": "Советник ректора, ответственный за стабильную духовную среду среди студентов"
  },
  "Talaba-yoshlar o‘rtasida ijtimoiy-ma’naviy muhit barqarorligini ta’minlash, ularni turli illatlar ta’siridan asrash ishlarini tashkil qiladi. Oʻquv jarayonini takomillashtirish, universitet yoshlari o‘rtasida sog‘lom muhit ustuvorligiga erishish borasida takliflar kiritadi va amalga oshirilishida bosh-qosh bo‘ladi.": {
    "uz": "Talaba-yoshlar o‘rtasida ijtimoiy-ma’naviy muhit barqarorligini ta’minlash, ularni turli illatlar ta’siridan asrash ishlarini tashkil qiladi. O‘quv jarayonini takomillashtirish va universitet yoshlari o‘rtasida sog‘lom muhit ustuvorligiga erishish bo‘yicha takliflar kiritadi hamda ularning amalga oshirilishida bosh-qosh bo‘ladi.",
    "en": "Organizes work to ensure a stable social and spiritual environment among students and protect them from harmful influences. Makes proposals to improve the educational process and strengthen a healthy environment among university youth, and supports their implementation.",
    "ru": "Организует работу по обеспечению стабильной социально-духовной среды среди студентов и защите их от вредных влияний. Вносит предложения по совершенствованию учебного процесса и укреплению здоровой среды среди молодежи университета, а также содействует их реализации."
  },
  "Imora AI boshlang‘ich tashkilot yetakchisi": {
    "uz": "Imora AI boshlang‘ich tashkilot yetakchisi",
    "en": "Leader of Imora AI’s primary youth organization",
    "ru": "Лидер первичной организации Кокандского университета"
  },
  "“Imora AI boshlang‘ich tashkilot yetakchisi — talabalarning ijtimoiy faolligini oshirish, yoshlarni birlashtirish va universitet hayotida ularning tashabbuslarini qo‘llab-quvvatlashga xizmat qiluvchi mas’ul hamda yetakchi lavozim egasi.”": {
    "uz": "“Imora AI boshlang‘ich tashkilot yetakchisi — talabalarning ijtimoiy faolligini oshirish, yoshlarni birlashtirish va universitet hayotida ularning tashabbuslarini qo‘llab-quvvatlashga xizmat qiluvchi mas’ul hamda yetakchi lavozim egasi.”",
    "en": "“The leader of Imora AI’s primary organization is a responsible leadership role that helps increase students’ social activity, unite young people and support their initiatives in university life.”",
    "ru": "«Лидер первичной организации Кокандского университета — ответственная руководящая должность, направленная на повышение социальной активности студентов, объединение молодежи и поддержку их инициатив в жизни университета»."
  },
  "Ilmiy ishlar va innovatsiyalar boʻyicha prorektor": {
    "uz": "Ilmiy ishlar va innovatsiyalar bo‘yicha prorektor",
    "en": "Vice-Rector for Research and Innovation",
    "ru": "Проректор по научной работе и инновациям"
  },
  "O‘zbekiston Respublikasi qonunlari, Prezident farmonlari va farmoyishlari, Oliy Majlis va Vazirlar Mahkamasining ilm-fan, innovatsion faoliyat, taʼlim hamda kadrlar tayyorlash sohasidagi qarorlarini amalga oshirishni tashkil etish; ilmiy tadqiqot faoliyatini muvofiqlashtirish; professor-o‘qituvchilarning ilmiy ishlarini nazorat qilish; xalqaro va respublika miqyosidagi ilmiy konferensiyalarni tashkil etish; ilmiy tadqiqot ishlari natijalarini amaliyotga joriy etish va boshqalar.": {
    "uz": "O‘zbekiston Respublikasi qonunlari, Prezident farmonlari va farmoyishlari, Oliy Majlis va Vazirlar Mahkamasining ilm-fan, innovatsion faoliyat, ta’lim hamda kadrlar tayyorlash sohasidagi qarorlarini amalga oshirishni tashkil etish; ilmiy tadqiqot faoliyatini muvofiqlashtirish; professor-o‘qituvchilarning ilmiy ishlarini nazorat qilish; xalqaro va respublika miqyosidagi ilmiy konferensiyalarni tashkil etish; ilmiy tadqiqot ishlari natijalarini amaliyotga joriy etish va boshqalar.",
    "en": "Organizing the implementation of laws of the Republic of Uzbekistan, presidential decrees and decisions in science, innovation, education and personnel training; coordinating research activities; supervising the scientific work of faculty members; organizing international and national scientific conferences; applying research results in practice, and more.",
    "ru": "Организация реализации законов Республики Узбекистан, указов и распоряжений Президента, решений в сфере науки, инновационной деятельности, образования и подготовки кадров; координация научно-исследовательской деятельности; контроль научной работы профессорско-преподавательского состава; организация международных и республиканских научных конференций; внедрение результатов исследований в практику и другое."
  },
  "Learn more about our tutors": {
    "uz": "Tutorlarimiz haqida batafsil",
    "en": "Learn more about our tutors",
    "ru": "Подробнее о наших тьюторах"
  },
  "Personal Tutors": {
    "uz": "Shaxsiy yordam",
    "en": "Personal support",
    "ru": "Персональная поддержка"
  },
  "Your education - our expertise": {
    "uz": "Imora AI — doim yoningizda",
    "en": "Imora AI — always by your side",
    "ru": "Imora AI — всегда рядом"
  },
  "What is a Personal Tutor?": {
    "uz": "Imora AI qanday yordam beradi?",
    "en": "How does Imora AI help?",
    "ru": "Как помогает Imora AI?"
  },
  "Kokand universitetidagi tutorim bilan haftalik uchrashuvlarim mustaqil o‘qishning erkinligi va mas’uliyatini yaxshiroq tushunishga yordam beradi. Men o‘qish jarayonimni o‘zim boshqaraman, lekin bu intizom va javobgarlikni talab qiladi. Tutorim esa menga yo‘nalish berib, maqsadlarimga erishishda qo‘llab-quvvatlaydi. Bu jarayon menga mustaqil fikrlash va o‘z ustimda ishlash ko‘nikmasini rivojlantiradi.": {
    "uz": "Imora AI bilan ishlash men uchun juda oson bo‘ldi. Savol tug‘ilsa, jamoa tez javob beradi va qo‘llanma har doim yonimda. Men saytim ma’lumotini o‘zim boshqaraman, Imora AI esa menga aniq yo‘nalish berib, to‘g‘ri qaror qabul qilishда yordam beradi.",
    "en": "Working with Imora AI has been very easy for me. When a question comes up, the team responds quickly and the docs are always there. I manage my site's data myself, while Imora AI gives me clear direction and helps me make the right decisions.",
    "ru": "Работать с Imora AI мне очень легко. Если возникает вопрос, команда быстро отвечает, а документация всегда под рукой. Я сам управляю данными сайта, а Imora AI даёт чёткое направление и помогает принимать верные решения."
  },
  "Learn more about our Personal Tutors and the wider academic support options available to students at Imora AI": {
    "uz": "Imora AI foydalanuvchilari uchun yordam va qo‘llab-quvvatlash imkoniyatlari haqida batafsil bilib oling",
    "en": "Learn more about the help and support options available to Imora AI users",
    "ru": "Узнайте больше о возможностях помощи и поддержки для пользователей Imora AI"
  },
  "IN UNCERTAIN TIMES, QUALITY COUNTS": {
    "uz": "MUHIM QARORLARDA — ANIQ MA’LUMOT",
    "en": "IN KEY DECISIONS, CLEAR DATA COUNTS",
    "ru": "В ВАЖНЫХ РЕШЕНИЯХ ВАЖНЫ ТОЧНЫЕ ДАННЫЕ"
  },
  "Umummilliy AI Hackathon Farg‘ona | 2-kun 🏫 Farg‘ona shahrida bo'lib o'tayotgan Umummilliy AI Hackathonda Imora AI talabalari ham faol ishtirok etib, o‘z innovatsion g‘oyalari va texnologik loyihalari bilan qatnashmoqdalar. 🏫 2-kun har bir jamoa o'z loyihalarini mentorlar va ekspertlarga taqdim etish uchun tayyorgarlik jarayonlarini olib bormoqda. Ishtirokchilar jamiyat va kelajak uchun muhim bo‘lgan yo‘nalishlarda AI asosidagi yechimlar ustida ishlashmoqda. Loyiha mavzulari: - Ta'lim sohasida AI platforma - Kasallikni erta aniqlash - Ta'lim jarayonlarida inklyuziv ta'limga muhtoz bo'lgan shaxslar uchun mobil dasturiy ta'minot 🎁 Eng yaxshi loyihalar qimmatbaho sovrinlar va maxsus nominatsiyalar bilan taqdirlanadi. Hackathon 23-may kuniga qadar davom etadi.": {
    "uz": "Umummilliy AI Hackathon Farg‘ona | 2-kun 🏫 Farg‘ona shahrida bo‘lib o‘tayotgan Umummilliy AI Hackathonda Imora AI talabalari ham faol ishtirok etib, o‘z innovatsion g‘oyalari va texnologik loyihalari bilan qatnashmoqdalar. 2-kun har bir jamoa o‘z loyihalarini mentorlar va ekspertlarga taqdim etishga tayyorgarlik ko‘rmoqda. Ishtirokchilar jamiyat va kelajak uchun muhim yo‘nalishlarda AI asosidagi yechimlar ustida ishlashmoqda. Loyiha mavzulari: ta’lim sohasida AI platforma, kasallikni erta aniqlash, inklyuziv ta’limga muhtoj shaxslar uchun mobil dasturiy ta’minot. Eng yaxshi loyihalar qimmatbaho sovrinlar va maxsus nominatsiyalar bilan taqdirlanadi. Hackathon 23-may kuniga qadar davom etadi.",
    "en": "National AI Hackathon Fergana | Day 2 🏫 Imora AI students are actively participating in the National AI Hackathon taking place in Fergana, presenting innovative ideas and technological projects. On day 2, each team is preparing to present its project to mentors and experts. Participants are working on AI-based solutions in areas important for society and the future. Project topics include: an AI platform for education, early disease detection, and mobile software for people who need inclusive education. The best projects will receive valuable prizes and special nominations. The hackathon continues until May 23.",
    "ru": "Национальный AI Hackathon Фергана | 2-й день 🏫 Студенты Кокандского университета активно участвуют в Национальном AI Hackathon в Фергане, представляя инновационные идеи и технологические проекты. Во второй день команды готовятся представить свои проекты наставникам и экспертам. Участники работают над AI-решениями в направлениях, важных для общества и будущего: AI-платформа для образования, раннее выявление заболеваний и мобильное приложение для людей, нуждающихся в инклюзивном образовании. Лучшие проекты будут отмечены ценными призами и специальными номинациями. Хакатон продолжается до 23 мая."
  },
  "Partnerships": {
    "uz": "Hamkorliklar",
    "en": "Partnerships",
    "ru": "Партнерства"
  },
  "Learning without boundaries.": {
    "uz": "Chegarasiz tahlil.",
    "en": "Analytics without boundaries.",
    "ru": "Аналитика без границ."
  },
  "“Learning without boundaries” means gaining knowledge freely, without limits of place, time, or method. It encourages students to explore beyond the classroom, take responsibility for their own learning, and use different resources to grow independently. It is about curiosity, flexibility, and continuous self-development.": {
    "uz": "“Chegarasiz tahlil” — joy, vaqt yoki qurilma bilan cheklanmasdan auditoriyangizni tushunish demakdir. Imora AI real vaqtда, istalgan joydan ma’lumot beradi va sizni to‘g‘ri qarorlar sari yo‘naltiradi. Bu erkinlik, moslashuvchanlik va uzluksiz o‘sish haqidadir.",
    "en": "“Analytics without boundaries” means understanding your audience without limits of place, time, or device. Imora AI gives you real-time data from anywhere and guides you toward the right decisions. It is about freedom, flexibility, and continuous growth.",
    "ru": "«Аналитика без границ» — это понимание аудитории без ограничений места, времени и устройства. Imora AI даёт данные в реальном времени из любого места и направляет к верным решениям. Это про свободу, гибкость и постоянный рост."
  },
  "Our students": {
    "uz": "Mijozlarimiz",
    "en": "Our customers",
    "ru": "Наши клиенты"
  },
  "Trying to fit in? One size doesn’t fit all.": {
    "uz": "Moslashishga urinayapsizmi? Hamma uchun bitta qolip to‘g‘ri kelmaydi.",
    "en": "Trying to fit in? One size doesn’t fit all.",
    "ru": "Пытаетесь вписаться? Один подход не подходит всем."
  },
  "Arthur, one of the students at Greene’s, shares his plans and future aspirations.": {
    "uz": "Foydalanuvchilarimizdan biri Imora AI bilan ish tajribasi va rejalari haqida so‘zlaydi.",
    "en": "One of our users shares their experience with Imora AI and their plans.",
    "ru": "Один из наших пользователей делится опытом работы с Imora AI и своими планами."
  },
  "Lucia tells us about her experiences at Greene’s and how Greene’s help her achieving her academic and personal goals.": {
    "uz": "Bir mijoz Imora AI unga auditoriyani tushunish va to‘g‘ri qarorlar qabul qilishda qanday yordam berganini so‘zlab beradi.",
    "en": "A customer tells us how Imora AI helped them understand their audience and make better decisions.",
    "ru": "Клиент рассказывает, как Imora AI помог понять аудиторию и принимать верные решения."
  },
  "What's On": {
    "uz": "Yangiliklar",
    "en": "What's On",
    "ru": "Афиша и новости"
  },
  "23-may 2026": {
    "uz": "23-may 2026",
    "en": "May 23, 2026",
    "ru": "23 мая 2026"
  },
  "Umummilliy AI Hackathon Farg‘ona | 2-kun": {
    "uz": "Umummilliy AI Hackathon Farg‘ona | 2-kun",
    "en": "National AI Hackathon Fergana | Day 2",
    "ru": "Национальный AI Hackathon Фергана | 2-й день"
  },
  "Is Taking a Gap Year a Good Idea?": {
    "uz": "Gap Year olish yaxshi fikrmi?",
    "en": "Is Taking a Gap Year a Good Idea?",
    "ru": "Gap Year — хорошая идея?"
  },
  "The Top 5 A level Retake FAQS": {
    "uz": "A level qayta topshirish bo‘yicha 5 ta asosiy savol",
    "en": "The Top 5 A level Retake FAQS",
    "ru": "Топ-5 вопросов о пересдаче A level"
  },
  "See all news": {
    "uz": "Barcha yangiliklar",
    "en": "See all news",
    "ru": "Все новости"
  },
  "You might be interested in": {
    "uz": "Sizni qiziqtirishi mumkin",
    "en": "You might be interested in",
    "ru": "Вас может заинтересовать"
  },
  "Courses": {
    "uz": "Kurslar",
    "en": "Courses",
    "ru": "Курсы"
  },
  "Close": {
    "uz": "Yopish",
    "en": "Close",
    "ru": "Закрыть"
  },
  "PROGRAMMER DAVRONOV OYBEK NORIDDIN OG'LI": {
    "uz": "DASTURCHI DAVRONOV OYBEK NORIDDIN O‘G‘LI",
    "en": "PROGRAMMER DAVRONOV OYBEK NORIDDIN OG'LI",
    "ru": "ПРОГРАММИСТ ДАВРОНОВ ОЙБЕК НОРИДДИН УГЛИ"
  },
  "KU Prospectus": {
    "uz": "KU prospekti",
    "en": "KU Prospectus",
    "ru": "Проспект KU"
  },
  "Create your personal prospectus by selecting your interests.": {
    "uz": "Qiziqishlaringizni tanlab, shaxsiy prospektingizni yarating.",
    "en": "Create your personal prospectus by selecting your interests.",
    "ru": "Создайте персональный проспект, выбрав свои интересы."
  },
  "The Story of KU": {
    "uz": "KU tarixi",
    "en": "The Story of KU",
    "ru": "История KU"
  },
  "Retaking A levels": {
    "uz": "A levels qayta topshirish",
    "en": "Retaking A levels",
    "ru": "Пересдача A levels"
  },
  "Academic Support Programme": {
    "uz": "Akademik qo‘llab-quvvatlash dasturi",
    "en": "Academic Support Programme",
    "ru": "Программа академической поддержки"
  },
  "University Preparation": {
    "uz": "Universitetga tayyorgarlik",
    "en": "University Preparation",
    "ru": "Подготовка к университету"
  },
  "University Applications": {
    "uz": "Universitetga arizalar",
    "en": "University Applications",
    "ru": "Поступление в университет"
  },
  "Interview preparation programme": {
    "uz": "Suhbatga tayyorgarlik dasturi",
    "en": "Interview preparation programme",
    "ru": "Программа подготовки к интервью"
  },
  "Going to the U.S.": {
    "uz": "AQSHga yo‘l",
    "en": "Going to the U.S.",
    "ru": "Поступление в США"
  },
  "Aptitude tests": {
    "uz": "Qobiliyat testlari",
    "en": "Aptitude tests",
    "ru": "Тесты способностей"
  },
  "Short Courses": {
    "uz": "Qisqa kurslar",
    "en": "Short Courses",
    "ru": "Краткосрочные курсы"
  },
  "Exams centre": {
    "uz": "Imtihon markazi",
    "en": "Exams centre",
    "ru": "Экзаменационный центр"
  },
  "Science practicals": {
    "uz": "Fan amaliyotlari",
    "en": "Science practicals",
    "ru": "Практические занятия по наукам"
  },
  "Online Tuition": {
    "uz": "Onlayn ta’lim",
    "en": "Online Tuition",
    "ru": "Онлайн-обучение"
  },
  "Athletes at KU": {
    "uz": "KU sportchilari",
    "en": "Athletes at KU",
    "ru": "Спортсмены KU"
  },
  "International students": {
    "uz": "Xalqaro talabalar",
    "en": "International students",
    "ru": "Иностранные студенты"
  },
  "Educational agents": {
    "uz": "Ta’lim agentlari",
    "en": "Educational agents",
    "ru": "Образовательные агенты"
  },
  "This link will take you to KU International": {
    "uz": "Bu havola sizni KU International sahifasiga olib boradi",
    "en": "This link will take you to KU International",
    "ru": "Эта ссылка перенаправит вас на KU International"
  },
  "Proceed": {
    "uz": "Davom etish",
    "en": "Proceed",
    "ru": "Продолжить"
  },
  "Download Form": {
    "uz": "Formani yuklab olish",
    "en": "Download Form",
    "ru": "Скачать форму"
  },
  "Name": {
    "uz": "Ism",
    "en": "Name",
    "ru": "Имя"
  },
  "E-mail": {
    "uz": "E-mail",
    "en": "E-mail",
    "ru": "Эл. почта"
  },
  "This field is hidden when viewing the form": {
    "uz": "Forma ko‘rilganda bu maydon yashiriladi",
    "en": "This field is hidden when viewing the form",
    "ru": "Это поле скрыто при просмотре формы"
  },
  "Redirect URL": {
    "uz": "Yo‘naltirish URL manzili",
    "en": "Redirect URL",
    "ru": "URL перенаправления"
  },
  "(Required)": {
    "uz": "(Majburiy)",
    "en": "(Required)",
    "ru": "(Обязательно)"
  },
  "CAPTCHA": {
    "uz": "CAPTCHA",
    "en": "CAPTCHA",
    "ru": "CAPTCHA"
  },
  "We use cookies on our website to give you the most relevant experience by remembering your preferences and repeat visits. By clicking “Accept”, you consent to the use of ALL the cookies. However you may visit Cookie Settings to provide a controlled consent.": {
    "uz": "Saytimizda sizning afzalliklaringizni eslab qolish va tajribangizni yaxshilash uchun cookie-fayllardan foydalanamiz. “Qabul qilish” tugmasini bosish orqali barcha cookie-fayllardan foydalanishga rozilik bildirasiz. Biroq cookie sozlamalariga kirib, rozilikni boshqarishingiz mumkin.",
    "en": "We use cookies on our website to give you the most relevant experience by remembering your preferences and repeat visits. By clicking “Accept”, you consent to the use of ALL the cookies. However you may visit Cookie Settings to provide a controlled consent.",
    "ru": "Мы используем cookie-файлы, чтобы запоминать ваши предпочтения и улучшать опыт посещения сайта. Нажимая «Принять», вы соглашаетесь на использование всех cookie. Вы также можете открыть настройки cookie и управлять согласием."
  },
  "Read More": {
    "uz": "Batafsil",
    "en": "Read More",
    "ru": "Подробнее"
  },
  "Cookie settings": {
    "uz": "Cookie sozlamalari",
    "en": "Cookie settings",
    "ru": "Настройки cookie"
  },
  "ACCEPT": {
    "uz": "QABUL QILISH",
    "en": "ACCEPT",
    "ru": "ПРИНЯТЬ"
  },
  "Manage consent": {
    "uz": "Rozilikni boshqarish",
    "en": "Manage consent",
    "ru": "Управление согласием"
  },
  "Privacy Overview": {
    "uz": "Maxfiylik haqida umumiy ma’lumot",
    "en": "Privacy Overview",
    "ru": "Обзор конфиденциальности"
  },
  "This website uses cookies to improve your experience while you navigate through the website. Out of these cookies, the cookies that are categorized as necessary are stored on your browser as they are essential for the working of basic functionalities of the website. We also use third-party cookies that help us analyze and understand how you use this website. These cookies will be stored in your browser only with your consent. You also have the option to opt-out of these cookies. But opting out of some of these cookies may have an effect on your browsing experience.": {
    "uz": "Ushbu sayt ko‘rish tajribangizni yaxshilash uchun cookie-fayllardan foydalanadi. Zarur cookie-fayllar brauzeringizda saqlanadi, chunki ular saytning asosiy funksiyalari ishlashi uchun kerak. Shuningdek, saytimizdan qanday foydalanishingizni tahlil qilishga yordam beradigan uchinchi tomon cookie-fayllaridan ham foydalanamiz. Bu cookie-fayllar faqat roziligingiz bilan brauzeringizda saqlanadi. Siz ulardan voz kechishingiz mumkin, ammo ayrim cookie-fayllarni o‘chirish sayt tajribasiga ta’sir qilishi mumkin.",
    "en": "This website uses cookies to improve your experience while you navigate through the website. Out of these cookies, the cookies that are categorized as necessary are stored on your browser as they are essential for the working of basic functionalities of the website. We also use third-party cookies that help us analyze and understand how you use this website. These cookies will be stored in your browser only with your consent. You also have the option to opt-out of these cookies. But opting out of some of these cookies may have an effect on your browsing experience.",
    "ru": "Этот сайт использует cookie-файлы, чтобы улучшить ваш опыт просмотра. Необходимые cookie сохраняются в браузере, так как они нужны для работы базовых функций сайта. Мы также используем сторонние cookie, которые помогают анализировать и понимать, как вы пользуетесь сайтом. Эти cookie будут сохранены в браузере только с вашего согласия. Вы можете отказаться от них, но отключение некоторых cookie может повлиять на работу сайта."
  },
  "Necessary": {
    "uz": "Zarur",
    "en": "Necessary",
    "ru": "Необходимые"
  },
  "Always Enabled": {
    "uz": "Doim yoqilgan",
    "en": "Always Enabled",
    "ru": "Всегда включены"
  },
  "Necessary cookies are absolutely essential for the website to function properly. These cookies ensure basic functionalities and security features of the website, anonymously.": {
    "uz": "Zarur cookie-fayllar saytning to‘g‘ri ishlashi uchun mutlaqo kerak. Ular saytning asosiy funksiyalari va xavfsizlik imkoniyatlarini anonim tarzda ta’minlaydi.",
    "en": "Necessary cookies are absolutely essential for the website to function properly. These cookies ensure basic functionalities and security features of the website, anonymously.",
    "ru": "Необходимые cookie абсолютно важны для правильной работы сайта. Они анонимно обеспечивают базовые функции и функции безопасности сайта."
  },
  "Cookie": {
    "uz": "Cookie",
    "en": "Cookie",
    "ru": "Cookie"
  },
  "Duration": {
    "uz": "Muddati",
    "en": "Duration",
    "ru": "Срок"
  },
  "Description": {
    "uz": "Tavsif",
    "en": "Description",
    "ru": "Описание"
  },
  "1 year": {
    "uz": "1 yil",
    "en": "1 year",
    "ru": "1 год"
  },
  "Set by the GDPR Cookie Consent plugin, this cookie is used to record the user consent for the cookies in the \"Advertisement\" category .": {
    "uz": "GDPR Cookie Consent plagini tomonidan o‘rnatiladi; bu cookie “Reklama” toifasidagi cookie-fayllar bo‘yicha foydalanuvchi roziligini saqlash uchun ishlatiladi.",
    "en": "Set by the GDPR Cookie Consent plugin, this cookie is used to record the user consent for the cookies in the \"Advertisement\" category .",
    "ru": "Этот cookie устанавливается плагином GDPR Cookie Consent и используется для записи согласия пользователя на cookie категории «Реклама»."
  },
  "Set by the GDPR Cookie Consent plugin, this cookie is used to record the user consent for the cookies in the \"Analytics\" category .": {
    "uz": "GDPR Cookie Consent plagini tomonidan o‘rnatiladi; bu cookie “Analitika” toifasidagi cookie-fayllar bo‘yicha foydalanuvchi roziligini saqlash uchun ishlatiladi.",
    "en": "Set by the GDPR Cookie Consent plugin, this cookie is used to record the user consent for the cookies in the \"Analytics\" category .",
    "ru": "Этот cookie устанавливается плагином GDPR Cookie Consent и используется для записи согласия пользователя на cookie категории «Аналитика»."
  },
  "The cookie is set by the GDPR Cookie Consent plugin to record the user consent for the cookies in the category \"Functional\".": {
    "uz": "Bu cookie GDPR Cookie Consent plagini tomonidan “Funksional” toifadagi cookie-fayllar bo‘yicha foydalanuvchi roziligini saqlash uchun o‘rnatiladi.",
    "en": "The cookie is set by the GDPR Cookie Consent plugin to record the user consent for the cookies in the category \"Functional\".",
    "ru": "Этот cookie устанавливается плагином GDPR Cookie Consent для записи согласия пользователя на cookie категории «Функциональные»."
  },
  "Set by the GDPR Cookie Consent plugin to record the user consent for the cookies in the \"Necessary\" category .": {
    "uz": "GDPR Cookie Consent plagini tomonidan “Zarur” toifadagi cookie-fayllar bo‘yicha foydalanuvchi roziligini saqlash uchun o‘rnatiladi.",
    "en": "Set by the GDPR Cookie Consent plugin to record the user consent for the cookies in the \"Necessary\" category .",
    "ru": "Устанавливается плагином GDPR Cookie Consent для записи согласия пользователя на cookie категории «Необходимые»."
  },
  "Set by the GDPR Cookie Consent plugin, this cookie is used to store the user consent for cookies in the category \"Others\".": {
    "uz": "GDPR Cookie Consent plagini tomonidan o‘rnatiladi; bu cookie “Boshqalar” toifasidagi cookie-fayllar bo‘yicha foydalanuvchi roziligini saqlash uchun ishlatiladi.",
    "en": "Set by the GDPR Cookie Consent plugin, this cookie is used to store the user consent for cookies in the category \"Others\".",
    "ru": "Этот cookie устанавливается плагином GDPR Cookie Consent и хранит согласие пользователя на cookie категории «Другие»."
  },
  "Set by the GDPR Cookie Consent plugin, this cookie is used to store the user consent for cookies in the category \"Performance\".": {
    "uz": "GDPR Cookie Consent plagini tomonidan o‘rnatiladi; bu cookie “Ishlash samaradorligi” toifasidagi cookie-fayllar bo‘yicha foydalanuvchi roziligini saqlash uchun ishlatiladi.",
    "en": "Set by the GDPR Cookie Consent plugin, this cookie is used to store the user consent for cookies in the category \"Performance\".",
    "ru": "Этот cookie устанавливается плагином GDPR Cookie Consent и хранит согласие пользователя на cookie категории «Производительность»."
  },
  "session": {
    "uz": "sessiya",
    "en": "session",
    "ru": "сессия"
  },
  "Zoho sets this cookie for website security when a request is sent to campaigns.": {
    "uz": "Kampaniyalarga so‘rov yuborilganda sayt xavfsizligi uchun bu cookie Zoho tomonidan o‘rnatiladi.",
    "en": "Zoho sets this cookie for website security when a request is sent to campaigns.",
    "ru": "Zoho устанавливает этот cookie для безопасности сайта при отправке запроса в кампании."
  },
  "Functional": {
    "uz": "Funksional",
    "en": "Functional",
    "ru": "Функциональные"
  },
  "functional": {
    "uz": "funksional",
    "en": "functional",
    "ru": "функциональные"
  },
  "Functional cookies help to perform certain functionalities like sharing the content of the website on social media platforms, collect feedbacks, and other third-party features.": {
    "uz": "Funksional cookie-fayllar sayt kontentini ijtimoiy tarmoqlarda ulashish, fikr-mulohaza yig‘ish va boshqa uchinchi tomon imkoniyatlarini bajarishga yordam beradi.",
    "en": "Functional cookies help to perform certain functionalities like sharing the content of the website on social media platforms, collect feedbacks, and other third-party features.",
    "ru": "Функциональные cookie помогают выполнять такие функции, как публикация контента сайта в социальных сетях, сбор отзывов и другие сторонние возможности."
  },
  "Zoho sets this cookie for the login function on the website.": {
    "uz": "Zoho bu cookie-faylni saytdagi kirish funksiyasi uchun o‘rnatadi.",
    "en": "Zoho sets this cookie for the login function on the website.",
    "ru": "Zoho устанавливает этот cookie для функции входа на сайт."
  },
  "Performance": {
    "uz": "Samaradorlik",
    "en": "Performance",
    "ru": "Производительность"
  },
  "performance": {
    "uz": "samaradorlik",
    "en": "performance",
    "ru": "производительность"
  },
  "Performance cookies are used to understand and analyze the key performance indexes of the website which helps in delivering a better user experience for the visitors.": {
    "uz": "Samaradorlik cookie-fayllari saytning asosiy ishlash ko‘rsatkichlarini tushunish va tahlil qilish uchun ishlatiladi hamda tashrif buyuruvchilar tajribasini yaxshilashga yordam beradi.",
    "en": "Performance cookies are used to understand and analyze the key performance indexes of the website which helps in delivering a better user experience for the visitors.",
    "ru": "Cookie производительности используются для понимания и анализа ключевых показателей работы сайта, что помогает улучшать опыт посетителей."
  },
  "Analytics": {
    "uz": "Analitika",
    "en": "Analytics",
    "ru": "Аналитика"
  },
  "analytics": {
    "uz": "analitika",
    "en": "analytics",
    "ru": "аналитика"
  },
  "Analytical cookies are used to understand how visitors interact with the website. These cookies help provide information on metrics the number of visitors, bounce rate, traffic source, etc.": {
    "uz": "Analitik cookie-fayllar tashrif buyuruvchilar sayt bilan qanday o‘zaro aloqada bo‘lishini tushunish uchun ishlatiladi. Ular tashriflar soni, chiqib ketish darajasi, trafik manbai kabi ko‘rsatkichlar haqida ma’lumot beradi.",
    "en": "Analytical cookies are used to understand how visitors interact with the website. These cookies help provide information on metrics the number of visitors, bounce rate, traffic source, etc.",
    "ru": "Аналитические cookie используются для понимания того, как посетители взаимодействуют с сайтом. Они помогают получать данные о количестве посетителей, показателе отказов, источнике трафика и других метриках."
  },
  "2 years": {
    "uz": "2 yil",
    "en": "2 years",
    "ru": "2 года"
  },
  "The _ga cookie, installed by Google Analytics, calculates visitor, session and campaign data and also keeps track of site usage for the site's analytics report. The cookie stores information anonymously and assigns a randomly generated number to recognize unique visitors.": {
    "uz": "Google Analytics o‘rnatadigan _ga cookie tashrif buyuruvchi, sessiya va kampaniya ma’lumotlarini hisoblaydi hamda sayt tahliliy hisobotlari uchun foydalanishni kuzatadi. Cookie ma’lumotlarni anonim saqlaydi va noyob tashrif buyuruvchilarni aniqlash uchun tasodifiy raqam beradi.",
    "en": "The _ga cookie, installed by Google Analytics, calculates visitor, session and campaign data and also keeps track of site usage for the site's analytics report. The cookie stores information anonymously and assigns a randomly generated number to recognize unique visitors.",
    "ru": "Cookie _ga, установленный Google Analytics, рассчитывает данные посетителей, сессий и кампаний, а также отслеживает использование сайта для аналитических отчетов. Cookie хранит информацию анонимно и присваивает случайный номер для распознавания уникальных посетителей."
  },
  "1 minute": {
    "uz": "1 daqiqa",
    "en": "1 minute",
    "ru": "1 минута"
  },
  "Set by Google to distinguish users.": {
    "uz": "Foydalanuvchilarni farqlash uchun Google tomonidan o‘rnatiladi.",
    "en": "Set by Google to distinguish users.",
    "ru": "Устанавливается Google для различения пользователей."
  },
  "1 day": {
    "uz": "1 kun",
    "en": "1 day",
    "ru": "1 день"
  },
  "Installed by Google Analytics, _gid cookie stores information on how visitors use a website, while also creating an analytics report of the website's performance. Some of the data that are collected include the number of visitors, their source, and the pages they visit anonymously.": {
    "uz": "Google Analytics tomonidan o‘rnatiladigan _gid cookie tashrif buyuruvchilar saytni qanday ishlatishi haqida ma’lumot saqlaydi va sayt ishlashi bo‘yicha tahliliy hisobot yaratishga yordam beradi. Yig‘iladigan ma’lumotlarga tashriflar soni, manbasi va anonim ko‘rilgan sahifalar kiradi.",
    "en": "Installed by Google Analytics, _gid cookie stores information on how visitors use a website, while also creating an analytics report of the website's performance. Some of the data that are collected include the number of visitors, their source, and the pages they visit anonymously.",
    "ru": "Cookie _gid, установленный Google Analytics, хранит информацию о том, как посетители используют сайт, и помогает формировать аналитический отчет о работе сайта. Среди собираемых данных — количество посетителей, источник и анонимно посещенные страницы."
  },
  "YouTube sets this cookie via embedded youtube-videos and registers anonymous statistical data.": {
    "uz": "YouTube bu cookie-faylni joylashtirilgan videolar orqali o‘rnatadi va anonim statistik ma’lumotlarni qayd etadi.",
    "en": "YouTube sets this cookie via embedded youtube-videos and registers anonymous statistical data.",
    "ru": "YouTube устанавливает этот cookie через встроенные видео и регистрирует анонимные статистические данные."
  },
  "Advertisement": {
    "uz": "Reklama",
    "en": "Advertisement",
    "ru": "Реклама"
  },
  "advertisement": {
    "uz": "reklama",
    "en": "advertisement",
    "ru": "реклама"
  },
  "Advertisement cookies are used to provide visitors with relevant ads and marketing campaigns. These cookies track visitors across websites and collect information to provide customized ads.": {
    "uz": "Reklama cookie-fayllari tashrif buyuruvchilarga mos reklamalar va marketing kampaniyalarini ko‘rsatish uchun ishlatiladi. Ular foydalanuvchilarni turli saytlar bo‘ylab kuzatib, moslashtirilgan reklama uchun ma’lumot yig‘adi.",
    "en": "Advertisement cookies are used to provide visitors with relevant ads and marketing campaigns. These cookies track visitors across websites and collect information to provide customized ads.",
    "ru": "Рекламные cookie используются для показа посетителям релевантной рекламы и маркетинговых кампаний. Они отслеживают посетителей на разных сайтах и собирают данные для персонализированной рекламы."
  },
  "5 months 27 days": {
    "uz": "5 oy 27 kun",
    "en": "5 months 27 days",
    "ru": "5 месяцев 27 дней"
  },
  "A cookie set by YouTube to measure bandwidth that determines whether the user gets the new or old player interface.": {
    "uz": "YouTube tomonidan o‘rnatiladigan bu cookie tarmoq o‘tkazuvchanligini o‘lchaydi va foydalanuvchiga yangi yoki eski player interfeysi ko‘rsatilishini aniqlaydi.",
    "en": "A cookie set by YouTube to measure bandwidth that determines whether the user gets the new or old player interface.",
    "ru": "Cookie, установленный YouTube для измерения пропускной способности и определения, будет ли пользователь видеть новый или старый интерфейс плеера."
  },
  "YSC cookie is set by Youtube and is used to track the views of embedded videos on Youtube pages.": {
    "uz": "YSC cookie YouTube tomonidan o‘rnatiladi va YouTube sahifalaridagi joylashtirilgan videolar ko‘rilishini kuzatish uchun ishlatiladi.",
    "en": "YSC cookie is set by Youtube and is used to track the views of embedded videos on Youtube pages.",
    "ru": "Cookie YSC устанавливается YouTube и используется для отслеживания просмотров встроенных видео на страницах YouTube."
  },
  "never": {
    "uz": "hech qachon",
    "en": "never",
    "ru": "никогда"
  },
  "YouTube sets this cookie to store the video preferences of the user using embedded YouTube video.": {
    "uz": "YouTube bu cookie-faylni joylashtirilgan video orqali foydalanuvchining video sozlamalarini saqlash uchun o‘rnatadi.",
    "en": "YouTube sets this cookie to store the video preferences of the user using embedded YouTube video.",
    "ru": "YouTube устанавливает этот cookie для хранения видеонастроек пользователя при использовании встроенного видео."
  },
  "This cookie, set by YouTube, registers a unique ID to store data on what videos from YouTube the user has seen.": {
    "uz": "YouTube tomonidan o‘rnatiladigan bu cookie foydalanuvchi YouTube’da ko‘rgan videolar haqidagi ma’lumotlarni saqlash uchun noyob ID qayd etadi.",
    "en": "This cookie, set by YouTube, registers a unique ID to store data on what videos from YouTube the user has seen.",
    "ru": "Этот cookie, установленный YouTube, регистрирует уникальный ID для хранения данных о том, какие видео YouTube пользователь посмотрел."
  },
  "Others": {
    "uz": "Boshqalar",
    "en": "Others",
    "ru": "Другие"
  },
  "others": {
    "uz": "boshqalar",
    "en": "others",
    "ru": "другие"
  },
  "Other uncategorized cookies are those that are being analyzed and have not been classified into a category as yet.": {
    "uz": "Boshqa tasniflanmagan cookie-fayllar hozir tahlil qilinayotgan va hali hech bir toifaga kiritilmagan cookie-fayllardir.",
    "en": "Other uncategorized cookies are those that are being analyzed and have not been classified into a category as yet.",
    "ru": "Другие неклассифицированные cookie — это cookie, которые анализируются и еще не отнесены ни к одной категории."
  },
  "No description available.": {
    "uz": "Tavsif mavjud emas.",
    "en": "No description available.",
    "ru": "Описание недоступно."
  },
  "2 hours": {
    "uz": "2 soat",
    "en": "2 hours",
    "ru": "2 часа"
  },
  "13 hours": {
    "uz": "13 soat",
    "en": "13 hours",
    "ru": "13 часов"
  },
  "No description": {
    "uz": "Tavsif yo‘q",
    "en": "No description",
    "ru": "Нет описания"
  },
  "30 minutes": {
    "uz": "30 daqiqa",
    "en": "30 minutes",
    "ru": "30 минут"
  },
  "Save & Accept": {
    "uz": "Saqlash va qabul qilish",
    "en": "Save & Accept",
    "ru": "Сохранить и принять"
  },
  "Powered by": {
    "uz": "Tomonidan quvvatlanadi",
    "en": "Powered by",
    "ru": "Работает на"
  },
  "09 Jun 2025": {
    "uz": "09-iyun 2025",
    "en": "09 Jun 2025",
    "ru": "09 июня 2025"
  },
  "06 Feb 2023": {
    "uz": "06-fevral 2023",
    "en": "06 Feb 2023",
    "ru": "06 февраля 2023"
  },
  "Set by the GDPR Cookie Consent plugin, this cookie is used to record the user consent for the cookies in the \"Necessary\" category .": {
    "uz": "GDPR Cookie Consent plagini tomonidan o‘rnatiladi; bu cookie “Zarur” toifadagi cookie-fayllar bo‘yicha foydalanuvchi roziligini saqlash uchun ishlatiladi.",
    "en": "Set by the GDPR Cookie Consent plugin, this cookie is used to record the user consent for the cookies in the \"Necessary\" category .",
    "ru": "Этот cookie устанавливается плагином GDPR Cookie Consent и используется для записи согласия пользователя на cookie категории «Необходимые»."
  },
  "Google Tag Manager (noscript)": {
    "uz": "Google Tag Manager (noscript)",
    "en": "Google Tag Manager (noscript)",
    "ru": "Google Tag Manager (noscript)"
  },
  "End Google Tag Manager (noscript)": {
    "uz": "End Google Tag Manager (noscript)",
    "en": "End Google Tag Manager (noscript)",
    "ru": "End Google Tag Manager (noscript)"
  },
  "begin Moneypenny code": {
    "uz": "begin Moneypenny code",
    "en": "begin Moneypenny code",
    "ru": "begin Moneypenny code"
  },
  "end Moneypenny code": {
    "uz": "end Moneypenny code",
    "en": "end Moneypenny code",
    "ru": "end Moneypenny code"
  },
  "Custom Feeds for Instagram JS": {
    "uz": "Instagram JS uchun maxsus lentalar",
    "en": "Custom Feeds for Instagram JS",
    "ru": "Пользовательские ленты Instagram JS"
  },
  "googleoff: all": {
    "uz": "googleoff: all",
    "en": "googleoff: all",
    "ru": "googleoff: all"
  },
  "googleon: all": {
    "uz": "googleon: all",
    "en": "googleon: all",
    "ru": "googleon: all"
  }
};
  var textSources = new WeakMap();
  var applying = false;
  var scheduled = false;

  function normalize(value) {
    return String(value || '').replace(/\s+/g, ' ').trim();
  }

  function getInitialLanguage() {
    try {
      var saved = window.localStorage.getItem('greenes_language');
      if (saved && SUPPORTED_LANGUAGES[saved]) return saved;
    } catch (error) {}
    return DEFAULT_LANGUAGE;
  }

  function translate(source, lang) {
    var key = normalize(source);
    if (!key) return source;
    var entry = TRANSLATIONS[key];
    if (!entry) return source;
    return entry[lang] || entry.en || source;
  }

  function preserveWhitespace(original, replacement) {
    var start = (String(original).match(/^\s*/) || [''])[0];
    var end = (String(original).match(/\s*$/) || [''])[0];
    return start + replacement + end;
  }

  function isIgnored(node) {
    var element = node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement;
    if (!element) return true;
    return Boolean(element.closest('script, style, noscript, svg, .ku-language-switcher, [data-no-translate]'));
  }

  function rememberTextNode(node, force) {
    if (!node || node.nodeType !== Node.TEXT_NODE || isIgnored(node)) return;
    var value = normalize(node.nodeValue);
    if (!value) return;
    if (force || !textSources.has(node)) textSources.set(node, value);
  }

  function walkTextNodes(root, callback) {
    if (!root || isIgnored(root)) return;
    if (root.nodeType === Node.TEXT_NODE) {
      callback(root);
      return;
    }
    if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_NODE) return;
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        if (isIgnored(node) || !normalize(node.nodeValue)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var node;
    while ((node = walker.nextNode())) callback(node);
  }

  function applyTextTranslations(root) {
    var lang = window.GreenesLanguage || getInitialLanguage();
    applying = true;
    try {
      walkTextNodes(root || document.body, function (node) {
        rememberTextNode(node, false);
        var source = textSources.get(node);
        var translated = translate(source, lang);
        if (normalize(node.nodeValue) !== normalize(translated)) {
          node.nodeValue = preserveWhitespace(node.nodeValue, translated);
        }
      });
      applyAttributeTranslations(lang);
      document.documentElement.setAttribute('lang', lang === 'uz' ? 'uz-UZ' : lang === 'ru' ? 'ru-RU' : 'en-GB');
      updateSwitcher(lang);
    } finally {
      setTimeout(function () { applying = false; }, 0);
    }
  }

  function applyAttributeTranslations(lang) {
    ['placeholder', 'aria-label', 'title', 'alt', 'value'].forEach(function (attr) {
      document.querySelectorAll('[' + attr + ']').forEach(function (el) {
        if (isIgnored(el)) return;
        if (attr === 'value' && !/^(button|submit|reset)$/i.test(el.type || '')) return;
        var originalAttr = 'data-i18n-original-' + attr;
        if (!el.hasAttribute(originalAttr)) el.setAttribute(originalAttr, el.getAttribute(attr) || '');
        var original = el.getAttribute(originalAttr) || '';
        var translated = translate(original, lang);
        if (translated !== original || TRANSLATIONS[normalize(original)]) el.setAttribute(attr, translated);
      });
    });
    var titleSource = document.querySelector('title');
    if (titleSource) {
      if (!titleSource.dataset.i18nOriginal) titleSource.dataset.i18nOriginal = titleSource.textContent;
      titleSource.textContent = translate(titleSource.dataset.i18nOriginal, lang);
    }
  }

  function scheduleApply() {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(function () {
      scheduled = false;
      applyTextTranslations(document.body);
    });
  }

  function buildSwitcher() {
    var wrapper = document.querySelector('.ku-language-switcher');
    if (!wrapper) {
      wrapper = document.createElement('div');
      wrapper.className = 'ku-language-switcher';
      wrapper.setAttribute('aria-label', 'Language selector');
      wrapper.setAttribute('data-no-translate', 'true');
      wrapper.innerHTML = '<span class="ku-language-switcher__label">Til</span>' +
        Object.keys(SUPPORTED_LANGUAGES).map(function (lang) {
          return '<button type="button" data-lang="' + lang + '" title="' + LANGUAGE_NAMES[lang] + '">' + SUPPORTED_LANGUAGES[lang] + '</button>';
        }).join('');
      document.body.appendChild(wrapper);
    }
    wrapper.style.display = 'inline-flex';
    wrapper.style.visibility = 'visible';
    wrapper.style.removeProperty('opacity');
    if (wrapper.dataset.bound === 'true') return;
    wrapper.dataset.bound = 'true';
    wrapper.addEventListener('click', function (event) {
      var button = event.target.closest('button[data-lang]');
      if (!button) return;
      setLanguage(button.getAttribute('data-lang'));
    });
  }

  function updateSwitcher(lang) {
    document.querySelectorAll('.ku-language-switcher button[data-lang]').forEach(function (button) {
      var active = button.getAttribute('data-lang') === lang;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
      // Inline fallback styles are updated too, so it works even if CSS is cached or not loaded.
      button.style.background = active ? 'rgba(255, 255, 255, 0.34)' : 'transparent';
      button.style.color = active ? 'rgba(0, 0, 0, 0.92)' : 'rgba(22, 22, 22, 0.74)';
    });
  }

  function setLanguage(lang) {
    if (!SUPPORTED_LANGUAGES[lang]) return;
    window.GreenesLanguage = lang;
    try { window.localStorage.setItem('greenes_language', lang); } catch (error) {}
    applyTextTranslations(document.body);
  }

  function observeDynamicContent() {
    var observer = new MutationObserver(function (mutations) {
      if (applying) return;
      mutations.forEach(function (mutation) {
        if (mutation.type === 'characterData') rememberTextNode(mutation.target, true);
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(function (node) { walkTextNodes(node, function (textNode) { rememberTextNode(textNode, true); }); });
        }
      });
      scheduleApply();
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  }

  window.GreenesSetLanguage = setLanguage;
  window.GreenesLanguage = getInitialLanguage();

  function init() {
    buildSwitcher();
    walkTextNodes(document.body, function (node) { rememberTextNode(node, false); });
    applyTextTranslations(document.body);
    observeDynamicContent();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
