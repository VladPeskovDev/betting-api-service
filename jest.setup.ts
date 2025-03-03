import dotenv from "dotenv";

// Загружаем переменные окружения из `.env.test`
dotenv.config({ path: ".env.test" });

// Подключаем необходимые моки и настройки
jest.setTimeout(30000); // Увеличиваем таймаут, если тесты работают с БД
