const API = process.env.REACT_APP_API_URL
const POS = process.env.REACT_APP_API_POS

export const login = API + '/auth/login'
export const check = API + '/auth/pos/check'
export const checkEod = API + '/store/eod/check'
export const authorizes = API + '/auth/authorize'
export const clerks = API + '/trans/pos/clerk'
export const clerkUrl = API + '/clerk/pos/history'
export const histories = API + '/trans/pos/history'
export const memberListUrl = API + '/member/list'
export const transUrl = API + '/trans/pos'
export const scanUrl = API + '/item/pos/scan'
export const returs = API + '/trans/pos/retur'
export const smartMemberUrl = API + '/member/check'
export const scanMemberUrl = API + '/member/scan'
export const scanVoucherUrl = API + '/voucher/check'
export const payVoucherUrl = API + '/voucher'
export const itemUrl = API + '/item/pos/list'
export const holdUrl = API + '/hold/pos'
export const promotionUrl = API + '/promotion/pos'
export const qrisSnap = API + '/qris/snap'
export const qrisWaiting = API + '/qris/waiting'

export const printStruk = POS + '/print/struk'
export const printClerk = POS + '/print/clerk'

