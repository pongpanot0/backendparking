const parking = require('../controller/parking')
module.exports = function (app) {
    app.get('/parking/:parking_logs_id/:company_id',parking.parking)
    app.get('/parking2/:company_id',parking.calpark)
}