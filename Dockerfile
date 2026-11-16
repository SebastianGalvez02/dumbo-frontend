# syntax=docker/dockerfile:1

# Herramientas comunes
FROM node:24.22.1-bookworm-slim AS base

ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /app

# Se instala antes de copiar package.json para evitar
# que un npm inicial diferente sea rechazado por devEngines.
RUN npm install --global npm@12.2.1


# Instalación reproducible de dependencias
FROM base AS dependencies

COPY package.json package-lock.json .npmrc ./

RUN npm ci


# Validación y compilación
FROM base AS builder

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production

RUN npm run lint \
    && npm run build \
    && npm run typecheck


# Ejecución de producción
FROM base AS runtime

ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0

RUN mkdir -p .next && chown node:node .next

COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/', {signal: AbortSignal.timeout(3000)}).then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["node", "server.js"]