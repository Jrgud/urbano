#!/bin/bash

#optener cambios
git pull

#instalar nuevas dependencias
npm install
#borrar carpeta dist 
sudo rm -r dist

# Compilar el proyecto
npm run build

# Copiar el proyecto compilado a la ruta de producción
yes | cp -rf dist/* /sistemas/geo_front


# Recargar NGINX
sudo service nginx reload