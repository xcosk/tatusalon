import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const newWorks = [
  {
    slug: "oldskul-yakor",
    title: "Якорь олдскул",
    style: "Олдскул",
    priceFrom: 9000,
    description: "Классика American Traditional",
    imageUrl: "/images/old.jpeg",
    categorySlug: "oldskul",
    sortOrder: 7,
  },
  {
    slug: "grafika-portret",
    title: "Графический портрет",
    style: "Графика",
    priceFrom: 7000,
    description: "Контрастная штриховка",
    imageUrl: "/images/images.png",
    categorySlug: "grafika",
    sortOrder: 8,
  },
  {
    slug: "minimal-volna",
    title: "Волна линией",
    style: "Минимализм",
    priceFrom: 4500,
    description: "Одна линия — целый образ",
    imageUrl: "/images/images-2.jpeg",
    categorySlug: "minimalizm",
    sortOrder: 9,
  },
  {
    slug: "yaponiya-drakon",
    title: "Дракон",
    style: "Япония",
    priceFrom: 16000,
    description: "Ирезуми, крупный формат",
    imageUrl: "/images/images-3.jpeg",
    categorySlug: "yaponiya",
    sortOrder: 10,
  },
  {
    slug: "blekvork-cherep",
    title: "Череп блэкворк",
    style: "Блэкворк",
    priceFrom: 11000,
    description: "Плотная чёрная заливка",
    imageUrl: "/images/images-4.jpeg",
    categorySlug: "blekvork",
    sortOrder: 11,
  },
  {
    slug: "geometriya-kompas",
    title: "Компас",
    style: "Геометрия",
    priceFrom: 8500,
    description: "Симметрия и чистые формы",
    imageUrl: "/images/images-5.jpeg",
    categorySlug: "geometriya",
    sortOrder: 12,
  },
  {
    slug: "grafika-botanika",
    title: "Ботаника",
    style: "Графика",
    priceFrom: 6500,
    description: "Тонкая графика, листья",
    imageUrl: "/images/unnamed.jpg",
    categorySlug: "grafika",
    sortOrder: 13,
    isFeatured: true,
  },
  {
    slug: "minimal-siluet",
    title: "Силуэт",
    style: "Минимализм",
    priceFrom: 4000,
    description: "Микро-тату, чистый контур",
    imageUrl: "/images/images.jpeg",
    categorySlug: "minimalizm",
    sortOrder: 14,
  },
];

async function main() {
  for (const w of newWorks) {
    const category = await prisma.category.findUnique({
      where: { slug: w.categorySlug },
    });
    await prisma.tattooWork.upsert({
      where: { slug: w.slug },
      update: {
        title: w.title,
        style: w.style,
        priceFrom: w.priceFrom,
        description: w.description,
        imageUrl: w.imageUrl,
        categoryId: category?.id,
        sortOrder: w.sortOrder,
        isFeatured: w.isFeatured ?? false,
        isPublished: true,
      },
      create: {
        slug: w.slug,
        title: w.title,
        style: w.style,
        priceFrom: w.priceFrom,
        description: w.description,
        imageUrl: w.imageUrl,
        categoryId: category?.id,
        sortOrder: w.sortOrder,
        isFeatured: w.isFeatured ?? false,
        isPublished: true,
      },
    });
    console.log(`Added/updated: ${w.title}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
