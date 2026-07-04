# Version must match the playwright version in package-lock.json —
# the image ships the browsers preinstalled for exactly that release.
FROM mcr.microsoft.com/playwright:v1.59.1-noble

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

ENV NODE_ENV=production
CMD ["node", "dist/http.js"]
