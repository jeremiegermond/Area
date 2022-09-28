const express = require('express')
const router = express.Router()

const userRoute = require('./user')
// const actionRoute = require('./action')
// const reactionRoute = require('./reaction')

const api = {
    name: 'expressAPI',
    version: '0.1',
    status: 200,
    message: 'Go to localhost:8081 for the web interface'
}

router.get('/', async (req, res) => {
    res.status(200).json(api)
})

router.use('/users', userRoute)
// router.use('/actions', actionRoute)
// router.use('/reactions', reactionRoute)

module.exports = router