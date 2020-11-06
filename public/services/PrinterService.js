const moment = require('moment')
const escpos = require('escpos')
const Axios = require("axios")
escpos.USB = require('escpos-usb')
moment.locale('id')

const printing = async (req, res) => {
    try {
        const { transactionId } = req.body
        const hit = await post('trans/pos/view', { transId: transactionId })
        if (hit.status) {
            const print = struk(hit.data)
            if (!print) return res.json({ status: false, message: 'Printer tidak terhubung!' })
            return res.json({ status: true, result: 'Cetak Berhasil', data: hit.data })
        } else {
            return res.json({ status: false, message: 'Data tidak ditemukan!' })
        }
    } catch (error) {
        console.log(error)
        res.json({ status: false, result: 'Error Proses' })
    }
}

const printingClerk = async (req, res) => {
    try {
        const { data } = req.body
        const print = printClerk(res.locals, data)
        if (!print) return res.json({ status: false, message: 'Printer tidak terhubung!' })
        return res.json({ status: true, result: 'Cetak Berhasil' })
    } catch (error) {
        console.log(error)
        res.json({ status: false, result: 'Error Proses' })
    }
}

const struk = (data = {}) => {
    try {
        const options = { encoding: "GB18030" /* default */ }
        const device = new escpos.USB();
        const printer = new escpos.Printer(device, options);
        device.open((error) => {
            let separator = '================================'
            let line = '--------------------------------'
            let width = separator.length - 12;
            let width2 = width - 9;
            printer
                .align('CT')
                .text('')
                .text(`${data.store_name.toUpperCase()} / ${data.store.store_phone}`)
                .text('CV. DAHANTA BERKAH RETAILINDO')
                .text('')
                .text(data.store.store_address.toUpperCase())
                .align('LT')
                .text(separator)
                .text(`Bon   : ${data.no_trans}`)
                .text(`Kasir : ${data.name}`)
                .text(separator)
            let total_qty = 0
            for (let i = 0; i < data.items.length; i++) {
                let item_name = data.items[i].desc.substring(0, 15)
                let item_qty = data.items[i].qty.toString()
                let item_sub_total = number((data.items[i].sales * data.items[i].qty) + data.items[i].disc)
                let qty_length = item_name.length + item_qty.length
                let disc = `(${number(data.items[i].disc)})`

                printer.text(`${item_name}${getSpace(width, qty_length)}${item_qty}  ${getSpace(width2 - 1, item_sub_total.length)}${item_sub_total}`)
                if (data.items[i].disc > 0) {
                    printer.text(displayTwo('    Diskon', disc, separator))
                }

                total_qty += data.items[i].qty
            }
            printer.text(line)

            // Total Item
            let total_item = 'Total Item'
            let total_qty_length = total_item.length + total_qty.toString().length
            let sub_total = data.grand_total + data.total_discount
            let string_sub_total = number(sub_total)
            printer.text(`${total_item}${getSpace(width, total_qty_length)}${total_qty}  ${getSpace(width2 - 1, string_sub_total.toString().length)}${string_sub_total}`)

            printer.text(displayTwo('Total Diskon', number(data.total_discount), separator))
            printer.text(displayTwo('Total Belanja', number(data.grand_total), separator))

            if (data.payment_method == 'CASH') {
                printer.text(displayTwo('Tunai', number(data.cash), separator))
                printer.text(displayTwo('Sedekah', number(data.sedekah), separator))
                printer.text(displayTwo('Kembalian', number(data.cash - data.sedekah - data.grand_total), separator))
            } else if (data.payment_method == 'MEMBER') {
                printer.text(displayTwo('Smart Member', number(data.grand_total), separator))
            } else if (data.payment_method == 'PARTIAL') {
                for (const p of data.partials) {
                    printer.text(displayTwo(p.method_name, number(p.amount), separator))
                }
            } else if (data.payment_method == 'VOUCHER') {
                printer.text(displayTwo('Voucher', number(data.cash), separator))
            } else {
                printer.text(displayTwo('Non Tunai', number(data.grand_total), separator))
                printer.text(displayTwo('Bank', data.bank, separator))
                printer.text(displayTwo('No Kartu', data.ccno, separator))
            }
            if (data.memberId) {
                printer.text(displayTwo('No Member', data.member_no, separator))
                printer.text(displayTwo('Nama Member', data.member_fullname, separator))
            }
            printer.text(separator)
            printer.text(`Tgl. ${moment(data.createdAt).format('DD MMMM YYYY, HH:mm:ss')}`)
            printer.text(line)
            printer.text('Kritik & Saran: 0813-9806-6633')
            if (data.retur) {
                printer.align('CT')
                printer.text('')
                printer.text('')
                printer.text('----- STRUK RETUR -----')
            }
            printer.text('')
            printer.cut().close()
        })
        return true
    } catch (error) {
        console.log(error)
        console.log('Printer tidak terhubung')
        return false
    }
}

const printClerk = async (profile = {}, data = {}) => {
    try {
        const options = { encoding: "GB18030" /* default */ }
        const device = new escpos.USB();
        const printer = new escpos.Printer(device, options);
        device.open((error) => {
            let separator = '================================'
            printer
                .align('CT')
                .text('')
                .text(`${profile.store_name.toUpperCase()} / ${profile.store_phone}`)
                .text('CV. DAHANTA BERKAH RETAILINDO')
                .text('')
                .text(profile.store_address.toUpperCase())
                .align('LT')
                .text(separator)
                .text('CLERK KASIR')
                .text(`Tgl Transaksi : ${moment(data.createdAt).format('DD MMMM YYYY')}`)
                .text(`Jam Clerk     : ${moment(data.createdAt).format('HH:mm:ss')}`)
                .text(`Kasir         : ${profile.name}`)
                .text(separator)

            printer.text(displayTwo('Jumlah Transaksi', number(data.count_sales), separator))
            printer.text(displayTwo('Jumlah QTY', number(data.count_qty), separator))
            printer.text(displayTwo('Jumlah Retur', number(data.count_retur), separator))
            printer.text(displayTwo('Total Tunai', number(data.total_cash), separator))
            printer.text(displayTwo('Total Non Tunai', number(data.total_debit), separator))
            printer.text(displayTwo('Total Nominal Transaksi', number(data.total_trans), separator))
            printer.text(displayTwo('Total Nominal Diskon', number(data.total_disc), separator))
            printer.text(displayTwo('Total Nominal Retur', number(data.total_retur), separator))
            printer.text(displayTwo('Total Nominal Sedekah', number(data.total_sedekah), separator))
            printer.text(displayTwo('Grand Total', number(data.grand_total), separator))
            printer.text(displayTwo('Setoran', number(data.setoran), separator))
            printer.text(displayTwo('Selisih', number(data.setoran - data.grand_total), separator))
            printer.text(separator)
            printer.text('')
            printer.cut().close()
        })
        return true
    } catch (error) {
        console.log(error)
        console.log('Printer tidak terhubung!')
        return false
    }
}

const post = (uri, body) => {
    return new Promise((resolve, reject) => {
        const url = 'https://prod.dahanta.co.id'
        Axios.post(`${url}/${uri}`, body, { headers: { 'User-Agent': 'POS-DAHANTA' } })
            .then((res) => {
                resolve(res.data)
            })
            .catch((err) => {
                console.log('Server Printer Timeout')
                reject(err)
            })
    })
}

const displayTwo = (title, value, available) => {
    let length = String(title).length + String(value).length
    return title + getSpace(available.length, length) + String(value)
}

const getSpace = (length_available, length_text) => {
    let space = ''
    let length = length_available - length_text
    for (let i = 0; i < length; i++) {
        space += " "
    }
    return space
}

const number = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

module.exports = { printing, printingClerk }