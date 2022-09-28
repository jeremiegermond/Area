const express = require('express')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')

const indexRouter = require('./routes/v1/index');
const mongodb = require('./db/mongo');

mongodb.initDbConnection()

const app = express()

app.use(cors({
    exposedHeaders: ['Authorization'],
    origin: '*'
}))
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())

app.use('/v1', indexRouter)

app.use(function (freq, res, next) {
    res.status(404).json({name: 'API', version:1.0})
})

function getServices() {
    // fetch DB return available services
    // {
    //     "name": "Facebook",
    //     "actions": [{
    //       "name": "action_1",
    //       "description": "action_dsc_1"
    //     }],
    //     "reactions": [{
    //       "name": "reaction_1",
    //       "description": "reaction_dsc_1"
    //     }]
    // }
    return []
}

app.get('/about.json', (req, res) => {
    const ip = req.ip.split(':')[3]
    console.log(ip)
    res.json({
        "client": {
            "host": ip
        },
        "server": {
            "current_time": Date.now()
        },
        "services": getServices()
    })
})

app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${process.env.PORT}`)
})

module.exports = app