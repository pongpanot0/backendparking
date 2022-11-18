const auth = require('../controller/auth')
module.exports = function (app) {
    app.post('/register',auth.register)
    app.post('/login',auth.login)
}