FROM node:5.3.0
MAINTAINER Sébastien Richoz <sebastien.richoz1@heig-vd.ch>, Patrick Djomo <patrick.djomo@heig-vd.ch>

COPY src res

# install Node.js packages
RUN npm install moment
RUN npm install es6-map

ENTRYPOINT ["node", "res/auditor.js"]