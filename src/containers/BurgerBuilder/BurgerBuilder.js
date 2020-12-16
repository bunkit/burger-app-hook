import React, { Component } from 'react';
import { connect } from 'react-redux';

import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinener/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as action from '../../store/actions/index';



class BurgerBuilder extends Component {


    state = {
        purchasing: false,
        loading: false,
    }
    componentDidMount() {
        this.props.onFetchIngredients('https://react-my-burger-d4cec.firebaseio.com/ingredients.json');
    }



    updatePurchaseState(ingredients) {

        const sum = Object.keys(ingredients)
            .map(igKey => {
                return ingredients[igKey];
            })
            .reduce((sum, el) => {
                return sum + el;
            }, 0);
        return (sum > 0)
    }

    purchaseHandler = () => {
        if (!this.props.isAuthenticated) {
            this.props.onSetAuthPath('/checkout');
            this.props.history.push("/auth");
        } else {
            this.setState({ purchasing: true })
        }
    }

    purchaseCancelHandler = () => {
        this.setState({ purchasing: false });
    }

    purchaseContinueHandler = () => {
        this.props.onPurchaseInit();
        this.props.history.push('checkout')
    }

    render() {
        const disableInfo = {
            ...this.props.igr
        }
        for (let key in disableInfo) {
            disableInfo[key] = disableInfo[key] <= 0
        }
        let orderSummary = null;

        let burger = this.props.error ? <h2 style={{ textAlign: 'center' }}>Ooops.... <br /> Data Cannot be Found!!</h2> : <Spinner />
        if (this.props.igr) {
            burger = (
                <Aux>
                    <Burger ingredients={this.props.igr} />
                    <BuildControls
                        ingredientAdded={this.props.onAddIngredients}
                        ingredientRemoved={this.props.onRemoveIngredients}
                        disabled={disableInfo}
                        price={this.props.tPrice}
                        purchasable={this.updatePurchaseState(this.props.igr)}
                        ordered={this.purchaseHandler}
                        isAuthenticated={this.props.isAuthenticated}
                    />
                </Aux>
            );
            orderSummary = <OrderSummary
                ingredients={this.props.igr}
                purchaseCancelled={this.purchaseCancelHandler}
                purchaseContinued={this.purchaseContinueHandler}
                price={this.props.tPrice.toFixed(2)}
            />;
        }
        if (this.state.loading) {
            orderSummary = <Spinner />
        }
        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        )
    }
}

const mapStateToProps = state => {
    return {
        igr: state.burgerBuilderReducer.ingredients,
        tPrice: state.burgerBuilderReducer.totalPrice,
        error: state.burgerBuilderReducer.error,
        isAuthenticated: state.authReducer.token !== null
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onAddIngredients: (ingredientName) => dispatch(action.addIngredient(ingredientName)),
        onRemoveIngredients: (ingredientName) => dispatch(action.removeIngredient(ingredientName)),
        onFetchIngredients: (url) => dispatch(action.fetchIngredients(url)),
        onPurchaseInit: () => dispatch(action.purchaseInit()),
        onSetAuthPath: (path) => dispatch(action.authSetPathRedeirect(path))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));
