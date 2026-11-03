FROM node:22-bookworm-slim AS dependencies
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev --no-audit --no-fund

FROM node:22-bookworm-slim
ENV NODE_ENV=production
WORKDIR /app
COPY --from=dependencies --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node package.json server.js db.js validation.js ./
COPY --chown=node:node routes ./routes
COPY --chown=node:node controllers ./controllers
COPY --chown=node:node middleware ./middleware
USER node
EXPOSE 5050
CMD ["node", "server.js"]
