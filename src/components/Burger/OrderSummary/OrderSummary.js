import React from "react";
import Aux from "../../../hoc/Aux/Aux";
import Button from "../../UI/Button/Button";

const OrderSummary = (props) => {
    const ingredientSummary = Object.keys(props.ingredients).map((igKey) => {
        return (
            <li key={igKey}>
                <span style={{ textTransform: "capitalize" }}>{igKey}</span>:{" "}
                {props.ingredients[igKey]}
            </li>
        );
    });
    return (
        <Aux>
            <h3>Your Order</h3>
            <p>A delicioud burger with the following ingredients:</p>
            <ul>{ingredientSummary}</ul>
            <h2>Total Price: ${props.price}</h2>
            <h3>Continue to Checkout?</h3>
            <Button btnType={"Danger"} clicked={props.purchaseCancelled}>
                CANCEL
            </Button>
            <Button btnType={"Success"} clicked={props.purchaseContinued}>
                CONTINUE
            </Button>
        </Aux>
    );
};

export default OrderSummary;
