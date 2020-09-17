FROM mhart/alpine-node:10.11

LABEL authors="Lachlan Kermode <lk@forensic-architecture.org>"

# Install app dependencies
COPY package.json /www/package.json
RUN cd /www; yarn

# Copy app source
COPY . /www
WORKDIR /www
RUN yarn build
RUN mkdir -p data

# set your port
ENV PORT 8080
EXPOSE  8080

# start command as per package.json
CMD ["yarn", "start"]
