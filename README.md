# betting-api-service

Тестовое задание: Разработка сервиса интеграции с API платформы ставок.

Стек технологий:
Фреймворк: Express
Язык: TypeScript
База данных: PostgreSQL
ORM: Prisma
Пакетный менеджер: pnpm
Тестирование: Jest
Контейнеризация: Docker и Docker Compose

-------------->Инструкция по запуску проекта<-----------

git clone <URL*РЕПОЗИТОРИЯ> или ssh
cd <НАЗВАНИЕ*ПРОЕКТА>

Установка зависимостей
pnpm install

Создаем файл .env криденшелы берем из .env.example

Применяем миграции для создания таблиц в базе данных
pnpm prisma migrate deploy

Наполняем базу данных сидами
pnpm prisma db seed

Запуск проект

pnpm run dev - режим разработки
pnpm run start - продакш режим
pnpm run test - запуск тестов   (тестами покрыта вся логика взаимодействия пользователя с внешним api)

Также этот проект разворачивается в Docker-контейнерах и включает:
Node.js приложение
PostgreSQL базу данных
Prisma ORM для управления схемой БД

Убедится, что есть и заполнен .env.docker файл
docker-compose up --build <-------Сборка и запуск
docker-compose down <-------Остановка контейнеров
docker-compose up <-------Повторный запуск

Для Аутентификации и получения токена, который необходим для теста каждого endpointa использовать пользователей который сидами внесены в бд это:

{
"username": "Vladislav"
} <------ обычный пользователь (тело запроса)

{
"username": "admin"
} <------ пользователь с правами администратора (тело запроса)


документацию по API (Swagger)     ------>   http://localhost:3000/api-docs    (при запущенном сервере)

--------->Аутентификация<-----------

0. В нашем сервисе

   http://localhost:3000/api/auth/login
   {
   "username": "Vladislav"
   }          (Можно тестировать через Thunder Client или Postman)

1. В стороннем сервисе по API   (Примеры тестирования через curl везде нужно добавлять токен полученный при аутентификации)

   curl -X POST http://localhost:3000/api/authOut \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer {token}" \
   -d '{ "user_id": "12" }'

   ----------->Управление ставками<----------

2. Получаем все ставки (история ставок)
   curl -X GET http://localhost:3000/api/bets \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer eyJhbGciOiJIUzI1Ni..."
3. Получение ставки по id
   curl -X GET http://localhost:3000/api/bets/:id \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer eyJhbGciOiJIUzI1Ni..."

4. Рекомендуемые ставки

   curl -X GET http://localhost:3000/api/bets/recommended \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer eyJhbGciOiJIUzI1Ni..."

5. Сделать ставку

   curl -X POST http://localhost:3000/api/bets \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
   -H "Idempotency-Key: 123e4567-e89b-12d3-a456-426614174000" \
   -d '{
   "amount": 3
   }'

6. Получить результат ставки

   curl -X POST "http://localhost:3000/api/win" \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer eyJhbGciOiJIUzI" \
   -d '{"bet_id": 41}'

----------->Управление балансом<---------------

7. Установить баланс
   curl -X POST http://localhost:3000/api/balance \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer <TOKEN>" \
    -d '{
   "balance": 1000
   }'

8. Получить баланс
   curl -X POST http://localhost:3000/api/balance \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer <TOKEN>" \
    -d '{}'
   либо

   curl -X GET http://localhost:3000/api/balance \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer <TOKEN>"

9. История Транзакций
   curl -X GET "http://localhost:3000/api/transactions?page=1&limit=2" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer <ваш-токен>"

10. Проверка работоспособности сервиса

curl -X GET "http://localhost:3000/api/health" \
 -H "Content-Type: application/json"

--------------->Admin<----------------

11. Тестирования аутентификации в api ставок

curl -X POST http://localhost:3000/api/internal/auth \
 -H "Content-Type: application/json" \
 -H "Authorization: Bearer {admin_token}" \
 -d '{ "user_id": "5" }'

12. Тестирование получения рекомендуемой ставки от API

curl -X GET "http://localhost:3000/api/internal/bet" \
 -H "Content-Type: application/json" \
 -H "Authorization: Bearer {admin_token}"

13. Тестирование размещения ставки в API

curl -X POST http://localhost:3000/api/internal/bet \
 -H "Content-Type: application/json" \
 -H "Authorization: Bearer {admin_token}" \
 -d '{
"user_id": "12",
"bet": 3
}'

14. Тестирование получения результата ставки от API

curl -X POST http://localhost:3000/api/internal/win \
 -H "Content-Type: application/json" \
 -H "Authorization: Bearer {admin_token}" \
 -d '{
"user_id": "5",
"bet_id": "456"
}'

15. Установка баланса пользователя

curl -X POST http://localhost:3000/api/internal/balance \
 -H "Content-Type: application/json" \
 -H "Authorization: Bearer {admin_token}" \
 -d '{
"user_id": "5",
"balance": 1000
}'

16. Получение баланса пользователя

curl -X POST http://localhost:3000/api/internal/balance \
 -H "Content-Type: application/json" \
 -H "Authorization: Bearer {admin_token}" \
 -d '{
"user_id": "5"
}'

17. Проверка корректности баланса

curl -X POST http://localhost:3000/api/internal/check-balance \
 -H "Content-Type: application/json" \
 -H "Authorization: Bearer {admin_token}" \
 -d '{
"user_id": "5",
"expected_balance": 1006
}'

----------------------> Архитектура решения тестового задания <-----------------
Решение построено на трёхслойной архитектуре (контроллеры, сервисы, API-клиенты) с использованием TypeScript, Express и PostgreSQL.

1. Основные компоненты

КОНТРОЛЛЕРЫ (Routes)
Отвечают за обработку HTTP-запросов.
Вызывают соответствующие сервисы и возвращают ответы клиенту.
Примеры:
bets.controller.ts — управление ставками.
balance.controller.ts — работа с балансом.

СЕРВИСЫ (Services)
Содержат бизнес-логику приложения.
Обрабатывают данные и взаимодействуют с базой через ORM (Prisma).
Примеры:
bet.service.ts — обработка ставок, проверка выигрыша.
balance.service.ts — управление балансом пользователя.
auth.service.ts — логика авторизации.

API-клиенты (API Clients)
Взаимодействуют с внешними API.
Отправляют запросы и обрабатывают ответы.
Примеры:
betApiClient.ts — работа с API ставок.
balanceApiClient.ts — работа с API баланса.
winApiClient.ts — проверка результатов ставок.

Middleware (Промежуточные слои)
Проверяют JWT-токен (авторизация пользователя).
Валидация user-id в заголовках.
Обрабатывают идемпотентность запросов.

БАЗА ДАННЫХ (PostgreSQL, Prisma ORM)
Основные таблицы:
users — пользователи.
bets — ставки.
transactions — транзакции.
balances — баланс пользователей.
Используются индексы для ускорения поиска (idempotencyKey, userId, status).

2. Взаимодействие компонентов (Поставить ставку)
   Клиент отправляет запрос (например, создание ставки POST /api/bets).
   Контроллер принимает запрос, передаёт данные в сервис.
   Сервис:
   Проверяет баланс пользователя.
   Отправляет ставку во внешний API через betApiClient.
   Сохраняет данные в PostgreSQL через Prisma, при этом изменяя баланс пользователя на сумму ставки.
   Если запрос повторяется, проверяется идемпотентность по idempotencyKey.
   Все взаимодейтсвие пользователя логируется с записью данных в бд.
   Ответ возвращается клиенту.

3. Взаимодействие компонентов (API /win)
   Клиент отправляет запрос (POST /api/bets/win) с bet_id, чтобы проверить результат ставки.
   Контроллер (checkBetWin) принимает запрос и передаёт данные в сервис (checkBetResult).
   Сервис:
   Проверяет, существует ли ставка в базе (ищет по bet_id).
   Проверяет статус ставки:
   Если статус "pending" → отправляет запрос во внешний API (winApiClient) для получения результата.
   Если ставка уже имеет статус "completed", возвращает сохранённый результат (идемпотентность запроса).
   В случае выигрыша:
   Обновляет статус ставки на "won", фиксирует выигрышную сумму.
   Обновляет баланс пользователя.
   Создаёт транзакцию в БД (история операций).
   В случае проигрыша:
   Обновляет статус.
   Идемпотентность обеспечивается проверкой статуса ставки:
   Если статус "completed", повторный запрос не вызывает внешний API, а просто возвращает сохранённый результат.
   Ответ возвращается клиенту с информацией о результате ставки.

4. Взаимодействие с внешними API
   Каждое обращение требует заголовков user-id и x-signature.
   Реализована аутентификация (POST /api/auth), которая проверяет пользователя через authApiClient.
   Вся работа с балансом, ставками и результатами ведётся через внешний API.

5. Безопасность и обработка ошибок
   Используется JWT-токен (verifyAccessToken).
   Запросы проверяются на идемпотентность (ключ idempotencyKey).
   Ошибки логируются в консоль и возвращаются в формате JSON.
   Вывод
   Архитектура построена по принципу разделения ответственности.
   Каждый компонент выполняет строго свою задачу, что делает код гибким и расширяемым.

6. Взаимодействие компонентов (Пул эндпоинтов для администратора)
   Общий принцип работы админских эндпоинтов
   В системе реализован админ без отдельной роли "админ", а через конкретного пользователя-администратора, которого добавили в сиды при начальной инициализации базы данных.
   Все запросы к административным эндпоинтам требуют аутентификации через JWT-токен, а проверка на админа осуществляется через сравнение userId с предустановленным ID администратора.
   Безопасность опеспечена:
   Проверка JWT-токена (verifyAccessToken) → в res.locals.user сохраняется userId.
   Проверка, что userId совпадает с ID админа, который хранится в сидовых данных.



http://localhost:3000/api-docs
