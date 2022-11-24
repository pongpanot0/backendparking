const parking = require('../controller/parking')
module.exports = function (app) {

    app.get('/parkcalculate/:id/:parking_logs_id',parking.parkcalculate)
    
    app.post('/createPark',parking.createPark)
    
}