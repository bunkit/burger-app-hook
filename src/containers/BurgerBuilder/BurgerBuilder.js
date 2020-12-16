import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

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
    const { onFetchIngredients } = props;
    const [purchasing, setPurchasing] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        onFetchIngredients(
            "https://react-my-burger-d4cec.firebaseio.com/ingredients.json"
        );
    }, [onFetchIngredients]);

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
        if (!props.isAuthenticated) {
            props.onSetAuthPath("/checkout");
            props.history.push("/auth");
        } else {
            setPurchasing(true);
        }
    };

    const purchaseCancelHandler = () => {
        setPurchasing(false);
    };

    const purchaseContinueHandler = () => {
        props.onPurchaseInit();
        props.history.push("checkout");
    };

    const disableInfo = {
        ...props.igr,
    };

    for (let key in disableInfo) {
        disableInfo[key] = disableInfo[key] <= 0;
    }
    let orderSummary = null;

    let burger = props.error ? (
        <h2 style={{ textAlign: "center" }}>
            Ooops.... <br /> Data Cannot be Found!!
        </h2>
    ) : (
        <Spinner />
    );
    if (props.igr) {
        burger = (
            <Aux>
                <Burger ingredients={props.igr} />
                <BuildControls
                    ingredientAdded={props.onAddIngredients}
                    ingredientRemoved={props.onRemoveIngredients}
                    disabled={disableInfo}
                    price={props.tPrice}
                    purchasable={updatePurchaseState(props.igr)}
                    ordered={purchaseHandler}
                    isAuthenticated={props.isAuthenticated}
                />
            </Aux>
        );
        orderSummary = (
            <OrderSummary
                ingredients={props.igr}
                purchaseCancelled={purchaseCancelHandler}
                purchaseContinued={purchaseContinueHandler}
                price={props.tPrice.toFixed(2)}
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

const mapStateToProps = (state) => {
    return {
        igr: state.burgerBuilderReducer.ingredients,
        tPrice: state.burgerBuilderReducer.totalPrice,
        error: state.burgerBuilderReducer.error,
        isAuthenticated: state.authReducer.token !== null,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onAddIngredients: (ingredientName) =>
            dispatch(action.addIngredient(ingredientName)),
        onRemoveIngredients: (ingredientName) =>
            dispatch(action.removeIngredient(ingredientName)),
        onFetchIngredients: (url) => dispatch(action.fetchIngredients(url)),
        onPurchaseInit: () => dispatch(action.purchaseInit()),
        onSetAuthPath: (path) => dispatch(action.authSetPathRedeirect(path)),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withErrorHandler(BurgerBuilder, axios));
