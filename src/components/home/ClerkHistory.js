import React, { useState, useEffect } from 'react'
import { Modal } from 'react-bootstrap'
import { clerkUrl } from '../../Endpoint'
import { fetchGet, printingClerk, numberFormat, Alert } from '../../helpers'

const ClerkHistory = (props) => {

    const [clerk, setClerk] = useState([])

    const fetchClerk = async () => {
        try {
            const res = await fetchGet(clerkUrl)
            setClerk(res.data)
        } catch (error) {
            Alert('Server timeout!')
        }
    }

    useEffect(() => {
        if (props.fetch) {
            fetchClerk()
        }
    }, [props.fetch])

    return (
        <div>
            <Modal show={props.show} onHide={props.close} backdrop="static" keyboard={false} size='md' animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Histori Clerk Hari ini
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="table-responsive">
                        <table className="table table-sm table-hover table-striped">
                            <thead className="thead-dark">
                                <tr>
                                    <th>No</th>
                                    <th>Total Nominal</th>
                                    <th>Total Setoran</th>
                                    <th>Kasir</th>
                                    <th>Opsi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {clerk.map((el, i) =>
                                    <tr key={i}>
                                        <td>{i + 1}</td>
                                        <td>{numberFormat(el.grand_total)}</td>
                                        <td>{numberFormat(el.setoran)}</td>
                                        <td>{el.user.name}</td>
                                        <td><button className="btn btn-sm btn-success" onClick={() => printingClerk(el.id)}>Cetak</button></td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}
export default ClerkHistory
