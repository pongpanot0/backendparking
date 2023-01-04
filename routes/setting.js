const setting = require('../controller/setting')
module.exports = function (app) {
    app.post('/addsetting',setting.insert)
    app.get('/getsetting/:id',setting.get)
    app.get('/getsettingid/:id',setting.getId)
    app.post('/editsetting',setting.editdata)
}