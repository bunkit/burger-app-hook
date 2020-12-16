import React, { useState } from "react";
import { connect } from "react-redux";
import Button from "../../../components/UI/Button/Button";
import classes from "./ContactData.module.css";
import axios from "../../../axios-orders";
import Spinner from "../../../components/UI/Spinener/Spinner";
import Input from "../../../components/UI/Input/Input";
import * as actions from "../../../store/actions";
import withErrorHandler from "../../../hoc/withErrorHandler/withErrorHandler";
import { updateObject, cekVaidity } from "../../../shared/utility";

const ContactData = (props) => {
    const [state, setState] = useState({
        orderForm: {
            name: {
                elementType: "input",
                elementConfig: {
                    type: "text",
                    placeholder: "Enter Your Full Name",
                },
                value: "",
                validation: {
                    required: true,
                },
                valid: {
                    value: false,
                    errorMessage: "",
                },
                touched: false,
            },
            street: {
                elementType: "input",
                elementConfig: {
                    type: "text",
                    placeholder: "Enter Street",
                },
                value: "",
                validation: {
                    required: true,
                },
                valid: {
                    value: false,
                    errorMessage: "",
                },
                touched: false,
            },
            zipCode: {
                elementType: "input",
                elementConfig: {
                    type: "text",
                    placeholder: "Enter Postal Code",
                },
                value: "",
                validation: {
                    required: true,
                    minLength: 3,
                    maxLength: 8,
                },
                valid: {
                    value: false,
                    errorMessage: "",
                },
                touched: false,
            },
            country: {
                elementType: "input",
                elementConfig: {
                    type: "text",
                    placeholder: "Enter Country",
                },
                value: "",
                validation: {
                    required: true,
                },
                valid: {
                    value: false,
                    errorMessage: "",
                },
                touched: false,
            },
            email: {
                elementType: "input",
                elementConfig: {
                    type: "email",
                    placeholder: "Enter Your E-Mail",
                },
                value: "",
                validation: {
                    required: true,
                    isEmail: true,
                    minLength: 5,
                },
                valid: {
                    value: false,
                    errorMessage: "",
                },
            },
            deliveryMethod: {
                elementType: "select",
                elementConfig: {
                    options: [
                        { value: "", display: "Please Select" },
                        { value: "fastest", display: "Fastest" },
                        { value: "cheapest", display: "Cheapest" },
                    ],
                },
                value: "",
                validation: {
                    required: true,
                },
                valid: {
                    value: false,
                    errorMessage: "",
                },
                touched: false,
            },
        },
        formValid: false,
    });
    const orderHandler = (event) => {
        event.preventDefault();
        const formData = {};
        for (const key in state.orderForm) {
            formData[key] = state.orderForm[key].value;
        }

        const order = {
            ingredients: props.ing,
            price: props.price.toFixed(2),
            orderData: formData,
            userId: props.userId,
        };

        props.onOrderBurger(order, props.token);
    };

    const inputChangedHandler = (e, identifier) => {
        const validity = cekVaidity(
            e.target.value,
            state.orderForm[identifier].validation
        );
        const valid = updateObject(state.orderForm[identifier].valid, {
            value: validity.value,
            errorMessage: validity.message,
        });
        const updatedFormElement = updateObject(state.orderForm[identifier], {
            value: e.target.value,
            touched: true,
            valid: valid,
        });
        const updateOrderForm = updateObject(state.orderForm, {
            [identifier]: updatedFormElement,
        });
        let formValid = true;
        for (const key in updateOrderForm) {
            formValid = updateOrderForm[key].valid.value && formValid;
        }
        setState({ orderForm: updateOrderForm, formValid: formValid });
    };

    let formElement = [];
    for (const key in state.orderForm) {
        formElement.push({
            id: key,
            config: state.orderForm[key],
        });
    }
    let form = props.loading ? (
        <Spinner />
    ) : (
        <div>
            <h4>Enter your Contact Data</h4>
            <form onSubmit={orderHandler}>
                {formElement.map((formItem) => {
                    return (
                        <Input
                            key={formItem.id}
                            elementType={formItem.config.elementType}
                            elementConfig={formItem.config.elementConfig}
                            value={formItem.config.value}
                            changed={(e) => inputChangedHandler(e, formItem.id)}
                            validity={formItem.config.valid}
                            touched={formItem.config.touched}
                            shouldValidate={formItem.config.validation}
                        />
                    );
                })}
                <Button
                    disabled={!state.formValid}
                    btnType="Success"
                    clicked={orderHandler}
                >
                    Order NOW!
                </Button>
            </form>
        </div>
    );
    return (
        <div className={classes.ContactData}>
            {form}
            <div style={{ color: "red" }}>
                <strong>{props.error}</strong>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => {
    const burger = state.burgerBuilderReducer;
    const order = state.orderReducer;
    return {
        ing: burger.ingredients,
        price: burger.totalPrice,
        loading: order.loading,
        error: order.error,
        token: state.authReducer.token,
        userId: state.authReducer.userId,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onOrderBurger: (orderData, token) =>
            dispatch(actions.purchaseBurger(orderData, token)),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withErrorHandler(ContactData, axios));
