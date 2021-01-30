const { Router } = require("express")
const { printing, printingClerk, prepaid, postpaid, transfer } = require('../services/PrinterService')

const route = Router()

route.route('/print/struk').post(printing)
route.route('/print/clerk').post(printingClerk)
route.route('/print/ppob/prepaid').post(prepaid)
route.route('/print/ppob/postpaid').post(postpaid)
route.route('/print/bank/transfer').post(transfer)

module.exports = route