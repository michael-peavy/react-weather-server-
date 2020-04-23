const supertest = require("supertest");
const app = require("../src/app");
const knex = require("knex");
const { TEST_DATABASE_URL } = require("../src/config");
var {assert} = require("chai")


describe("cities endpoint", function() {
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

    //happy scenario
    it("should return array of cities", () => {
      return supertest(app)
        .get("/api/cities")
        .set("Accept", "application/json")
        .expect(200)
        .then(response => {
          let data = response.body 
          delete data[0].created_date //removing time stamp field from result object
          assert(data, testCities); //comparing input with the result from api
        });
    });

  });

  describe("POST /api/cities", () => {
    const testCities = [
      {
        id: 1,
        name: "milwaukee"
      }
    ];

    //happy scenario - create city
    it("should return error on duplicate", () => {
      return supertest(app)
        .post('/api/cities')
        .send({name: 'milwaukee'})
        .set("Accept", "application/json")
        .expect(400)
    });

    beforeEach("insert city", () => {
      return db.into("cities").insert(testCities);
    });

    //unhappy scenario - duplicate entry
    it("should return error on duplicate", () => {
      return supertest(app)
        .post('/api/cities')
        .send({name: 'milwaukee'})
        .set("Accept", "application/json")
        .expect(400)
    });

    //unhappy scenario - missing name
    it("should return error on missing city name", () => {
      return supertest(app)
        .post('/api/cities')
        .send({})
        .set("Accept", "application/json")
        .expect(400)
    });

  });


  describe("DELETE /api/cities", () => {
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
    it("should return 200 OK", () => {
      return supertest(app)
        .delete("/api/cities/1")
        .set("Accept", "application/json")
        .expect(200)
    });

     //unhappy scenario
     it("should return error on missing id param", () => {
      return supertest(app)
        .delete("/api/cities/")
        .set("Accept", "application/json")
        .expect(404)
    });

  });


});
