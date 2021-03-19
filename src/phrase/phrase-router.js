const express = require('express')
const path = require('path')
const jsonParser = express.json()
const PhraseService = require('./phrase-service')
const { requireAuth } = require('../middleware/jwt-auth')
const xss = require('xss')

const phraseRouter = express.Router()

phraseRouter.route('/')
  .get(requireAuth, (req, res, next) => {
    PhraseService.getPhrases(req.app.get('db'), req.user.id)
      .then(phrases => {
        return res.status(200).json(phrases)
      })
      .catch(next)
  })
  .post(requireAuth, jsonParser,(req,res,next)=>{
    PhraseService.addNewPhrase(req.app.get('db'), req.user.id)
      .then(phrase => {
        return res.status(201).json(phrase)
      })
      .catch(next)
  })

  phraseRouter.route('/:id')
    .all(requireAuth, (req, res, next)=>{
        PhraseService.getPhraseById(
          req.app.get('db'),
          req.params.id
      )
      .then(phrase=>{
          if (!phrase){
              return res.status(404).json({
                  error: {message: 'Phrase does not exist'}
              })
          }
          res.phrase = phrase
          next()
      })
      .catch(next)
    })
    .get((req,res,next)=>{
      res.status(200).json(res.phrase)
    })
    .delete(requireAuth, (req, res, next) => {
        PhraseService.deletePhrase(req.app.get('db'), req.params.id)
          .then(()=>{res.status(204).end()})
          .catch(next)
    })
    .patch(requireAuth, jsonParser,(req, res, next)=> {
      const { name, motifs, modal_shifts } = req.body
      const newData = { name, motifs, modal_shifts }
      newData.name = xss(newData.name)

      PhraseService.updatePhrase(req.app.get('db'), req.params.id, newData)
        .then(
          res.status(204).end()
        )
        .catch(next)
    })

module.exports = phraseRouter