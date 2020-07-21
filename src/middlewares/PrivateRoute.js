import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { check } from '../Endpoint'
import { fetchGet, Alert } from '../helpers'
import { useDispatch } from 'react-redux'

const PrivateRoute = (props) => {

    const dispatch = useDispatch()

    const checkAuth = async () => {
        try {
            const hit = await fetchGet(check)
            if (hit.status) {
                dispatch({ type: 'SESSION', payload: hit.data })
                return true
            } else {
                localStorage.removeItem('authJwt')
                dispatch({ type: 'SESSION', payload: null })
                return false
            }
        } catch (error) {
            console.log(error)
            Alert('Server timeout!')
        }
    }

    if (!localStorage.getItem('authJwt')) {
        return (<Redirect to="/login" />)
    } else {
        const isAuth = checkAuth()
        if (isAuth) {
            return (<Route {...props} />)
        } else {
            return (<Redirect to="/login" />)
        }
    }

}
export default PrivateRoute