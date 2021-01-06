import axios from 'axios'
import Swal from 'sweetalert2'
import { printStruk, printClerk } from '../Endpoint'

const Warning = (msg) => {
    Swal.fire({
        title: 'Perhatian',
        text: msg,
        showClass: {
            popup: '',
            icon: ''
        },
        hideClass: {
            popup: '',
        },
    })
}

export const numberFormat = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export const cleanSeparator = (value) => {
    const cleanValue = value.replace(/[^\d]/g, '')
    return cleanValue;
}

export const reduce = (trans) => {
    return trans.reduce((a, b) => ({ sub_total: a.sub_total + b.sub_total, qty: a.qty + b.qty, disc: a.disc + b.disc }), { sub_total: 0, qty: 0, disc: 0 })
}

export const fetchGet = async (url) => {
    try {
        const hit = await axios.get(url, { headers: { Authorization: 'Bearer ' + localStorage.getItem('authJwt') } })
        return hit.data
    } catch (error) {
        console.log(error)
        Warning('server timeout!')
    }
}

export const fetchPost = async (url, body) => {
    try {
        const hit = await axios.post(url, body, { headers: { Authorization: 'Bearer ' + localStorage.getItem('authJwt') } })
        return hit.data
    } catch (error) {
        console.log(error)
        Warning('server timeout!')
    }
}

export const fetchPut = async (url, body) => {
    try {
        const hit = await axios.put(url, body, { headers: { Authorization: 'Bearer ' + localStorage.getItem('authJwt') } })
        return hit.data
    } catch (error) {
        console.log(error)
        Warning('server timeout!')
    }
}

export const fetchDelete = async (url, body) => {
    try {
        const hit = await axios.delete(url, { headers: { Authorization: 'Bearer ' + localStorage.getItem('authJwt') }, data: body })
        return hit.data
    } catch (error) {
        console.log(error)
        Warning('server timeout!')
    }
}

export const printing = async (transactionId) => {
    try {
        const paper = localStorage.getItem('paper') || 'small'
        const config = {
            headers: { Authorization: `Bearer ${localStorage.getItem('authJwt')}` }
        }
        const hit = await axios.post(printStruk, { transactionId, paper }, config)
        if (hit.data.status) {
            Warning(hit.data.result)
        } else {
            Warning(hit.data.message)
        }
    } catch (error) {
        console.log(error)
        Warning('Server time out!')
    }
}

export const printingClerk = async (clerkId) => {
    try {
        const config = {
            headers: { Authorization: `Bearer ${localStorage.getItem('authJwt')}` }
        }
        const hit = await axios.post(printClerk, { clerkId }, config)
        if (hit.data.status) {
            Warning(hit.data.result)
        } else {
            Warning(hit.data.message)
        }
    } catch (error) {
        console.log(error)
        Warning('Server time out!')
    }
}

export const Alert = (msg) => {
    Swal.fire({
        title: 'Perhatian',
        text: msg,
        showClass: {
            popup: '',
            icon: ''
        },
        hideClass: {
            popup: '',
        },
    })
}

export const Info = (html) => {
    Swal.fire({
        title: 'Informasi',
        html: html,
        showClass: {
            popup: '',
            icon: ''
        },
        hideClass: {
            popup: '',
        },
    })
}