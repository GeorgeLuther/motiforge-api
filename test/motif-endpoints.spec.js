const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Motif Endpoints', function () {
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
   * @description Endpoints for motifs owned by a user
   **/
    describe(`Motif endpoints protected by user`, () => {

        describe('GET /api/motif', () => {
            beforeEach('insert users, motifs, phrases, and forms', () => {
                return helpers.seedUsersMotifsPhrasesForms(
                  db,
                  testUsers,
                  testMotifs,
                  testPhrases,
                  testForms,
                )
              })
            context('Given user has no motifs',()=>{
                it('responds with 200 and empty array',()=>{
                    return supertest(app)
                        .get('/api/motif')
                        //user 1 exists but without any owned data
                        .set('Authorization', helpers.makeAuthHeader(testUsers[1]))
                        .expect(200, [])
                })
            })
    
            context('Given user has motifs',()=>{
                it('responds with 200 and array of user motifs',()=>{
                    return supertest(app)
                        .get('/api/motif')
                        //user 1 exists and owns data
                        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                        .expect(200, testMotifs)
                })
            })
        })

        describe('POST /api/motif', () => {   
            beforeEach('insert users, motifs, phrases, and forms', () => {
                return helpers.seedUsersMotifsPhrasesForms(
                  db,
                  testUsers,
                  testMotifs,
                  testPhrases,
                  testForms,
                )
              })
              
                it('responds with 201 and a template motif',()=>{
                    return supertest(app)
                            .post('/api/motif')        
                            .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                            .expect(201)
                })
        
        })
        describe('GET /api/motif/:id',()=>{
            beforeEach('insert users, motifs, phrases, and forms', () => {
                return helpers.seedUsersMotifsPhrasesForms(
                  db,
                  testUsers,
                  testMotifs,
                  testPhrases,
                  testForms,
                )
              })
            context(`Given motif not in database`, () => {
                it(`responds with 404`, () => {
                  const motifId = 1000
                  return supertest(app)
                    .get(`/api/motif/${motifId}`)
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(404, { error: { message: `Motif does not exist` } })
                })
              })
            context('Given motif table is seeded',()=>{
                it('responds with 204 and removes the pattern', ()=>{
                    const idToGet = 1
                    const expectedMotif = testMotifs[0]
                    return supertest(app)
                            .get(`/api/motif/${idToGet}`)
                            .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                            .expect(200, expectedMotif)
                })
            })
        })

        describe('DELETE /api/motif/:id',()=>{
            beforeEach('insert users, motifs, phrases, and forms', () => {
                return helpers.seedUsersMotifsPhrasesForms(
                  db,
                  testUsers,
                  testMotifs,
                  testPhrases,
                  testForms,
                )
              })
            context(`Given motif not in database`, () => {
                it(`responds with 404`, () => {
                  const motifId = 1000
                  return supertest(app)
                    .delete(`/api/motif/${motifId}`)
                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                    .expect(404, { error: { message: `Motif does not exist` } })
                })
              })
            context('Given motif table is seeded',()=>{
                it('responds with 204 and removes the pattern', ()=>{
                    const idToRemove = 1
                    const expectedMotifs = testMotifs.filter(motif => motif.id !== idToRemove)
                    return supertest(app)
                            .delete(`/api/motif/${idToRemove}`)
                            .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                            .expect(204)
                            .then(res => 
                                supertest(app)
                                    .get('/api/motif')
                                    .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                                    .expect(expectedMotifs)
                            )
                })
            })
        })
        describe('PATCH /api/motif/:id',()=>{
            
            beforeEach('insert users, motifs, phrases, and forms', () => {
                return helpers.seedUsersMotifsPhrasesForms(
                  db,
                  testUsers,
                  testMotifs,
                  testPhrases,
                  testForms,
                )
              })
            context(`Given no motifs in database`, () => {
                it(`responds with 404`, () => {
                    const motifId = 1000
                    return supertest(app)
                        .delete(`/api/motif/${motifId}`)
                        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                        .expect(404, { error: { message: `Motif does not exist` } })
                    })
            })
            it('responds with 204 and updates motif', ()=>{
                const motifToUpdate = 1
                const updatedBody = {
                    name: 'goof',
                    notes: [2,5,1]
                }
                return supertest(app)
                        .patch(`/api/motif/${motifToUpdate}`)
                        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                        .send(updatedBody)
                        .expect(204)
                        .then(res => 
                            supertest(app)
                                .get(`/api/motif/${motifToUpdate}`)
                                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                                .expect(res => {
                                    console.log(updatedBody)
                                    console.log(res.body)
                                    expect(res.body).to.have.property('id', 1)
                                    expect(res.body).to.have.property('name', updatedBody.name)
                                    expect(res.body.notes).to.eql(updatedBody.notes)
                                })
                        )
            })
        })
    })
})