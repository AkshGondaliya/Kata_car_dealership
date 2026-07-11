const request = require("supertest");
const app = require("../app");

describe("POST /api/vehicles", () => {

  test("should create a new vehicle", async () => {

    const response = await request(app)
      .post("/api/vehicles")
      .send({
        make: "Toyota",
        model: "Fortuner",
        category: "SUV",
        price: 4500000,
        quantity: 10
      });

    expect(response.statusCode).toBe(201);

    expect(response.body.success).toBe(true);

    expect(response.body.vehicle.make).toBe("Toyota");

    expect(response.body.vehicle.model).toBe("Fortuner");

  });

});