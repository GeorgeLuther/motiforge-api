const MotifService = {
  getMotifs(db, user_id) {
    return db.select('*')
      .from('motif')
      .where({user_id})
  },
  getMotifById(db, id){
    return db('motif')
            .select('*')
            .where({id})
            .first()
  },
  addNewMotif(db, user_id){
    return db
            .insert({
              name: 'Untitled',
              notes: '{0,0}',
              user_id: user_id
            })
            .into('motif')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
            .catch(err => console.log('post-err',err))
  },
  updateMotif(db, id, newData){
    return db('motif')
            .where({ id })
            .update(newData)
  },
  deleteMotif(db, id){
    return db('motif')
            .where({id})
            .delete()
  }
}
module.exports = MotifService