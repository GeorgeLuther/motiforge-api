const express = require('express')
const path = require('path')
const jsonParser = express.json()
const FormService = require('./form-service')
const { requireAuth } = require('../middleware/jwt-auth')
const xss = require('xss')

const formRouter = express.Router()

formRouter.route('/')
  .get(requireAuth, (req, res, next) => {
    FormService.getForms(req.app.get('db'), req.user.id)
      .then(forms => {
        return res.status(200).json(forms)
      })
      .catch(next)
  })
  .post(requireAuth, jsonParser,(req,res,next)=>{
    FormService.addNewForm(req.app.get('db'), req.user.id)
      .then(form => {
        return res.status(201).json(form)
      })
      .catch(next)
  })

  formRouter.route('/:id')
    .all(requireAuth, (req, res, next)=>{
        FormService.getFormById(
          req.app.get('db'),
          req.params.id
      )
      .then(form=>{
          if (!form){
              return res.status(404).json({
                  error: {message: 'Form does not exist'}
              })
          }
          res.form = form
          next()
      })
      .catch(next)
    })
    .get((req,res,next)=>{
      res.status(200).json(res.form)
    })
    .delete(requireAuth, (req, res, next) => {
        FormService.deleteForm(req.app.get('db'), req.params.id)
          .then(()=>{res.status(204).end()})
          .catch(next)
    })
    .patch(requireAuth, jsonParser,(req, res, next)=> {
      const { name, phrases, transpositions } = req.body
      const newData = { name, phrases, transpositions }
      newData.name = xss(newData.name)

      FormService.updateForm(req.app.get('db'), req.params.id, newData)
        .then(
          res.status(204).end()
        )
        .catch(next)
    })

module.exports = formRouter