#!/bin/sh

echo "01"
ls -l /etc/anubis/decaymap.yaml

/usr/local/bin/anubis -bind :3923 -policy-fname /etc/anubis/decaymap.yaml -use-remote-address &

echo "Nginx"
# Validar configuración antes de arrancar
nginx -t -c /etc/nginx/nginx.conf || exit 1

# Arrancar Nginx en primer plano
exec nginx -g "daemon off;"
