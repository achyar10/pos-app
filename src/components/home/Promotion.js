import React, { useState, useEffect } from 'react'
import { Modal, Button } from 'react-bootstrap'
import DataPromo from './DataPromo'
import axios from 'axios'

const Promotion = (props) => {

    const [disable, setDisable] = useState(false)
    const [buttonName, setButtonName] = useState('Update Promosi')
    const [promotion, setPromotion] = useState([])
    const [loading, setLoading] = useState(false)
    const token = localStorage.getItem('authJwt')
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    }

    const fetchPromo = async () => {
        setLoading(true)
        const res = await axios.get(`${process.env.REACT_APP_API_POS}/promotion`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('authJwt')}` }
        })
        setPromotion(res.data)
        setLoading(false)
    }
    
    useEffect(() => {
        if (props.fetch) {
            fetchPromo()
        }
    }, [props.fetch])

    const handleUpdate = () => {
        setButtonName('Proses Update...')
        setDisable(true)
        axios.post(`${process.env.REACT_APP_API_POS}/promotion`, {}, config)
            .then(response => {
                setButtonName('Update Produk')
                setDisable(false)
                fetchPromo()
                alert('Update promosi selesai')
            })
            .catch(err => console.log(err))
    }

    return (
        <div>
            <Modal show={props.show} onHide={props.close} backdrop="static" keyboard={false} size='lg'>
                <Modal.Header closeButton>
                    <Modal.Title>Produk Promosi
                        <Button variant="danger" className="btn-sm ml-2" onClick={handleUpdate} disabled={disable}>{buttonName}</Button>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <DataPromo promotion={promotion} loading={loading} />
                </Modal.Body>
            </Modal>
        </div>
    )
}
export default Promotion
