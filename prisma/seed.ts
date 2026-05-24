/**
 * НАЧАЛЬНОЕ ЗАПОЛНЕНИЕ БАЗЫ (seed)
 * Запуск: npm run db:seed
 *
 * Создаёт: админа, менеджера, категории, мастеров, эскизы (imageUrl → /images/...),
 * отзывы, галерею, настройки сайта.
 * Менять картинки эскизов: поле imageUrl и файлы в public/images/
 */
import { PrismaClient, Role } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await hash("admin123", 12);

  await prisma.user.upsert({
    where: { email: "admin@inkstudio.ru" },
    update: {},
    create: {
      email: "admin@inkstudio.ru",
      name: "Администратор",
      passwordHash,
      role: Role.ADMIN,
    },
  });

  await prisma.user.upsert({
    where: { email: "manager@inkstudio.ru" },
    update: {},
    create: {
      email: "manager@inkstudio.ru",
      name: "Менеджер",
      passwordHash: await hash("manager123", 12),
      role: Role.MANAGER,
    },
  });

  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      mapEmbedUrl:
        "https://yandex.ru/map-widget/v1/?ll=37.626080%2C55.755819&z=16&pt=37.626080%2C55.755819%2Cpm2rdm",
    },
  });

  const categories = [
    { slug: "minimalizm", name: "Минимализм", sortOrder: 1 },
    { slug: "blekvork", name: "Блэкворк", sortOrder: 2 },
    { slug: "geometriya", name: "Геометрия", sortOrder: 3 },
    { slug: "dotvork", name: "Дотворк", sortOrder: 4 },
    { slug: "realizm", name: "Реализм", sortOrder: 5 },
    { slug: "yaponiya", name: "Япония", sortOrder: 6 },
    { slug: "oldskul", name: "Олдскул", sortOrder: 7 },
    { slug: "grafika", name: "Графика", sortOrder: 8 },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }

  const geo = await prisma.category.findUniqueOrThrow({
    where: { slug: "geometriya" },
  });
  const yaponiya = await prisma.category.findUniqueOrThrow({
    where: { slug: "yaponiya" },
  });
  const minimal = await prisma.category.findUniqueOrThrow({
    where: { slug: "minimalizm" },
  });
  const blek = await prisma.category.findUniqueOrThrow({
    where: { slug: "blekvork" },
  });
  const dot = await prisma.category.findUniqueOrThrow({
    where: { slug: "dotvork" },
  });
  const real = await prisma.category.findUniqueOrThrow({
    where: { slug: "realizm" },
  });
  const oldskul = await prisma.category.findUniqueOrThrow({
    where: { slug: "oldskul" },
  });
  const grafika = await prisma.category.findUniqueOrThrow({
    where: { slug: "grafika" },
  });

  const artists = [
    {
      slug: "alisa-k",
      name: "Алиса К.",
      bio: "Специализируется на минимализме и графике. Работает с тонкой линией и чистыми формами.",
      styles: ["Минимализм", "Графика"],
      sortOrder: 1,
    },
    {
      slug: "mark-v",
      name: "Марк В.",
      bio: "Мастер блэкворка и орнаментальных композиций.",
      styles: ["Блэкворк", "Орнамент"],
      sortOrder: 2,
    },
    {
      slug: "yulya-n",
      name: "Юля Н.",
      bio: "Реализм и дотворк. Внимание к деталям и свету.",
      styles: ["Реализм", "Дотворк"],
      sortOrder: 3,
    },
    {
      slug: "dima-r",
      name: "Дима Р.",
      bio: "Японская традиция и олдскул.",
      styles: ["Япония", "Олдскул"],
      sortOrder: 4,
    },
    {
      slug: "sonya-l",
      name: "Соня Л.",
      bio: "Тонкая линия, микро-тату и деликатные работы.",
      styles: ["Тонкая линия"],
      sortOrder: 5,
    },
    {
      slug: "kirill-o",
      name: "Кирилл О.",
      bio: "Геометрия и абстрактные композиции.",
      styles: ["Геометрия"],
      sortOrder: 6,
    },
  ];

  for (const a of artists) {
    await prisma.tattooArtist.upsert({
      where: { slug: a.slug },
      update: a,
      create: a,
    });
  }

  const kirill = await prisma.tattooArtist.findUniqueOrThrow({
    where: { slug: "kirill-o" },
  });

  const works = [
    {
      slug: "geometricheskiy-volk",
      title: "Геометрический волк",
      style: "Геометрия",
      priceFrom: 8000,
      description: "Тонкие линии, минимализм",
      imageUrl: "/images/gemetric.png",
      categoryId: geo.id,
      artistId: kirill.id,
      isFeatured: true,
      sortOrder: 1,
    },
    {
      slug: "yaponskiy-karp",
      title: "Японский карп",
      style: "Япония",
      priceFrom: 15000,
      description: "Классический ирезуми",
      imageUrl: "/images/a33b324bb0df29c2d9a5a3cea0f73098.jpg",
      categoryId: yaponiya.id,
      isFeatured: true,
      sortOrder: 2,
    },
    {
      slug: "minimalnaya-liniya",
      title: "Минимальная линия",
      style: "Минимализм",
      priceFrom: 5000,
      description: "Один штрих, чистая форма",
      imageUrl: "/images/minimal.jpg",
      categoryId: minimal.id,
      isFeatured: true,
      sortOrder: 3,
    },
    {
      slug: "chernaya-roza",
      title: "Чёрная роза",
      style: "Блэкворк",
      priceFrom: 10000,
      description: "Блэкворк, плотная заливка",
      imageUrl: "/images/mfvmf.jpeg",
      categoryId: blek.id,
      isFeatured: true,
      sortOrder: 4,
    },
    {
      slug: "dotvork-mandala",
      title: "Дотворк мандала",
      style: "Дотворк",
      priceFrom: 12000,
      description: "Точечная техника",
      imageUrl: "/images/dotwor.jpg",
      categoryId: dot.id,
      sortOrder: 5,
    },
    {
      slug: "realizm-glaz",
      title: "Реализм глаз",
      style: "Реализм",
      priceFrom: 18000,
      description: "Фотореалистичный портрет",
      imageUrl: "/images/65368ce5b476c7a72112c8733b864298.jpg",
      categoryId: real.id,
      isFeatured: true,
      sortOrder: 6,
    },
    {
      slug: "oldskul-yakor",
      title: "Якорь олдскул",
      style: "Олдскул",
      priceFrom: 9000,
      description: "Классика American Traditional",
      imageUrl: "/images/old.jpeg",
      categoryId: oldskul.id,
      sortOrder: 7,
    },
    {
      slug: "grafika-portret",
      title: "Графический портрет",
      style: "Графика",
      priceFrom: 7000,
      description: "Контрастная штриховка",
      imageUrl: "/images/images.png",
      categoryId: grafika.id,
      sortOrder: 8,
    },
    {
      slug: "minimal-volna",
      title: "Волна линией",
      style: "Минимализм",
      priceFrom: 4500,
      description: "Одна линия — целый образ",
      imageUrl: "/images/images-2.jpeg",
      categoryId: minimal.id,
      sortOrder: 9,
    },
    {
      slug: "yaponiya-drakon",
      title: "Дракон",
      style: "Япония",
      priceFrom: 16000,
      description: "Ирезуми, крупный формат",
      imageUrl: "/images/images-3.jpeg",
      categoryId: yaponiya.id,
      sortOrder: 10,
    },
    {
      slug: "blekvork-cherep",
      title: "Череп блэкворк",
      style: "Блэкворк",
      priceFrom: 11000,
      description: "Плотная чёрная заливка",
      imageUrl: "/images/images-4.jpeg",
      categoryId: blek.id,
      sortOrder: 11,
    },
    {
      slug: "geometriya-kompas",
      title: "Компас",
      style: "Геометрия",
      priceFrom: 8500,
      description: "Симметрия и чистые формы",
      imageUrl: "/images/images-5.jpeg",
      categoryId: geo.id,
      sortOrder: 12,
    },
    {
      slug: "grafika-botanika",
      title: "Ботаника",
      style: "Графика",
      priceFrom: 6500,
      description: "Тонкая графика, листья",
      imageUrl: "/images/unnamed.jpg",
      categoryId: grafika.id,
      isFeatured: true,
      sortOrder: 13,
    },
    {
      slug: "minimal-siluet",
      title: "Силуэт",
      style: "Минимализм",
      priceFrom: 4000,
      description: "Микро-тату, чистый контур",
      imageUrl: "/images/images.jpeg",
      categoryId: minimal.id,
      sortOrder: 14,
    },
  ];

  for (const w of works) {
    await prisma.tattooWork.upsert({
      where: { slug: w.slug },
      update: w,
      create: w,
    });
  }

  const reviews = [
    {
      author: "Анна М.",
      content:
        "Делала тату у Алисы — всё чисто, спокойно, эскиз дорабатывали вместе. Результат лучше, чем ожидала.",
      rating: 5,
    },
    {
      author: "Игорь С.",
      content:
        "Записался через сайт, перезвонили за пару часов. Сеанс прошёл без спешки, уход объяснили подробно.",
      rating: 5,
    },
    {
      author: "Мария К.",
      content:
        "Студия с характером — не конвейер. Ценю, что не берутся за всё подряд.",
      rating: 5,
    },
  ];

  // Тестовые отзывы сразу опубликованы (у пользователей по умолчанию isPublished: false)
  for (const r of reviews) {
    await prisma.review.create({ data: { ...r, isPublished: true } });
  }

  const galleryImages = [
    "/images/work-wolf-17e862.png",
    "/images/work-koi-5e3251.png",
    "/images/work-line-27adfc.png",
    "/images/work-rose-27adfc.png",
    "/images/work-eye-5d98bb.png",
    "/images/hero-master-3d8ad4.png",
    "/images/studio-interior-3edddf.png",
    "/images/about-studio-4ff87d.png",
  ];

  let sort = 0;
  for (const url of galleryImages) {
    sort += 1;
    await prisma.galleryItem.create({
      data: {
        imageUrl: url,
        sortOrder: sort,
        isPublished: true,
      },
    });
  }

  await prisma.blogPost.upsert({
    where: { slug: "uhod-za-tatuirovkoy" },
    update: {},
    create: {
      slug: "uhod-za-tatuirovkoy",
      title: "Уход за свежей татуировкой: что важно знать",
      excerpt: "Первые две недели определяют, как заживёт работа.",
      content: `## Первые 24 часа\n\nПосле сеанса мастер закроет работу плёнкой. Не снимайте её раньше рекомендованного времени.\n\n## Мытьё\n\nИспользуйте мягкое мыло без отдушек, промокайте чистым полотенцем — не трите.\n\n## Чего избегать\n\n- Солнце и солярий\n- Бассейн и баня\n- Спорт с трением по зоне\n\nПри любых сомнениях — пишите нам в Telegram или на почту.`,
      isPublished: true,
      publishedAt: new Date(),
    },
  });

  await prisma.blogPost.upsert({
    where: { slug: "kak-vybrat-eskiz" },
    update: {},
    create: {
      slug: "kak-vybrat-eskiz",
      title: "Как выбрать эскиз, который останется актуальным",
      excerpt: "Разговор о смысле, а не о трендах.",
      content: `## Начните с идеи\n\nХорошая татуировка — это история. Подумайте, что хотите нести на коже годами.\n\n## Тело имеет значение\n\nМесто влияет на размер, детализацию и то, как линии поведут себя со временем.\n\n## Консультация бесплатна\n\nЗапишитесь — обсудим без обязательств.`,
      isPublished: true,
      publishedAt: new Date(),
    },
  });

  console.log("Seed completed");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
