FROM php:8.3 as php

RUN apt-get update -y
RUN apt-get install -y unzip libpq-dev libcurl4-gnutls-dev
RUN docker-php-ext-install pdo_mysql bcmath

RUN pecl install -o -f redis \
    && rm -rf /tmp/pear \
    && docker-php-ext-enable redis

WORKDIR /var/www
COPY . .
COPY --from=composer:2.8.12 /usr/bin/composer /usr/bin/composer

RUN chmod +x entrypoint.sh

ENV PORT=8000
ENTRYPOINT [ "/entrypoint.sh" ]
