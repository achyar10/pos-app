import React, { useState, useEffect } from 'react'
import { Modal, Button } from 'react-bootstrap'
import DataPromo from './DataPromo'
import { promotionUrl } from '../../Endpoint'
import { fetchGet, fetchPost, Alert } from '../../helpers'

const Promotion = (props) => {

    const [disable, setDisable] = useState(false)
    const [buttonName, setButtonName] = useState('Update Promosi')
    const [promotion, setPromotion] = useState([])
    const [loading, setLoading] = useState(false)

    const fetchPromo = async () => {
        try {
            setLoading(true)
            const res = await fetchGet(promotionUrl)
            setPromotion(res)
            setLoading(false)
        } catch (error) {
            Alert('Server timeout!')
        }
    }

    useEffect(() => {
        if (props.fetch) {
            fetchPromo()
        }
    }, [props.fetch])

    const handleUpdate = async () => {
        try {
            setButtonName('Proses Update...')
            setDisable(true)
            const res = await fetchPost(promotionUrl, {})
            if (res.status) {
                setButtonName('Update Produk')
                setDisable(false)
                fetchPromo()
                Alert('Update promosi selesai')
            }
        } catch (error) {
            Alert('Server timeout!')
        }
    }

    return (
        <div>
            <Modal show={props.show} onHide={props.close} backdrop="static" keyboard={false} size='lg' animation={false}>
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
