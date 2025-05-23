## Redesflix


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


