## 🖥️📱💳📺 Redesflix
Es una plataforma web basada en microservicios orientada a la visualización de contenido audiovisual segmentado por tipo de membresía. Este proyecto presenta el desarrollo y despliegue


## 🐳 Tecnologías Utilizadas

Este proyecto se construyó con una variedad de herramientas y tecnologías modernas que permiten un desarrollo modular, escalable y fácil de desplegar:

| 🐳 Tecnología       | 🔎 Descripción |
|--------------------|----------------|
| 🟢 **Node.js**      | Backend para los microservicios: `usuarios`, `catálogo`, `historial`, `suscripciones`. |
| 🐬 **MySQL**        | Base de datos relacional para cada microservicio (4 bases independientes). |
| 🐳 **Docker**       | Contenedores para cada microservicio, frontend y base de datos. |
| 📦 **Dockerfile**   | Scripts para construir imágenes personalizadas de frontend y MySQL preconfigurada. |
| 📡 **Docker Swarm** | Orquestación de contenedores en múltiples nodos. |
| 🌐 **HTML + Bootstrap** | Frontend estático para interacción de usuario con los microservicios. |
| 🛠️ **Apache2**      | Servidor web usado en entornos de desarrollo. |
| 🐈‍⬛ **Git & GitHub** | Control de versiones y repositorio remoto del proyecto. |
| 📦 **Vagrant**      | Automatización del entorno de desarrollo con máquinas virtuales (cliente y servidor Ubuntu). |
| ⚡ **Apache Spark** (opcional) | Análisis distribuido de datos para consultas complejas y estadísticas. |

> Todas estas tecnologías fueron integradas para desarrollar **Redesflix**, un sistema completo de streaming con arquitectura de microservicios.



## Requisitos previos

- Tener Docker instalado en la máquina Ubuntu.
- Docker Swarm inicializado o nodo unido a un swarm.
- Acceso a internet para descargar imágenes desde Docker Hub.


## Pasos para instalar y ejecutar

### 1. Clonar el repositorio

En la terminal de tu servidor Ubuntu, ejecuta:

```bash
git clone https://github.com/EstebanCG2006/Redesflix.git
cd Redesflix
```
## 🐳 Inicializar Docker Swarm y desplegar el stack

```bash
docker swarm init
# Agrega el  worker con el token que se genera en la otra máquina 
docker stack deploy -c docker-stack.yml redesflix
```
## 3. Preparar bases de datos
Para que los microservicios funcionen, es necesario importar las bases de datos MySQL.

3.1 Crear carpeta compartida para las bases de datos
En el nodo worker (o en tu entorno compartido):

```bash
mkdir Database
cp Database/* /vagrant/Database/
```
```bash
docker cp /vagrant/Databases/movies_db.sql <contenedor_mysql>:/tmp/movies_db.sql
docker cp /vagrant/Databases/u_movies.sql <contenedor_mysql>:/tmp/u_movies.sql
docker cp /vagrant/Databases/suscripciones_db.sql <contenedor_mysql>:/tmp/suscripciones_db.sql
docker cp /vagrant/Databases/historial_db2.sql <contenedor_mysql>:/tmp/historial_db2.sql
```
## Importar las bases de datos dentro del contenedor

```bash
docker exec -it <contenedor_mysql> bash
```
```bash
mysql -uroot -pGomez92150@ -e "CREATE DATABASE IF NOT EXISTS movies_db"
mysql -uroot -pGomez92150@ movies_db < /tmp/movies_db.sql
```
```bash
mysql -uroot -pGomez92150@ -e "CREATE DATABASE IF NOT EXISTS u_movies"
mysql -uroot -pGomez92150@ u_movies < /tmp/u_movies.sql
```
```bash
mysql -uroot -pGomez92150@ -e "CREATE DATABASE IF NOT EXISTS suscripciones_db"
mysql -uroot -pGomez92150@ suscripciones_db < /tmp/suscripciones_db.sql
```
```bash
mysql -uroot -pGomez92150@ -e "CREATE DATABASE IF NOT EXISTS historial_db2"
mysql -uroot -pGomez92150@ historial_db2 < /tmp/historial_db2.sql
exit
```
## 🌐 Acceder a la plataforma
```bash
http://192.168.100.3:8088/
```
Importante al momento de colocar la tarjeta solo acepta 10 digitos y que termine en 90
--------------
## ⚡Redesflix - Aplicación de Análisis con PySpark (Dockerizado)

---

 Requisitos

- Archivo `redesflix_spark_app.zip` ya descargado

---

Pasos para poner en marcha la aplicación

 1. Mover el archivo ZIP a la máquina virtual

Puedes usar `scp` o copiarlo por medio de carpetas compartidas:

```bash
scp redesflix_spark_app.zip usuario@192.168.X.X:/home/usuario/
```

O simplemente pegarlo si tienes la VM montada con carpetas sincronizadas.

---

### 2. Descomprimir el archivo

```bash
unzip redesflix_spark_app.zip
cd redesflix_spark_app
```

Esto creará la estructura:

```
.
├── analisis_spark.py
├── Dockerfile
├── dataset/
│   └── movies_analytics.csv
└── README.md
```

---

 3. Construir la imagen de Docker

```bash
docker build -t redesflix-analisis .
```

Esto crea una imagen llamada `redesflix-analisis` con Spark y tu script PySpark.

---

 4. Ejecutar la aplicación

```bash
docker run --rm redesflix-analisis
```

Esto ejecutará el análisis sobre el dataset. Los resultados se generan en `resultados/peliculas/` dentro del contenedor.

---

 5. Ver los resultados

Para obtener los archivos generados fuera del contenedor, ejecuta el contenedor con volumen montado:

```bash
docker run --rm -v "$PWD/resultados:/app/resultados" redesflix-analisis
```

Luego revisa la carpeta `resultados/` que se habrá creado en tu VM.

---

 Análisis realizados

- Top 5 películas más vistas
- Top 5 películas menos vistas
- Top 5 películas más vistas por membresía:
  - Básico
  - Estándar
  - Premium

---

¡Y listo! Ya puedes usar esta base para escalar, generar dashboards o integrarlo a pruebas con JMeter.



