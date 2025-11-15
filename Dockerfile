# Imagen base ligera de Nginx
FROM nginx:alpine

# Instalar dependencias necesarias
RUN apk add --no-cache bash curl

# Copiar configuraciones
COPY nginx.conf /etc/nginx/nginx.conf
COPY decaymap.yaml /etc/anubis/decaymap.yaml

# Copiar binario de Anubis (ajusta según dónde lo tengas en tu repo)
COPY anubis /usr/local/bin/anubis

# Copiar script de arranque
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Usar el script como punto de entrada
ENTRYPOINT ["/entrypoint.sh"]
