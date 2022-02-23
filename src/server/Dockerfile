FROM node:lts-alpine3.14

WORKDIR /usr/src/app


ENV CHROME_BIN="/usr/bin/chromium-browser" \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD="true"

RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      harfbuzz \
      ca-certificates \
      ttf-freefont \
      nodejs \
      yarn

COPY package*.json ./
RUN npm install -qy

COPY . .

CMD ["npm", "run", "dev"]