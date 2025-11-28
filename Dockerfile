FROM nginx:alpine

# Copiar configuración personalizada
COPY nginx.conf /etc/nginx/nginx.conf

# Copiar archivos estáticos si quieres servirlos desde Render
COPY ./dist /usr/share/nginx/html
