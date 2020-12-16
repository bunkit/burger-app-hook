import classes from './Auth.module.css';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Button from '../../components/UI/Button/Button';
import Input from '../../components/UI/Input/Input';
import Spinner from '../../components/UI/Spinener/Spinner';
import { cekVaidity } from '../../shared/utility';
import * as action from '../../store/actions/';

class Auth extends Component {

    state = {
        formElement: {
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Enter Your E-Mail'
                },
                value: '',
                validation: {
                    required: true,
                    isEmail: true
                },
                valid: {
                    value: false,
                    errorMessage: ''
                },
                touched: false
            },
            password: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: 'Password'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 6
                },
                valid: {
                    value: false,
                    errorMessage: ''
                },
                touched: false
            },
        },
        formValid: false,
        isLogin: true
    }
    componentDidMount() {
        if (!this.props.buildingBurger && this.props.redirectPath !== '/') {
            this.props.onSetAuthPath()
        }
    }

    inputChangedHandler = (e, identifier) => {
        const updatedForm = {
            ...this.state.formElement
        }
        const updatedFormElement = {
            ...updatedForm[identifier]
        };
        updatedFormElement.value = e.target.value
        const validity = cekVaidity(e.target.value, updatedFormElement.validation)
        updatedFormElement.valid = {
            value: validity.value,
            errorMessage: validity.message
        }
        updatedFormElement.touched = true
        updatedForm[identifier] = updatedFormElement;
        let formValid = true
        for (const key in updatedForm) {
            formValid = updatedForm[key].valid.value && formValid
        }
        this.setState({ 'formElement': updatedForm, formValid: formValid });
    }

    loginHandler = (e) => {
        e.preventDefault();
        const formData = {}
        for (const key in this.state.formElement) {
            formData[key] = this.state.formElement[key].value;
        }
        this.props.onAuth(formData.email, formData.password, this.state.isLogin);
    }

    switchModeHandler = (e) => {
        e.preventDefault();
        this.setState(prevState => {
            return {
                isLogin: !prevState.isLogin
            }
        });
    }

    render() {
        let formElement = [];
        for (const key in this.state.formElement) {
            formElement.push({
                id: key,
                config: this.state.formElement[key]
            })
        }
        let form = <Spinner />
        const url = '';
        let stateWord = this.state.isLogin ? 'Login' : 'Signup';
        let linkWord = this.state.isLogin ? 'Signup' : 'Login';
        let errorMessage = this.props.error ? this.props.error.split('_').join(' ').toLowerCase() : null;
        if (!this.props.loading) {
            form = (
                <div>
                    <h3>{stateWord}</h3>
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
                        <h3 style={{ color: 'red', margin: '5px', textTransform: 'capitalize' }}>{errorMessage}</h3>
                        <Button disabled={!this.state.formValid} btnType="Success" clicked={this.loginHandler}>{stateWord}</Button>
                    </form>
                    <a href={url} onClick={this.switchModeHandler}>{linkWord}</a>
                </div>
            )
        }
        let redirect = this.props.isAuthenticated ? <Redirect to={this.props.redirectPath} /> : null;
        return (
            <div className={classes.Auth}>
                { redirect}
                {form}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        loading: state.authReducer.loading,
        error: state.authReducer.error,
        isAuthenticated: state.authReducer.token !== null,
        redirectPath: state.authReducer.pathToRedirect,
        buildingBurger: state.burgerBuilderReducer.buildingBurger
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email, password, isLogin) => dispatch(action.authenticate(email, password, isLogin)),
        onSetAuthPath: () => dispatch(action.authSetPathRedeirect('/'))

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
