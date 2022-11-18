const cal = require('../controller/calculation')
module.exports = function (app) {
    app.get('/gg/:company_id',cal.calpark)
    
}