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
  // .use(async (req, res, next) => {
  //   try {
  //     const motif = await MotifService.getMotifs(
  //       req.app.get('db'),
  //       req.user.id,
  //     )
  //     if (!motif)
  //       return res.status(404).json({
  //         error: `You don't have any motifs`,
  //       })
  //     req.motif = res.json(motif)
  //     next()
  //   } catch (error) {
  //     next(error)
  //   }
  // })
// motifRouter
//   .use(requireAuth)
//   .post(jsonParser,(req,res,next)=>{
//     MotifService.addNewMotif(
//       req.app.get('db'),
//       req.user.id,
//       )
//       .then(motif => {
//           res
//               .status(201)
//               .json(motif)
//       })
//       .catch(next)
// })
// const seq = await db
// .from('word_id_seq')
// .select('last_value')
// .first()

  
  

module.exports = motifRouter