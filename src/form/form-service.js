const FormService = {
  getForms(db, user_id) {
    return db.select('*')
      .from('form')
      .where({user_id})
  },
  getFormById(db, id){
    return db('form')
            .select('*')
            .where({id})
            .first()
  },
  addNewForm(db, user_id){
    return db
            .insert({
              name: 'Untitled',
              motifs: '{1,1}',
              modal_shifts: '{0,0}',
              user_id: user_id
            })
            .into('form')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
            .catch(err => err)
  },
  updateForm(db, id, newData){
    return db('form')
            .where({ id })
            .update(newData)
  },
  deleteForm(db, id){
    return db('form')
            .where({id})
            .delete()
  }
}
module.exports = FormService