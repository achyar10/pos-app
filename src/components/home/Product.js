import React, { useState, useEffect } from 'react'
import { Modal, Button } from 'react-bootstrap'
import axios from 'axios'

const Product = (props) => {

    const [product, setProduct] = useState([])
    const [search, setSearch] = useState('')

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
                                        <td>{el.sales}</td>
                                        <td><button className="btn btn-sm btn-primary" onClick={props.close}>Pilih</button></td>
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
        </>

    )
}

export default Product