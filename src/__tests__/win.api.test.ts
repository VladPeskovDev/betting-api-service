import request from "supertest";
import app from "../app";
import { prisma } from "../../prisma/client";

describe("API Integration Tests", () => {
  let authToken: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let testBet: any;

  it("Должен успешно выполнить логин", async () => {
    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send({ username: "Vladislav" });
    authToken = loginResponse.body.token;
    console.log("Наш токен:", authToken);
    expect(authToken).toBeDefined();
  });

  it("Должен успешно создать ставку", async () => {
    const betResponse = await request(app)
      .post("/api/bets")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ amount: 3 });
    testBet = betResponse.body;
    console.log("Созданная ставка:", testBet);
    expect(testBet).toHaveProperty("id");
    expect(testBet).toHaveProperty("amount");
    expect(testBet.amount).toBe("3");
  });

  describe("POST /api/win", () => {
    it("Должен успешно проверить выигрыш ставки", async () => {
      console.log("Тестируем bet_id:", testBet.id);
      const response = await request(app)
        .post("/api/win")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ bet_id: testBet.id.toString() });
      console.log("Ответ от API:", response.body);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message");
      expect(response.body).toHaveProperty("win_amount");
    });

    it("Должен вернуть 400, если не передан bet_id", async () => {
      const response = await request(app)
        .post("/api/win")
        .set("Authorization", `Bearer ${authToken}`)
        .send({});
      console.log("Ответ для отсутствующего bet_id:", response.body);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("bet_id is required");
    });

    it("Должен вернуть 403, если нет токена", async () => {
      const response = await request(app)
        .post("/api/win")
        .send({ bet_id: testBet.id.toString() });
      console.log("Ответ без токена:", response.body);

      expect(response.status).toBe(403);
    });

    it("Должен вернуть 403, если передан неверный токен", async () => {
      const response = await request(app)
        .post("/api/win")
        .set("Authorization", "Bearer invalid-token")
        .send({ bet_id: testBet.id.toString() });
      console.log("Ответ с неверным токеном:", response.body);

      expect(response.status).toBe(403);
    });
  });

  it("Должен вернуть рекомендованную сумму для ставок", async () => {
    const response = await request(app)
      .get("/api/bets/recommended")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${authToken}`);
    console.log("Ответ для /api/bets/recommended:", response.body);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("recommended_amount");
    expect(typeof response.body.recommended_amount).toBe("number");
  });

  it("Должен вернуть баланс пользователя", async () => {
    const response = await request(app)
      .post("/api/balance")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${authToken}`)
      .send({});
    console.log("Ответ для /api/balance:", response.body);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("balance");
    expect(response.body).toHaveProperty("last_updated");
  });

  it("Должен вернуть список транзакций с пагинацией", async () => {
    const response = await request(app)
      .get("/api/transactions?page=1&limit=2")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${authToken}`);
    console.log("Ответ для /api/transactions:", response.body);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("transactions");
    expect(Array.isArray(response.body.transactions)).toBe(true);
    expect(response.body).toHaveProperty("pagination");
    expect(response.body.pagination).toHaveProperty("total");
    expect(response.body.pagination).toHaveProperty("page");
    expect(response.body.pagination).toHaveProperty("limit");
    expect(response.body.pagination).toHaveProperty("pages");
  });

  it("Должен вернуть состояние сервиса (health check)", async () => {
    const response = await request(app)
      .get("/api/health")
      .set("Content-Type", "application/json");
    console.log("Ответ для /api/health:", response.body);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("status", "ok");
    expect(response.body).toHaveProperty("timestamp");
    expect(response.body).toHaveProperty("services");
    expect(response.body.services).toHaveProperty("api");
    expect(response.body.services).toHaveProperty("database");
    expect(response.body.services).toHaveProperty("external_api");
  });

  it("Должен вернуть историю ставок", async () => {
    const response = await request(app)
      .get("/api/bets")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${authToken}`);
    console.log("Ответ для /api/bets:", response.body);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("bets");
    expect(Array.isArray(response.body.bets)).toBe(true);
    if (response.body.bets.length) {
      const bet = response.body.bets[0];
      expect(bet).toHaveProperty("id");
      expect(bet).toHaveProperty("userId");
      expect(bet).toHaveProperty("externalBetId");
      expect(bet).toHaveProperty("amount");
      expect(bet).toHaveProperty("status");
    }
  });


  afterAll(async () => {
    await prisma.bet.deleteMany({ where: { userId: 1 } });
    await prisma.$disconnect();
  });
});
