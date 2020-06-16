import React, { useState, useEffect } from 'react'
import axios from 'axios'
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
        if (nik === '') return alert('Nik cannot be empty')
        if (password === '') return alert('Password cannot be empty')
        const URL = `${process.env.REACT_APP_API_URL}/auth/login`
        try {
            const response = await axios.post(URL, { nik, password })
            if (response.data.status) {
                localStorage.setItem('authJwt', response.data.data.token)
                props.history.push('/')
            } else {
                alert(response.data.message)
            }
        } catch (error) {
            console.log(error)
        }
    }

    if (localStorage.getItem('authJwt')) {
        props.history.push('/')
    }

    return (
        <form className="form-signin" onSubmit={handleSubmit}>
            <div className="text-center mb-4">
                <img className="mb-4" src={Logo} alt=""
                    height="100" />
                <h1 className="h3 mb-3 font-weight-normal">Dahanta POS</h1>
            </div>
            <div className="form-label-group">
                <input type="text" id="nik" name="nik" className="form-control form-control-lg" placeholder="NIK" value={nik} onChange={e => setNik(e.target.value)} autoFocus />
                <label htmlFor="nik">NIK</label>
            </div>
            <div className="form-label-group">
                <input type="password" id="password" name="password" className="form-control form-control-lg" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                <label htmlFor="password">Password</label>
            </div>
            <button className="btn btn-lg btn-primary btn-block" type="submit">Login</button>
            <p className="mt-5 mb-3 text-muted text-center">Alright Reserved {new Date().getFullYear()}</p>
        </form>
    )
}
export default Login