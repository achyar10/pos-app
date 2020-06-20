import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { withRouter, Redirect } from 'react-router-dom'
import { getJwt } from '../../helpers'

const Auth = (props) => {

    const [user, setUser] = useState('')

    useEffect(() => {
        getUser()
    }, [])

    const getUser = async () => {
        const jwt = getJwt()
        if (!jwt) {
            setUser(null)
            return
        }
        const URL = `${process.env.REACT_APP_API_POS}/auth/check`
        const response = await axios.get(URL, { headers: { Authorization: getJwt() } })
        if (response) {
            setUser(response.data.data)
        }
    }

    if (user === undefined || user === null) {
        localStorage.removeItem('authJwt')
        return (<Redirect to={'/login'} />)
    }
    return props.children
}
export default withRouter(Auth)