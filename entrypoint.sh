#!/bin/sh

/usr/local/bin/anubis -bind :3923 -policy-fname /etc/anubis/decaymap.yaml &

exec nginx -g "daemon off;"
