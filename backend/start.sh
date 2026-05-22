#!/bin/sh

# Set Apache port dynamically from Render's $PORT env variable (default to 80 if not set)
PORT=${PORT:-80}
sed -i "s/Listen 80/Listen ${PORT}/g" /etc/apache2/ports.conf
sed -i "s/<VirtualHost \*:80>/<VirtualHost \*:${PORT}>/g" /etc/apache2/sites-available/*.conf

# Ensure Artisan runs from the Laravel app directory when the image is built from the repo root
cd /var/www/html/backend

# Run migrations automatically for production databases
php artisan migrate --force

# Cache configuration, routes, and views for lightning fast performance
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Start Apache in the foreground
exec apache2-foreground
