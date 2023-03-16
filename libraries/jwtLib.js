"use strict"

const jwt = require('jsonwebtoken')
const { jwtSecret } = require('../config')

module.exports = {
    generate: (data) => {
        return jwt.sign(data, jwtSecret, {expiresIn:24 * 3600})
    },
    verify: (token) => {
        return jwt.verify(token, jwtSecret)
    }
}
