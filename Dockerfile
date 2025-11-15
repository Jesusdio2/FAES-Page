FROM nginx:alpine

# Instalar dependencias necesarias
RUN apk add --no-cache bash curl tar

# Copiar configuraciones
COPY nginx.conf /etc/nginx/nginx.conf
COPY decaymap.yaml /etc/anubis/decaymap.yaml
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Descargar y extraer binario de Anubis
# ⚠️ Sustituye la URL si cambia la versión o ubicación
RUN curl -L https://github.com/TecharoHQ/anubis/releases/download/v1.23.1/anubis-1.23.1-linux-amd64.tar.gz \
    -o /tmp/anubis.tar.gz && \
    tar -xzf /tmp/anubis.tar.gz -C /tmp && \
    mv /tmp/anubis /usr/local/bin/anubis && \
    chmod +x /usr/local/bin/anubis && \
    rm /tmp/anubis.tar.gz

ENTRYPOINT ["/entrypoint.sh"]
