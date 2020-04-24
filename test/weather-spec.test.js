const supertest = require("supertest");
const app = require("../src/app");
const knex = require("knex");
const { TEST_DATABASE_URL } = require("../src/config");
var {assert} = require("chai")

describe("weather endpoint", function() {
    let db;
    before("make knex instance", () => {
      db = knex({
        client: "pg",
        connection: TEST_DATABASE_URL
      });
      app.set("db", db);
    });
    before("clean the table", () => db("cities").truncate());
    afterEach("cleanup", () => db("cities").truncate());
    after("disconnect from db", () => db.destroy());

    describe("GET /api/weather/:city", () => {
        const testCities = [
          {
            id: 1,
            name: "milwaukee"
          }
        ];
    
        beforeEach("insert city", () => {
          return db.into("cities").insert(testCities);
        });
    
        //happy scenario
        it("should return weather data object of that city", () => {
          return supertest(app)
            .get("/api/weather/milwaukee")
            .set("Accept", "application/json")
            .expect(200)
            .then(response => {
              let data = response.body
              assert(data.name, 'Milwaukee')
            });
        });

        //unhappy scenario -missing query params
        it("should return weather data object of that city", () => {
            return supertest(app)
              .get("/api/weather")
              .set("Accept", "application/json")
              .expect(404)
        });
    
    });

})