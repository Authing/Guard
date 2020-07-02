FROM node:12.14.0 as BASE_IMAGE
WORKDIR /app
COPY package.json .
RUN yarn --registry https://registry.npm.taobao.org/
COPY . .
RUN yarn build

FROM nginx:alpine
COPY --from=BASE_IMAGE /app/dist /dist
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80 
