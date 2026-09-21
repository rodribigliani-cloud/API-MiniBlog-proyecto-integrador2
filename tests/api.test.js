//Importar las herramientas necesarias para las pruebas

import request from "supertest"; //Permite hacer peticiones HTTP a tu API sin abrir Thunder Client ni Postman.
import app from "../src/index.js"; //es parecido a hacer:GET http://localhost:3000/authors Importamos nuestra aplicación Express.

//describe() sirve para agrupar varios tests relacionados.
describe("MiniBlog API", () => {
  let authorId; //Aquí creamos una variable vacía.Porque primero vamos a crear un author y necesitamos guardar su id.

  //Después utilizaremos ese ID para buscarlo y crear un post.
  const uniqueEmail = `user${Date.now()}@example.com`; //Esto genera un email diferente cada vez que ejecutas el test.
  //Primer test: crear un author
    it("crear author", async () => {
    const res = await request(app) //Estamos diciendo:Haz una petición POST a /authors.
    .post("/authors")
      //Aquí enviamos los datos del nuevo author.
    .send({
        name: "Usuario Test",
        email: uniqueEmail,
        bio: "Usuario para pruebas",
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.email).toBe(uniqueEmail);

    authorId = res.body.id;
    });

    it("obtener author", async () => {
    const res = await request(app).get(`/authors/${authorId}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id", authorId);
    expect(res.body.email).toBe(uniqueEmail);
    });

    it("crear post", async () => {
    const res = await request(app).post("/posts").send({
        title: "Post de prueba",
        content: "Contenido de prueba para validación",
        author_id: authorId,
        published: true,
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.title).toBe("Post de prueba");
    expect(res.body.author_id).toBe(authorId);
});

    it("eliminar recurso inexistente", async () => {
    const res = await request(app).delete("/authors/999999");

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("message");
    });
});
