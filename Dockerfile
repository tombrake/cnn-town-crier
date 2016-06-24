FROM node:6.2.2

ENV ENVIRONMENT=local
ENV PORT=5000

ADD . /cnn-town-crier/

EXPOSE ${PORT}

cd /cnn-town-crier
npm install

CMD cd /cnn-town-crier && node server.js
