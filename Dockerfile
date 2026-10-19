FROM node:24-bookworm-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:24-bookworm-slim
ENV NODE_ENV=production HOST=0.0.0.0 PORT=3001 SPOORTHI_DATA_DIR=/app/storage
WORKDIR /app
COPY --from=build --chown=node:node /app/dist ./dist
COPY --from=build --chown=node:node /app/server ./server
COPY --from=build --chown=node:node /app/src/data ./src/data
COPY --from=build --chown=node:node /app/package.json ./package.json
RUN mkdir /app/storage && chown node:node /app/storage
USER node
EXPOSE 3001
VOLUME ["/app/storage"]
CMD ["node", "server/start.mjs"]
