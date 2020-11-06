import React, { useState, useEffect } from 'react'
import { Modal } from 'react-bootstrap'
import DataPromo from './DataPromo'
import { promotionUrl } from '../../Endpoint'
import { fetchGet, Alert } from '../../helpers'

const Promotion = (props) => {

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

    return (
        <div>
            <Modal show={props.show} onHide={props.close} backdrop="static" keyboard={false} size='lg' animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Produk Promosi
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
