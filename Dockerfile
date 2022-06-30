#BUILD PHASE
FROM node:14.17.0-alpine3.13 as build-phase
RUN apk add --update bash git
WORKDIR /usr/src/app
COPY . .
RUN yarn && yarn build

#RUN PHASE
FROM nginx:1.22
WORKDIR /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY --from=build-phase /usr/src/app/build .
COPY nginx/nginx.conf /etc/nginx/conf.d
EXPOSE 80
CMD ["nginx","-g","daemon off;"]


