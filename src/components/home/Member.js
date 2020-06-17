import React, { useState, useEffect } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import moment from 'moment'

const Member = (props) => {

    const [members, setMember] = useState([])
    const [search, setSearch] = useState('')
    const dispatch = useDispatch()
    useEffect(() => {

    }, [search])

    const handleMember = (e) => {
        setSearch(e.target.value)
        getMember()
    }

    const getMember = async () => {
        try {
            const q = search
            const config = {
                headers: { Authorization: `Bearer ${localStorage.getItem('authJwt')}` }
            }
            const hit = await axios.post(`${process.env.REACT_APP_API_URL}/member/list`, { q }, config)
            if (hit.data.status) {
                setMember(hit.data.data)
            } else {
                alert(hit.data.message)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const selectMember = (el) => {
        dispatch({type: 'MEMBER', payload: {
            memberId: el.id,
            member_no: el.phone,
            member_fullname: el.name
        }})
    }

    return (
        <>
            <Modal show={props.show} onHide={props.close} backdrop="static" keyboard={false} size='lg'>
                <Modal.Header closeButton>
                    <Modal.Title>Daftar Member</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="input-group mb-3">
                        <div className="input-group-prepend">
                            <button className="btn btn-info" type="button"><span
                                className="fa fa-search"></span></button>
                        </div>
                        <input type="text" className="form-control" placeholder="Ketik nama member..." onChange={e => handleMember(e)} />
                    </div>
                    <div className="table-responsive">
                        <table className="table table-sm table-hover table-striped">
                            <thead className="thead-dark">
                                <tr>
                                    <th>No</th>
                                    <th>Nama</th>
                                    <th>No Member</th>
                                    <th>Tanggal Lahir</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {members.map((el, i) =>
                                    <tr key={i}>
                                        <td>{i + 1}</td>
                                        <td>{el.name}</td>
                                        <td>{el.phone}</td>
                                        <td>{moment(el.date).format('DD MMM YYYY')}</td>
                                        <td><button className="btn btn-success btn-sm" onClick={() => selectMember(el)}>Pilih</button></td>
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
export default Member