const print = require('../controller/print')
module.exports = function (app) {
    app.post('/print',print.pdf)
    app.post('/print2',print.print2)

}
