# client/Dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN npm run build

# Копируем в /app/build — docker-compose монтирует volume и возьмёт файлы оттуда
FROM alpine:3.18
WORKDIR /out
# копируем из стадии build
COPY --from=build /app/build /out/build
# при запуске контейнера (client_builder) volume client_build будет заполнен через docker-compose команду (мы положим cp в entrypoint)
CMD ["true"]
