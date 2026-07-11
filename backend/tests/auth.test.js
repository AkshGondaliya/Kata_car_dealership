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