export const getJwt = () => {
    return 'Bearer ' + localStorage.getItem('authJwt');
};

export const numberFormat = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export const reduce = (trans) => {
    return trans.reduce((a, b) => ({ sub_total: a.sub_total + b.sub_total, qty: a.qty + b.qty }), { sub_total: 0, qty: 0 })
}