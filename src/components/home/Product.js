import React, { useState, useEffect } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { numberFormat, fetchPost, Alert } from '../../helpers'
import Promotion from './Promotion'
import { useSelector, useDispatch } from 'react-redux'
import { scanUrl, itemUrl } from '../../Endpoint'
import { debounce } from 'lodash'

const Product = (props) => {

    const [product, setProduct] = useState([])
    const [search, setSearch] = useState('')
    const [fetch, setFetch] = useState(false)
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

    const handleProduct = debounce((val) => {
        getProduct(val)
    }, 1000)

    const getProduct = async (val) => {
        try {
            setSearch(val)
            const hit = await fetchPost(itemUrl, { q: val })
            if (hit.status) {
                setProduct(hit.data)
            } else {
                Alert(hit.message)
            }
        } catch (error) {
            Alert('Server timeout!')
        }
    }

    const scanner = async barcode => {
        try {
            const hit = await fetchPost(scanUrl, { barcode })
            if (hit.status) {
                const item = hit.data
                const index = trans.findIndex(e => e.productId === item.productId)
                if (index === -1) {
                    dispatch({
                        type: 'TRANS', payload: [...trans, {
                            productId: item.productId,
                            barcode: item.product.barcode,
                            desc: item.product.desc,
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
                Alert('Data produk tidak ditemukan!')
            }
        } catch (error) {
            Alert('Server timeout!')
        }
    }

    return (
        <>
            <Modal show={props.show} onHide={props.close} backdrop="static" keyboard={false} size='lg' animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Semua Produk
                        <Button variant="warning" className="btn-sm ml-2 text-white" onClick={handleShow}>{'Promo'}</Button>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="input-group mb-3">
                        <div className="input-group-prepend">
                            <button className="btn btn-info" type="button"><span
                                className="fa fa-search"></span></button>
                        </div>
                        <input type="text" className="form-control" placeholder="Ketik nama produk..." onChange={e => handleProduct(e.target.value)} />
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
                                        <td>{el.product.barcode}</td>
                                        <td>{el.product.desc}</td>
                                        <td>{numberFormat(el.sales)}</td>
                                        <td><button className="btn btn-sm btn-primary" onClick={() => props.close(scanner(el.product.barcode))}>Pilih</button></td>
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