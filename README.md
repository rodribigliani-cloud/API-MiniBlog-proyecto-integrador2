# MiniBlog API

API REST para administrar autores y publicaciones de un blog. Está construida con Node.js, Express y PostgreSQL.

## Tecnologías

- Node.js
- Express 5
- PostgreSQL
- `pg` para la conexión con PostgreSQL
- Vitest y Supertest para las pruebas

## Requisitos

- Node.js 18 o superior
- PostgreSQL 14 o superior
- npm

## Instalación local

Clona el repositorio e instala las dependencias:

```bash
git clone <URL_DEL_REPOSITORIO>
cd MiniBlog
npm install
```

Crea una base de datos PostgreSQL llamada `miniblog_db`, un usuario con permisos y las tablas definidas en `sql/schema.sql`. Después, si quieres cargar datos de ejemplo, ejecuta `sql/seed.sql`.

También puedes usar una base de datos PostgreSQL existente configurando las variables de entorno antes de iniciar la API.

## Variables de entorno

La aplicación acepta una URL completa de conexión:

```env
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/miniblog_db
PORT=3000
NODE_ENV=development
```

Si no defines `DATABASE_URL`, se utilizan estas variables individuales:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=miniblog_db
DB_USER=miniblog_user
DB_PASSWORD=admin
PORT=3000
NODE_ENV=development
```

En producción, no subas un archivo `.env` con contraseñas al repositorio.

## Ejecutar la API

Modo producción/local:

```bash
npm start
```

La API estará disponible en:

```text
http://localhost:3000
```

Comprobar el estado del servidor:

```text
GET http://localhost:3000/health
```

Respuesta esperada:

```json
{
  "status": "ok",
  "timestamp": "2026-09-22T12:00:00.000Z",
  "uptime": 10.5
}
```

## Pruebas

Ejecutar todas las pruebas una sola vez:

```bash
npm test -- --run
```

Las pruebas utilizan la base de datos configurada en las variables de entorno, por lo que deben existir las tablas antes de ejecutarlas.

## Endpoints

### Health check

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/health` | Comprueba que la API esté funcionando |

### Autores

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/authors` | Lista todos los autores |
| GET | `/authors/:id` | Obtiene un autor por ID |
| POST | `/authors` | Crea un autor |
| PUT | `/authors/:id` | Actualiza un autor |
| DELETE | `/authors/:id` | Elimina un autor |

Crear un autor:

```http
POST /authors
Content-Type: application/json
```

```json
{
  "name": "Ana García",
  "email": "ana@example.com",
  "bio": "Desarrolladora full-stack"
}
```

### Publicaciones

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/posts` | Lista todas las publicaciones |
| GET | `/posts/:id` | Obtiene una publicación por ID |
| GET | `/posts/author/:authorId` | Lista las publicaciones de un autor |
| POST | `/posts` | Crea una publicación |
| PUT | `/posts/:id` | Actualiza una publicación |
| DELETE | `/posts/:id` | Elimina una publicación |

Crear una publicación:

```http
POST /posts
Content-Type: application/json
```

```json
{
  "title": "Introducción a Node.js",
  "content": "Contenido de la publicación",
  "author_id": 1,
  "published": true
}
```

## Ejemplos con curl

```bash
curl http://localhost:3000/health
```

```bash
curl http://localhost:3000/authors
```

```bash
curl http://localhost:3000/posts
```

```bash
curl -X POST http://localhost:3000/authors \
  -H "Content-Type: application/json" \
  -d '{"name":"Ana García","email":"ana@example.com","bio":"Desarrolladora"}'
```

## Despliegue en Railway

1. Sube el proyecto a GitHub.
2. En Railway, crea un proyecto y selecciona **Deploy from GitHub Repo**.
3. Añade un servicio **PostgreSQL** al proyecto.
4. En el servicio de la API, configura la variable:

```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
```

Cambia `Postgres` por el nombre real del servicio de base de datos si es diferente.

5. Railway ejecutará automáticamente:

```bash
npm install
npm start
```

6. En la base de datos de Railway, ejecuta las sentencias de creación de las tablas de `sql/schema.sql`. No ejecutes `CREATE DATABASE` ni `CREATE USER`, porque Railway ya proporciona la base de datos y el usuario.
7. Ejecuta `sql/seed.sql` si quieres cargar los datos de ejemplo.
8. En **Settings > Networking**, pulsa **Generate Domain**.
9. Comprueba el despliegue visitando:

```text
https://TU-DOMINIO.up.railway.app/health
```

La respuesta debe contener `"status": "ok"`.

## Estructura del proyecto

```text
MiniBlog/
├── controllers/       # Lógica de autores y publicaciones
├── docs/              # Documentación OpenAPI
├── middlewares/       # Validación y manejo de errores
├── routes/            # Rutas HTTP
├── sql/               # Esquema y datos iniciales de PostgreSQL
├── src/               # Entrada de la aplicación y conexión a la base de datos
├── tests/              # Pruebas de la API
├── package.json
└── vitest.config.js
```

## Licencia

ISC
