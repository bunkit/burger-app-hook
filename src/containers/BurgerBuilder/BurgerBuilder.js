import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Aux from "../../hoc/Aux/Aux";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import axios from "../../axios-orders";
import Spinner from "../../components/UI/Spinener/Spinner";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import * as action from "../../store/actions/index";

const BurgerBuilder = (props) => {
    const [purchasing, setPurchasing] = useState(false);
    const [loading] = useState(false);

    const dispatch = useDispatch();

    // redux distpatching
    const onAddIngredients = (ingredientName) =>
        dispatch(action.addIngredient(ingredientName));
    const onRemoveIngredients = (ingredientName) =>
        dispatch(action.removeIngredient(ingredientName));
    const onFetchIngredients = (url) => dispatch(action.fetchIngredients(url));
    const onPurchaseInit = () => dispatch(action.purchaseInit());
    const onSetAuthPath = (path) => dispatch(action.authSetPathRedeirect(path));

    //reduxt parsing state
    const igr = useSelector((state) => state.burgerBuilderReducer.ingredients);
    const tPrice = useSelector(
        (state) => state.burgerBuilderReducer.totalPrice
    );
    const error = useSelector((state) => state.burgerBuilderReducer.error);
    const isAuthenticated = useSelector(
        (state) => state.authReducer.token !== null
    );
    useEffect(() => {
        onFetchIngredients(
            "https://react-my-burger-d4cec.firebaseio.com/ingredients.json"
        );
    }, []);

    const updatePurchaseState = (ingredients) => {
        const sum = Object.keys(ingredients)
            .map((igKey) => {
                return ingredients[igKey];
            })
            .reduce((sum, el) => {
                return sum + el;
            }, 0);
        return sum > 0;
    };

    const purchaseHandler = () => {
        if (!isAuthenticated) {
            onSetAuthPath("/checkout");
            props.history.push("/auth");
        } else {
            setPurchasing(true);
        }
    };

    const purchaseCancelHandler = () => {
        setPurchasing(false);
    };

    const purchaseContinueHandler = () => {
        onPurchaseInit();
        props.history.push("checkout");
    };

    const disableInfo = {
        ...igr,
    };

    for (let key in disableInfo) {
        disableInfo[key] = disableInfo[key] <= 0;
    }
    let orderSummary = null;

    let burger = error ? (
        <h2 style={{ textAlign: "center" }}>
            Ooops.... <br /> Data Cannot be Found!!
        </h2>
    ) : (
        <Spinner />
    );
    if (igr) {
        burger = (
            <Aux>
                <Burger ingredients={igr} />
                <BuildControls
                    ingredientAdded={onAddIngredients}
                    ingredientRemoved={onRemoveIngredients}
                    disabled={disableInfo}
                    price={tPrice}
                    purchasable={updatePurchaseState(igr)}
                    ordered={purchaseHandler}
                    isAuthenticated={isAuthenticated}
                />
            </Aux>
        );
        orderSummary = (
            <OrderSummary
                ingredients={igr}
                purchaseCancelled={purchaseCancelHandler}
                purchaseContinued={purchaseContinueHandler}
                price={tPrice.toFixed(2)}
            />
        );
    }
    if (loading) {
        orderSummary = <Spinner />;
    }
    return (
        <Aux>
            <Modal show={purchasing} modalClosed={purchaseCancelHandler}>
                {orderSummary}
            </Modal>
            {burger}
        </Aux>
    );
};

export default withErrorHandler(BurgerBuilder, axios);
