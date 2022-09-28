const express = require('express')
const router = express.Router()

const service = require('../../services/v1/user')

router.get('/:id', service.getById)

module.exports = router