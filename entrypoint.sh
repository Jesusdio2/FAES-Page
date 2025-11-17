#!/bin/sh

echo "01"
ls -l /etc/anubis/decaymap.yaml   # Verificación de que el archivo existe

/usr/local/bin/anubis -bind :3923 -policy-fname /etc/anubis/decaymap.yaml -use-remote-address &

echo "Nginx"
# Arrancar Nginx en primer plano
exec nginx -g "daemon off;"
