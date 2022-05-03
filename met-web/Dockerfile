# pull official base image
FROM node:13.12.0-alpine

# set working directory
WORKDIR /app

# set user permissions to app folder
# TODO: replace with correct permissions/user, the current solution just gives it access to everything
RUN set -x \
	&& chmod -R 777 /app/

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY package-lock.json ./

RUN npm install --silent
RUN npm install react-scripts@3.4.1 -g --silent

# add app files
COPY . ./

# start app
CMD ["npm", "start"]