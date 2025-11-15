FROM nginx:alpine

# Instalar dependencias necesarias
RUN apk add --no-cache bash curl tar

# Copiar configuraciones
COPY nginx.conf /etc/nginx/nginx.conf
COPY decaymap.yaml /etc/anubis/decaymap.yaml
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Descargar y extraer binario de Anubis desde carpeta bin/
RUN curl -L https://github.com/TecharoHQ/anubis/releases/download/v1.23.1/anubis-1.23.1-linux-amd64.tar.gz \
    -o /tmp/anubis.tar.gz && \
    tar -xzf /tmp/anubis.tar.gz -C /tmp && \
    mv /tmp/anubis-1.23.1-linux-amd64/bin/anubis /usr/local/bin/anubis && \
    chmod +x /usr/local/bin/anubis && \
    rm -rf /tmp/anubis.tar.gz /tmp/anubis-1.23.1-linux-amd64

ENTRYPOINT ["/entrypoint.sh"]
