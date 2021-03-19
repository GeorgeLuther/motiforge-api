const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Form Endpoints', function () {
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

    /**
   * @description Endpoints for forms owned by a user
   **/
    describe(`Form endpoints protected by user`, () => {

        describe('GET /api/form', () => {
            beforeEach('insert users, motifs, phrases, and forms', () => {
                return helpers.seedUsersMotifsPhrasesForms(
                  db,
                  testUsers,
                  testMotifs,
                  testPhrases,
                  testForms,
                )
              })
            context('Given user has no forms',()=>{
                it('responds with 200 and empty array',()=>{
                    return supertest(app)
                        .get('/api/form')
                        //user id of 2 exists but without any owned data
                        .set('Authorization', helpers.makeAuthHeader(testUsers[1]))
                        .expect(200, [])
                })
            })
    
            context('Given user has forms',()=>{
                it('responds with 200 and array of user forms',()=>{
                    return supertest(app)
                        .get('/api/form')
                        //user 1 exists and owns data
                        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                        .expect(200, testForms)
                })
            })
        })

        describe('POST /api/form', () => {   
            beforeEach('insert users, motifs, phrases, and forms', () => {
                return helpers.seedUsersMotifsPhrasesForms(
                  db,
                  testUsers,
                  testMotifs,
                  testPhrases,
                  testForms,
                )
              })
              
                it('responds with 201 and a template form',()=>{
                    return supertest(app)
                            .post('/api/form')        
                            .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                            .expect(201)
                })
        
        })
        describe('GET /api/form/:id',()=>{
            beforeEach('insert users, motifs, phrases, and forms', () => {
                return helpers.seedUsersMotifsPhrasesForms(
                  db,
                  testUsers,
                  testMotifs,
                  testPhrases,
                  testForms,
                )
              })
            context(`Given form not in database`, () => {
                it(`responds with 404`, () => {
                  const formId = 1000
                  return supertest(app)
                    .get(`/api/form/${formId}`)
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(404, { error: { message: `Form does not exist` } })
                })
              })
            context('Given form table is seeded',()=>{
                it('responds with 204 and removes the form', ()=>{
                    const idToGet = 1
                    const expectedForm = testForms[0]
                    return supertest(app)
                            .get(`/api/form/${idToGet}`)
                            .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                            .expect(200, expectedForm)
                })
            })
        })

        describe('DELETE /api/form/:id',()=>{
            beforeEach('insert users, motifs, phrases, and forms', () => {
                return helpers.seedUsersMotifsPhrasesForms(
                  db,
                  testUsers,
                  testMotifs,
                  testPhrases,
                  testForms,
                )
              })
            context(`Given form not in database`, () => {
                it(`responds with 404`, () => {
                  const formId = 1000
                  return supertest(app)
                    .delete(`/api/form/${formId}`)
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(404, { error: { message: `Form does not exist` } })
                })
              })
            context('Given form table is seeded',()=>{
                it('responds with 204 and removes the form', ()=>{
                    const idToRemove = 1
                    const expectedForms = testForms.filter(form => form.id !== idToRemove)
                    return supertest(app)
                            .delete(`/api/form/${idToRemove}`)
                            .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                            .expect(204)
                            .then(res => 
                                supertest(app)
                                    .get('/api/form')
                                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                                    .expect(expectedForms)
                            )
                })
            })
        })
        describe('PATCH /api/form/:id',()=>{
            
            beforeEach('insert users, motifs, phrases, and forms', () => {
                return helpers.seedUsersMotifsPhrasesForms(
                  db,
                  testUsers,
                  testMotifs,
                  testPhrases,
                  testForms,
                )
              })
            context(`Given no forms in database`, () => {
                it(`responds with 404`, () => {
                    const formId = 1000
                    return supertest(app)
                        .delete(`/api/form/${formId}`)
                        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                        .expect(404, { error: { message: `Form does not exist` } })
                    })
            })
            it('responds with 204 and updates form', ()=>{
                const formToUpdate = 1
                const updatedBody = {
                    name: 'goof',
                    phrases: [1,2,3,1],
                    transpositions: [0,1,0,1]
                }
                return supertest(app)
                        .patch(`/api/form/${formToUpdate}`)
                        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                        .send(updatedBody)
                        .expect(204)
                        .then(res => 
                            supertest(app)
                                .get(`/api/form/${formToUpdate}`)
                                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                                .expect(res => {
                                    expect(res.body).to.have.property('id', 1)
                                    expect(res.body).to.have.property('name', updatedBody.name)
                                    expect(res.body.phrases).to.eql(updatedBody.phrases)
                                    expect(res.body.transpositions).to.eql(updatedBody.transpositions)
                                })
                        )
            })
        })
    })
})