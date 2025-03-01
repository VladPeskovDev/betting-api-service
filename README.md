# betting-api-service

0. http://localhost:3000/api/auth/signin
   {
   "username": "Vladislav"
   } аутентификация

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

5. Получить баланс curl -X POST http://localhost:3000/api/balance \
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
