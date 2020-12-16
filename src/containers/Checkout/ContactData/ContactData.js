import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.module.css';
import axios from '../../../axios-orders'
import Spinner from '../../../components/UI/Spinener/Spinner';
import Input from '../../../components/UI/Input/Input';
import * as actions from '../../../store/actions';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import { updateObject, cekVaidity } from '../../../shared/utility';

class ContactData extends Component {
    state = {
        orderForm: {
            name: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Enter Your Full Name'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: {
                    value: false,
                    errorMessage: ''
                },
                touched: false
            },
            street: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Enter Street'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: {
                    value: false,
                    errorMessage: ''
                },
                touched: false
            },
            zipCode: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Enter Postal Code'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 3,
                    maxLength: 8,
                },
                valid: {
                    value: false,
                    errorMessage: ''
                },
                touched: false
            },
            country: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Enter Country'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: {
                    value: false,
                    errorMessage: ''
                },
                touched: false
            },
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Enter Your E-Mail'
                },
                value: '',
                validation: {
                    required: true,
                    isEmail: true,
                    minLength: 5
                },
                valid: {
                    value: false,
                    errorMessage: ''
                }
            },
            deliveryMethod: {
                elementType: 'select',
                elementConfig: {
                    options: [
                        { value: '', display: 'Please Select' },
                        { value: 'fastest', display: 'Fastest' },
                        { value: 'cheapest', display: 'Cheapest' },
                    ]
                },
                value: '',
                validation: {
                    required: true
                },
                valid: {
                    value: false,
                    errorMessage: ''
                },
                touched: false
            }
        },
        formValid: false
    }

    componentDidMount() {

    }
    orderHandler = (event) => {
        event.preventDefault();
        const formData = {}
        for (const key in this.state.orderForm) {
            formData[key] = this.state.orderForm[key].value;
        }

        const order = {
            ingredients: this.props.ing,
            price: this.props.price.toFixed(2),
            orderData: formData,
            userId: this.props.userId
        }

        this.props.onOrderBurger(order, this.props.token);

    }

    inputChangedHandler = (e, identifier) => {
        const validity = cekVaidity(e.target.value, this.state.orderForm[identifier].validation)
        const valid = updateObject(this.state.orderForm[identifier].valid, {
            value: validity.value,
            errorMessage: validity.message
        })
        const updatedFormElement = updateObject(this.state.orderForm[identifier], {
            value: e.target.value,
            touched: true,
            valid: valid
        })
        const updateOrderForm = updateObject(this.state.orderForm, {
            [identifier]: updatedFormElement
        })
        let formValid = true
        for (const key in updateOrderForm) {
            formValid = updateOrderForm[key].valid.value && formValid
        }
        this.setState({ 'orderForm': updateOrderForm, formValid: formValid });
    }

    render() {
        let formElement = [];
        for (const key in this.state.orderForm) {
            formElement.push({
                id: key,
                config: this.state.orderForm[key]
            })
        }
        let form =
            this.props.loading ?
                <Spinner /> :
                <div><h4>Enter your Contact Data</h4>
                    <form onSubmit={this.orderHandler}>
                        {formElement.map(formItem => {
                            return (
                                <Input
                                    key={formItem.id}
                                    elementType={formItem.config.elementType}
                                    elementConfig={formItem.config.elementConfig}
                                    value={formItem.config.value}
                                    changed={(e) => this.inputChangedHandler(e, formItem.id)}
                                    validity={formItem.config.valid}
                                    touched={formItem.config.touched}
                                    shouldValidate={formItem.config.validation}
                                />
                            )
                        })}
                        <Button disabled={!this.state.formValid} btnType="Success" clicked={this.orderHandler}>Order NOW!</Button>
                    </form>

                </div>;
        return (
            <div className={classes.ContactData}>
                {form}
                <div style={{ color: 'red' }}>
                    <strong>
                        {this.props.error}
                    </strong>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    const burger = state.burgerBuilderReducer;
    const order = state.orderReducer;
    return ({
        ing: burger.ingredients,
        price: burger.totalPrice,
        loading: order.loading,
        error: order.error,
        token: state.authReducer.token,
        userId: state.authReducer.userId
    })
}

const mapDispatchToProps = dispatch => {
    return {
        onOrderBurger: (orderData, token) => dispatch(actions.purchaseBurger(orderData, token))
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ContactData, axios));
