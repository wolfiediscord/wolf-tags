FROM node:18

RUN mkdir -p /usr/src/wolftags
WORKDIR /usr/src/wolftags

COPY package.json /usr/src/wolftags
RUN npm install

COPY . /usr/src/wolftags

RUN npm install pm2 -g

CMD ["pm2-runtime", "bot.js"]

