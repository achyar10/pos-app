const moment = require('moment')
const escpos = require('escpos')
const Axios = require("axios")
const request = require('request')
escpos.USB = require('escpos-usb')
moment.locale('id')
require('dotenv').config()

const printing = async (req, res) => {
    try {
        const { transactionId, paper = 'small' } = req.body
        const hit = await post('trans/pos/view', { transId: transactionId })
        if (hit.status) {
            const print = struk(hit.data, paper)
            if (!print) return res.json({ status: false, message: 'Printer tidak terhubung!' })
            return res.json({ status: true, result: 'Cetak Berhasil', data: hit.data })
        } else {
            return res.json({ status: false, message: 'Data tidak ditemukan!' })
        }
    } catch (error) {
        console.log(error)
        res.json({ status: false, message: error })
    }
}

const printingClerk = async (req, res) => {
    const { clerkId } = req.body
    try {
        const hit = await post('clerk/pos/view', { id: clerkId })
        if (hit.status) {
            const data = hit.data
            const profile = {
                name: data.user.name,
                store_name: data.store.store_name,
                store_phone: data.store.store_phone,
                store_address: data.store.store_address,
            }
            const print = printClerk(profile, data)
            if (!print) return res.json({ status: false, message: 'Printer tidak terhubung!' })
            return res.json({ status: true, result: 'Cetak Berhasil' })
        } else {
            return res.json({ status: false, message: 'Data tidak ditemukan!' })
        }
    } catch (error) {
        console.log(error)
        res.json({ status: false, message: error })
    }
}

const prepaid = (req, res) => {
    const { data, paper } = req.body
    try {
        const options = { encoding: "GB18030" /* default */ }
        const device = new escpos.USB();
        const printer = new escpos.Printer(device, options);
        device.open((error) => {
            let separator = '================================'
            let line = '--------------------------------'
            if (paper == 'large') {
                separator = '================================================'
                line = '------------------------------------------------'
            }
            printer
                .align('CT')
                .text('')
                .text(`${data.store.store_name.toUpperCase()} / ${data.store.store_phone}`)
                .text('CV. DAHANTA BERKAH RETAILINDO')
                .text('')
                .text(data.store.store_address.toUpperCase())
                .align('LT')
                .text(separator)
                .text(`Bon    : ${data.no_trans}`)
                .text(`Kasir  : ${data.fullname}`)
                .text(separator)

            printer.text(displayTwo('ID Transaksi', data.tr_id, separator))
            printer.text(displayTwo('Produk', data.operator, separator))
            printer.text(displayTwo('Nomor', data.hp, separator))
            if (data.type !== 'pln') {
                printer.text(displayTwo('Serial Number', data.sn, separator))
            } else {
                const split = data.sn.split('/')
                printer.text(displayTwo('Nama', split[1], separator))
                printer.text(displayTwo('Tarif/Daya', `${split[2]}/${split[3]}`, separator))
                printer.text(displayTwo('Kwh', split[4], separator))
            }
            printer.text(displayTwo('Harga', number(data.sales), separator))
            printer.text(displayTwo('Tunai', number(data.cash), separator))
            printer.text(displayTwo('Kembalian', number(data.cash - data.sales), separator))
            if (data.type === 'pln') {
                printer.text(line)
                const split = data.sn.split('/')
                printer.align('CT').text('TOKEN')
                printer.align('CT').text(split[0])
            }
            printer.align('LT').text(separator)
            printer.text(`Tgl. ${moment(data.createdAt).format('DD MMMM YYYY, HH:mm:ss')}`)
            printer.text(line)
            printer.text('Kritik & Saran: 0813-9806-6633')
            printer.text('')
            printer.cut().close()
        })
        return res.json({ status: true, result: 'Cetak Berhasil' })
    } catch (error) {
        console.log(error)
        res.json({ status: false, message: 'Printer tidak terhubung!' })
    }
}

const postpaid = (req, res) => {
    const { data, obj, paper } = req.body
    try {
        const options = { encoding: "GB18030" /* default */ }
        const device = new escpos.USB();
        const printer = new escpos.Printer(device, options);
        device.open((error) => {
            let separator = '================================'
            let line = '--------------------------------'
            if (paper == 'large') {
                separator = '================================================'
                line = '------------------------------------------------'
            }
            printer
                .align('CT')
                .text('')
                .text(`${obj.store.store_name.toUpperCase()} / ${obj.store.store_phone}`)
                .text('CV. DAHANTA BERKAH RETAILINDO')
                .text('')
                .text(obj.store.store_address.toUpperCase())
                .align('LT')
                .text(separator)
                .text(`Bon    : ${obj.no_trans}`)
                .text(`Kasir  : ${obj.fullname}`)
                .text(separator)

            if (data.code === 'PLNPOSTPAID') {
                printer.text(displayTwo('IDPEL', data.hp, separator))
                printer.text(displayTwo('NAMA', data.tr_name, separator))
                printer.text(displayTwo('TARIF/DAYA', `${data.desc.tarif}/${data.desc.daya}`, separator))
                printer.text(displayTwo('BL/TH', moment(data.period, "YYYYMM").format('MMM YY'), separator))
                printer.text(displayTwo('RP TAG PLN', number(data.nominal), separator))
                printer.text(displayTwo('NO REF', data.noref, separator))
                printer.align('CT').text('PLN menyatakan struk ini sebagai bukti pembayaran yang sah.')
                printer.align('LT').text(displayTwo('ADMIN BANK', number(data.admin), separator))
                printer.text(displayTwo('TOTAL BAYAR', number(data.price), separator))
                printer.align('CT').text('Terima Kasih')
                printer.align('CT').text('Informasi Hubungi Call Center 123 Atau Hub PLN Terdekat')
            } else {
                printer.text(displayTwo('Produk', data.code, separator))
                printer.text(displayTwo('Nomor', data.hp, separator))
                printer.text(displayTwo('Nama', data.tr_name, separator))
                printer.text(displayTwo('No Ref', data.noref, separator))
                printer.text(displayTwo('Total Tagihan', number(data.nominal), separator))
                printer.text(displayTwo('Admin', number(data.admin), separator))
                printer.text(displayTwo('Total Bayar', number(data.price), separator))
            }
            printer.align('LT').text(displayTwo('Tunai', number(obj.cash), separator))
            printer.text(displayTwo('Kembalian', number(obj.cash - obj.sales), separator))
            printer.text(separator)
            printer.text(`Tgl. ${moment(obj.createdAt).format('DD MMMM YYYY, HH:mm:ss')}`)
            printer.text(line)
            printer.text('Kritik & Saran: 0813-9806-6633')
            printer.text('')
            printer.cut().close()
        })
        return res.json({ status: true, result: 'Cetak Berhasil' })
    } catch (error) {
        console.log(error)
        res.json({ status: false, message: 'Printer tidak terhubung!' })
    }
}

const struk = (data = {}, paper = 'small') => {
    try {
        const options = { encoding: "GB18030" /* default */ }
        const device = new escpos.USB();
        const printer = new escpos.Printer(device, options);
        device.open((error) => {
            let separator = '================================'
            let line = '--------------------------------'
            let width = separator.length - 12;
            let width2 = width - 9;
            if (paper == 'large') {
                separator = '================================================'
                line = '------------------------------------------------'
                width = separator.length - 12;
                width2 = width - 25;
            }
            const min = 1
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
                let item_name = (paper == 'small') ? data.items[i].desc.substring(0, 15) : data.items[i].desc.substring(0, 30)
                let item_qty = data.items[i].qty.toString()
                let item_sub_total = number(data.items[i].sales * data.items[i].qty)
                let qty_length = item_name.length + item_qty.length
                let disc = `(${number(data.items[i].disc)})`

                printer.text(`${item_name}${getSpace(width, qty_length)}${item_qty}  ${getSpace(width2 - min, item_sub_total.length)}${item_sub_total}`)
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
            printer.text(`${total_item}${getSpace(width, total_qty_length)}${total_qty}  ${getSpace(width2 - min, string_sub_total.toString().length)}${string_sub_total}`)

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
            } else if (data.payment_method == 'QRIS') {
                printer.text(displayTwo('QRIS', number(data.grand_total), separator))
            } else {
                printer.text(displayTwo('Non Tunai', number(data.grand_total), separator))
                if (data.bank && data.ccno) {
                    printer.text(displayTwo('Bank', data.bank, separator))
                    printer.text(displayTwo('No Kartu', data.ccno, separator))
                }
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
            printer.text(displayTwo('Jumlah PPOB', number(data.count_ppob), separator))
            printer.text(displayTwo('Total Tunai', number(data.total_cash), separator))
            printer.text(displayTwo('Total Non Tunai', number(data.total_debit), separator))
            printer.text(displayTwo('Total Nominal Transaksi', number(data.total_trans), separator))
            printer.text(displayTwo('Total Nominal Diskon', number(data.total_disc), separator))
            printer.text(displayTwo('Total Nominal Retur', number(data.total_retur), separator))
            printer.text(displayTwo('Total Nominal Sedekah', number(data.total_sedekah), separator))
            printer.text(displayTwo('Total Nominal PPOB', number(data.total_ppob), separator))
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

const transfer = (req, res) => {
    const { data, paper } = req.body
    try {
        const options = { encoding: "GB18030" /* default */ }
        const device = new escpos.USB();
        const printer = new escpos.Printer(device, options);
        device.open((error) => {
            let separator = '================================'
            let line = '--------------------------------'
            if (paper == 'large') {
                separator = '================================================'
                line = '------------------------------------------------'
            }
            printer
                .align('CT')
                .text('')
                .text(`${data.store.store_name.toUpperCase()} / ${data.store.store_phone}`)
                .text('CV. DAHANTA BERKAH RETAILINDO')
                .text('')
                .text(data.store.store_address.toUpperCase())
                .align('LT')
                .text(separator)
                .text(`Bon    : ${data.no_trans}`)
                .text(`Kasir  : ${data.fullname}`)
                .text(separator)

            printer.text(displayTwo('Produk', 'BANK TRANSFER', separator))
            printer.text(displayTwo('Kode Bank', data.bank_code, separator))
            printer.text(displayTwo('Nama Bank', data.bank_name, separator))
            printer.text(displayTwo('Nomor Rekening', data.account_number, separator))
            printer.text(displayTwo('Nama', data.account_name, separator))
            printer.text(displayTwo('Nominal Transfer', number(data.amount), separator))
            printer.text(displayTwo('Admin', number(data.sales - data.amount), separator))
            printer.text(displayTwo('Total Bayar', number(data.sales), separator))
            printer.text(displayTwo('Keterangan', data.note, separator))

            printer.text(displayTwo('Tunai', number(data.cash), separator))
            printer.text(displayTwo('Kembalian', number(data.cash - data.sales), separator))
            printer.text(separator)
            printer.text(`Tgl. ${moment(data.createdAt).format('DD MMMM YYYY, HH:mm:ss')}`)
            printer.text(line)
            printer.text('Kritik & Saran: 0813-9806-6633')
            printer.text('')
            printer.cut().close()
        })
        return res.json({ status: true, result: 'Cetak Berhasil' })
    } catch (error) {
        console.log(error)
        res.json({ status: false, message: 'Printer tidak terhubung!' })
    }
}

const post = (uri, body) => {
    return new Promise((resolve, reject) => {
        const url = `https://prod.dahanta.co.id/${uri}`
        const options = {
            url: url,
            method: 'POST',
            body: JSON.stringify(body),
            rejectUnauthorized: false,
            headers: {
                'Content-Type': 'application/json',
            }
        }
        request(options, (error, response, data) => {
            if (error) {
                console.log(error)
                return reject(error);
            }
            const result = JSON.parse(data)
            console.log(result)
            return resolve(result);
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

module.exports = { printing, printingClerk, prepaid, postpaid, transfer }