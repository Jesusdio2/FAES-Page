FROM nginx:alpine

# Instalar dependencias
RUN apk add --no-cache curl bash

# Copiar configs
COPY nginx.conf /etc/nginx/nginx.conf
COPY decaymap.yaml /etc/anubis/decaymap.yaml

# Copiar binario de Anubis (ejemplo)
COPY anubis /usr/local/bin/anubis

# Script de arranque que lanza ambos
COPY entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
