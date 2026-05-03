FROM node:20-alpine AS base

# 1. Install dependancies
FROM base AS deps
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# 2. Build the project
FROM base AS builder
RUN npm install -g turbo@^2
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN --mount=type=secret,id=DOTENV_PRIVATE_KEY_PRODUCTION,env=DOTENV_PRIVATE_KEY_PRODUCTION turbo run build

# 3. Runner stage
FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# The standalone output folder needs to be copied
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

CMD ["node", "server.js"]
