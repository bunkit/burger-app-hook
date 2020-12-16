import * as actionTypes from './actionTypes';
import axios from '../../axios-orders'
export const purchaseBurgerSuccess = (id, orderData) => {
    return {
        type: actionTypes.PURCHASE_BURGER_SUCCESS,
        orderId: id,
        orderData: orderData
    }
}

export const purchaseBurgerFail = (error) => {
    return {
        type: actionTypes.PURCHASE_BURGER_FAIL,
        error: error
    }
}

export const purchaseBurgerStart = () => {
    return {
        type: actionTypes.PURCHASE_BURGER_START
    }
}
export const purchaseInit = () => {
    return {
        type: actionTypes.PURCHASE_INIT
    }
}

export const purchaseBurger = (orderData, token) => {
    return dispatch => {
        let getToken = token ? '?auth=' + token : '';
        dispatch(purchaseBurgerStart())
        axios.post('/orders.json' + getToken, orderData)
            .then(response => {
                dispatch(purchaseBurgerSuccess(response.data.name, orderData))
            })
            .catch(error => {
                dispatch(purchaseBurgerFail('Data cannot be submitted'))
            })
    }
}


export const fetchOrderSuccess = (orders) => {
    return {
        type: actionTypes.FETCH_ORDER_SUCCESS,
        orders: orders
    }
}

export const fetchOrderFail = (error) => {
    return {
        type: actionTypes.FETCH_ORDER_FAIL,
        error: error
    }
}

export const fetchOrderStart = () => {
    return {
        type: actionTypes.FETCH_ORDER_START
    }
}

export const fetchOrder = (token, userId) => {
    return dispatch => {
        let getToken = token ? '?auth=' + token : '';
        const queryParams = `${getToken}&orderBy="userId"&equalTo="${userId}"`
        dispatch(fetchOrderStart());
        axios.get('/orders.json' + queryParams)
            .then(response => {
                const fetchedOrders = [];
                for (const key in response.data) {
                    fetchedOrders.push({
                        ...response.data[key],
                        id: key
                    })
                }
                dispatch(fetchOrderSuccess(fetchedOrders))

            })
            .catch(err => {
                dispatch(fetchOrderFail(err))
            })
    }
}


