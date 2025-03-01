import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // 1) Создаём/обновляем пользователя Vladislav
  await prisma.user.upsert({
    where: { email: "Vladpeskovdev@gmail.com" }, // ищем по уникальному полю email
    update: {}, // если нашли, ничего не обновляем
    create: {
      username: "Vladislav",
      email: "Vladpeskovdev@gmail.com",
    },
  });

  // 2) Создаём/обновляем "admin"
  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {}, // можно что-то обновлять
    create: {
      username: "admin",
      email: "admin@example.com",
    },
  });

  console.log("Сиды применены/обновлены без дублирования!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
