#!/bin/sh

# Start PHP-FPM in background
php-fpm &

# Wait for PHP-FPM to start
sleep 2

# Run database migrations if needed
php bin/console doctrine:database:create --if-not-exists
php bin/console doctrine:migrations:migrate --no-interaction

# Start Nginx in foreground
nginx -g "daemon off;"