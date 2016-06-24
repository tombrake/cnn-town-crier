FROM node:6.2.2

ENV ENVIRONMENT=local
ENV PORT=5000

ADD . /cnn-town-crier/

EXPOSE ${PORT}

CMD cd /cnn-town-crier && node server.js
