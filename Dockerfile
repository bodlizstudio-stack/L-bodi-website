FROM php:8.2-apache

WORKDIR /var/www/html

# Omogoci Apache module, ki ga pogosto rabimo pri static/PHP straneh.
RUN a2enmod rewrite

COPY . /var/www/html/

EXPOSE 80
