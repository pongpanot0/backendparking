const theme = require('../controller/theme')
module.exports = function (app) {
    app.post('/createtheme',theme.createTheme)
    app.get('/gettheme/:id',theme.getTheme)
}