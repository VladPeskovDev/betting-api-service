"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
// Загружаем переменные окружения из `.env.test`
dotenv_1.default.config({ path: ".env.test" });
// Подключаем необходимые моки и настройки
jest.setTimeout(30000); // Увеличиваем таймаут, если тесты работают с БД
