FROM node:5.3.0
MAINTAINER Sébastien Richoz <sebastien.richoz1@heig-vd.ch>, Patrick Djomo <patrick.djomo@heig-vd.ch>

COPY src res

ENTRYPOINT ["node", "res/musician.js"]

# install Node.js package to generate random uuid
RUN npm install uuid
