const initialState = {
    trans: [],
    member: null,
    clerk: false,
    hold: false
}

const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'TRANS':
            return {
                ...state,
                trans: action.payload,
            }
        case 'MEMBER':
            return {
                ...state,
                member: action.payload,
            }
        case 'CLERK':
            return {
                ...state,
                clerk: action.payload,
            }
        case 'HOLD':
            return {
                ...state,
                hold: action.payload,
            }
        default:
            break;
    }
    return state
}

export default rootReducer