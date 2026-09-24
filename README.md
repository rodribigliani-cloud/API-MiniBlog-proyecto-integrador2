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
Endpoints.
  
  https://api-miniblog-proyecto-integrador2-production.up.railway.app/health
  La respuesta debe contener `"status": "ok"`.
  
  https://api-miniblog-proyecto-integrador2-production.up.railway.app/authors
La respuesta debe contener "authores".
  
  https://api-miniblog-proyecto-integrador2-production.up.railway.app/posts
La respuesta debe contener "posts"


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
--------------------------------------------------------------
        ---- AI---------
estas son algunas preguntas que le fui dando, me maneje mas con consulta de errores..

 pregunta numero 1 a la AI

1 Como hacer un supertest.explicamelo de manera simple y bien.dame unos ejemplos cortos
 
*Respuesta
¿Qué es Supertest?
Supertest sirve para probar automáticamente las rutas de tu API.
Por ejemplo, en lugar de entrar manualmente a Thunder Client y hacer:
GET /authors

Supertest puede hacerlo automáticamente mediante código.

mportar Supertest y tu API
import request from "supertest";
import app from "../src/index.js";

Aquí:
- request → permite hacer peticiones HTTP.
- app → es tu aplicación Express.
4. Probar un GET
Supongamos que tienes:
app.get("/authors", (req, res) => {
    res.json([
        { id: 1, name: "Gabriel García Márquez" }
    ]);
});

El test sería:
import request from "supertest";
import app from "../src/index.js";

it("debe obtener los autores", async () => {

    const res = await request(app)
        .get("/authors");

    expect(res.status).toBe(200);
});


¿Qué hace?
request(app)

Usa tu API.
.get("/authors")

Hace un GET.
expect(res.status).toBe(200)

Comprueba que la respuesta sea 200.
5. Probar un POST
Por ejemplo:
it("debe crear un autor", async () => {

    const res = await request(app)
        .post("/authors")
        .send({
            name: "Usuario Test",
            email: "test@example.com"
        });

    expect(res.status).toBe(201);
});

La parte:
.send({
    name: "Usuario Test",
    email: "test@example.com"
})

envía los datos a tu API.
6. Probar un GET por ID
it("debe obtener un autor", async () => {

    const res = await request(app)
        .get("/authors/1");

    expect(res.status).toBe(200);
});

7. Comprobar el contenido
También puedes comprobar los datos:
expect(res.body.name).toBe("Usuario Test");

Por ejemplo:
const res = await request(app)
    .get("/authors/1");

expect(res.status).toBe(200);
expect(res.body.id).toBe(1);

8. Ejecutar los tests
Si tienes Vitest instalado:
npx vitest run

O puedes agregar en package.json:
"scripts": {
    "test": "vitest"
}

Y ejecutar:
npm test

La idea más importante
Piensa en Supertest así:
Supertest
   ↓
Hace petición
   ↓
Tu API Express
   ↓
Recibe respuesta
   ↓
Supertest comprueba resultado

Ejemplo súper corto
const res = await request(app)
    .get("/authors");

expect(res.status).toBe(200);

Significa:
"Haz GET a /authors y comprueba que responda 200."

Y para POST:
const res = await request(app)
    .post("/authors")
    .send({
        name: "Juan",
        email: "juan@example.com"
    });

expect(res.status).toBe(201);

"Crea un autor y comprueba que se haya creado correctamente."

Pregunta 2
que quiere decir esto? explicamelo en un solo punto posts: id, author_id (FK -> users.id), title, content, published created_at 

*Respuesta
 Significa que estás definiendo una tabla posts (publicaciones) con estos campos:
posts: id, author_id (FK → users.id), title, content, published, created_at
👉 En un solo punto: cada publicación tiene un id para identificarla, un author_id que indica qué usuario la creó (relacionado con users.id), un title como título, content para el contenido, published para saber si está publicada o no, y created_at para guardar la fecha de creación.

