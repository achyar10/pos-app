import axios from 'axios'

export const getJwt = () => {
    return 'Bearer ' + localStorage.getItem('authJwt');
};

export const numberFormat = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export const reduce = (trans) => {
    return trans.reduce((a, b) => ({ sub_total: a.sub_total + b.sub_total, qty: a.qty + b.qty }), { sub_total: 0, qty: 0 })
}

export const printing = async (transactionId) => {
    try {
        const config = {
            headers: { Authorization: `Bearer ${localStorage.getItem('authJwt')}` }
        }
        const hit = await axios.post(`${process.env.REACT_APP_API_POS}/print/struk`, { transactionId }, config)
        if (hit.data.status) {
            alert(hit.data.result)
        } else {
            alert(hit.data.message)
        }
    } catch (error) {
        console.log(error)
    }
}