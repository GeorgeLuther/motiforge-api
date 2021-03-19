const PhraseService = {
  getPhrases(db, user_id) {
    return db.select('*')
      .from('phrase')
      .where({user_id})
  },
  getPhraseById(db, id){
    return db('phrase')
            .select('*')
            .where({id})
            .first()
  },
  addNewPhrase(db, user_id){
    return db
            .insert({
              name: 'Untitled',
              motifs: '{1,1}',
              modal_shifts: '{0,0}',
              user_id: user_id
            })
            .into('phrase')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
            .catch(err => err)
  },
  updatePhrase(db, id, newData){
    return db('phrase')
            .where({ id })
            .update(newData)
  },
  deletePhrase(db, id){
    return db('phrase')
            .where({id})
            .delete()
  }
}
module.exports = PhraseService