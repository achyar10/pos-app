import React, { useState } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { Alert } from '../../helpers'

const Setting = (props) => {

    const [paper, setPaper] = useState(localStorage.getItem('paper'))

    const handleSave = () => {
        localStorage.setItem('paper', paper)
        Alert('Berhasil disimpan')
    }

    return (
        <div>
            <Modal show={props.show} onHide={props.close} backdrop="static" keyboard={false} size='md' animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Setting POS</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="form-group">
                        <label>Sambungan Printer <span className="text-danger">*</span></label>
                        <input type="text" className="form-control" value="USB" disabled />
                    </div>
                    <div className="form-group">
                        <label>Kertas Printer <span className="text-danger">*</span></label><br />
                        <label className="mr-3">
                            <input type="radio" name="paper" value="small" className="paper" onChange={(e) => setPaper(e.target.value)} checked={paper === 'small'} /> 58MM
                        </label>
                        <label>
                            <input type="radio" name="paper" value="large" onChange={(e) => setPaper(e.target.value)} className="paper" checked={paper === 'large'} /> 80MM
                        </label>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={handleSave}>Simpan</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default Setting
