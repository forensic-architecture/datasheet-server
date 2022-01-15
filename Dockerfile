FROM mhart/alpine-node:10.11

LABEL authors="Lachlan Kermode <lk@forensic-architecture.org>"

# Install app dependencies
COPY package.json /www/package.json
RUN cd /www; npm install

# Copy app source
COPY . /www
WORKDIR /www
RUN npm run build
RUN mkdir -p data

# set your port
ENV PORT 4040
EXPOSE 4040

# start command as per package.json
CMD ["npm", "start"]
