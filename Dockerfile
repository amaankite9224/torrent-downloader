FROM node:16.3.0-alpine as builder

WORKDIR /app
COPY package.json main.js ./
COPY src /app/src
RUN npm install --production && npm run build


FROM alpine

WORKDIR /app
RUN apk add --no-cache transmission-cli mosquitto-clients \
    openssh tree sshpass rsync &&\
    mkdir /data && mkdir -p /root/.ssh &&\
    ssh-keygen -b 2048 -t rsa -f /tmp/sshkey -q -N "" &&\
    ssh-keyscan -H captain-nemo.xyz >> ~/.ssh/known_hosts
COPY --from=builder /app/main /usr/bin/torrent

CMD [ "mosquitto -c /etc/mosquitto/mosquitto.conf" ]
