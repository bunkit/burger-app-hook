import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';


const initialState = {
    ingredients: null,
    totalPrice: 4,
    error: false,
    buildingBurger: false
}
const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
}

const addIngredient = (state, action) => {
    const updateIngredent = { [action.ingredientName]: state.ingredients[action.ingredientName] + 1 };
    const newIngredients = updateObject(state.ingredients, updateIngredent)
    const newState = {
        ingredients: newIngredients,
        totalPrice: state.totalPrice + INGREDIENT_PRICES[action.ingredientName],
        buildingBurger: true
    }
    return updateObject(state, newState)
}
const removeIngredient = (state, action) => {
    const updateIngredent = { [action.ingredientName]: state.ingredients[action.ingredientName] - 1 };
    const newIngredients = updateObject(state.ingredients, updateIngredent)
    const newState = {
        ingredients: newIngredients,
        totalPrice: state.totalPrice + INGREDIENT_PRICES[action.ingredientName],
        buildingBurger: true
    }
    return updateObject(state, newState)
}
const fetchIngredients = (state, action) => {
    const ingredients = {
        salad: action.ingredients.salad,
        bacon: action.ingredients.bacon,
        cheese: action.ingredients.cheese,
        meat: action.ingredients.meat
    }
    return updateObject(state, {
        ingredients: ingredients,
        totalPrice: 4,
        error: false,
        buildingBurger: false
    })
}
const fetchIngredientsFail = (state, action) => {
    return updateObject(state, { error: true })
}
const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.ADD_INGREDIENT: return addIngredient(state, action)
        case actionTypes.REMOVE_INGREDIENT: return removeIngredient(state, action)
        case actionTypes.FETCH_INGREDIENTS: return fetchIngredients(state, action)
        case actionTypes.FETCH_INGREDIENTS_FAIL: return fetchIngredientsFail(state, action)
        default: return { ...state }
    }
}

export default reducer;
