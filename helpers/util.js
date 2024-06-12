const jwt = require('jsonwebtoken')
const User = require('../models/User')

const secretToken = 'rubicamp';

async function tokenValid(req, res, next) {
    try {
        const authorization = req.get('Authorization')
        const token = authorization.slice(7)
        const decoded = jwt.verify(token, secretToken);
        const user = await User.findById(decoded.userid)
        req.user = user;
        next()
    } catch (e) {
        console.log(e)
        res.status(401).json({ message: 'token is not valid' })
    }
}

module.exports = { secretToken, tokenValid }
