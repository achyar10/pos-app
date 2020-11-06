const { Router } = require("express")
const { printing, printingClerk } = require('../services/PrinterService')

const route = Router()

route.route('/print/struk').post(printing)
route.route('/print/clerk').post(printingClerk)

module.exports = route