const MotifService = {
    getMotifs(db, user_id) {
      return db.select('*')
        .from('motif')
        .where({user_id})
    },
    addNewMotif(db, user_id){
      console.log(user_id)
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
}
module.exports = MotifService