FROM node:alpine3.16
WORKDIR /bot
RUN apk add gcc make libc-dev binutils libffi-dev git ffmpeg opus-dev bash 
COPY package.json package.json
RUN npm install
COPY . . 
CMD ["node", "main"]

