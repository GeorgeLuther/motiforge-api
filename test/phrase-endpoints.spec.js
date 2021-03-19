const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Phrase Endpoints', function () {
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
   * @description Endpoints for phrases owned by a user
   **/
    describe(`Phrase endpoints protected by user`, () => {

        describe('GET /api/phrase', () => {
            beforeEach('insert users, motifs, phrases, and forms', () => {
                return helpers.seedUsersMotifsPhrasesForms(
                  db,
                  testUsers,
                  testMotifs,
                  testPhrases,
                  testForms,
                )
              })
            context('Given user has no phrases',()=>{
                it('responds with 200 and empty array',()=>{
                    return supertest(app)
                        .get('/api/phrase')
                        //user id of 2 exists but without any owned data
                        .set('Authorization', helpers.makeAuthHeader(testUsers[1]))
                        .expect(200, [])
                })
            })
    
            context('Given user has phrases',()=>{
                it('responds with 200 and array of user phrases',()=>{
                    return supertest(app)
                        .get('/api/phrase')
                        //user 1 exists and owns data
                        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                        .expect(200, testPhrases)
                })
            })
        })

        describe('POST /api/phrase', () => {   
            beforeEach('insert users, motifs, phrases, and forms', () => {
                return helpers.seedUsersMotifsPhrasesForms(
                  db,
                  testUsers,
                  testMotifs,
                  testPhrases,
                  testForms,
                )
              })
              
                it('responds with 201 and a template phrase',()=>{
                    return supertest(app)
                            .post('/api/phrase')        
                            .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                            .expect(201)
                })
        
        })
        describe('GET /api/phrase/:id',()=>{
            beforeEach('insert users, motifs, phrases, and forms', () => {
                return helpers.seedUsersMotifsPhrasesForms(
                  db,
                  testUsers,
                  testMotifs,
                  testPhrases,
                  testForms,
                )
              })
            context(`Given phrase not in database`, () => {
                it(`responds with 404`, () => {
                  const phraseId = 1000
                  return supertest(app)
                    .get(`/api/phrase/${phraseId}`)
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(404, { error: { message: `Phrase does not exist` } })
                })
              })
            context('Given phrase table is seeded',()=>{
                it('responds with 204 and removes the phrase', ()=>{
                    const idToGet = 1
                    const expectedPhrase = testPhrases[0]
                    return supertest(app)
                            .get(`/api/phrase/${idToGet}`)
                            .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                            .expect(200, expectedPhrase)
                })
            })
        })

        describe('DELETE /api/phrase/:id',()=>{
            beforeEach('insert users, motifs, phrases, and forms', () => {
                return helpers.seedUsersMotifsPhrasesForms(
                  db,
                  testUsers,
                  testMotifs,
                  testPhrases,
                  testForms,
                )
              })
            context(`Given phrase not in database`, () => {
                it(`responds with 404`, () => {
                  const phraseId = 1000
                  return supertest(app)
                    .delete(`/api/phrase/${phraseId}`)
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(404, { error: { message: `Phrase does not exist` } })
                })
              })
            context('Given phrase table is seeded',()=>{
                it('responds with 204 and removes the phrase', ()=>{
                    const idToRemove = 1
                    const expectedPhrases = testPhrases.filter(phrase => phrase.id !== idToRemove)
                    return supertest(app)
                            .delete(`/api/phrase/${idToRemove}`)
                            .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                            .expect(204)
                            .then(res => 
                                supertest(app)
                                    .get('/api/phrase')
                                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                                    .expect(expectedPhrases)
                            )
                })
            })
        })
        describe('PATCH /api/phrase/:id',()=>{
            
            beforeEach('insert users, motifs, phrases, and forms', () => {
                return helpers.seedUsersMotifsPhrasesForms(
                  db,
                  testUsers,
                  testMotifs,
                  testPhrases,
                  testForms,
                )
              })
            context(`Given no phrases in database`, () => {
                it(`responds with 404`, () => {
                    const phraseId = 1000
                    return supertest(app)
                        .delete(`/api/phrase/${phraseId}`)
                        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                        .expect(404, { error: { message: `Phrase does not exist` } })
                    })
            })
            it('responds with 204 and updates phrase', ()=>{
                const phraseToUpdate = 1
                const updatedBody = {
                    name: 'goof',
                    motifs: [1,2,3],
                    modal_shifts: [0,5,0]
                }
                return supertest(app)
                        .patch(`/api/phrase/${phraseToUpdate}`)
                        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                        .send(updatedBody)
                        .expect(204)
                        .then(res => 
                            supertest(app)
                                .get(`/api/phrase/${phraseToUpdate}`)
                                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                                .expect(res => {
                                    expect(res.body).to.have.property('id', 1)
                                    expect(res.body).to.have.property('name', updatedBody.name)
                                    expect(res.body.motifs).to.eql(updatedBody.motifs)
                                    expect(res.body.modal_shifts).to.eql(updatedBody.modal_shifts)
                                })
                        )
            })
        })
    })
})