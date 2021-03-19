import React, { useState, useEffect } from 'react'
import { Modal } from 'react-bootstrap'
import { numberFormat, fetchPost, fetchGet, cleanSeparator, Alert } from '../../../helpers'
import { transferBank, inquiryAccount, bankList, transferStatus, printBankStruk } from '../../../Endpoint'
import NumberFormat from 'react-number-format';
import '../home.css'


const Transfer = (props) => {

    const [disabled, setDisabled] = useState(false)
    const [phone, setPhone] = useState('')
    const [amount, setAmount] = useState(0)
    const [obj, setObj] = useState(null)
    const [code, setCode] = useState(null)
    const [bankName, setBankName] = useState(null)
    const [note, setNote] = useState('')
    const [bank, setBank] = useState([])
    const [cash, setCash] = useState(0)
    const [print, setPrint] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const hit = await fetchGet(bankList)
                setBank(hit.data)
            } catch (error) {
                Alert('Server timeout!')
            }
        }
        if (props.fetching) {
            fetchData()
        }
        if (props.close) {
            setObj(null)
            setPrint(null)
        }
    }, [props, phone])

    const getBank = (e) => {
        const index = e.nativeEvent.target.selectedIndex
        setBankName(e.nativeEvent.target[index].text)
        setCode(e.target.value)
    }

    const handlePay = async () => {
        try {
            setDisabled(true)
            const body = {
                no_trans: localStorage.getItem('bankInv'),
                account_number: obj.account_number,
                account_name: obj.account_name,
                bank_code: obj.bank_code,
                bank_name: bankName,
                hpp: obj.hpp,
                sales: obj.sales,
                amount, note, cash,
            }
            const hit = await fetchPost(transferBank, body)
            if (hit.status) {
                Alert('Transfer Berhasil')
                setObj(null)
                setPrint(hit.data.no_trans)
            } else {
                Alert(hit.message)
            }
            setDisabled(false)
        } catch (error) {
            Alert('Server timeout!')
        }
    }

    const inquiry = async () => {
        try {
            setDisabled(true)
            const hit = await fetchPost(inquiryAccount, { bank_code: code, account_number: phone, amount })
            if (hit.status) {
                setObj(hit.data)
            } else {
                Alert(hit.message)
                setObj(null)
            }
            setDisabled(false)
        } catch (error) {
            Alert('Server timeout!')
        }
    }

    const handleCash = (val) => {
        setCash(val)
        if (val >= obj.sales) {
            setDisabled(false)
        } else {
            setDisabled(true)
        }
    }

    const handlePrint = async () => {
        try {
            const hit = await fetchPost(transferStatus, { no_trans: print })
            if (hit.status) {
                const paper = localStorage.getItem('paper') || 'small'
                const print = await fetchPost(printBankStruk, { data: hit.data, paper })
                if (print.status) {
                    Alert('Cetak Berhasil')
                } else {
                    Alert(print.message)
                }
            } else {
                Alert(hit.message)
            }
        } catch (error) {
            Alert('Server timeout!')
        }
    }


    return (
        <div>
            <Modal show={props.show} onHide={props.close} backdrop="static" keyboard={false} size='md' animation={false}>
                <Modal.Header closeButton>
                    Transfer Antar Bank
                </Modal.Header>
                <Modal.Body>
                    <div className="form-group">
                        <label>Bank Tujuan</label>
                        <select className="form-control" onChange={(e) => getBank(e)}>
                            <option value="">--- Pilih Bank ---</option>
                            {bank.map((el, i) =>
                                <option key={i} value={el.bank_code}>{el.bank_name}</option>
                            )}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Nomor Rekening</label>
                        <input type="text" className="form-control" placeholder="Masukan nomor member..." onChange={(e) => setPhone(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Nominal Transfer</label>
                        <NumberFormat className="form-control" onChange={e => setAmount(cleanSeparator(e.target.value))} thousandSeparator={true} prefix={'Rp. '} />
                    </div>
                    {(!print) ?
                        <button className="btn btn-danger" disabled={disabled} onClick={inquiry}>Cek Rekening</button> :
                        <button className="btn btn-success btn-block" onClick={handlePrint}>Cetak</button>
                    }

                    <hr />
                    {obj && <div><table className="table table-borderless table-sm table-hover">
                        <tbody>
                            <tr>
                                <td>Nama</td>
                                <td className="font-weight-bold">{obj.account_name}</td>
                            </tr>
                            <tr>
                                <td>Total Bayar</td>
                                <td className="font-weight-bold">{numberFormat(obj.sales)}</td>
                            </tr>
                        </tbody>
                    </table>
                        <hr />
                        <div className="form-group">
                            <label>Keterangan</label>
                            <input type="text" className="form-control" placeholder="Masukan keterangan transfer..." onChange={(e) => setNote(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Uang Tunai</label>
                            <NumberFormat className="form-control" onChange={e => handleCash(cleanSeparator(e.target.value))} thousandSeparator={true} prefix={'Rp. '} />
                        </div>
                        <button className="btn btn-success btn-block" disabled={disabled} onClick={handlePay}>Transfer</button>
                    </div>}

                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default Transfer