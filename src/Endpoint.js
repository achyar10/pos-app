const API = process.env.REACT_APP_API_URL
const POS = process.env.REACT_APP_API_POS

export const login = API + '/auth/login'
export const check = POS + '/auth/check'
export const checkEod = API + '/store/eod/check'
export const authorizes = API + '/auth/authorize'
export const clerks = POS + '/clerk'
export const histories = POS + '/transaction/history'
export const returs = POS + '/transaction/retur'
export const holdUrl = POS + '/hold'
export const memberListUrl = API + '/member/list'
export const transUrl = POS + '/transaction/create'
export const scanUrl = POS + '/item/scan'
export const itemUrl = POS + '/item/list'
export const itemUpdateUrl = POS + '/item/update'
export const promotionUrl = POS + '/promotion'