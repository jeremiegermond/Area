const express = require('express')
const router = express.Router()

const service = require('../../services/v1/user')

router.get('/:id', service.getById)

router.get('/getUsers', service.getAllUsers)

router.put('/add', service.add)

router.patch('/update', service.update)

router.delete('/delete', service.delete)

router.post('/signup', service.signUp)

router.post('/login', service.login)

module.exports = router