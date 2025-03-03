"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        // 1) Создаём/обновляем пользователя Vladislav
        const vladislav = yield prisma.user.upsert({
            where: { email: "Vladpeskovdev@gmail.com" },
            update: {},
            create: {
                username: "Vladislav",
                email: "Vladpeskovdev@gmail.com",
            },
        });
        // 2) Создаём/обновляем "admin"
        const admin = yield prisma.user.upsert({
            where: { email: "admin@example.com" },
            update: {},
            create: {
                username: "admin",
                email: "admin@example.com",
            },
        });
        // 3) Добавляем запись в ExternalApiAccount для Vladislav (externalUserId = "12")
        yield prisma.externalApiAccount.upsert({
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
        yield prisma.externalApiAccount.upsert({
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
    });
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
