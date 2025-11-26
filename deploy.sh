#!/bin/bash
set -e

# -------------------------------
# Настройки
# -------------------------------
GIT_BRANCH="main"                     # ветка для деплоя
EMAIL="chabanovdan@gmail.com"        # email для certbot
PROJECT_DIR=$(pwd)                     # корень проекта
ENV_FILE=".env.production"             # серверный env

# -------------------------------
# 1. Обновляем репозиторий
# -------------------------------
echo ">>> Pull latest code from Git ($GIT_BRANCH)"
git fetch origin $GIT_BRANCH
git reset --hard origin/$GIT_BRANCH

# -------------------------------
# 2. Собираем и запускаем контейнеры
# -------------------------------
echo ">>> Build and start Docker containers"
docker compose --env-file $ENV_FILE up -d --build

# -------------------------------
# 3. Копируем статический сайт в volume
# -------------------------------
echo ">>> Copy static website into Docker volume"
docker compose run --rm -v $PROJECT_DIR/website:/src website_builder

# -------------------------------
# 4. Сборка React frontend
# -------------------------------
echo ">>> Build React client into Docker volume"
docker compose run --rm client_builder

# -------------------------------
# 5. Получаем/обновляем SSL сертификаты
# -------------------------------
echo ">>> Obtain/renew SSL certificates via certbot"
./init-letsencrypt.sh $EMAIL

# -------------------------------
# 6. Перезапускаем nginx для применения новых сертификатов
# -------------------------------
echo ">>> Reload Nginx"
docker compose exec nginx nginx -s reload

echo ">>> Deployment completed successfully!"