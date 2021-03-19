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
    {
      name: 'POST /api/motif',
      path: '/api/motif',
      method: supertest(app).post,
    },
    {
      name: 'GET /api/motif/:id',
      path: '/api/motif/1',
      method: supertest(app).get,
    },
    {
      name: 'PATCH /api/motif/:id',
      path: '/api/motif/1',
      method: supertest(app).patch,
    },
    {
      name: 'DELETE /api/motif/:id',
      path: '/api/motif/1',
      method: supertest(app).delete,
    },
    {
      name: 'GET /api/phrase',
      path: '/api/phrase',
      method: supertest(app).get,
    },
    {
      name: 'POST /api/phrase',
      path: '/api/phrase',
      method: supertest(app).post,
    },
    {
      name: 'GET /api/phrase/:id',
      path: '/api/phrase/1',
      method: supertest(app).get,
    },
    {
      name: 'PATCH /api/phrase/:id',
      path: '/api/phrase/1',
      method: supertest(app).patch,
    },
    {
      name: 'DELETE /api/phrase/:id',
      path: '/api/phrase/1',
      method: supertest(app).delete,
    },
    {
      name: 'GET /api/form',
      path: '/api/form',
      method: supertest(app).get,
    },
    {
      name: 'POST /api/form',
      path: '/api/form',
      method: supertest(app).post,
    },
    {
      name: 'GET /api/form/:id',
      path: '/api/form/1',
      method: supertest(app).get,
    },
    {
      name: 'PATCH /api/form/:id',
      path: '/api/form/1',
      method: supertest(app).patch,
    },
    {
      name: 'DELETE /api/form/:id',
      path: '/api/form/1',
      method: supertest(app).delete,
    },
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
