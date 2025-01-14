FROM node:16.3.0-alpine as builder

WORKDIR /app
COPY package.json main.js ./
COPY src /app/src
RUN npm install webtorrent -g
RUN npm install --production && npm run build



FROM alpine

WORKDIR /app
COPY scripts/* /usr/bin/
COPY --from=builder /app/main /usr/bin/torrent

RUN apk add --no-cache transmission-cli mosquitto-clients jq \
    openssh tree sshpass rsync zip curl &&\
    mkdir /data && mkdir -p /root/.ssh &&\
    ssh-keygen -b 2048 -t rsa -f /tmp/sshkey -q -N "" &&\
    chmod +x /usr/bin/transfer /usr/bin/compress
CMD [ "mosquitto -c /etc/mosquitto/mosquitto.conf" ]
