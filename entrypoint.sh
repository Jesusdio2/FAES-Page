#!/bin/sh

echo ">>> Inicio del entrypoint en $(date)"

echo ">>> Verificando decaymap.yaml..."
ls -l /etc/anubis/decaymap.yaml || echo "Archivo decaymap.yaml no encontrado"

echo ">>> Lanzando Anubis en background..."
/usr/local/bin/anubis -bind :3923 -policy-fname /etc/anubis/decaymap.yaml -use-remote-address &
ANUBIS_PID=$!
echo ">>> Anubis arrancado con PID $ANUBIS_PID"

echo ">>> Lanzando Express en background..."
node /app/server.js &
EXPRESS_PID=$!
echo ">>> Express arrancado con PID $EXPRESS_PID"

echo ">>> Validando configuración de Nginx..."
nginx -t -c /etc/nginx/nginx.conf || exit 1

echo ">>> Arrancando Nginx en foreground..."
exec nginx -g "daemon off;"
