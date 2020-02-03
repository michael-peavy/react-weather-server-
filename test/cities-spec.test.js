const supertest = require("supertest");
const app = require("../src/app");
const knex = require("knex");

describe("cities endpoint", function() {
  let db;
  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL
    });
    app.set("db", db);
  });
  after("disconnect from db", () => db.destroy());
  before("clean the table", () => db("cities").truncate());
  afterEach("cleanup", () => db("cities").truncate());

  describe("GET /api/cities", () => {
    const testCities = [
      {
        id: 1,
        name: "milwaukee"
      }
    ];

    beforeEach("insert city", () => {
      return db.into("cities").insert(testCities);
    });

    it("should return array of cities", () => {
      return supertest(app)
        .get("/api/cities")
        .set("Accept", "application/json")
        .expect(200, testCities);
    });
  });
});
