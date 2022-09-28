const express = require('express')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')

const baseRouter = require('./routes/index')
const apiRouter = require('./routes/v1/index')
const mongodb = require('./db/mongo')

mongodb.initDbConnection()

const app = express()
const port = process.env.PORT || 8080

app.use(cors({
    exposedHeaders: ['Authorization'],
    origin: '*'
}))
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())

app.use('/', baseRouter)
app.use('/v1', apiRouter)

app.use(function (freq, res, next) {
    res.status(404).json({name: 'API', version:1.0})
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port }`)
})

module.exports = app