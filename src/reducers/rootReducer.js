const initialState = {
    trans: [],
    total: 0,
}

const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'TRANS':
            return {
                ...state,
                trans: action.payload,
            }
        case 'TOTAL':
            return {
                ...state,
                total: action.payload,
            }
        default:
            break;
    }
    return state
}

export default rootReducer