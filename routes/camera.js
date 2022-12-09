const camera = require('../controller/camera')
module.exports = function (app) {
    app.post('/createcamera',camera.createcamera)
    app.get('/getcamera/:id',camera.getcamera)
}