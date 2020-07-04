import React, { useState, useEffect } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { numberFormat, fetchPost } from '../../helpers'
import Promotion from './Promotion'
import { useSelector, useDispatch } from 'react-redux'
import { scanUrl, itemUpdateUrl, itemUrl } from '../../Endpoint'

const Product = (props) => {

    const [product, setProduct] = useState([])
    const [search, setSearch] = useState('')
    const [disable, setDisable] = useState(false)
    const [fetch, setFetch] = useState(false)
    const [buttonName, setButtonName] = useState('Update Produk')
    const trans = useSelector(state => state.trans)
    const dispatch = useDispatch()
    const [show, setShow] = useState(false)
    const handleClose = () => {
        setShow(false)
        setFetch(false)
    }
    const handleShow = () => {
        setShow(true)
        setFetch(true)
    }

    useEffect(() => {

    }, [search])

    const handleProduct = (e) => {
        setSearch(e.target.value)
        getProduct()
    }

    const getProduct = async () => {
        const q = search
        const hit = await fetchPost(itemUrl, { q })
        if (hit.status) {
            setProduct(hit.data)
        } else {
            alert(hit.message)
        }
    }

    const scanner = async barcode => {
        const hit = await fetchPost(scanUrl, { barcode })
        if (hit.status) {
            const item = hit.data
            const index = trans.findIndex(e => e.productId === item.productId)
            if (index === -1) {
                dispatch({
                    type: 'TRANS', payload: [...trans, {
                        productId: item.productId,
                        barcode: item.barcode,
                        desc: item.desc,
                        hpp: item.hpp,
                        sales: item.sales,
                        qty: 1,
                        valueDisc: item.disc,
                        disc: item.disc,
                        sub_total: item.sales - item.disc
                    }]
                })
            } else {
                let copyData = [...trans]
                copyData[index].qty += 1
                copyData[index].disc = copyData[index].valueDisc * copyData[index].qty
                copyData[index].sub_total = (copyData[index].sales * copyData[index].qty) - copyData[index].disc
                dispatch({ type: 'TRANS', payload: copyData })
            }
        } else {
            alert('Data produk tidak ditemukan!')
        }
    }

    const handleUpdate = async () => {
        setButtonName('Proses Update...')
        setDisable(true)
        const token = localStorage.getItem('authJwt')
        const res = await fetchPost(itemUpdateUrl, { token })
        if (res.status) {
            setButtonName('Update Produk')
            setDisable(false)
            alert('Update produk selesai')
        }
    }


    return (
        <>
            <Modal show={props.show} onHide={props.close} backdrop="static" keyboard={false} size='lg'>
                <Modal.Header>
                    <Modal.Title>Semua Produk
                        <Button variant="danger" className="btn-sm ml-2" onClick={handleUpdate} disabled={disable}>{buttonName}</Button>
                        <Button variant="warning" className="btn-sm ml-2 text-white" onClick={handleShow}>{'Promo'}</Button>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="input-group mb-3">
                        <div className="input-group-prepend">
                            <button className="btn btn-info" type="button"><span
                                className="fa fa-search"></span></button>
                        </div>
                        <input type="text" className="form-control" placeholder="Ketik nama produk..." onChange={e => handleProduct(e)} />
                    </div>
                    <div className="table-responsive">
                        <table className="table table-sm table-hover table-striped">
                            <thead className="thead-dark">
                                <tr>
                                    <th>Barcode Produk</th>
                                    <th>Nama Produk</th>
                                    <th>Harga</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {product.map((el, i) =>
                                    <tr key={i}>
                                        <td>{el.barcode}</td>
                                        <td>{el.desc}</td>
                                        <td>{numberFormat(el.sales)}</td>
                                        <td><button className="btn btn-sm btn-primary" onClick={e => scanner(el.barcode)}>Pilih</button></td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={props.close}>Tutup</Button>
                </Modal.Footer>
            </Modal>
            <Promotion show={show} onHide={handleClose} close={handleClose} fetch={fetch} />
        </>

    )
}

export default Product