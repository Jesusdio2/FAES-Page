#!/bin/sh

/usr/local/bin/anubis --config /etc/anubis/decaymap.yaml --port 9090 &

sleep 3

nginx -g "daemon off;"
