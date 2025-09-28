// ✅ set env variables first
process.env.MONGO_URI = "mongodb://localhost:27017/testdb";
process.env.STRIPE_SECRET_KEY = "sk_test_fake";

// now require app
const request = require("supertest");
const app = require("./backend/index");

describe("Products API", () => {
  it("should return a list of products", async () => {
    const res = await request(app).get("/products");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    expect(res.body[0]).toHaveProperty("id");
    expect(res.body[0]).toHaveProperty("name");
    expect(res.body[0]).toHaveProperty("price");
    expect(res.body[0]).toHaveProperty("imageUrl");
  });
});
