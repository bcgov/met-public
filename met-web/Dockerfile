# "build-stage", based on Node.js, to build and compile the frontend
# pull official base image
FROM node:20-alpine as build-stage

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# Argument for the FontAwesome token
ARG FONTAWESOME_TOKEN

# Set FontAwesome token as an environment variable for use in the .npmrc
ENV FONTAWESOME_PACKAGE_TOKEN=${FONTAWESOME_TOKEN}

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
COPY .npmrc ./

RUN apk --no-cache add g++ make py3-pip && npm install --legacy-peer-deps --silent
RUN npm install react-scripts@3.4.1 -g --silent

# create and set user permissions to app folder
RUN mkdir -p node_modules/.cache && chmod -R 777 node_modules/.cache

# add app files
COPY . ./

RUN npm run build

# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:1.17 as production-stage
RUN mkdir /app

# RUN  touch /var/run/nginx.pid && \
#     chown -R nginx:nginx /var/cache/nginx /var/run/nginx.pid

ARG user=nginx
RUN usermod -a -G root $user

COPY --from=build-stage /app/build /usr/share/nginx/html
COPY /nginx/*.conf /etc/nginx/
COPY /nginx/docker-entrypoint.sh /

# Set ownership and permissions
# Set scripts as executable (make files and python files do not have to be marked)
# Make /etc/passwd writable for the root group so an entry can be created for an OpenShift assigned user account.
RUN chown -R $user:root /etc/nginx/ \
    && chmod -R ug+rw /etc/nginx/ \
    && chmod ug+x docker-entrypoint.sh \
    && chmod g+rw /etc/passwd

USER $user
ENTRYPOINT ["sh", "/docker-entrypoint.sh"]