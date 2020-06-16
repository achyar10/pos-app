
const Logout = (props) => {

    localStorage.removeItem('authJwt')
    return props.history.push('/login')

}
export default Logout