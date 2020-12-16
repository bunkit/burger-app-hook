import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';

const initialState = {
    token: null,
    userId: null,
    error: null,
    loading: false,
    pathToRedirect: '/'
}
const authStart = (state, action) => {
    return updateObject(state, { loading: true, error: null })
}
const authSucces = (state, action) => {
    return updateObject(state, {
        loading: false,
        error: null,
        token: action.authData.idToken,
        userId: action.authData.localId
    })
}
const authFail = (state, action) => {
    return updateObject(state, { loading: false, error: action.error })
}

const authLogout = (state, action) => {
    return updateObject(state, {
        loading: false,
        token: null,
        userId: null
    })
}

const authSetPathRedeirect = (state, action) => {
    return updateObject(state, { pathToRedirect: action.path })
}
export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.AUTH_START: return authStart(state, action)
        case actionTypes.AUTH_SUCCESS: return authSucces(state, action)
        case actionTypes.AUTH_FAIL: return authFail(state, action)
        case actionTypes.AUTH_LOGOUT: return authLogout(state, action)
        case actionTypes.AUTH_SET_PATH_REDIRECT: return authSetPathRedeirect(state, action)
        default: return { ...state }
    }
}

export default reducer
