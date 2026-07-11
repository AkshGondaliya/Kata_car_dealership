const request = require("supertest");
const app = require("../app");

describe("POST /api/auth/register", () => {

  test("should register a new user", async () => {

    const response = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Aksh",
        email: "aksh@gmail.com",
        password: "Password123"
      });

    expect(response.statusCode).toBe(201);

    expect(response.body.success).toBe(true);

  });

});

describe("POST /api/auth/login", () => {

    test("should login successfully with valid credentials", async () => {

        // First create user

        await request(app)
            .post("/api/auth/register")
            .send({
                name: "Aksh",
                email: "aksh@gmail.com",
                password: "Password123"
            });

        // Now login

        const response = await request(app)
            .post("/api/auth/login")
            .send({
                email: "aksh@gmail.com",
                password: "Password123"
            });

        expect(response.statusCode).toBe(200);

        expect(response.body.success).toBe(true);

        expect(response.body.message).toBe("Login successful");

        expect(response.body.token).toBeDefined();

        expect(response.body.user.email).toBe("aksh@gmail.com");

    });

});