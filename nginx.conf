events { }

http {
    include       mime.types;
    default_type  application/octet-stream;

    server {
        listen 80;
        server_name _;

        root /usr/share/nginx/html;
        index index.html;

        # Cabeceras CORS
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods GET,POST,OPTIONS;
        add_header Access-Control-Allow-Headers *;

        # Archivos estáticos
        location ~* \.(?:js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 30d;
            access_log off;
        }

        # Página principal y rutas SPA
        location / {
            try_files $uri $uri/ /index.html;
        }
    }
}
