require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const authRouter = require('./auth/auth-router')
const userRouter = require('./user/user-router')
const motifRouter = require('./motif/motif-router')
const phraseRouter = require('./phrase/phrase-router')
const formRouter = require('./form/form-router')

const app = express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())


app.get('/',(req,res)=>{
    res.send('Hello, world!')
})

app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)
app.use('/api/motif', motifRouter)
app.use('/api/phrase', phraseRouter)
app.use('/api/form', formRouter)

app.use(function errorHandler(error, req, res, next){
    let response
    if (NODE_ENV === 'production') {
        response = {error: {message: 'server error'}}
    } else {
        console.error(error)
        response = {message: error.message, error}
    }
    console.error(error)
    res.status(500).json(response)
})
module.exports = app