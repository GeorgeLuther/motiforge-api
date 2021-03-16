const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Protected Endpoints', function () {
  let db

  const testUsers = helpers.makeUsersArray()
  const [testUser] = testUsers
  const [testMotifs, testPhrases, testForms] = helpers.makeMotifsPhrasesForms(testUser)

  before('make knex instance', () => {
    db = helpers.makeKnexInstance()
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('cleanup', () => helpers.cleanTables(db))

  afterEach('cleanup', () => helpers.cleanTables(db))

  beforeEach('insert users, motifs, phrases, and forms', () => {
    return helpers.seedUsersMotifsPhrasesForms(
      db,
      testUsers,
      testMotifs,
      testPhrases,
      testForms
    )
  })

  const protectedEndpoints = [
    {
      name: 'GET /api/motif',
      path: '/api/motif',
      method: supertest(app).get,
    },
    // {
    //   name: 'GET /api/phrases',
    //   path: '/api/phrases',
    //   method: supertest(app).get,
    // },
    {
      name: 'POST /api/motif',
      path: '/api/motif',
      method: supertest(app).post,
    },
    // {
    //   name: 'PATCH /api/motif/:id',
    //   path: '/api/motif/1',
    //   method: supertest(app).post,
    // },
    {
      name: 'PUT /api/auth/token',
      path: '/api/auth/token',
      method: supertest(app).put,
    },
  ]

  protectedEndpoints.forEach(endpoint => {
    describe(endpoint.name, () => {
      it(`responds 401 'Missing bearer token' when no bearer token`, () => {
        return endpoint.method(endpoint.path)
          .expect(401, { error: `Missing bearer token` })
      })

      it(`responds 401 'Unauthorized request' when invalid JWT secret`, () => {
        const validUser = testUsers[0]
        const invalidSecret = 'bad-secret'
        return endpoint.method(endpoint.path)
          .set('Authorization', helpers.makeAuthHeader(validUser, invalidSecret))
          .expect(401, { error: `Unauthorized request, web token err` })
      })

      it(`responds 401 'Unauthorized request' when invalid sub in payload`, () => {
        const invalidUser = { username: 'user-not-existy', id: 1 }
        return endpoint.method(endpoint.path)
          .set('Authorization', helpers.makeAuthHeader(invalidUser))
          .expect(401, { error: `Unauthorized request, no user` })
      })
    })
  })
})
