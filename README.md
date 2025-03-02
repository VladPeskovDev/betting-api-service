# betting-api-service

--------->Аутентификация<-----------

0. http://localhost:3000/api/auth/signin
   {
   "username": "Vladislav"
   } аутентификация

   ----------->Управление ставками<----------

1. Получаем ставки
   curl -X GET http://localhost:3000/api/bets \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer eyJhbGciOiJIUzI1Ni..."
    
 1.1 Получение ставки по id 
   curl -X GET http://localhost:3000/api/bets/:id \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer eyJhbGciOiJIUzI1Ni..."    

2. Рекомендуемые ставки
   curl -X GET http://localhost:3000/api/bets/recommended \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer eyJhbGciOiJIUzI1Ni..."

3. Делаем ставку
   curl -X POST http://localhost:3000/api/bets \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer eyJhbGciOiJIUzI1Ni..." \
    -d '{
   "amount": 3
   }'

4. Установить баланс
   curl -X POST http://localhost:3000/api/balance \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer <TOKEN>" \
    -d '{
   "balance": 1000
   }'
----------->Управление балансом<---------------

5. Получить баланс 
   curl -X POST http://localhost:3000/api/balance \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer <TOKEN>" \
    -d '{}'
   либо

   curl -X GET http://localhost:3000/api/balance \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer <TOKEN>"

6. История Транзакций 
curl -X GET "http://localhost:3000/api/transactions?page=1&limit=2" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ваш-токен>"


7. Проверка работоспособности сервиса

curl -X GET "http://localhost:3000/api/health" \
  -H "Content-Type: application/json"


------------>Admin<-------------


7. Тестирования аутентификации в api ставок
 curl -X POST http://localhost:3000/api/internal/auth \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {admin_token}" \
  -d '{ "user_id": "5" }'


8. curl -X POST http://localhost:3000/api/internal/bet \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {admin_token}" \
  -d '{
    "user_id": "12",
    "bet": 3
  }'

  
9. Проверка выйгрыша 
curl -X POST http://localhost:3000/api/internal/win \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {admin_token}" \
  -d '{
    "user_id": "5",
    "bet_id": "456"
  }'

10. Установка баланса пользователя 
curl -X POST http://localhost:3000/api/internal/balance \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {admin_token}" \
  -d '{
    "user_id": "5",
    "balance": 1000
  }'

11. Получение баланса пользователя 

curl -X POST http://localhost:3000/api/internal/balance \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {admin_token}" \
  -d '{
    "user_id": "5"
  }'

12. Проверка корректности баланса 

curl -X POST http://localhost:3000/api/internal/check-balance \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {admin_token}" \
  -d '{
    "user_id": "5",
    "expected_balance": 1006
  }'

13. 

curl -X GET "http://localhost:3000/api/internal/bet" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {admin_token}"



обеспечить идемпотентность операций на POST /api/bets; POST /api/internal/bet; POST /api/internal/balance