const express = require('express')
const path = require('path')
const jsonParser = express.json()
const MotifService = require('./motif-service')
const { requireAuth } = require('../middleware/jwt-auth')
const xss = require('xss')

const motifRouter = express.Router()

motifRouter.route('/')
  .get(requireAuth, (req, res, next) => {
    MotifService.getMotifs(req.app.get('db'), req.user.id)
      .then(motifs => {
        return res.status(200).json(motifs)
      })
      .catch(next)
  })
  .post(requireAuth, jsonParser,(req,res,next)=>{
    MotifService.addNewMotif(req.app.get('db'), req.user.id)
      .then(motif => {
        return res.status(201).json(motif)
      })
      .catch(next)
  })

motifRouter.route('/:id')
    .all((req, res, next)=>{
      MotifService.getMotifById(
          req.app.get('db'),
          req.params.id
      )
      .then(motif=>{
          if (!motif){
              return res.status(404).json({
                  error: {message: 'Motif does not exist'}
              })
          }
          res.motif = motif
          next()
      })
      .catch(next)
    })
    .get((req,res,next)=>{
      res.status(200).json(res.motif)
    })
    .delete(requireAuth, (req, res, next) => {
      MotifService.deleteMotif(req.app.get('db'), req.params.id)
          .then(()=>{res.status(204).end()})
          .catch(next)
    })
    .patch(requireAuth, jsonParser,(req, res, next)=> {
      const { name, notes } = req.body
      const newData = { name, notes }

      newData.name = xss(newData.name)

      MotifService.updateMotif(req.app.get('db'), req.params.id, newData)
        .then(
          res.status(204).end()
        )
        .catch(next)
    })

module.exports = motifRouter