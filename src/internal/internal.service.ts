import { callExternalApi } from "../api/internalApi";

/**
 * 1) Тест аутентификации: POST /api/internal/auth
 */
export async function testAuth(user_id: string) {
  return { success: true, external_response: await callExternalApi("POST", "/auth", { user_id }) };
}

/**
 * 2) Тест получения рекомендуемой ставки: GET /api/internal/bet
 */
export async function testGetBet() {
  return {
    success: true,
    external_response: await callExternalApi("GET", "/bet"),
  };
}

/**
 * 3) Тест размещения ставки: POST /api/internal/bet
 */
export async function testPostBet(user_id: string, bet: number) {
  return { success: true, external_response: await callExternalApi("POST", "/bet", { user_id, bet }) };
}

/**
 * 4) Тест получения результата ставки: POST /api/internal/win
 */
export async function testWin(user_id: string, bet_id: string) {
  return { success: true, external_response: await callExternalApi("POST", "/win", { user_id, bet_id }) };
}

/**
 * 5) Тестирование установки/получения баланса: POST /api/internal/balance
 */
export async function testBalance(user_id: string, balance?: number) {
  const body = balance ? { user_id, balance } : { user_id };
  return { success: true, external_response: await callExternalApi("POST", "/balance", body) };
}

/**
 * 6) Тестирование проверки баланса: POST /api/internal/check-balance
 */
export async function testCheckBalance(user_id: string, expected_balance: number) {
  return {
    success: true,
    external_response: await callExternalApi("POST", "/check-balance", { user_id, expected_balance }),
  };
}
