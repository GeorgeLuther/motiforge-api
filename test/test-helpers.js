const knex = require('knex')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

/**
 * create a knex instance connected to postgres
 * @returns {knex instance}
 */
function makeKnexInstance() {
  return knex({
    client: 'pg',
    connection: process.env.TEST_DB_URL,
  })
}

/**
 * create a knex instance connected to postgres
 * @returns {array} of user objects
 */
function makeUsersArray() {
  return [
    {
      id: 1,
      username: 'test-user-1',
      name: 'Test user 1',
      password: 'password',
    },
    {
      id: 2,
      username: 'test-user-2',
      name: 'Test user 2',
      password: 'password',
    },
  ]
}

/**
 * insert users into db with bcrypted passwords and update sequence
 * @param {knex instance} db
 * @param {array} users - array of user objects for insertion
 * @returns {Promise} - when users table seeded
 */
 function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }))
  return db.transaction(async trx => {
    await trx.into('user').insert(preppedUsers)

    await trx.raw(
      `SELECT setval('user_id_seq', ?)`,
      [users[users.length - 1].id],
    )
  })
}

/**
 * make a bearer token with jwt for authorization header
 * @param {object} user - contains `id`, `username`
 * @param {string} secret - used to create the JWT
 * @returns {string} - for HTTP authorization header
 */

 function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.username,
    algorithm: 'HS256',
  })
  return `Bearer ${token}`
}

/**
 * generate fixtures of motifs, phrases, and forms for a given user
 * @param {object} user - contains `id` property
 * @returns {Array(motifs, phrases, and forms)} - arrays of motifs, phrases, and forms
 */
function makeMotifsPhrasesForms(user) {
  const motifs = [
    {
      id: 1,
      name: 'Test motif 1',
      date_created: '2021-03-16T04:50:07.486Z',
      notes: [0,1,0,0,1,0,1,0],
      user_id: user.id,
    },
    {
      id: 2,
      name: 'Test motif 2',
      date_created: '2021-03-16T04:50:07.486Z',
      notes: [0,2,4,7],
      user_id: user.id,
    },
    {
      id: 3,
      name: 'Test motif 3',
      date_created: '2021-03-16T04:50:07.486Z',
      notes: [4,3,2,1,0,-1,1],
      user_id: user.id,
    },
  ]
  const phrases = [
    {
      id: 1,
      name: 'Test phrase 1',
      date_created: '2021-03-18T19:42:00.327Z',
      motifs: [1,2,1,3,1],
      modal_shifts: [0,0,0,0,0],
      user_id: user.id,
    },
    {
      id: 2,
      name: 'Test phrase 2',
      date_created: '2021-03-18T19:42:00.327Z',
      motifs: [1,1,1,2],
      modal_shifts: [1,5,-1,1],
      user_id: user.id,
    },
    {
      id: 3,
      name: 'Test phrase 3',
      date_created: '2021-03-18T19:42:00.327Z',
      motifs: [3,3,2,3],
      modal_shifts: [3,2,1,0],
      user_id: user.id,
    },
  ]
  const forms = [
    {
      id: 1,
      name: 'Test form 1',
      date_created: '2021-03-18T19:42:00.327Z',
      phrases: [1,2,1,3,1],
      transpositions: [0,0,0,0,0],
      user_id: user.id,
    },
    {
      id: 2,
      name: 'Test form 2',
      date_created: '2021-03-18T19:42:00.327Z',
      phrases: [1,1,1,2],
      transpositions: [1,5,-1,1],
      user_id: user.id,
    },
    {
      id: 3,
      name: 'Test form 3',
      date_created: '2021-03-18T19:42:00.327Z',
      phrases: [3,3,2,3],
      transpositions: [3,2,1,0],
      user_id: user.id,
    },
  ]

  return [motifs, phrases, forms]
}

/**
 * remove data from tables and reset sequences for SERIAL id fields
 * @param {knex instance} db
 * @returns {Promise} - when tables are cleared
 */
function cleanTables(db) {
  return db.transaction(trx =>
    trx.raw(
      `TRUNCATE
        "form",
        "phrase",
        "motif",
        "user"`
      )
      .then(() =>
        Promise.all([
          trx.raw(`ALTER SEQUENCE form_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE phrase_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE motif_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE user_id_seq minvalue 0 START WITH 1`),
          trx.raw(`SELECT setval('form_id_seq', 0)`),
          trx.raw(`SELECT setval('phrase_id_seq', 0)`),
          trx.raw(`SELECT setval('motif_id_seq', 0)`),
          trx.raw(`SELECT setval('user_id_seq', 0)`),
        ])
      )
  )
}

/**
 * seed the databases with words and update sequence counter
 * @param {knex instance} db
 * @param {array} users - array of user objects for insertion
 * @param {array} motifs - array of motif objects for insertion
 * @param {array} phrases - array of phrase objects for insertion
 * * @param {array} forms - array of form objects for insertion
 * @returns {Promise} - when all tables seeded
//  */
async function seedUsersMotifsPhrasesForms(db, users, motifs, phrases, forms) {
  await seedUsers(db, users)

  await db.transaction(async trx => {
    await trx.into('motif').insert(motifs)
    await trx.into('phrase').insert(phrases)
    await trx.into('form').insert(forms)

    await Promise.all([
      trx.raw(
        `SELECT setval('motif_id_seq', ?)`,
        [motifs[motifs.length - 1].id],
      ),
      trx.raw(
        `SELECT setval('phrase_id_seq', ?)`,
        [phrases[phrases.length - 1].id],
      ),
      trx.raw(
        `SELECT setval('form_id_seq', ?)`,
        [forms[forms.length - 1].id],
      ),
    ])
  })
}

module.exports = {
  makeKnexInstance,
  makeUsersArray,
  makeAuthHeader,
  cleanTables,
  seedUsers,
  makeMotifsPhrasesForms,
  seedUsersMotifsPhrasesForms
}
