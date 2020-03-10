FROM node:9.6.1 as builder
RUN mkdir /front-app
WORKDIR /front-app
ENV PATH /front-app/node_modules/.bin:$PATH
COPY package.json /front-app/package.json
RUN npm install --silent
RUN npm install react-scripts@1.1.1 -g --silent
COPY . /front-app
RUN npm run build

# production environment
FROM nginx:1.13.9-alpine
COPY --from=builder /front-app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
