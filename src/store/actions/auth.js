import * as actionTypes from './actionTypes';
import axios from 'axios';

const AUTH_KEY = process.env.REACT_APP_BURGER_API_KEY;

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    }
}
export const authFail = (err) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: err
    }
}
export const authSuccess = (authData) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        authData: authData
    }
}

export const logout = (data) => {
    localStorage.removeItem('dataAuth')
    return {
        type: actionTypes.AUTH_LOGOUT
    }
}

export const checkAuthTimeout = (expirationTime) => {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout())
        }, expirationTime * 1000)
    }
}

export const authenticate = (email, password, isLogin) => {
    return dispatch => {
        dispatch(authStart());
        const dataAuthenticate = {
            email: email,
            password: password,
            returnSecureToken: true
        }
        let url = isLogin
            ? "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key="
            : 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=';
        axios.post(url + AUTH_KEY, dataAuthenticate)
            .then(response => {
                const expirationDate = new Date().getTime() + response.data.expiresIn * 1000
                const dataAuth = {
                    token: response.data.idToken,
                    userId: response.data.localId,
                    expirationDate: expirationDate
                }
                localStorage.setItem('dataAuth', JSON.stringify(dataAuth))
                dispatch(authSuccess(response.data))
                dispatch(checkAuthTimeout(response.data.expiresIn))
                dispatch(authCheckLocalStorage())

            })
            .catch(err => {
                dispatch(authFail(err.response.data.error.message))
            });
    }
}

export const authSetPathRedeirect = (path) => {
    return {
        type: actionTypes.AUTH_SET_PATH_REDIRECT,
        path: path
    }
}

export const authAutologin = (localData) => {
    return dispatch => {
        if (localData.expirationDate <= new Date().getTime()) {
            dispatch(logout())
        } else {
            const dataLogin = {
                idToken: localData.token,
                localId: localData.userId
            }
            dispatch(authSuccess(dataLogin))
            dispatch(checkAuthTimeout((localData.expirationDate - new Date().getTime()) / 1000))
        }
    }
}

export const authCheckLocalStorage = () => {
    return dispatch => {
        const localData = JSON.parse(localStorage.getItem('dataAuth'))
        if (!localData) {
            dispatch(logout())
        } else {
            dispatch(authAutologin(localData))
        }

    }
}


