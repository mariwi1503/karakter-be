"use strict"

const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = {
    hasher: (password) => {
        return bcrypt.hashSync(password, saltRounds);
    },
    checker: (password, hash) => {
        return bcrypt.compareSync(password, hash);
    }
}
