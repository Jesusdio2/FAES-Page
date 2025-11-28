FROM nginx:alpine

# Copiar configuración personalizada
COPY nginx.conf /etc/nginx/nginx.conf

# Copiar archivos estáticos (tu web)
COPY ./public /usr/share/nginx/html

# Opcional: copiar otros configs
COPY decaymap.yaml /etc/anubis/decaymap.yaml
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
