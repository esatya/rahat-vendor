# production environment
FROM nginx:1.23.1-alpine
RUN rm -rf /etc/nginx/conf.d
COPY conf.d /etc/nginx/conf.d
COPY build /usr/share/nginx/html 
EXPOSE 80
CMD ["nginx","-g","daemon off;"]
