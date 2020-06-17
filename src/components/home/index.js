import React, { useEffect } from 'react'
import Navbar from '../navbar'
import Pay from './Pay'
import Menu from './Menu'

const Home = (props) => {

    const title = 'Home'

    useEffect(() => {
        document.title = title
    })

    const handleLogout = () => {
        localStorage.removeItem('authJwt')
        props.history.push('/login')
    }

    const handleFinish = () => {
        window.location.href = '/'
    }

    return (
        <div className="bck">
            <Navbar logout={handleLogout} />
            <div className="container-fluid">
                <div className="row mt-2">
                    <div className="col-md-9">
                        <Pay />
                    </div>
                    <div className="col-md-3">
                        <Menu redirect={handleFinish} />
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Home