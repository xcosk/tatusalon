import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const imageBySlug: Record<string, string> = {
  "geometricheskiy-volk": "/images/gemetric.png",
  "yaponskiy-karp": "/images/a33b324bb0df29c2d9a5a3cea0f73098.jpg",
  "minimalnaya-liniya": "/images/minimal.jpg",
  "chernaya-roza": "/images/mfvmf.jpeg",
  "dotvork-mandala": "/images/dotwor.jpg",
  "realizm-glaz": "/images/65368ce5b476c7a72112c8733b864298.jpg",
};

async function main() {
  for (const [slug, imageUrl] of Object.entries(imageBySlug)) {
    await prisma.tattooWork.updateMany({
      where: { slug },
      data: { imageUrl },
    });
    console.log(`Updated ${slug} -> ${imageUrl}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
