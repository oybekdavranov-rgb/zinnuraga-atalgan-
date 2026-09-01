'use strict';
const db = require('./index');
const { config } = require('../config');
const log = require('../logger');
const site = require('../site-profile');
const { hashPassword, newSalt } = require('../security/passwords');

async function createUser(email, password, role) {
  const now = Date.now();
  const salt = newSalt();
  await db.run(
    'INSERT INTO users (email, password_hash, salt, role, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
    [email.toLowerCase(), hashPassword(password, salt), salt, role, now, now]
  );
}

async function bootstrapUsers() {
  const { c } = (await db.get('SELECT COUNT(*) AS c FROM users')) || { c: 0 };
  if (Number(c) > 0) {
    const staff = await db.get("SELECT COUNT(*) AS c FROM users WHERE role = 'staff'");
    if (Number(staff.c) === 0) {
      await db.run('UPDATE users SET role = ? WHERE id = (SELECT MIN(id) FROM users)', ['staff']);
    }
    return;
  }
  await createUser(config.DEFAULT_STAFF_EMAIL, config.DEFAULT_STAFF_PASSWORD, 'staff');
  await createUser(config.DEFAULT_EDITOR_EMAIL, config.DEFAULT_EDITOR_PASSWORD, 'editor');
  log.info('Standart adminlar yaratildi (staff + editor)');
}

async function seedTable(table, cols, rows) {
  // Bu profilda jadval yaratilmagan bo'lsa — o'tkazib yuboramiz
  if (!site.has(table)) return;
  const { c } = (await db.get(`SELECT COUNT(*) AS c FROM ${table}`)) || { c: 0 };
  if (Number(c) > 0) return;
  const now = Date.now();
  const allCols = [...cols, 'created_at', 'updated_at'];
  const ph = allCols.map(() => '?').join(', ');
  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    const vals = [...cols.map((col) => (col === 'sort' ? i : r[col] ?? '')), now, now];
    await db.run(`INSERT INTO ${table} (${allCols.join(', ')}) VALUES (${ph})`, vals);
  }
}

async function seedContent() {
  await seedTable('news', ['title', 'date', 'image', 'excerpt', 'body', 'link', 'sort'], [
    { title: 'Umummilliy AI Hackathon Farg‘ona | 2-kun', date: '23-may 2026', image: 'images/copy-of-greenes4-1-e1707301347593-352x228.jpg', excerpt: 'Ishtirokchilar jamiyat va kelajak uchun muhim yo‘nalishlarda AI yechimlari ustida ishlashmoqda.', body: '🏫 2-kun har bir jamoa o‘z loyihalarini mentorlar va ekspertlarga taqdim etishga tayyorlanmoqda.\n\nHackathon davomida talabalar amaliy ko‘nikmalarni egallab, jamoaviy ishlash va innovatsion g‘oyalarni real mahsulotga aylantirishni o‘rganmoqda.', link: 'https://t.me/kuyoshlarittifoqi' },
    { title: 'Imora AI talabalari xalqaro tanlovda g‘olib bo‘ldi', date: '09-iyun 2026', image: 'images/homepage-4-1024x683.jpg', excerpt: 'Talabalar xalqaro ilmiy loyihalar tanlovida yuqori natijalarni qo‘lga kiritdi.', body: 'Imora AI talabalari xalqaro miqyosdagi ilmiy-amaliy loyihalar tanlovida ishtirok etib, bilim va ko‘nikmalarini namoyish qildi.\n\nBu g‘alaba universitetning sifatli kadrlar tayyorlashga qaratilgan siyosatining isbotidir.', link: '' },
    { title: 'Yangi o‘quv yili: qabul jarayoni boshlandi', date: '01-iyul 2026', image: 'images/homepage-3.jpg', excerpt: 'Yangi o‘quv yiliga qabul boshlandi. Yo‘nalishlar va imtiyozlar bilan tanishing.', body: 'Imora AI yangi o‘quv yiliga talabalar qabulini boshladi. Zamonaviy o‘quv dasturlari, amaliyotga yo‘naltirilgan ta’lim va xalqaro hamkorlik imkoniyatlari taklif etiladi.', link: 'https://qabul.kokanduni.uz/' },
    { title: 'Xalqaro hamkorlik: yangi shartnomalar imzolandi', date: '15-iyun 2026', image: 'images/homepage-8.jpg', excerpt: 'Universitet xorijiy oliy ta’lim muassasalari bilan hamkorlik shartnomalarini imzoladi.', body: 'Imora AI xorijiy universitetlar bilan ta’lim va ilmiy tadqiqot sohasidagi hamkorlikni kengaytirmoqda. Shartnomalar talabalar almashinuvi va qo‘shma dasturlarni nazarda tutadi.', link: '' },
  ]);

  await seedTable('achievements', ['name', 'subtitle', 'image', 'description', 'sort'], [
    { name: 'Muhammadali Abbosxonov', subtitle: 'Xalqaro IT olimpiadasi g‘olibi', image: 'images/angus.jpg', description: 'Dasturlash bo‘yicha xalqaro olimpiadada oltin medalni qo‘lga kiritdi.' },
    { name: 'Shahlo Mansurova', subtitle: 'Biznes marafon g‘olibi', image: 'images/rowena.JPG', description: 'Startap loyihasi bilan “Biznes Marafon” tanlovida birinchi o‘rinni egalladi.' },
    { name: 'Behruz Nosirov', subtitle: 'Ilmiy loyihalar tanlovi laureati', image: 'images/lamine.jpg', description: 'Ilmiy-tadqiqot loyihasi bilan respublika tanlovida faxrli o‘rinni egalladi.' },
  ]);

  await seedTable('distinctions', ['title', 'image', 'summary', 'body', 'sort'], [
    { title: 'Jonli statistika', image: 'images/homepage-1.jpg', summary: 'Real vaqtda tashrifchilar va faollik.', body: 'Imora AI saytingizdagi har bir ko‘rish, bosish va qidiruvni real vaqtda kuzatadi. Kim, qachon va nimaga qiziqayotganini darhol, jonli tarzda ko‘rasiz.' },
    { title: 'Auditoriyani tushunish', image: 'images/homepage-3.jpg', summary: 'Raqamlar ortidagi real insonlar.', body: 'Imora AI shunchaki raqam ko‘rsatmaydi — u auditoriyangiz xatti-harakatini tahlil qilib, ularning ehtiyoj va qiziqishlarini tushunishga yordam beradi.' },
    { title: 'Maxfiylik birinchi o‘rinda', image: 'images/homepage-4.jpg', summary: 'Shaxsiy ma’lumot saqlanmaydi.', body: 'Imora AI hech qanday shaxsiy ma’lumot yig‘maydi va saqlamaydi. Har bir tashrifchi anonim qoladi, tahlil esa aniq — ishonch va xavfsizlik kafolatlanadi.' },
    { title: 'Aqlli tavsiyalar', image: 'images/homepage-9-1024x884.webp', summary: 'AI yordamida to‘g‘ri qarorlar.', body: 'Platforma ma’lumotlarni tahlil qilib, sizga tushunarli xulosa va tavsiyalar beradi. Murakkab statistika oddiy va foydali ko‘rinishga aylanadi.' },
    { title: 'Oson ulanish', image: 'images/homepage-8.jpg', summary: 'Bir necha daqiqada integratsiya.', body: 'Imora AI ni saytingizga ulash oson: bir necha qadam va platforma darhol ishlay boshlaydi. Chuqur texnik bilim talab qilinmaydi.' },
    { title: 'Inson uchun yaratilgan', image: 'images/greene-s-0058-704x456.jpg', summary: 'Texnologiya — inson xizmatida.', body: 'Biz sun’iy intellektni inson uchun tushunarli va yaqin qilib yaratamiz. Imora AI — insonlar bilan texnologiya o‘rtasidagi ishonchli ko‘prik.' },
  ]);

  await seedTable('interests', ['title', 'image', 'body', 'link', 'sort'], [
    { title: 'Imkoniyatlar', image: 'images/lucia-navarrete-y3tr4-mn6es-unsplash-352x228.jpg', body: 'Imora AI jonli analitika, auditoriya tahlili, real vaqtli hisobotlar va maxfiylik himoyasi kabi imkoniyatlarni bitta platformada birlashtiradi.', link: 'https://www.kokanduni.uz/uz' },
    { title: 'Bog‘lanish', image: 'images/aptitude-test-2-352x228.jpg', body: 'Jamoamiz Imora AI ni ulash, sozlash va imkoniyatlaridan to‘liq foydalanish bo‘yicha yordam beradi. Savollaringiz bilan istalgan vaqtda murojaat qiling.', link: 'https://www.kokanduni.uz/uz/static/contacts' },
    { title: 'Yangilanishlar', image: 'images/spires_rgb_edited-1500x500-1-352x228.jpg', body: 'Imora AI doimiy rivojlanadi: yangi imkoniyatlar, yaxshilanishlar va foydali funksiyalar muntazam ravishda qo‘shib boriladi.', link: 'https://www.kokanduni.uz/uz' },
  ]);

  await seedTable('stories', ['title', 'date', 'category', 'image', 'excerpt', 'body', 'link', 'sort'], [
    {
      title: 'Imora AI talabasi bo‘lish qanday tuyg‘u?',
      date: '18-iyul 2026', category: 'Talaba hayoti', image: 'images/stories/story-1.jpg',
      excerpt: 'Birinchi kursdan bitiruvgacha — universitetdagi hayot, do‘stlar, ustozlar va o‘zgarishlar haqida talaba hikoyasi.',
      body: 'Universitetga birinchi qadam qo‘yganimda hammasi yangi va biroz qo‘rqinchli tuyulgandi. Ammo bir necha hafta ichida Imora AI menga ikkinchi uyga aylandi.\n\nBu yerda faqat darslar emas, balki klublar, loyihalar va tadbirlar orqali o‘zimni topdim. Ustozlar har birimizni ismimiz bilan taniydi, savolga har doim vaqt topadi.\n\nEng muhimi — bu yerda men mustaqil fikrlashni, jamoada ishlashni va o‘z g‘oyalarimga ishonishni o‘rgandim.',
      link: '',
    },
    {
      title: 'Amaliyotdan ish o‘rniga: bitiruvchi tajribasi',
      date: '12-iyul 2026', category: 'Karyera', image: 'images/stories/story-2.jpg',
      excerpt: 'Universitetdagi amaliyot uni to‘g‘ridan-to‘g‘ri kompaniyaga olib keldi. Karyera yo‘lining boshlanishi haqida hikoya.',
      body: 'Uchinchi kursda amaliyotni jiddiy qabul qildim. Har bir vazifani real ish deb bajardim va bu bekorga ketmadi.\n\nAmaliyot tugagach, kompaniya menga ish taklif qildi. Universitetda olgan amaliy ko‘nikmalarim va mustaqil loyihalarim aynan shu paytda asqotdi.\n\nImora AI talabalarga real muhitda o‘rganish imkonini beradi — bu esa diplomdan ham qimmatroq.',
      link: '',
    },
    {
      title: 'Ilmiy loyiha: g‘oyadan natijagacha',
      date: '05-iyul 2026', category: 'Ilmiy tadqiqot', image: 'images/stories/story-3.jpg',
      excerpt: 'Bir guruh talaba oddiy g‘oyadan boshlab, respublika tanlovida taqdirlangan loyiha yaratdi.',
      body: 'Hammasi darsdan keyingi oddiy suhbatdan boshlandi. Biz jamiyat uchun foydali bo‘ladigan loyiha yaratishni xohladik.\n\nMentorimiz yordamida g‘oyani reja, keyin prototipga aylantirdik. Ko‘p tunlar ishladik, xatolardan o‘rgandik va tark etmadik.\n\nNatijada loyihamiz respublika tanlovida faxrli o‘rinni egalladi. Bu — jamoaviy mehnat va ustozlar qo‘llab-quvvatlashining samarasi.',
      link: '',
    },
    {
      title: 'Xalqaro almashinuv dasturida bir semestr',
      date: '28-iyun 2026', category: 'Xalqaro imkoniyatlar', image: 'images/stories/story-4.jpg',
      excerpt: 'Xorijiy universitetda o‘qish tajribasi dunyoqarashni qanday o‘zgartirdi — talaba o‘z tajribasini bo‘lishadi.',
      body: 'Xalqaro almashinuv dasturi menga boshqa madaniyat, boshqa ta’lim uslubi va yangi do‘stlar berdi.\n\nBoshqa mamlakatda o‘qib, o‘z bilimlarimning kuchli tomonlarini ko‘rdim va yangi ko‘nikmalarni egalladim. Til bilan bir qatorda mustaqillik va moslashuvchanlik o‘rgandim.\n\nImora AI’ning xalqaro hamkorligi tufayli bu imkoniyat menga ochildi.',
      link: '',
    },
    {
      title: 'Kichik guruhlarda o‘qishning afzalligi',
      date: '20-iyun 2026', category: 'Ta’lim', image: 'images/stories/story-5.jpg',
      excerpt: 'Nega kichik guruhlar samaraliroq? Talaba va ustoz nuqtai nazaridan hikoya.',
      body: 'Kichik guruhda har bir talaba e’tibordan chetda qolmaydi. Savol berish oson, muhokamalar jonli va o‘qish shaxsiylashtirilgan.\n\nUstoz har birimizning kuchli va zaif tomonlarimizni biladi, shuning uchun yordam aniq va o‘z vaqtida bo‘ladi.\n\nMen uchun bu — bilimni chuqur o‘zlashtirish va ishonch hosil qilishning eng yaxshi yo‘li bo‘ldi.',
      link: '',
    },
    {
      title: 'Talabalar klublari: darsdan tashqari hayot',
      date: '14-iyun 2026', category: 'Talaba hayoti', image: 'images/stories/story-6.jpg',
      excerpt: 'Debat klubidan IT jamoasigacha — universitetdagi klublar qanday qilib iste’dodni ochadi.',
      body: 'Universitetdagi hayot faqat auditoriya bilan cheklanmaydi. Klublar — bu yangi do‘stlar, yangi ko‘nikmalar va o‘zingni sinab ko‘rish maydoni.\n\nMen debat klubiga qo‘shildim va omma oldida gapirishdan qo‘rqmaydigan bo‘ldim. Do‘stlarim IT va tadbirkorlik klublarida o‘z loyihalarini boshladi.\n\nBu tajribalar kelajakdagi kasbimiz uchun juda muhim.',
      link: '',
    },
    {
      title: 'Ustoz va shogird: mentorlik hikoyasi',
      date: '07-iyun 2026', category: 'Ustozlar', image: 'images/stories/story-7.jpg',
      excerpt: 'Bir ustozning to‘g‘ri vaqtdagi maslahati talabaning yo‘nalishini butunlay o‘zgartirdi.',
      body: 'Men qaysi yo‘nalishni tanlashni bilmay qiynalgan paytimda ustozim menga vaqt ajratdi. U mening qiziqishlarimni tingladi va to‘g‘ri savollarni berdi.\n\nShu suhbatdan keyin o‘zimga to‘g‘ri kelgan sohani tanladim va endi har kuni sevgan ishim bilan shug‘ullanaman.\n\nImora AI’da mentorlik — rasmiyatchilik emas, balki chinakam g‘amxo‘rlik.',
      link: '',
    },
    {
      title: 'Grant sohibi bo‘lgan talabaning yo‘li',
      date: '30-may 2026', category: 'Yutuqlar', image: 'images/stories/story-8.jpg',
      excerpt: 'Mehnat va qat’iyat bilan grantga erishgan talaba o‘z tajribasi va maslahatlari bilan bo‘lishadi.',
      body: 'Grant menga osonlikcha kelmadi. Har kuni maqsad qo‘yib ishladim, darslarni qoldirmadim va qo‘shimcha loyihalarda qatnashdim.\n\nUniversitet iqtidorli talabalarni qo‘llab-quvvatlaydi — bu esa menga ko‘proq harakat qilish uchun kuch berdi.\n\nMaslahatim: maqsadingizni aniq belgilang, muntazam ishlang va imkoniyatlardan foydalaning.',
      link: '',
    },
    {
      title: 'Bitiruv kuni: yangi hayotning ostonasida',
      date: '22-may 2026', category: 'Bitiruvchilar', image: 'images/stories/story-9.jpg',
      excerpt: 'To‘rt yillik mehnat, do‘stlik va o‘sish — bitiruvchi universitetdagi eng yorqin damlarini eslaydi.',
      body: 'Bitiruv kunida orqaga qarab, universitetda o‘tgan yillar ko‘z oldimdan o‘tdi. Birinchi imtihonlar, tungacha davom etgan loyihalar, do‘stlar bilan kulgu.\n\nImora AI menga faqat diplom emas, balki hayotga tayyor shaxsni yasadi.\n\nEndi yangi bosqich boshlanadi, lekin bu yerda olgan bilim va do‘stlik hamisha men bilan qoladi.',
      link: '',
    },
    {
      title: 'Zamonaviy kutubxona va raqamli resurslar',
      date: '15-may 2026', category: 'Ta’lim', image: 'images/stories/story-10.jpg',
      excerpt: 'Universitet kutubxonasi va onlayn platformalari o‘qishni qanday qulay va samarali qiladi.',
      body: 'Zamonaviy kutubxona — bu shunchaki kitoblar javoni emas. Bu yerda raqamli bazalar, tinch o‘qish zonalari va guruh ishlash xonalari bor.\n\nOnlayn platformalar orqali dars materiallariga istalgan joydan kirish mumkin. Bu ayniqsa loyiha va imtihonlarga tayyorlanishda juda qulay.\n\nBilim manbalarining bunday qulayligi o‘qishni sifatli va mustaqil qiladi.',
      link: '',
    },
    {
      title: 'Talabamiz milliy miqyosda eng yuqori natijani qo‘lga kiritdi',
      date: '10-may 2026', category: 'Yutuqlar', image: 'images/stories/story-11.jpg',
      excerpt: 'Imora AI talabasi respublika ko‘lamidagi fan imtihonida eng yuqori ballni to‘pladi.',
      body: 'Universitetimiz talabasi milliy miqyosdagi fan imtihonida eng yuqori natijani qayd etib, mamlakatning eng iqtidorli yoshlari qatoridan joy oldi.\n\nBu muvaffaqiyat ortida qat’iyat, muntazam mehnat va tajribali ustozlarning qo‘llab-quvvatlashi turibdi. Talaba imtihonga oylar davomida rejali tayyorgarlik ko‘rdi.\n\nImora AI har bir talabaning iqtidorini rivojlantirish va yuqori natijalarga erishishi uchun barcha sharoitni yaratadi.',
      link: '',
    },
  ]);

  await seedTable('castle_pages', ['title', 'slug', 'icon', 'image', 'summary', 'body', 'faq', 'sort'], [
    {
      title: 'Joylashuvlar', slug: 'joylashuvlar', icon: 'map-pin', image: 'shaharcha/img/joylar.jpg',
      summary: 'Turar joylarimiz qayerda joylashgan va universitetgacha qancha vaqt ketadi.',
      body: 'Barcha turar joylarimiz Qo‘qon shahrida, universitetga qulay masofada joylashgan. Har bir joyni tanlashda uchta narsaga e’tibor berganmiz: universitetga yaqinlik, xavfsizlik va kundalik hayot qulayligi.\n\n**Kampus hududi** — universitet binolaridan 5 daqiqa piyoda. Eng ommabop variant: darsga kechikmaysiz, kutubxona va oshxona yonginangizda.\n\n**Shahar markazi** — 10–15 daqiqa. Do‘konlar, kafelar va transport shundoq yoningizda. Faol hayot tarzini yoqtiradiganlar uchun.\n\n**Tinch mahallalar** — 15–20 daqiqa. Tinchroq muhit, arzonroq narx, ko‘proq shaxsiy makon.\n\nHar bir joygacha jamoat transporti qatnaydi, velosiped yo‘llari mavjud.',
      faq: 'Universitetga qanday boraman? :: Piyoda (5–20 daqiqa), avtobus yoki velosipedda.\nTransport to‘xtash joyi bormi? :: Ha, ko‘pchilik joylarda velosiped va avtoturargoh bor.\nDo‘kon va oshxona yaqinmi? :: Barcha joylardan 5 daqiqalik masofada do‘konlar mavjud.\nKechqurun xavfsizmi? :: Hududlar yoritilgan va videokuzatuv ostida.',
    },
    {
      title: 'Bizning tariximiz', slug: 'tarix', icon: 'compass', image: 'shaharcha/img/tarix.jpg',
      summary: 'Bir binodan to‘liq talabalar shaharchasigacha — rivojlanish yo‘limiz.',
      body: 'Talabalar shaharchasi bir necha yil ichida kichik yotoqxonadan zamonaviy turar joy tizimiga aylandi.\n\n**Boshlanish** — birinchi yotoqxona binosi ochildi. Maqsad oddiy edi: boshqa shaharlardan kelgan talabalarga arzon va xavfsiz joy berish.\n\n**Kengayish** — talabalar soni ortgani sari yangi binolar qo‘shildi. Studiya xonalar va umumiy kvartiralar paydo bo‘ldi.\n\n**Zamonaviylashtirish** — barcha binolarda internet, o‘quv zonalari va dam olish maydonlari yaratildi. Xavfsizlik tizimi yangilandi.\n\n**Bugun** — 6 dan ortiq turar joy varianti, yuzlab talaba va doimiy rivojlanish. Har yili talabalar fikri asosida sharoitlarni yaxshilab boramiz.',
      faq: 'Necha yildan beri ishlaysiz? :: Bir necha yildan beri; har yili yangi imkoniyatlar qo‘shilmoqda.\nYangi binolar quriladimi? :: Ha, talabalar soni ortishi bilan kengaytirish rejalashtirilgan.\nTalabalar fikri hisobga olinadimi? :: Albatta — har semestr so‘rovnoma o‘tkaziladi.',
    },
    {
      title: 'Xalqaro talabalar', slug: 'xalqaro', icon: 'hands', image: 'shaharcha/img/xalqaro.jpg',
      summary: 'Xorijdan kelayotgan talabalar uchun to‘liq yordam va qulaylik.',
      body: 'Boshqa mamlakatdan kelish katta qadam. Biz bu jarayonni imkon qadar oson qilishga harakat qilamiz.\n\n**Kelishdan oldin** — onlayn ariza va bron. Joyni kelmasdan turib band qilasiz, fotosuratlar va xona tavsifi orqali tanlaysiz.\n\n**Kelganda** — aeroport yoki vokzaldan kutib olish tashkil etiladi. Xonaga joylashish, kalit topshirish va dastlabki ekskursiya.\n\n**Birinchi haftalar** — koordinator hujjatlar, ro‘yxatdan o‘tish, tibbiy sug‘urta va bank kartasi masalalarida yordam beradi.\n\n**Doimiy qo‘llab-quvvatlash** — til qiyinchiliklari, kundalik savollar yoki muammolar bo‘lsa — koordinator doim aloqada.\n\nKichik narsalar ham hisobga olinadi: choyshab va sochiq, oshxona jihozlari, birinchi kunlarda ovqatlanish maslahati.',
      faq: 'Kafil (garantor) kerakmi? :: Xalqaro talabalar uchun moslashuvchan shartlar mavjud.\nKelishdan oldin bron qila olamanmi? :: Ha, onlayn ariza orqali joy band qilinadi.\nAeroportdan kutib olasizmi? :: Ha, oldindan xabar bersangiz — tashkil etiladi.\nTil bilmasam-chi? :: Koordinatorlar yordam beradi; til kurslari ham mavjud.\nHujjatlarda yordam beriladimi? :: Ha, ro‘yxatdan o‘tish va sug‘urta bo‘yicha to‘liq yordam.',
    },
    {
      title: 'Savol-javob', slug: 'savol-javob', icon: 'speech', image: 'shaharcha/img/faq.jpg',
      summary: 'Bron, to‘lov, xona sharoitlari va qoidalar bo‘yicha eng ko‘p beriladigan savollar.',
      body: 'Quyida talabalar va ota-onalar eng ko‘p so‘raydigan savollarga javoblar to‘plangan. Javobini topa olmasangiz — biz bilan bog‘laning.',
      faq: 'Qanday bron qilaman? :: Turar joyni tanlaysiz, ariza qoldirasiz, koordinator siz bilan bog‘lanadi va shartnoma tuziladi.\nTo‘lov qanday amalga oshiriladi? :: Shartnomada ko‘rsatilgan tartibda; bo‘lib to‘lash imkoniyati bor.\nDepozit kerakmi? :: Ba’zi variantlarda kafolat to‘lovi bo‘ladi, u chiqishda qaytariladi.\nShartnomani bekor qilsam-chi? :: Bekor qilish shartlari shartnomada aniq yozilgan.\nXonada nima bor? :: Karavot, shkaf, ish stoli, stul va internet. Ba’zilarida shaxsiy hammom.\nChoyshab va idish-tovoq beriladimi? :: Ko‘p variantlarda asosiy jihozlar beriladi; aniqlashtirib olasiz.\nMehmon chaqirsam bo‘ladimi? :: Ha, belgilangan tartib va vaqt doirasida.\nKommunal to‘lovlar alohidami? :: Ko‘pchilik variantlarda narxga kiritilgan.\nInternet tezligi qanday? :: Onlayn dars va videoqo‘ng‘iroq uchun yetarli.\nKir yuvish qanday? :: Har bir binoda kir yuvish xonasi mavjud.\nUy hayvoni mumkinmi? :: Umumiy turar joylarda ruxsat etilmaydi.\nChekish mumkinmi? :: Binolar ichida chekish taqiqlanadi; maxsus joylar ajratilgan.',
    },
    {
      title: 'Xona turlari', slug: 'xona-turlari', icon: 'bed', image: 'shaharcha/img/xona.jpg',
      summary: 'Standart, komfort va studiya — har bir xona turi va uning jihozlari.',
      body: 'Turar joylarimizda uch xil asosiy xona turi mavjud. Har biri turli byudjet va ehtiyojga mo‘ljallangan.\n\n**Standart xona** — 2–3 kishilik, umumiy hammom va oshxona. Eng qulay narx. Har bir talabaga karavot, shkaf, ish stoli va stul beriladi.\n\n**Komfort xona** — 1–2 kishilik, xonada yuvinish joyi. Kengroq maydon, kattaroq deraza va shaxsiy javon.\n\n**Studiya** — bir kishilik mustaqil xona: shaxsiy hammom, mini-oshxona, ish zonasi va dam olish burchagi. Eng yuqori qulaylik.\n\nBarcha xonalarda: isitish, tez internet, yorug‘lik va tabiiy shamollatish. Xonani ko‘rish uchun oldindan tashrif buyurishingiz mumkin.',
      faq: 'Xonani oldin ko‘rsam bo‘ladimi? :: Ha, oldindan kelishilgan vaqtda ko‘rishga olib boramiz.\nXonani almashtirish mumkinmi? :: Bo‘sh joy bo‘lsa, semestr boshida imkoniyat bor.\nMebel qo‘shsam bo‘ladimi? :: Kichik shaxsiy narsalar mumkin; katta mebel uchun ruxsat kerak.\nXonani kim bilan bo‘lishaman? :: Imkon qadar bir yo‘nalish yoki kurs talabalari bilan.\nXonada muzlatgich bormi? :: Studiyalarda bor; boshqalarida umumiy oshxonada.',
    },
    {
      title: 'Bog‘lanish', slug: 'bogʻlanish', icon: 'phone', image: 'shaharcha/img/aloqa.jpg',
      summary: 'Telefon, email, manzil va ish vaqti — biz bilan qanday bog‘lanish mumkin.',
      body: 'Savollaringiz bo‘lsa yoki joy bron qilmoqchi bo‘lsangiz — bir necha yo‘l bilan bog‘lanishingiz mumkin.\n\n**Telefon** — ish kunlari eng tez javob. Koordinator darhol yordam beradi.\n\n**Email** — batafsil savollar va hujjatlar uchun qulay. Odatda bir ish kuni ichida javob beramiz.\n\n**Telegram** — tezkor savollar uchun. Rasm va hujjat yuborish oson.\n\n**Bevosita tashrif** — universitet qabulxonasiga kelib, turar joy bo‘yicha maslahat olishingiz mumkin. Oldindan xabar bersangiz, xonalarni ham ko‘rsatamiz.\n\nOta-onalar uchun ham alohida maslahat xizmati mavjud.',
      faq: 'Ish vaqti qanday? :: Dushanba–shanba, ish kunlari; aniq vaqt telefon orqali.\nDam olish kunlari javob berasizmi? :: Telegram orqali cheklangan tarzda.\nOta-onam qo‘ng‘iroq qilsa bo‘ladimi? :: Ha, albatta — ular uchun ham maslahat beramiz.\nXonani ko‘rishga qanday boraman? :: Oldindan vaqt belgilanadi, koordinator kutib oladi.',
    },
    {
      title: 'Do‘stingizni taklif qiling', slug: 'dost-taklif', icon: 'hands', image: 'shaharcha/img/dost.jpg',
      summary: 'Do‘stingiz ham joylashsa — ikkingiz uchun ham imtiyoz.',
      body: 'Do‘stingizni talabalar shaharchasiga taklif qilsangiz, ikkingiz ham imtiyozga ega bo‘lasiz.\n\n**Qanday ishlaydi:** do‘stingizga o‘z ismingizni ko‘rsatishni aytasiz. U shartnoma tuzgach, ikkingizga ham imtiyoz qo‘llanadi.\n\n**Nima olasiz:** to‘lovdan chegirma yoki qo‘shimcha xizmat (bu davrga qarab belgilanadi).\n\n**Nechta do‘st taklif qilish mumkin?** Cheklov yo‘q — har bir yangi joylashgan do‘st uchun imtiyoz beriladi.\n\nBu nafaqat tejamkorlik, balki yoningizda tanish odam bo‘lishi ham — moslashish ancha oson kechadi.',
      faq: 'Imtiyoz qancha? :: Davriy aksiyaga qarab; aniq shartlarni koordinatordan bilib olasiz.\nDo‘stim boshqa turar joy tanlasa-chi? :: Muhim emas — shaharchamizning istalgan variantida amal qiladi.\nQachon qo‘llanadi? :: Do‘stingiz shartnoma tuzib, joylashgandan so‘ng.\nO‘zim yangi talaba bo‘lsam ham mumkinmi? :: Ha, birgalikda ariza topshirsangiz ham amal qiladi.',
    },
    {
      title: 'Talaba portali', slug: 'portal', icon: 'lock', image: 'shaharcha/img/oquv.jpg',
      summary: 'To‘lov, xizmat so‘rovi va e’lonlar — hammasi bitta shaxsiy kabinetda.',
      body: 'Joylashgan talabalar uchun shaxsiy portal mavjud. U kundalik masalalarni onlayn hal qilish imkonini beradi.\n\n**To‘lovlar** — to‘lov tarixini ko‘rasiz, keyingi to‘lov sanasini bilasiz va onlayn to‘lash mumkin.\n\n**Xizmat so‘rovi** — biror narsa buzilsa (kran, chiroq, eshik) portal orqali so‘rov qoldirasiz, texnik xizmat keladi.\n\n**E’lonlar** — turar joy bo‘yicha muhim xabarlar, tadbirlar va eslatmalar shu yerda.\n\n**Hujjatlar** — shartnoma va boshqa hujjatlaringizning nusxasi doim qo‘l ostida.\n\nPortalga kirish ma’lumotlari joylashgandan so‘ng beriladi.',
      faq: 'Portalga qanday kiraman? :: Joylashgach login va parol beriladi.\nParolni yo‘qotsam-chi? :: Koordinatorga murojaat qilasiz, tiklanadi.\nTelefondan kirsam bo‘ladimi? :: Ha, portal mobil qurilmalarga moslashgan.\nXizmat so‘rovi qancha vaqtda bajariladi? :: Shoshilinch masalalar shu kuni; qolganlari navbat bilan.',
    },
    {
      title: 'Yozgi turar joy', slug: 'yozgi', icon: 'compass', image: 'shaharcha/img/yozgi.jpg',
      summary: 'Yozgi ta\u2019tilda qisqa muddatga joy \u2014 kurs, amaliyot yoki loyiha uchun.',
      body: 'Yoz oylarida qisqa muddatli turar joy taklif etamiz. Bu yozgi kurslarda o\u2018qiyotgan, amaliyot o\u2018tayotgan yoki loyiha ustida ishlayotgan talabalar uchun qulay.\n\n**Muddat** \u2014 bir haftadan uch oygacha. O\u2018zingizga kerakli kunlarni tanlaysiz.\n\n**Narx** \u2014 o\u2018quv yili davomidagi narxdan qulayroq, chunki muddat qisqa va talab kamroq.\n\n**Xonalar** \u2014 to\u2018liq jihozlangan: choyshab, sochiq, oshxona jihozlari. Faqat jomadoningiz bilan kelasiz.\n\n**Kimlar uchun** \u2014 yozgi kurs talabalari, amaliyotchilar, ilmiy loyiha ustida ishlayotganlar va boshqa shahardan kelgan mehmon talabalar.\n\nJoylar cheklangan, shuning uchun oldindan bron qilish tavsiya etiladi.',
      faq: 'Eng qisqa muddat qancha? :: Bir hafta.\nNarx qanday hisoblanadi? :: Haftalik yoki oylik \u2014 muddatga qarab.\nJihozlar beriladimi? :: Ha, choyshab, sochiq va oshxona jihozlari kiritilgan.\nYozda ham xavfsizlik ishlaydimi? :: Albatta, 24/7 nazorat yil bo\u2018yi ishlaydi.\nQachon bron qilish kerak? :: Iloji boricha erta \u2014 yozgi joylar tez tugaydi.',
    },
    {
      title: 'Xona jihozlari va narxlar', slug: 'jihozlar', icon: 'bed', image: 'shaharcha/img/jihoz.jpg',
      summary: 'Har bir xona darajasida nima bor va to\u2018lov qanday hisoblanadi.',
      body: 'Xonalar uchta darajaga bo\u2018linadi. Har bir darajada jihozlar to\u2018plami va narx farq qiladi.\n\n**Bronza** \u2014 asosiy to\u2018plam: karavot, matras, shkaf, ish stoli, stul, javon, isitish va internet. Hammom va oshxona umumiy.\n\n**Kumush** \u2014 bronza + xonada yuvinish joyi, kattaroq ish stoli, qo\u2018shimcha javonlar va yumshoq kursi.\n\n**Oltin** \u2014 to\u2018liq mustaqillik: shaxsiy hammom, mini-oshxona (muzlatgich, plita, mikroto\u2018lqinli), keng ish zonasi va dam olish burchagi.\n\n**To\u2018lov nima o\u2018z ichiga oladi:** xona narxi, kommunal xizmatlar (suv, elektr, isitish), internet, umumiy joylar tozalash va xavfsizlik.\n\n**Muddat tanlovi** \u2014 semestrlik yoki to\u2018liq o\u2018quv yili. Uzoq muddat tanlaganlarga qulayroq narx qo\u2018llanadi.',
      faq: 'Qaysi daraja eng ommabop? :: Kumush \u2014 narx va qulaylik muvozanati yaxshi.\nDarajani keyin oshirsam bo\u2018ladimi? :: Bo\u2018sh joy bo\u2018lsa, semestr boshida mumkin.\nKommunal to\u2018lov alohidami? :: Yo\u2018q, narxga kiritilgan.\nBo\u2018lib to\u2018lash mumkinmi? :: Ha, shartnomada belgilangan grafik bo\u2018yicha.\nUzoq muddatga chegirma bormi? :: Ha, to\u2018liq o\u2018quv yiliga shartnoma qulayroq.\nKafolat to\u2018lovi qaytariladimi? :: Ha, shartnoma tugagach, zarar bo\u2018lmasa to\u2018liq qaytariladi.',
    },
    {
      title: 'Blog va maslahatlar', slug: 'blog', icon: 'speech', image: 'shaharcha/img/blog.jpg',
      summary: 'Talabalik hayoti, tejamkorlik va moslashish bo‘yicha foydali maqolalar.',
      body: 'Blogimizda talabalar uchun amaliy maslahatlar to‘planadi — ko‘chib o‘tishdan imtihon davrigacha.\n\n**Ko‘chib o‘tish** — nima olib kelish kerak, nimani joyida sotib olish arzon, birinchi hafta rejasi.\n\n**Byudjet** — oylik xarajatlarni rejalashtirish, tejamkor xarid, o‘zi pishirishning foydasi.\n\n**Moslashish** — yangi shaharda do‘st topish, sog‘inchni engish, kun tartibini shakllantirish.\n\n**O‘qish va dam** — imtihonga tayyorlanish usullari, tanaffuslar ahamiyati, uyqu tartibi.\n\n**Xavfsizlik** — kundalik ehtiyot choralari, muhim raqamlar, favqulodda holatlarda nima qilish.\n\nYangi maqolalar muntazam qo‘shiladi.',
      faq: 'Maqolalar qanchalik tez yangilanadi? :: Muntazam — har oy yangi mavzular qo‘shiladi.\nO‘zim maqola yozsam bo‘ladimi? :: Ha, talabalar tajribasi juda qadrli — koordinatorga yozing.\nMavzu taklif qilsam bo‘ladimi? :: Albatta, qiziqtirgan mavzuni ayting.',
    },
  ]);

  await seedTable('residences', ['name', 'city', 'image', 'summary', 'description', 'amenities', 'price', 'link', 'sort'], [
    {
      name: 'Markaziy talabalar shaharchasi', city: 'Qo‘qon — markaz',
      image: 'shaharcha/img/tj-1.jpg', price: 'Oyiga — qulay narx',
      summary: 'Universitetga piyoda 5 daqiqa. Eng ommabop va qulay variant.',
      description: 'Markaziy talabalar shaharchasi universitetning asosiy binosidan atigi 5 daqiqalik masofada joylashgan. Bu yerda 2 va 3 kishilik xonalar, umumiy oshxonalar va tinch o‘quv zonalari mavjud.\n\nHar bir qavatda kir yuvish xonasi, dam olish burchagi va tez internet bor. Kirish kartalar orqali nazorat qilinadi, hudud 24/7 kuzatuv ostida.',
      amenities: 'Tez Wi-Fi\nUmumiy oshxona\nKir yuvish xonasi\nO‘quv zonasi\n24/7 xavfsizlik\nVelosiped turargohi',
      link: '',
    },
    {
      name: 'Studiya turar joy majmuasi', city: 'Qo‘qon — universitet yaqinida',
      image: 'shaharcha/img/tj-2.jpg', price: 'Premium daraja',
      summary: 'Mustaqil studiya xonalar: shaxsiy hammom va mini-oshxona.',
      description: 'Mustaqillikni qadrlaydigan talabalar uchun to‘liq jihozlangan studiya xonalar. Har bir studiyada shaxsiy hammom, mini-oshxona, keng ish stoli va katta deraza bor.\n\nMajmuada umumiy sport zali, kinozal va tom-terrassa mavjud. Bu — o‘qish va dam olish uchun ideal muvozanat.',
      amenities: 'Shaxsiy hammom\nMini-oshxona\nSport zali\nKinozal\nTom-terrassa\nTez Wi-Fi',
      link: '',
    },
    {
      name: 'Umumiy kvartiralar (shared flat)', city: 'Qo‘qon — shahar markazi',
      image: 'shaharcha/img/tj-3.jpg', price: 'Tejamkor variant',
      summary: '3–5 talaba uchun: shaxsiy yotoqxona + umumiy zal.',
      description: 'Har bir talabaga shaxsiy yotoqxona, umumiy oshxona va mehmonxona. Xarajatlar bo‘lishiladi, shuning uchun narx ancha qulay bo‘ladi.\n\nHamxonalar bilan birga yashash mustaqillikka o‘rgatadi va umrbod do‘stlik boshlanadigan joy bo‘ladi.',
      amenities: 'Shaxsiy yotoqxona\nUmumiy oshxona va zal\nKir yuvish mashinasi\nIsh stoli\nTez Wi-Fi\nAvtoturargoh',
      link: '',
    },
    {
      name: 'Xalqaro talabalar uyi', city: 'Qo‘qon — kampus hududi',
      image: 'shaharcha/img/tj-4.jpg', price: 'Xizmatlar narxga kiritilgan',
      summary: 'Xorijdan kelgan talabalar uchun to‘liq xizmatli turar joy.',
      description: 'Xalqaro talabalar uchun maxsus tashkil etilgan turar joy: kelishdan boshlab moslashishgacha to‘liq yordam.\n\nXonalar to‘liq jihozlangan, kommunal xizmatlar narxga kiritilgan. Doimiy koordinator hujjatlar, tibbiy sug‘urta va kundalik masalalarda yordam beradi.',
      amenities: 'To‘liq jihozlangan xona\nKommunal xizmatlar narxda\nKoordinator yordami\nUmumiy oshxona\nTez Wi-Fi\n24/7 xavfsizlik',
      link: '',
    },
    {
      name: 'Oilaviy mehmondorchilik', city: 'Qo‘qon — turli mahallalar',
      image: 'shaharcha/img/tj-5.jpg', price: 'Ovqat bilan yoki ovqatsiz',
      summary: 'Mahalliy oila bag‘rida: uy sharoiti va uy ovqati.',
      description: 'Tekshirilgan mahalliy oilalar bag‘rida yashash imkoniyati. Bu variant ayniqsa birinchi kurs va xorijlik talabalar uchun moslashishni osonlashtiradi.\n\nUy sharoiti, uy ovqati va kundalik jonli muloqot — til va madaniyatni tez o‘zlashtirishning eng yaxshi yo‘li.',
      amenities: 'Uy ovqati (ixtiyoriy)\nAlohida xona\nKir yuvish\nOilaviy muhit\nWi-Fi\nTekshirilgan oilalar',
      link: '',
    },
    {
      name: 'Qisqa muddatli turar joy', city: 'Qo‘qon — markaz',
      image: 'shaharcha/img/tj-6.jpg', price: 'Kunlik / haftalik',
      summary: 'Imtihon, kurs yoki qisqa tashrif uchun bir necha kun/hafta.',
      description: 'Qabul imtihonlari, qisqa kurslar yoki tashrif uchun kelgan talabalar va ota-onalar uchun qisqa muddatli joy.\n\nBron qilish oddiy, xonalar to‘liq jihozlangan, minimal muddat — bir necha kun.',
      amenities: 'Kunlik bron\nTo‘liq jihozlangan\nToza choyshab va sochiq\nWi-Fi\nMarkazda joylashuv\n24/7 qabul',
      link: '',
    },
  ]);

  await seedTable('gallery', ['title', 'category', 'image', 'description', 'video', 'sort'], [
    {
      title: 'Bosh oʻquv binosi', category: 'Binolar', image: 'images/gallery/bino-1.jpg', video: '',
      description: 'Imora AI bosh oʻquv binosi — universitetning yuragi. Bu yerda zamonaviy auditoriyalar, mʼaʼruza zallari va professor-oʻqituvchilar kafedralari joylashgan.\n\nBino arxitekturasi anʼanaviy va zamonaviy uslublarni uygʻunlashtirgan boʻlib, talabalar uchun qulay va ilhomlantiruvchi muhit yaratadi.',
    },
    {
      title: 'Markaziy hovli va maydon', category: 'Binolar', image: 'images/gallery/bino-2.jpg', video: '',
      description: 'Universitet markaziy hovlisi — talabalar tanaffus paytida dam oladigan, uchrashuvlar va tadbirlar oʻtkaziladigan joy.\n\nYashil maydon, oʻrindiqlar va yoʻlaklar bilan bezatilgan bu hudud kampus hayotining markazidir.',
    },
    {
      title: 'Zamonaviy fasad', category: 'Binolar', image: 'images/gallery/bino-3.jpg', video: '',
      description: 'Universitet binolarining tashqi koʻrinishi — zamonaviy mʼeʼmorchilik yechimi. Katta oynalar tabiy yorugʻlikni oʻtkazadi va energiya tejamkorligini tʼaʼminlaydi.',
    },
    {
      title: 'Maʼmuriy bino', category: 'Binolar', image: 'images/gallery/bino-4.jpg', video: '',
      description: 'Maʼmuriy bino — qabul komissiyasi, dekanat va boshqaruv boʻlimlari joylashgan bino. Talabalar bu yerda barcha hujjat va tashkiliy masalalar boʻyicha yordam oladi.',
    },
    {
      title: 'Kutubxona binosi', category: 'Binolar', image: 'images/gallery/bino-5.jpg', video: '',
      description: 'Zamonaviy kutubxona — minglab kitoblar, raqamli resurslar va tinch oʻqish zonalari. Talabalar bu yerda mustaqil ishlash va ilmiy izlanishlar olib borish imkoniyatiga ega.',
    },
    {
      title: 'Sport majmuasi', category: 'Binolar', image: 'images/gallery/bino-6.jpg', video: '',
      description: 'Universitet sport majmuasi — zamonaviy trenajyor zallari, oʻyin maydonchalari va sport toʻgaraklari. Talabalar salomatligi va faol hayot tarzi bu yerda qoʻllab-quvvatlanadi.',
    },
    {
      title: 'Talabalar turar joyi', category: 'Binolar', image: 'images/gallery/bino-7.jpg', video: '',
      description: 'Qulay va xavfsiz talabalar turar joyi. Har bir xonada zarur sharoitlar yaratilgan boʻlib, boshqa shaharlardan kelgan talabalar uchun ikkinchi uy vazifasini oʻtaydi.',
    },
    {
      title: 'Ilmiy-tadqiqot markazi', category: 'Binolar', image: 'images/gallery/bino-8.webp', video: '',
      description: 'Ilmiy-tadqiqot markazi — laboratoriyalar va innovatsion loyihalar makoni. Talabalar va olimlar bu yerda zamonaviy ilmiy izlanishlar olib boradi.',
    },
    {
      title: 'Konferensiya zali', category: 'Binolar', image: 'images/gallery/bino-9.webp', video: '',
      description: 'Katta konferensiya zali — ilmiy anjumanlar, seminarlar va tantanali tadbirlar oʻtkaziladigan zamonaviy zal. Yuqori sifatli akustika va texnik jihozlar bilan tʼaʼminlangan.',
    },
    {
      title: 'Kampusning umumiy koʻrinishi', category: 'Binolar', image: 'images/gallery/bino-10.jpg', video: '',
      description: 'Imora AI kampusi — barcha oʻquv, ilmiy va turar joy binolarini oʻz ichiga olgan yagona hudud. Yashil zonalar va zamonaviy infratuzilma bilan uygʻunlashgan.',
    },
    {
      title: 'Zamonaviy auditoriya', category: 'Ichki koʻrinish', image: 'images/gallery/ichki-1.jpg', video: '',
      description: 'Auditoriyalar zamonaviy jihozlar — proyektorlar, interaktiv doskalar va qulay oʻrindiqlar bilan tʼaʼminlangan. Har bir dars samarali va qiziqarli oʻtishi uchun barcha sharoit yaratilgan.',
    },
    {
      title: 'Kutubxona ichki koʻrinishi', category: 'Ichki koʻrinish', image: 'images/gallery/ichki-2.jpg', video: '',
      description: 'Kutubxona ichki qismi — keng va yorugʻ oʻqish zallari. Talabalar bu yerda kitoblar, jurnallar va elektron manbalardan foydalanib, bilim olishadi.',
    },
    {
      title: 'Kompyuter laboratoriyasi', category: 'Ichki koʻrinish', image: 'images/gallery/ichki-3.png', video: '',
      description: 'Zamonaviy kompyuter laboratoriyasi — yuqori tezlikdagi internet va soʻnggi dasturiy tʼaʼminot bilan jihozlangan. IT yoʻnalishidagi talabalar amaliy koʻnikmalarni bu yerda egallaydi.',
    },
    {
      title: 'Amaliy mashgʻulot xonasi', category: 'Ichki koʻrinish', image: 'images/gallery/ichki-4.jpg', video: '',
      description: 'Amaliy mashgʻulotlar va imtihonlar oʻtkaziladigan xona. Kichik guruhlarda ishlash uchun qulay muhit, bu yerda talabalar nazariyani amaliyot bilan bogʻlaydi.',
    },
    {
      title: 'Talabalar dam olish zonasi', category: 'Ichki koʻrinish', image: 'images/gallery/ichki-5.jpg', video: '',
      description: 'Talabalar tanaffus paytida dam oladigan, doʻstlari bilan suhbatlashadigan qulay zona. Kampus hayotining ijtimoiy markazlaridan biri.',
    },
    {
      title: 'Guruhli ishlash maydoni', category: 'Ichki koʻrinish', image: 'images/gallery/ichki-6.png', video: '',
      description: 'Loyihalar ustida jamoaviy ishlash uchun moʻljallangan maydon. Talabalar bu yerda gʻoyalarni muhokama qiladi, birgalikda taqdimotlar tayyorlaydi va bir-biridan oʻrganadi.',
    },
    {
      title: 'Universitet yotoqxonasi', category: 'Turar joy', image: 'images/turar-joy/tj-1.jpg', video: '',
      description: 'Universitet yotoqxonasi — eng qulay narxdagi va kampusga eng yaqin variant. Xonalar 2–4 kishilik boʻlib, har birida oʻquv joyi, shkaf va internet mavjud.\n\nUmumiy oshxona, kir yuvish xonasi va dam olish zonasi barcha talabalar ixtiyorida. 24/7 xavfsizlik nazorati ishlaydi.',
    },
    {
      title: 'Zamonaviy studiya xonalar', category: 'Turar joy', image: 'images/turar-joy/tj-2.jpg', video: '',
      description: 'Hamkor turar joy majmualarida mustaqil studiya xonalar taklif etiladi. Har bir studiyada shaxsiy hammom, mini-oshxona va ish stoli bor.\n\nMustaqillikni qadrlaydigan va tinch muhitda oʻqishni istagan talabalar uchun ideal variant.',
    },
    {
      title: 'Umumiy kvartira (shared flat)', category: 'Turar joy', image: 'images/turar-joy/tj-3.jpg', video: '',
      description: 'Bir necha talaba birgalikda yashaydigan kvartira: shaxsiy yotoqxona + umumiy oshxona va mehmonxona.\n\nBu variant hamxonalar bilan doʻstlashish, xarajatlarni boʻlishish va mustaqil hayotga oʻrganish imkonini beradi.',
    },
    {
      title: 'Umumiy dam olish zonasi', category: 'Turar joy', image: 'images/turar-joy/tj-4.jpg', video: '',
      description: 'Turar joy majmualarida talabalar uchun umumiy dam olish zonalari mavjud: yumshoq divanlar, televizor, stol oʻyinlari va kichik kutubxona.\n\nBu yerda talabalar tanaffus qiladi, doʻstlashadi va birgalikda tadbirlar oʻtkazadi.',
    },
    {
      title: 'Oilaviy mehmondorchilik', category: 'Turar joy', image: 'images/turar-joy/tj-5.jpg', video: '',
      description: 'Mahalliy oila bagʻrida yashash — uy sharoiti, uy ovqati va kundalik til muhiti. Ayniqsa birinchi kurs talabalari uchun moslashishni osonlashtiradi.\n\nBarcha oilalar universitet tomonidan tekshiriladi va tavsiya etiladi.',
    },
    {
      title: 'Zamonaviy o‘quv zonasi', category: 'Turar joy', image: 'images/gallery/tj-g7.jpg', video: '',
      description: 'Turar joy ichidagi maxsus o‘quv zonasi: keng stollar, yaxshi yorug‘lik va tinch muhit.\n\nImtihon davrida qo‘shimcha joylar ochiladi, shuning uchun har doim bo‘sh stol topiladi.',
    },
    {
      title: 'Umumiy dam olish xonasi', category: 'Turar joy', image: 'images/gallery/tj-g8.jpg', video: '',
      description: 'Talabalar birga vaqt o‘tkazadigan keng xona: yumshoq divanlar, televizor va stol o‘yinlari.\n\nBu yerda kino kechalari, bayramlar va norasmiy uchrashuvlar o‘tkaziladi.',
    },
    {
      title: 'Turar joy majmuasi tashqi ko‘rinishi', category: 'Turar joy', image: 'images/gallery/tj-g9.jpg', video: '',
      description: 'Turar joy majmuasining tashqi ko‘rinishi — zamonaviy meʼmorchilik va yashil hudud.\n\nBinolar atrofida yoritilgan yo‘laklar, velosiped turargohi va dam olish maydonchalari joylashgan.',
    },
    {
      title: 'Kechki kampus manzarasi', category: 'Turar joy', image: 'images/gallery/tj-g10.jpg', video: '',
      description: 'Kechki payt kampus va turar joy hududi — yoritilgan, xavfsiz va tinch.\n\nKech qaytsangiz ham yo‘llar yorug‘ va videokuzatuv ostida bo‘ladi.',
    },
    {
      title: 'Oʻquv va ish burchagi', category: 'Turar joy', image: 'images/turar-joy/tj-6.jpg', video: '',
      description: 'Har bir turar joyda tinch oʻqish uchun maxsus joy ajratilgan: yaxshi yorugʻlik, qulay stol va tez internet.\n\nImtihon davrida qoʻshimcha oʻquv xonalari ham ochiladi.',
    },
  ]);

  await seedTable('programmes', ['key', 'title', 'subtitle', 'image', 'intro', 'highlights', 'faq', 'link', 'sort'], [
    {
      key: 'bakalavr',
      title: 'Jonli boshqaruv paneli',
      subtitle: 'Saytingiz bir qarashda — real vaqtda',
      image: 'images/programmes/prog-bakalavr.jpg',
      intro: 'Imora AI jonli boshqaruv paneli saytingizdagi barcha faollikni bitta joyda, real vaqtda ko‘rsatadi. Hozir necha kishi onlayn, ular qaysi sahifada va nimaga qiziqayotganini bir qarashda bilib olasiz — hech qanday murakkab sozlashsiz.',
      highlights: 'Hozir onlayn tashrifchilar soni\nEng faol sahifalar va bo‘limlar\nKo‘rishlar, bosishlar va qidiruvlar\nSoatlik va kunlik dinamika\nBarchasi bitta chiroyli panelda\nMobil va kompyuterda bir xil qulay',
      faq: 'Panel real vaqtda yangilanadimi? :: Ha, ma’lumot bir necha soniyada yangilanib turadi.\nSozlash qiyinmi? :: Yo‘q — ulaganingizdan so‘ng panel avtomatik to‘ldiriladi.\nBir nechta saytni ko‘rsam bo‘ladimi? :: Ha, har bir saytni alohida yoki birgalikda kuzatish mumkin.',
      link: 'https://qabul.kokanduni.uz/',
    },
    {
      key: 'tezlashtirilgan',
      title: 'Real vaqtli kuzatuv',
      subtitle: 'Har bir harakat — sodir bo‘lgan zahoti',
      image: 'images/programmes/prog-tezlashtirilgan.jpg',
      intro: 'Imora AI tashrifchilar harakatini real vaqtda kuzatadi. Yangi tashrifchi kirganda, sahifa ochilganda yoki tugma bosilganda — buni darhol ko‘rasiz. Kampaniya yoki yangi kontent qanday ishlayotganini kutmasdan bilib olasiz.',
      highlights: 'Jonli tashrifchilar oqimi\nSahifa va tugma bosishlari darhol\nManbalar: qayerdan kelishayotgani\nKampaniya samarasini shu zahoti ko‘rish\nSekundlarda yangilanadigan ma’lumot',
      faq: 'Ma’lumot qanchalik tez keladi? :: Deyarli bir zumda — bir necha soniya ichida.\nHamma harakat kuzatiladimi? :: Ko‘rish, bosish va qidiruvlar — asosiy harakatlar.\nSayt sekinlashmaydimi? :: Yo‘q, Imora AI yengil ishlaydi va tezlikka ta’sir qilmaydi.',
      link: 'https://qabul.kokanduni.uz/',
    },
    {
      key: 'qayta',
      title: 'Auditoriya segmentatsiyasi',
      subtitle: 'Auditoriyangizni guruhlarga ajrating',
      image: 'images/programmes/prog-qayta.jpg',
      intro: 'Imora AI auditoriyangizni tushunarli guruhlarga ajratadi: yangi va qaytgan tashrifchilar, qurilma turi, kirish manbasi va faollik darajasi bo‘yicha. Shunda kim uchun nima ishlayotganini aniq bilib, to‘g‘ri qaror qabul qilasiz.',
      highlights: 'Yangi va qaytgan tashrifchilar\nQurilma bo‘yicha (mobil, kompyuter)\nKirish manbasi bo‘yicha guruhlar\nEng faol va eng qiziqqan auditoriya\nHar bir guruhni alohida tahlil qilish',
      faq: 'Segmentlar avtomatik yaratiladimi? :: Ha, asosiy guruhlar avtomatik ajratiladi.\nShaxsiy ma’lumot to‘planadimi? :: Yo‘q — guruhlar anonim va umumlashtirilgan.\nGuruhlarni solishtirsam bo‘ladimi? :: Ha, guruhlarni yonma-yon taqqoslash mumkin.',
      link: 'https://qabul.kokanduni.uz/',
    },
    {
      key: 'tayyorlov',
      title: 'Konversiya tahlili',
      subtitle: 'Tashrifchilar qayerda to‘xtab qolishini biling',
      image: 'images/programmes/prog-tayyorlov.jpg',
      intro: 'Imora AI foydalanuvchi yo‘lini bosqichma-bosqich tahlil qiladi: kirishdan maqsadli harakatgacha (ariza, xarid, ro‘yxatdan o‘tish). Qaysi qadamda ko‘p odam ketib qolayotganini ko‘rasiz va shu joyni yaxshilab, natijani oshirasiz.',
      highlights: 'Bosqichma-bosqich foydalanuvchi yo‘li\nHar qadamdagi yo‘qotishlarni ko‘rish\nMaqsadli harakatlar (ariza, xarid) sanog‘i\nQaysi sahifa yaxshi ishlayotgani\nO‘zgarishlar samarasini kuzatish',
      faq: 'Maqsadlarni o‘zim belgilaymanmi? :: Ha, muhim harakatlarni maqsad sifatida belgilaysiz.\nMurakkab sozlash kerakmi? :: Yo‘q — asosiy voronka avtomatik tuziladi.\nNatijani qanday yaxshilayman? :: Zaif qadam ko‘rsatiladi, siz uni takomillashtirasiz.',
      link: 'https://qabul.kokanduni.uz/',
    },
    {
      key: 'gcse-qayta',
      title: 'Xatti-harakat tahlili',
      subtitle: 'Foydalanuvchilar sahifada nima qilishini ko‘ring',
      image: 'images/programmes/prog-gcse-qayta.jpg',
      intro: 'Imora AI foydalanuvchilar saytingizda qanday harakat qilishini tahlil qiladi: qaysi bo‘limlarni ko‘proq ko‘rishadi, nimani bosishadi va qayerga e’tibor berishadi. Bu ma’lumot sayt tuzilishini yaxshilash va muhim narsalarni ko‘zga tashlanadigan qilishga yordam beradi.',
      highlights: 'Eng ko‘p ko‘rilgan bloklar va reklamalar\nEng ko‘p bosilgan tugma va havolalar\nQidirilgan so‘zlar va mavzular\nE’tibor qayerga qaratilgani\nSayt tuzilishini yaxshilash uchun aniq ma’lumot',
      faq: 'Bu maxfiylikка ziyon qilmaydimi? :: Yo‘q — hech qanday shaxsiy ma’lumot saqlanmaydi, faqat umumiy harakat.\nHar bir element kuzatiladimi? :: Ha, kartalar, reklamalar va bo‘limlar bo‘yicha alohida.\nMa’lumotni qanday ishlataman? :: Kam ko‘rilgan muhim narsalarni yuqoriroqqa chiqarasiz.',
      link: 'https://qabul.kokanduni.uz/',
    },
    {
      key: 'takrorlash',
      title: 'Aqlli ogohlantirishlar',
      subtitle: 'Muhim o‘zgarishlardan xabardor bo‘ling',
      image: 'images/programmes/prog-takrorlash.jpg',
      intro: 'Imora AI muhim o‘zgarishlarni o‘zi sezadi va sizni ogohlantiradi: tashrifchilar keskin ko‘payganda, biror sahifaga qiziqish oshganda yoki faollik pasayganda. Doim panelga qarab turishingiz shart emas — muhim narsani Imora AI aytadi.',
      highlights: 'Tashriflar keskin oshsa xabar\nYangi qiziqish to‘lqinlari\nFaollik pasayishidan ogohlantirish\nTelegram yoki e-pochtaga xabar\nO‘zingizga kerakli ostonalarni sozlash',
      faq: 'Xabarlar qayerga keladi? :: Telegram yoki e-pochta orqali (o‘zingiz tanlaysiz).\nOgohlantirishlarni sozlay olamanmi? :: Ha, qaysi hodisa muhimligini o‘zingiz belgilaysiz.\nKeraksiz xabarlar bo‘ladimi? :: Yo‘q — faqat siz muhim degan hodisalar bildiriladi.',
      link: 'https://qabul.kokanduni.uz/',
    },
    {
      key: 'gap-yil',
      title: 'Hisobotlar va eksport',
      subtitle: 'Ma’lumotni tushunarli hisobotga aylantiring',
      image: 'images/programmes/prog-gapyear.jpg',
      intro: 'Imora AI to‘plangan ma’lumotni tayyor, tushunarli hisobotlarga aylantiradi. Kunlik, haftalik yoki oylik natijalarni bir bosishда ko‘ring va kerak bo‘lsa jamoangiz yoki mijozingiz uchun eksport qiling.',
      highlights: 'Kunlik, haftalik, oylik hisobotlar\nAsosiy ko‘rsatkichlar bir joyda\nExcel/CSV ko‘rinishiga eksport\nDavrlarni o‘zaro solishtirish\nJamoa yoki mijoz uchun ulashish',
      faq: 'Hisobotlar avtomatik tuziladimi? :: Ha, tayyor shablonlar avtomatik to‘ldiriladi.\nEksport formati qanday? :: Jadval (masalan CSV) ko‘rinishida yuklab olinadi.\nHisobotni jadval bo‘yicha olsam bo‘ladimi? :: Ha, muntazam hisobotlarni sozlash mumkin.',
      link: 'https://qabul.kokanduni.uz/',
    },
    {
      key: 'shaxsiy',
      title: 'Moslashuvchan integratsiya',
      subtitle: 'Istalgan sayt yoki ilovaga oson ulanadi',
      image: 'images/programmes/prog-shaxsiy.jpg',
      intro: 'Imora AI ni istalgan sayt yoki ilovaga ulash oson. Kichik kod bo‘lagini qo‘yasiz — va platforma darhol ishlay boshlaydi. Statik saytlar, zamonaviy freymvorklar va mashhur platformalar bilan mos keladi.',
      highlights: 'Bir necha daqiqada ulanish\nStatik va dinamik saytlar uchun\nMashhur platformalar bilan moslik\nYengil — sayt tezligiga ta’sir qilmaydi\nChuqur texnik bilim talab qilmaydi\nBir hisob — bir nechta sayt',
      faq: 'Ulash uchun dasturchi kerakmi? :: Yo‘q — oddiy ko‘rsatma bo‘yicha o‘zingiz ulay olasiz.\nQaysi platformalarga mos? :: Ko‘pchilik sayt va ilova platformalari bilan.\nBir hisobda nechta sayt bo‘ladi? :: Bir nechta saytni bitta hisobdan boshqarish mumkin.',
      link: 'https://qabul.kokanduni.uz/',
    },
    {
      key: 'qanday-ariza',
      title: 'Imora AI ni qanday boshlash',
      subtitle: 'Uch oddiy qadamda ishga tushiring',
      image: 'images/programmes/prog-ariza.jpg',
      intro: 'Imora AI ni ishga tushirish oson va tez. Bepul hisob yaratasiz, saytingizga kichik kod bo‘lagini qo‘yasiz — va bir necha daqiqada jonli ma’lumot kela boshlaydi. Har bir qadamda tushunarli ko‘rsatma bor.',
      highlights: 'Bepul hisob yaratish\nSaytga kod bo‘lagini qo‘yish\nUlanishni tekshirish\nBirinchi ma’lumotni kutish (bir necha daqiqa)\nPanelni o‘zingizga moslash',
      faq: 'Dasturchi kerakmi? :: Yo‘q — ko‘rsatma bo‘yicha o‘zingiz ulay olasiz.\nQancha vaqt oladi? :: Odatda 5–10 daqiqa.\nBirinchi ma’lumot qachon keladi? :: Ulangan zahoti, deyarli darhol.',
      link: 'https://qabul.kokanduni.uz/',
    },
    {
      key: 'kochirish',
      title: 'Boshqa tizimdan ko‘chib o‘tish',
      subtitle: 'Eski analitikadan Imora AI ga oson o‘ting',
      image: 'images/programmes/prog-kochirish.jpg',
      intro: 'Boshqa analitika xizmatidan foydalanayotgan bo‘lsangiz, Imora AI ga o‘tish oson. Eski kodni olib tashlab, Imora AI kodini qo‘yasiz — va yangi, tushunarli panel darhol ishlay boshlaydi. Jamoamiz ko‘chishда yordam beradi.',
      highlights: 'Eski xizmatni oson almashtirish\nSaytga ta’sirsiz, tez ulanish\nTushunarliroq va sodda panel\nMaxfiylikка mos yechim\nKo‘chishда to‘liq yordam',
      faq: 'Eski ma’lumot ko‘chiriladimi? :: Yangi ma’lumot ulanган kundan yig‘iladi; ko‘chirish bo‘yicha maslahat beramiz.\nIkkalasini birga ishlatsam bo‘ladimi? :: Ha, sinov uchun bir muddat parallel ishlatish mumkin.\nYordam berasizmi? :: Albatta — ko‘chish jarayonini birga bajaramiz.',
      link: 'https://qabul.kokanduni.uz/',
    },
    {
      key: 'tolov',
      title: 'Narxlar va rejalar',
      subtitle: 'Shaffof narxlar — yashirin to‘lovlarsiz',
      image: 'images/programmes/prog-tolov.jpg',
      intro: 'Imora AI narxlari shaffof va moslashuvchan. Kichik loyihalar uchun bepul reja, o‘sib borayotgan saytlar uchun esa qulay tariflar mavjud. Faqat kerakli imkoniyatlar uchun to‘laysiz — yashirin to‘lovlar yo‘q.',
      highlights: 'Kichik loyihalar uchun bepul reja\nO‘sish bilan mos keladigan tariflar\nYashirin to‘lovlarsiz, shaffof narx\nIstalgan vaqtda rejani o‘zgartirish\nBir hisob — bir nechta sayt',
      faq: 'Bepul reja bormi? :: Ha, kichik loyihalar uchun bepul reja mavjud.\nRejani keyin o‘zgartira olamanmi? :: Ha, istalgan vaqtda yuqori yoki past rejaga o‘tasiz.\nYashirin to‘lov bormi? :: Yo‘q — narxlar oldindan aniq ko‘rsatiladi.',
      link: 'https://qabul.kokanduni.uz/',
    },
    {
      key: 'grant',
      title: 'Bepul reja',
      subtitle: 'Kichik loyihalar uchun — mutlaqo bepul',
      image: 'images/programmes/prog-grant.jpg',
      intro: 'Imora AI kichik saytlar va yangi loyihalar uchun bepul rejani taqdim etadi. Asosiy imkoniyatlar — jonli statistika, real vaqtli kuzatuv va maxfiylik himoyasi — bepul rejada ham to‘liq ishlaydi. Loyihangiz o‘sganda istalgan vaqtda kengaytirasiz.',
      highlights: 'Asosiy imkoniyatlar bepul\nJonli statistika va real vaqt\nMaxfiylik himoyasi\nKarta talab qilinmaydi\nXohlagan vaqtda kengaytirish',
      faq: 'Bepul reja doimiymi? :: Ha, kichik loyihalar uchun doimiy bepul.\nKarta kerakmi? :: Yo‘q — bepul rejaga karta talab qilinmaydi.\nKeyin kengaytira olamanmi? :: Ha, istalgan vaqtda yuqori rejaga o‘tasiz.',
      link: 'https://qabul.kokanduni.uz/',
    },
    {
      key: 'imtihonlar',
      title: 'Imora AI qanday ishlaydi',
      subtitle: 'Oddiy kod — kuchli tahlil',
      image: 'images/programmes/prog-imtihon.jpg',
      intro: 'Imora AI saytingizga qo‘yilgan kichik, yengil kod orqali ishlaydi. Bu kod tashrifchilar harakatini (ko‘rish, bosish, qidiruv) anonim tarzda yig‘adi, so‘ng serverда aqlli tahlil qilib, sizga tushunarli ko‘rinishda taqdim etadi — barchasi real vaqtda va maxfiylik saqlangan holda.',
      highlights: 'Yengil kod — sayt tezligiga ta’sirsiz\nAnonim, shaxsiy ma’lumotsiz yig‘ish\nServerda aqlli tahlil\nReal vaqtda natija\nHar bir element bo‘yicha statistika\nMaxfiylik va xavfsizlik ustuvor',
      faq: 'Kod saytni sekinlashtiradimi? :: Yo‘q — u juda yengil va fon rejimida ishlaydi.\nShaxsiy ma’lumot yig‘iladimi? :: Yo‘q, faqat anonim va umumiy harakat.\nTexnik bilim kerakmi? :: Yo‘q — kodni qo‘yish oddiy va tez.\nQanday tahlil qilinadi? :: Ma’lumot serverda umumlashtirilib, tushunarli ko‘rsatkichlarga aylantiriladi.',
      link: 'https://www.kokanduni.uz/uz',
    },
    {
      key: 'imtihon-tolov',
      title: 'Ma’lumot qanday yig‘iladi',
      subtitle: 'Anonim, shaffof va nazorat ostida',
      image: 'images/programmes/prog-imtihon-tolov.jpg',
      intro: 'Imora AI faqat kerakli, anonim ma’lumotni yig‘adi: qaysi sahifa ko‘rildi, qaysi tugma bosildi, nima qidirildi. Ismlar, elektron pochta yoki IP kabi shaxsiy ma’lumotlar saqlanmaydi. Har bir tashrifchi anonim identifikator bilan belgilanadi, xolos.',
      highlights: 'Faqat anonim harakat ma’lumoti\nIsm, e-pochta, IP saqlanmaydi\nHar bir element bo‘yicha aniq sanoq\nShaffof — nima yig‘ilishi ochiq\nMa’lumot xavfsiz saqlanadi',
      faq: 'IP manzil saqlanadimi? :: Yo‘q — IP saqlanmaydi.\nTashrifchini taniysizmi? :: Yo‘q, faqat anonim, tasodifiy identifikator ishlatiladi.\nMa’lumot kimga ko‘rinadi? :: Faqat sizga — hisobingiz egasiga.',
      link: 'https://www.kokanduni.uz/uz',
    },
    {
      key: 'muddatlar',
      title: 'Qonunchilikka muvofiqlik',
      subtitle: 'GDPR va maxfiylik talablariga mos',
      image: 'images/programmes/prog-muddatlar.jpg',
      intro: 'Imora AI maxfiylikni asos qilib qurilgan, shuning uchun zamonaviy maxfiylik talablariga (masalan GDPR) tabiiy ravishda mos keladi. Shaxsiy ma’lumot yig‘ilmagani uchun murakkab cookie roziliklari va ortiqcha huquqiy tashvishlar kamayadi.',
      highlights: 'Maxfiylikni asos qilib qurilgan\nGDPR ruhiga mos yondashuv\nShaxsiy ma’lumot yig‘ilmaydi\nOrtiqcha cookie talab qilmaydi\nFoydalanuvchi ishonchini mustahkamlaydi',
      faq: 'GDPR ga mosmi? :: Ha, shaxsiy ma’lumot yig‘ilmagani uchun mosligi ancha oson.\nCookie rozilik oynasi kerakmi? :: Ko‘p hollarda shart emas — shaxsiy ma’lumot yo‘q.\nHuquqiy hujjatlar berasizmi? :: Maxfiylik yondashuvi hujjatlashtirilgan va ochiq.',
      link: 'https://www.kokanduni.uz/uz',
    },
    {
      key: 'sinov',
      title: 'Ma’lumot sizniki',
      subtitle: 'To‘liq nazorat: eksport va o‘chirish',
      image: 'images/programmes/prog-sinov.jpg',
      intro: 'Imora AI da to‘plangan ma’lumot butunlay sizga tegishli. Uni istalgan vaqtda eksport qilib olishingiz yoki butunlay o‘chirib tashlashingiz mumkin. Biz ma’lumotingizni sotmaymiz va uchinchi tomonlarga bermaymiz.',
      highlights: 'Ma’lumot to‘liq sizniki\nIstalgan vaqtda eksport\nBir bosishда o‘chirish imkoni\nUchinchi tomonlarga berilmaydi\nSotilmaydi va reklama uchun ishlatilmaydi',
      faq: 'Ma’lumotni yuklab olsam bo‘ladimi? :: Ha, istalgan vaqtda eksport qilasiz.\nO‘chirsam butunlay ketadimi? :: Ha, o‘chirilgan ma’lumot qaytarilmaydi.\nMa’lumot sotiladimi? :: Yo‘q — hech qachon sotilmaydi yoki ulashilmaydi.',
      link: 'https://www.kokanduni.uz/uz',
    },
    {
      key: 'amaliyot',
      title: 'Aniq va ishonchli hisob',
      subtitle: 'Har bir tashrifchi bir marta sanaladi',
      image: 'images/programmes/prog-amaliyot.jpg',
      intro: 'Imora AI ko‘rsatkichlari aniq. Har bir tashrifchi bir elementni faqat bir marta sanaydi — sahifani qayta yuklab yoki bir necha marta bosib, sonni sun’iy shishirib bo‘lmaydi. Shuning uchun “ko‘rishlar” haqiqiy, unikal insonlar sonini anglatadi.',
      highlights: 'Takror-himoya: bir kishi bir marta\nSonni sun’iy oshirib bo‘lmaydi\nUnikal tashrifchilar aniq hisobi\nBotlar va shovqin filtri\nIshonchli, real ko‘rsatkichlar',
      faq: 'Qayta yuklasam son oshadimi? :: Yo‘q — takror-himoya buni oldini oladi.\n“Ko‘rish” nimani bildiradi? :: Elementni ko‘rgan unikal insonlar soni.\nBotlar sanaladimi? :: Asosiy shovqin va botlar filtrlab tashlanadi.',
      link: 'https://www.kokanduni.uz/uz',
    },
    {
      key: 'gcse-amaliyot',
      title: 'Yengil va tezkor',
      subtitle: 'Saytingizni sekinlashtirmaydi',
      image: 'images/programmes/prog-gcse-amaliyot.jpg',
      intro: 'Imora AI kodi juda yengil va fon rejimida ishlaydi, shuning uchun saytingiz tezligiga deyarli ta’sir qilmaydi. Foydalanuvchilar farqni sezmaydi, siz esa to‘liq tahlilга ega bo‘lasiz.',
      highlights: 'Juda kichik va yengil kod\nFon rejimida ishlaydi\nSahifa yuklanishini sekinlashtirmaydi\nMobil qurilmalarда ham tez\nBarqaror va ishonchli',
      faq: 'Kod hajmi qancha? :: Juda kichik — sahifaga sezilarli yuk bermaydi.\nSayt tezligi tushadimi? :: Yo‘q, ta’sir deyarli sezilmaydi.\nMobilда ishlaydimi? :: Ha, barcha qurilmalarда tez ishlaydi.',
      link: 'https://www.kokanduni.uz/uz',
    },
    {
      key: 'natijalar-xizmat',
      title: 'Ma’lumotdan xulosa va tavsiya',
      subtitle: 'Faqat raqam emas — aniq tavsiyalar',
      image: 'images/programmes/prog-natijalar.jpg',
      intro: 'Imora AI shunchaki raqamlarni ko‘rsatmaydi — u ma’lumotdan tushunarli xulosa chiqarib, sizga aniq tavsiyalar beradi. Nima yaxshi ishlayotgani va nimani yaxshilash kerakligini oddiy tilda tushuntiradi.',
      highlights: 'Ma’lumotdan avtomatik xulosa\nAniq va amaliy tavsiyalar\nNima ishlayapti — nima yo‘q\nO‘sish imkoniyatlarini ko‘rsatish\nOddiy, tushunarli tilда',
      faq: 'Tavsiyalar qanday tuziladi? :: Ma’lumotdagi tendensiyalar asosida avtomatik.\nTexnik bilim kerakmi? :: Yo‘q — xulosalar oddiy tilда beriladi.\nTavsiyalar foydalimi? :: Ular real ma’lumotga asoslangani uchun amaliy.',
      link: 'https://www.kokanduni.uz/uz',
    },
    {
      key: 'oquv-muddat',
      title: 'Yordam va qo‘llanma',
      subtitle: 'Kerakli javob — bir necha soniyada',
      image: 'images/programmes/prog-muddat.jpg',
      intro: 'Imora AI ni ishlatish oson, lekin savol tug‘ilsa — batafsil qo‘llanma va yordam maqolalari doim yoningizda. Ulanishdan tortib hisobotlargacha har bir bosqich sodda tilda tushuntirilgan.',
      highlights: 'Bosqichma-bosqich qo‘llanma\nTez-tez beriladigan savollar\nUlash va sozlash bo‘yicha maslahat\nVideo va rasmli ko‘rsatmalar\nDoimiy yangilanib turadi',
      faq: 'Qo‘llanma bepulmi? :: Ha, barcha yordam materiallari ochiq va bepul.\nQidiruv bormi? :: Ha, kerakli mavzuni tez topasiz.\nYangi funksiyalar tushuntiriladimi? :: Ha, har bir yangilik qo‘llanmaga qo‘shiladi.',
      link: 'https://www.kokanduni.uz/uz',
    },
    {
      key: 'akademik',
      title: 'Mijozlarni qo‘llab-quvvatlash',
      subtitle: 'Har qanday savolда yoningizdamiz',
      image: 'images/programmes/prog-akademik.jpg',
      intro: 'Imora AI jamoasi har qanday savolда yordam berishga tayyor. Ulash, sozlash yoki ma’lumotni tushunish bo‘yicha savolingiz bo‘lsa — tez va aniq javob olasiz. Sizni yolg‘iz qoldirmaymiz.',
      highlights: 'Tez va samimiy javob\nUlash va sozlashда yordam\nMa’lumotni tushunishга ko‘mak\nTelegram va e-pochta orqali aloqa\nDoimiy, ishonchli qo‘llab-quvvatlash',
      faq: 'Qanday murojaat qilaman? :: Telegram yoki e-pochta orqali.\nJavob qancha vaqtда keladi? :: Odatda tez — ish kuni davomida.\nQo‘llab-quvvatlash pullimi? :: Asosiy yordam barcha uchun ochiq.',
      link: 'https://www.kokanduni.uz/uz',
    },
    {
      key: 'turar-joy',
      title: 'Hamjamiyat va yangilanishlar',
      subtitle: 'Imora AI bilan birga o‘sib boring',
      image: 'images/programmes/prog-turarjoy.jpg',
      intro: 'Imora AI shunchaki vosita emas — bu rivojlanayotgan hamjamiyat. Biz foydalanuvchilar fikrini tinglaymiz, yangi imkoniyatlar qo‘shamiz va har bir yangilanishни ochiq ulashamiz. Sizning takliflaringiz platformani yaxshilaydi.',
      highlights: 'Doimiy yangi imkoniyatlar\nFoydalanuvchi takliflari inobatga olinadi\nYangilanishlar ochiq e’lon qilinadi\nFoydali maslahat va yo‘riqnomalar\nTelegram jamiyati va yangiliklar',
      faq: 'Taklif bersam bo‘ladimi? :: Albatta — takliflaringizni kutamiz va qadrlaymiz.\nYangiliklar qayerда e’lon qilinadi? :: Sayt va Telegram kanalимiz orqali.\nYangi funksiyalar bepulmi? :: Ko‘p yangilanishlar barcha rejalarга qo‘shiladi.',
      link: 'https://www.kokanduni.uz/uz',
    },
    {
      key: 'fikrlar',
      title: 'Mijozlar fikri',
      subtitle: 'Ular Imora AI haqida nima deydi',
      image: 'images/programmes/prog-fikrlar.jpg',
      intro: 'Imora AI dan foydalanayotgan sayt egalari va jamoalarning fikri — biz uchun eng qimmatli baho. Ular platforma qanday yordam berayotgani, auditoriyani tushunish qanchalik osonlashgani haqida ochiq gapiradi.',
      highlights: 'Haqiqiy foydalanuvchi fikrlari\nSayt egalari va jamoalar tajribasi\nAuditoriyani tushunish natijalari\nSodda va foydali ekaniga baho\nIshonch va tavsiyalar',
      faq: 'Fikrlar haqiqiymi? :: Ha, real foydalanuvchilardan.\nMen ham fikr qoldirsam bo‘ladimi? :: Albatta — fikringizni qadrlaymiz.\nNatijalar qanday? :: Ko‘pchilik auditoriyasini yaxshiroq tushunganini aytadi.',
      link: 'https://www.kokanduni.uz/uz',
    },
    {
      key: 'onlayn',
      title: 'Bulutli va xavfsiz',
      subtitle: 'Istalgan joyдан, istalgan qurilmadan',
      image: 'images/programmes/prog-onlayn.jpg',
      intro: 'Imora AI to‘liq bulutда ishlaydi — hech narsa o‘rnatish shart emas. Panelга brauzer orqали istalgan joydan kirasiz. Ma’lumot xavfsiz saqlanadi, platforma esa doim yangi va ishlashга tayyor.',
      highlights: 'To‘liq bulutli — o‘rnatish shart emas\nIstalgan qurilmадан kirish\nAvtomatik yangilanadi\nMa’lumot xavfsiz saqlanadi\nBarqaror va doim onlayn',
      faq: 'Dastur o‘rnatish kerakmi? :: Yo‘q — brauzer orqali ishlaydi.\nMobilда ochilaadimi? :: Ha, telefon va planshetда ham qulay.\nMa’lumot xavfsizmi? :: Ha, himoyalangan serverlarда saqlanadi.',
      link: 'https://www.kokanduni.uz/uz',
    },
    {
      key: 'vakansiya',
      title: 'Bo‘sh ish o‘rinlari',
      subtitle: 'Imora AI jamoasiga qo‘shiling',
      image: 'images/programmes/prog-vakansiya.jpg',
      intro: 'Imora AI iqtidorli va tashabbuskor mutaxassislarni jamoaga taklif etadi. Muhandislik, dizayn, mahsulot va qo‘llab-quvvatlash yo‘nalishlari bo‘yicha bo‘sh ish o‘rinlari muntazam e’lon qilinadi. Insonparvar texnologiyani birga quramiz.',
      highlights: 'Zamonaviy va do‘stona ish muhiti\nMasofaviy ishlash imkoniyati\nKasbiy o‘sish va o‘rganish\nRaqobatbardosh sharoit\nHaqiqiy ta’sirли mahsulot ustidа ishlash',
      faq: 'Qanday ariza topshiraman? :: CV ni belgilangan tartibда yuborasiz.\nQaysi yo‘nalishlar bor? :: Muhandislik, dizayn, mahsulot va qo‘llab-quvvatlash.\nMasofaviy ishlasa bo‘ladimi? :: Ko‘p lavozimlar uchun ha.',
      link: 'https://www.kokanduni.uz/uz',
    },
    {
      key: 'tutor-tarmoq',
      title: 'Hamkorlik',
      subtitle: 'Imora AI bilan birga o‘sing',
      image: 'images/programmes/prog-tutor-tarmoq.jpg',
      intro: 'Agentlik, veb-studiya yoki bir nechta sayt boshqaruvchisimisiz? Imora AI hamkorlik dasturi orqali mijozlaringizga jonli, sodda analitikani taklif eting. Birga insonparvar texnologiyani kengroq tarqatamiz.',
      highlights: 'Agentlik va studiyalar uchun\nBir hisobda ko‘p mijoz saytlari\nHamkorlik shartlari va imtiyozlar\nBirgalikda o‘sish imkoniyati\nTexnik va marketing yordami',
      faq: 'Kim hamkor bo‘la oladi? :: Agentliklar, studiyalar va ko‘p sayt boshqaruvchilari.\nMijozlarni birga boshqarsam bo‘ladimi? :: Ha, bitta paneldan.\nQanday boshlanadi? :: Bog‘lanasiz, so‘ng hamkorlik shartlari kelishiladi.',
      link: 'https://www.kokanduni.uz/uz',
    },
    {
      key: 'kollej',
      title: 'Imora AI haqida',
      subtitle: 'Inson va texnologiya uyg‘unligi',
      image: 'images/programmes/prog-kollej.jpg',
      intro: 'Imora AI — insonparvar sun’iy intellekt asosidagi jonli analitika platformasi. Bizning maqsadimiz — murakkab ma’lumotni har kim tushunadigan, foydali va maxfiylikni saqlaydigan qilib taqdim etish. Biz raqamlar ortida doim real insonlar borligiga ishonamiz.',
      highlights: 'Insonparvar, tushunarli AI\nJonli analitika va auditoriya tahlili\nMaxfiylik birinchi o‘rinda\nSodda, chiroyli va tez\nHar bir bizneskа mos yechim',
      faq: 'Imora AI nima qiladi? :: Saytlar uchun jonli, tushunarli analitika beradi.\nKim uchun mos? :: Sayt egalari, jamoalar va bizneslar uchun.\nNimasi bilan ajralib turadi? :: Insonparvarlik, soddalik va maxfiylik.',
      link: 'https://www.kokanduni.uz/uz',
    },
    {
      key: 'metod',
      title: 'Bizning yondashuvimiz',
      subtitle: 'Sodda, halol va inson uchun',
      image: 'images/programmes/prog-metod.jpg',
      intro: 'Biz analitikani murakkab jadvallar emas, balki tushunarli va foydali qilishga intilamiz. Har bir imkoniyat — halollik, maxfiylik va soddalik tamoyillari asosida quriladi. Texnologiya inson uchun ishlashi kerak, aksincha emas.',
      highlights: 'Soddalik — birinchi tamoyil\nHalol va shaffof ma’lumot\nMaxfiylikni asosiy qadriyat qilish\nFoydalanuvchi bilan birga rivojlanish\nHar bir detalда insonga g‘amxo‘rlik',
      faq: 'Nega sodda? :: Chunki ma’lumot foydali bo‘lishi uchun tushunarli bo‘lishi shart.\nHalollik nimada? :: Nima yig‘ilishi va qanday ishlashi ochiq aytiladi.\nInsonparvarlik nimada? :: Har raqam ortida real inson borligini unutmaymiz.',
      link: 'https://www.kokanduni.uz/uz',
    },
    {
      key: 'ustozlar',
      title: 'Bizning jamoa',
      subtitle: 'Imora AI ortidagi insonlar',
      image: 'images/programmes/prog-ustozlar.jpg',
      intro: 'Imora AI ni ishtiyoqli va tajribali jamoa yaratadi. Biz muhandislar, dizaynerlar va mahsulot ustalarimiz — hammamiz bir maqsad bilan birlashganmiz: insonparvar, sodda va ishonchli texnologiya yaratish.',
      highlights: 'Tajribali va ishtiyoqli jamoa\nMuhandislik va dizayn birligi\nFoydalanuvchiga yo‘naltirilgan ishlash\nDoimiy o‘rganish va yaxshilanish\nOchiq va halol qadriyatlar',
      faq: 'Jamoa kim? :: Muhandislar, dizaynerlar va mahsulot mutaxassislari.\nBog‘lansam bo‘ladimi? :: Ha, biz bilan bemalol bog‘laning.\nJamoaga qo‘shilsam bo‘ladimi? :: Ha — vakansiyalar bo‘limiga qarang.',
      link: 'https://www.kokanduni.uz/uz/static/employes/structure/32',
    },
    {
      key: 'natija-yonalish',
      title: 'Natijalar va ta’sir',
      subtitle: 'Imora AI qanday farq yaratadi',
      image: 'images/programmes/prog-natija-yonalish.jpg',
      intro: 'Imora AI dan foydalanadigan saytlar auditoriyasini yaxshiroq tushunadi va to‘g‘riroq qarorlar qabul qiladi. Aniq, jonli ma’lumot — kontentni yaxshilash, konversiyani oshirish va foydalanuvchiga g‘amxo‘rlik qilishга yordam beradi.',
      highlights: 'Auditoriyani chuqurroq tushunish\nKontent va sahifalarni yaxshilash\nKonversiya va natijalar o‘sishi\nTez va ishonchli qarorlar\nFoydalanuvchiga e’tibor',
      faq: 'Qanday farq qiladi? :: Aniq ma’lumot to‘g‘ri qarorga olib keladi.\nKichik saytga ham foydalimi? :: Ha, har qanday hajmdagi loyihaga.\nNatijani qanday ko‘raman? :: Panel va hisobotlarда o‘zgarishlarni kuzatasiz.',
      link: 'https://www.kokanduni.uz/uz',
    },
    {
      key: 'sixth-form',
      title: 'Ko‘p sayt boshqaruvi',
      subtitle: 'Barcha saytlaringiz — bitta panelда',
      image: 'images/programmes/prog-sixthform.jpg',
      intro: 'Bir nechta sayt yoki ilovangiz bormi? Imora AI ularning barchasini bitta hisobdan boshqarish imkonini beradi. Har birини alohida ko‘rasiz yoki umumiy manzarani bir joyда kuzatasiz — qulay va tartibli.',
      highlights: 'Bitta hisobda ko‘p sayt\nHar bir saytni alohida tahlil\nUmumiy manzarani bir joyда ko‘rish\nSaytlar o‘rtasида tez almashish\nJamoa a’zolariga kirish huquqi\nAgentlik va studiyalar uchun qulay',
      faq: 'Nechta sayt qo‘shsam bo‘ladi? :: Rejaga qarab bir nechta sayt qo‘shiladi.\nHar birини alohida ko‘ramanmi? :: Ha, alohida yoki birga.\nJamoa bilan ishlasa bo‘ladimi? :: Ha, a’zolarga kirish berish mumkin.',
      link: 'https://qabul.kokanduni.uz/',
    },
    {
      key: 'kontakt',
      title: 'Biz bilan bog‘lanish',
      subtitle: 'Savollaringiz bormi? Biz yordamга tayyormiz',
      image: 'images/programmes/prog-kontakt.jpg',
      intro: 'Imora AI jamoasi savollaringizga javob berishga har doim tayyor. Platforma, imkoniyatlar, narxlar yoki hamkorlik bo‘yicha biz bilan bemalol bog‘laning — tez va samimiy javob olasiz.',
      highlights: 'Email: rasmiy elektron pochta\nTelegram: qo‘llab-quvvatlash kanali\nIsh vaqti: dushanba–shanba\nHamkorlik va biznes so‘rovlari\nTez va samimiy javob',
      faq: 'Qanday bog‘lansam bo‘ladi? :: E-pochta yoki Telegram orqали.\nJavob qancha vaqtда keladi? :: Odatda ish kuni davomида.\nHamkorlik uchun kimga yozaman? :: Xuddi shu aloqa kanallари orqали.',
      link: 'https://www.kokanduni.uz/uz/static/contacts',
    },
    {
      key: 'yordam',
      title: 'Yordam markazi',
      subtitle: 'Har qanday savolда yoningizdamiz',
      image: 'images/programmes/prog-yordam.jpg',
      intro: 'Imora AI yordam markazi foydalanuvchilarga ulash, sozlash, hisobotlar va texnik masalalarда yordam beradi. Maqsadimiz — har bir murojaatga tez va aniq javob berish, sizni yolg‘iz qoldirmaslik.',
      highlights: 'Ulash va sozlash bo‘yicha yordam\nHisobot va ma’lumotni tushunishга ko‘mak\nTexnik masalalar bo‘yicha qo‘llab-quvvatlash\nQo‘llanma va yo‘riqnomalar\nTez va sifatli javob',
      faq: 'Yordamga qanday murojaat qilaman? :: Telegram yoki e-pochta orqали.\nTexnik muammoда kim yordam beradi? :: Qo‘llab-quvvatlash xizmati.\nJavob qancha vaqtда keladi? :: Odatda ish kuni davomида, tez.',
      link: 'https://www.kokanduni.uz/uz',
    },
  ]);

  const defaults = {
    stories_url: '/stories.html',
    our_tutors_url: 'https://website-checker-tool--davronovo425.replit.app/',
    results_title: 'Natijaga erishgan yoshlarimiz',
    results_intro: 'Universitetimiz talabalarining tanlov va olimpiadalardagi yutuqlari.',
    distinctions_title: 'Imora AI nimasi bilan ajralib turadi?',
    interests_title: 'Sizni qiziqtirishi mumkin',
    news_title: 'Yangiliklar',
    gallery_title: 'Imora AI galereyasi',
    gallery_intro: 'Universitet binolari, zamonaviy auditoriyalar va kampus hayoti — bir joyda.',
    gallery_video_url: '',
    castle_title: 'Imora AI talabalar shaharchasi',
    castle_intro: 'Uyingizdan uzoqda — yangi uyingiz. Universitetga yaqin, xavfsiz va qulay turar joy variantlari.',
    castle_phone: '+998 (00) 000-00-00',
    castle_email: 'turarjoy@kokanduni.uz',
    // Shaharcha alohida sayt bo'lganda footer havolalari shu manzilga ketadi.
    // Bo'sh bo'lsa — havolalar umuman ko'rsatilmaydi.
    university_url: '',
  };
  for (const [k, v] of Object.entries(defaults)) {
    const exists = await db.get('SELECT 1 AS x FROM settings WHERE key = ?', [k]);
    if (!exists) await db.run('INSERT INTO settings (key, value) VALUES (?, ?)', [k, v]);
  }
}

async function cleanupSessions() {
  await db.run('DELETE FROM sessions WHERE expires_at < ?', [Date.now()]);
}

/**
 * "Parol tiklash" (break-glass) — admin parolini unutgan bo'lsa.
 * Serverga `ADMIN_RESET="email:yangiparol"` muhit o'zgaruvchisini berib qayta
 * ishga tushiring — parol tiklanadi va barcha sessiyalar bekor qilinadi.
 * Ishlagach bu o'zgaruvchini OLIB TASHLANG. (Faqat server env'iga kirish
 * huquqi bo'lgan odam ishlata oladi — veb orqali hujum yuzasi yo'q.)
 */
async function applyAdminReset() {
  const raw = process.env.ADMIN_RESET;
  if (!raw) return;
  const idx = raw.indexOf(':');
  if (idx < 1) { log.error('ADMIN_RESET format xato — "email:parol" bo‘lsin'); return; }
  const email = raw.slice(0, idx).trim().toLowerCase();
  const password = raw.slice(idx + 1);
  if (password.length < 8) { log.error('ADMIN_RESET: parol kamida 8 belgidan iborat bo‘lsin'); return; }
  const user = await db.get('SELECT id FROM users WHERE email = ?', [email]);
  if (!user) { log.error('ADMIN_RESET: bunday admin topilmadi', { email }); return; }
  const salt = newSalt();
  await db.run('UPDATE users SET password_hash = ?, salt = ?, updated_at = ? WHERE id = ?',
    [hashPassword(password, salt), salt, Date.now(), user.id]);
  await db.run('DELETE FROM sessions WHERE user_id = ?', [user.id]); // eski sessiyalarni bekor qilamiz
  log.info('ADMIN_RESET: parol tiklandi', { email });
  log.info('⚠️  ADMIN_RESET muhit o‘zgaruvchisini ENDI OLIB TASHLANG.');
}

module.exports = { bootstrapUsers, seedContent, cleanupSessions, applyAdminReset };
