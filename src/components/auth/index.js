import React, { useEffect } from 'react'
import { fetchGet } from '../../helpers'
import { check } from '../../Endpoint'
import { withRouter, Redirect } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

const Auth = (props) => {

    const user = useSelector(state => state.session)
    const dispatch = useDispatch()

    useEffect(() => {
        const getUser = async () => {
            const jwt = 'Bearer ' + localStorage.getItem('authJwt')
            if (!jwt) {
                dispatch({ type: 'SESSION', payload: null })
                return
            }
            const response = await fetchGet(check)
            if (response.status) {
                dispatch({ type: 'SESSION', payload: response.data })
            }
        }
        getUser()
    }, [dispatch])

    if (user === undefined || user === null) {
        localStorage.removeItem('authJwt')
        return (<Redirect to={'/login'} />)
    }
    return props.children
}
export default withRouter(Auth)