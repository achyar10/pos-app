import React, { useState, useEffect } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { numberFormat } from '../../helpers'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'

const Product = (props) => {

    const [product, setProduct] = useState([])
    const [search, setSearch] = useState('')
    const [disable, setDisable] = useState(false)
    const [buttonName, setButtonName] = useState('Update Produk')
    const trans = useSelector(state => state.trans)
    const dispatch = useDispatch()

    useEffect(() => {

    }, [search])

    const handleProduct = (e) => {
        setSearch(e.target.value)
        getProduct()
    }

    const getProduct = async () => {
        try {
            const q = search
            const config = {
                headers: { Authorization: `Bearer ${localStorage.getItem('authJwt')}` }
            }
            const hit = await axios.post(`${process.env.REACT_APP_API_POS}/item/list`, { q }, config)
            if (hit.data.status) {
                setProduct(hit.data.data)
            } else {
                alert(hit.data.message)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const scanner = async barcode => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${localStorage.getItem('authJwt')}` }
            }
            const hit = await axios.post(`${process.env.REACT_APP_API_POS}/item/scan`, { barcode }, config)
            if (hit.data.status) {
                const item = hit.data.data
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
                            disc: 0,
                            sub_total: item.sales - item.disc
                        }]
                    })
                } else {
                    let copyData = [...trans]
                    copyData[index].qty += 1
                    copyData[index].sub_total = copyData[index].sales * copyData[index].qty
                    dispatch({ type: 'TRANS', payload: copyData })
                }
            } else {
                alert('Data produk tidak ditemukan!')
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleUpdate = () => {
        setButtonName('Proses Update...')
        setDisable(true)
        const token = localStorage.getItem('authJwt')
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        }
        axios.post(`${process.env.REACT_APP_API_POS}/item/update`, { token }, config)
            .then(response => {
                setButtonName('Update Produk')
                setDisable(false)
                alert('Update produk selesai')
            })
            .catch(err => console.log(err))
    }


    return (
        <>
            <Modal show={props.show} onHide={props.close} backdrop="static" keyboard={false} size='lg'>
                <Modal.Header closeButton>
                    <Modal.Title>Semua Produk</Modal.Title>
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
                    <Button variant="danger" className="ml-2" onClick={handleUpdate} disabled={disable}>{buttonName}</Button>
                </Modal.Footer>
            </Modal>
        </>

    )
}

export default Product