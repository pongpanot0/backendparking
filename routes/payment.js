const payment = require('../controller/payment')
module.exports = function (app) {
    app.post('/payment',payment.create)
    app.post('/qrcode',payment.qrcode)
    app.post('/omis',payment.omis)
    

}