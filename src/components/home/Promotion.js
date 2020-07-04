import React, { useState, useEffect } from 'react'
import { Modal, Button } from 'react-bootstrap'
import DataPromo from './DataPromo'
import { promotionUrl } from '../../Endpoint'
import { fetchGet, fetchPost } from '../../helpers'

const Promotion = (props) => {

    const [disable, setDisable] = useState(false)
    const [buttonName, setButtonName] = useState('Update Promosi')
    const [promotion, setPromotion] = useState([])
    const [loading, setLoading] = useState(false)

    const fetchPromo = async () => {
        setLoading(true)
        const res = await fetchGet(promotionUrl)
        setPromotion(res)
        setLoading(false)
    }

    useEffect(() => {
        if (props.fetch) {
            fetchPromo()
        }
    }, [props.fetch])

    const handleUpdate = async () => {
        setButtonName('Proses Update...')
        setDisable(true)
        const res = await fetchPost(promotionUrl, {})
        if (res.status) {
            setButtonName('Update Produk')
            setDisable(false)
            fetchPromo()
            alert('Update promosi selesai')
        }
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
