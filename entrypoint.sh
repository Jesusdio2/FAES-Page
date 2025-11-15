#!/bin/sh

/usr/local/bin/anubis --config /etc/anubis/decaymap.yaml &

nginx -g "daemon off;"
