FROM node:9.1.0

ENV ENVIRONMENT=local
ENV PORT=5000

ADD . /cnn-town-crier/

EXPOSE ${PORT}

RUN cd /cnn-town-crier && npm install
CMD cd /cnn-town-crier && node server.js
