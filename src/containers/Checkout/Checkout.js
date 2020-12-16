import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import CheckoutSummary from "../../components/Order/CheckoutSummary/CheckoutSummary";
import ContactData from "./ContactData/ContactData";

const Checkout = (props) => {
    const checkoutCancelledHandler = () => {
        props.history.push("/burger-builder");
    };
    const checkoutContinuedHandler = () => {
        props.history.replace("/checkout/contact-data");
    };

    let summary = <Redirect to="/burger-builder" />;
    if (props.ing) {
        const purchased = props.purchased ? (
            <Redirect to="/burger-builder" />
        ) : null;
        summary = (
            <div>
                {purchased}
                <CheckoutSummary
                    ingredients={props.ing}
                    checkoutCancelled={checkoutCancelledHandler}
                    checkoutContinued={checkoutContinuedHandler}
                />

                <Route
                    path={props.match.path + "/contact-data"}
                    component={ContactData}
                />
            </div>
        );
    }
    return summary;
};

const mapStateToProps = (state) => {
    return {
        ing: state.burgerBuilderReducer.ingredients,
        purchased: state.orderReducer.purchased,
    };
};

export default connect(mapStateToProps)(Checkout);
