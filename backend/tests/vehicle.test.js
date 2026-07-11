const request = require("supertest");
const app = require("../app");
const Vehicle = require("../models/Vehicle");
describe("POST /api/vehicles", () => {

    test("should create a new vehicle", async () => {

        await request(app)
            .post("/api/auth/register")
            .send({
                name: "Admin",
                email: "admin@gmail.com",
                password: "Password123",
                role: "ADMIN"
            });

        const login = await request(app)
            .post("/api/auth/login")
            .send({
                email: "admin@gmail.com",
                password: "Password123"
            });

        const token = login.body.token;

        const response = await request(app)
            .post("/api/vehicles")
            .set("Authorization", `Bearer ${token}`)
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

describe("PUT /api/vehicles/:id", () => {

    test("should update vehicle successfully", async () => {

        // Create vehicle directly in database
        const vehicle = await Vehicle.create({
            make: "Toyota",
            model: "Fortuner",
            category: "SUV",
            price: 4500000,
            quantity: 10
        });
        await request(app)
            .post("/api/auth/register")
            .send({
                name: "Admin",
                email: "admin@gmail.com",
                password: "Password123",
                role: "ADMIN"
            });
        // Login as admin first and get token
        const loginResponse = await request(app)
            .post("/api/auth/login")
            .send({
                email: "admin@gmail.com",
                password: "Password123"
            });

        const token = loginResponse.body.token;

        const response = await request(app)
            .put(`/api/vehicles/${vehicle._id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                make: "Toyota",
                model: "Fortuner Legender",
                category: "SUV",
                price: 5000000,
                quantity: 8
            });

        expect(response.statusCode).toBe(200);

        expect(response.body.success).toBe(true);

        expect(response.body.vehicle.model).toBe("Fortuner Legender");

        expect(response.body.vehicle.price).toBe(5000000);

        expect(response.body.vehicle.quantity).toBe(8);

    });

});

describe("DELETE /api/vehicles/:id", () => {

    test("should delete vehicle successfully", async () => {

        // Create a vehicle
        const vehicle = await Vehicle.create({
            make: "Toyota",
            model: "Fortuner",
            category: "SUV",
            price: 4500000,
            quantity: 10
        });

        await request(app)
            .post("/api/auth/register")
            .send({
                name: "Admin",
                email: "admin@gmail.com",
                password: "Password123",
                role: "ADMIN"
            });

        // Login as Admin
        const loginResponse = await request(app)
            .post("/api/auth/login")
            .send({
                email: "admin@gmail.com",
                password: "Password123"
            });

        const token = loginResponse.body.token;

        // Delete vehicle
        const response = await request(app)
            .delete(`/api/vehicles/${vehicle._id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);

        expect(response.body.success).toBe(true);

        expect(response.body.message).toBe("Vehicle deleted successfully");

        // Verify vehicle is removed from database
        const deletedVehicle = await Vehicle.findById(vehicle._id);

        expect(deletedVehicle).toBeNull();

    });

});

describe("GET /api/vehicles/search", () => {

    test("should return vehicles matching search criteria", async () => {

        // Create vehicles
        await Vehicle.create([
            {
                make: "Toyota",
                model: "Fortuner",
                category: "SUV",
                price: 4500000,
                quantity: 10
            },
            {
                make: "BMW",
                model: "X5",
                category: "SUV",
                price: 8500000,
                quantity: 5
            },
            {
                make: "Honda",
                model: "City",
                category: "Sedan",
                price: 1500000,
                quantity: 8
            }
        ]);

        // Login as authenticated user
        const loginResponse = await request(app)
            .post("/api/auth/login")
            .send({
                email: "aksh@gmail.com",
                password: "Password123"
            });

        const token = loginResponse.body.token;

        const response = await request(app)
            .get("/api/vehicles/search?make=Toyota")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);

        expect(response.body.success).toBe(true);

        expect(response.body.count).toBe(1);

        expect(response.body.vehicles[0].make).toBe("Toyota");

    });

});