# syntax=docker/dockerfile:1.5
# Use Node.js 20 Alpine as base image
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat python3 make g++
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
# Use npm ci with --prefer-offline for faster builds when cache is available
RUN npm ci --prefer-offline --no-audit --no-fund

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Copy node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy only necessary files for build, exclude unnecessary files via .dockerignore
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
ENV NEXT_TELEMETRY_DISABLED 1

# Build-time environment variables (for NEXT_PUBLIC_ variables)
ARG FINNHUB_API_KEY
ARG NEXT_PUBLIC_API_URL
ARG GEMINI_API_KEY
ARG ADMIN_EMAIL
ARG RESEND_API_KEY

ENV FINNHUB_API_KEY=${FINNHUB_API_KEY}
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV GEMINI_API_KEY=${GEMINI_API_KEY}
ENV ADMIN_EMAIL=${ADMIN_EMAIL}
ENV RESEND_API_KEY=${RESEND_API_KEY}
ENV NODE_ENV=production

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Runtime environment variables
ARG FINNHUB_API_KEY
ARG NEXT_PUBLIC_API_URL
ARG GEMINI_API_KEY
ARG ADMIN_EMAIL
ARG RESEND_API_KEY

ENV FINNHUB_API_KEY=${FINNHUB_API_KEY}
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV GEMINI_API_KEY=${GEMINI_API_KEY}
ENV ADMIN_EMAIL=${ADMIN_EMAIL}
ENV RESEND_API_KEY=${RESEND_API_KEY}

# Create non-root user in a single layer
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy public assets
COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache and create directories in one layer
RUN mkdir -p .next && \
    chown -R nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
# set hostname to localhost
ENV HOSTNAME "0.0.0.0"

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD ["node", "server.js"]
