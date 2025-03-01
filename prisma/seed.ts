import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // 1) Создаём/обновляем пользователя Vladislav
  const vladislav = await prisma.user.upsert({
    where: { email: "Vladpeskovdev@gmail.com" },
    update: {},
    create: {
      username: "Vladislav",
      email: "Vladpeskovdev@gmail.com",
    },
  });

  // 2) Создаём/обновляем "admin"
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      username: "admin",
      email: "admin@example.com",
    },
  });

  // 3) Добавляем запись в ExternalApiAccount для Vladislav (externalUserId = "12")
  await prisma.externalApiAccount.upsert({
    where: { userId: vladislav.id },
    update: {
      externalUserId: "12",
      externalSecretKey: "6b34fe24ac2ff8103f6fce1f0da2ef57",
      isActive: true,
    },
    create: {
      userId: vladislav.id,
      externalUserId: "12",
      externalSecretKey: "6b34fe24ac2ff8103f6fce1f0da2ef57",
      isActive: true,
    },
  });

  // 4) Добавляем запись в ExternalApiAccount для admin (externalUserId = "13")
  await prisma.externalApiAccount.upsert({
    where: { userId: admin.id },
    update: {
      externalUserId: "12", 
      externalSecretKey: "6b34fe24ac2ff8103f6fce1f0da2ef57",
      isActive: true,
    },
    create: {
      userId: admin.id,
      externalUserId: "12",
      externalSecretKey: "6b34fe24ac2ff8103f6fce1f0da2ef57",
      isActive: true,
    },
  });

  console.log("Сиды успешно применены!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
