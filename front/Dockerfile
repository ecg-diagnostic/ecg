FROM node:12.16.1-alpine as build

### STAGE 1: Build ###
RUN mkdir /front-app
WORKDIR /front-app
ENV PATH /front-app/node_modules/.bin:$PATH
COPY package.json /front-app/package.json
RUN npm install --silent
RUN npm install react-scripts -g --silent
COPY . /front-app
RUN npm run build

### STAGE 2: Production Environment ###
FROM nginx:1.13.12-alpine
COPY --from=build /front-app/build /usr/share/nginx/html
EXPOSE 4200
CMD ["nginx", "-g", "daemon off;"]
