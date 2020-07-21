import React, { useState, useEffect } from 'react'
import { fetchPost, Alert } from '../../helpers'
import { login, checkEod } from '../../Endpoint'
import Logo from '../../assets/img/logo.png'
import './login.css'

const Login = (props) => {

    const [nik, setNik] = useState('')
    const [password, setPassword] = useState('')

    useEffect(() => {
        document.title = 'Login'
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (nik === '') return Alert('Nik cannot be empty')
        if (password === '') return Alert('Password cannot be empty')
        const response = await fetchPost(login, { nik, password })
        if (response.status) {
            localStorage.setItem('authJwt', response.data.token)
            const resEod = await fetchPost(checkEod, {})
            if (resEod.status) {
                props.history.push('/')
            } else {
                localStorage.removeItem('authJwt')
                Alert(resEod.message)
            }
        } else {
            Alert(response.message)
        }
    }

    if (localStorage.getItem('authJwt')) {
        props.history.push('/')
    }

    return (
        <div className="bck">
            <div className="container-login">
                <form className="form-signin" onSubmit={handleSubmit}>
                    <div className="text-center mb-4">
                        <img className="mb-4" src={Logo} alt=""
                            height="100" />
                        <h1 className="h3 mb-3 font-weight-normal text-white">Dahanta POS</h1>
                    </div>
                    <div className="form-label-group">
                        <input type="text" id="nik" name="nik" className="form-control form-control-lg" placeholder="NIK" value={nik} onChange={e => setNik(e.target.value)} autoFocus />
                        <label htmlFor="nik">NIK</label>
                    </div>
                    <div className="form-label-group">
                        <input type="password" id="password" name="password" className="form-control form-control-lg" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                        <label htmlFor="password">Password</label>
                    </div>
                    <button className="btn btn-lg btn-danger btn-block" type="submit">Login</button>
                    <p className="mt-5 mb-3 text-muted text-center">Alright Reserved {new Date().getFullYear()}</p>
                </form>
            </div>
        </div>
    )
}
export default Login