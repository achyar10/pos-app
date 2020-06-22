import React, { useEffect } from 'react'
import axios from 'axios'
import { withRouter, Redirect } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { getJwt } from '../../helpers'

const Auth = (props) => {

    // const [user, setUser] = useState('')
    const user = useSelector(state => state.session)
    const dispatch = useDispatch()

    useEffect(() => {
        const getUser = async () => {
            const jwt = getJwt()
            if (!jwt) {
                dispatch({ type: 'SESSION', payload: null })
                return
            }
            const URL = `${process.env.REACT_APP_API_POS}/auth/check`
            const response = await axios.get(URL, { headers: { Authorization: getJwt() } })
            if (response) {
                dispatch({ type: 'SESSION', payload: response.data.data })
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