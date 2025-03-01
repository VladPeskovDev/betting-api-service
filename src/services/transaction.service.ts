import { prisma } from "../../prisma/client";  
/**
 * Получаем историю транзакций для конкретного пользователя с пагинацией
 * @param userId  ID пользователя
 * @param page    Номер страницы (по умолчанию 1)
 * @param limit   Число записей на страницу (по умолчанию 10)
 */
export async function getTransactionsForUser(
  userId: number,
  page: number = 1,
  limit: number = 10
) {
  // 1) Считаем общее кол-во транзакций
  const total = await prisma.transaction.count({
    where: { userId },
  });

  // 2) Считаем, сколько страниц
  const pages = Math.ceil(total / limit);

  // 3) Получаем нужный «срез» (сортируем по createdAt убыванию)
  const transactions = await prisma.transaction.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * limit,
    take: limit,
  });

  return {
    transactions,
    pagination: {
      total,
      page,
      limit,
      pages,
    },
  };
}
