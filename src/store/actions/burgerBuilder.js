import * as actionTypes from './actionTypes'
import axios from '../../axios-orders';

export const addIngredient = (name) => {
    return {
        type: actionTypes.ADD_INGREDIENT,
        ingredientName: name
    }
}

export const removeIngredient = (name) => {
    return {
        type: actionTypes.REMOVE_INGREDIENT,
        ingredientName: name
    }
}

export const saveIngredients = (ingredients) => {
    return {
        type: actionTypes.FETCH_INGREDIENTS,
        ingredients: ingredients
    }
}

export const failIngredients = () => {
    return { type: actionTypes.FETCH_INGREDIENTS_FAIL }
}

export const fetchIngredients = (url) => {
    return dispatch => {
        axios.get(url)
            .then(response => {
                dispatch(saveIngredients(response.data))
            })
            .catch(err => {
                dispatch(failIngredients())
            });
    }
}
