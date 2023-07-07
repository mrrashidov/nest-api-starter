FROM node:lts-alpine AS base
# BUILD FOR LOCAL DEVELOPMENT
FROM base AS development
WORKDIR /app
COPY --chown=node:node package*.json ./
RUN npm ci;
COPY --chown=node:node . .
USER node


# BUILD FOR PRODUCTION
FROM base AS build
WORKDIR /app
COPY --chown=node:node package*.json ./
COPY --chown=node:node --from=development /app/node_modules ./node_modules
COPY --chown=node:node . .
RUN npm run build;
ENV NODE_ENV production
RUN npm i -g husky && npm ci --only=production && npm cache clean --force
USER node


# PRODUCTION
FROM base As production
COPY --chown=node:node --from=build /app/node_modules ./node_modules
COPY --chown=node:node --from=build /app/dist ./dist
CMD [ "node", "dist/src/main" ]