const initialState = {
    trans: [],
    member: null,
    clerk: false
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
        default:
            break;
    }
    return state
}

export default rootReducer