import React, { useState, useEffect } from "react";
import classes from "./Auth.module.css";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import Button from "../../components/UI/Button/Button";
import Input from "../../components/UI/Input/Input";
import Spinner from "../../components/UI/Spinener/Spinner";
import { cekVaidity } from "../../shared/utility";
import * as action from "../../store/actions/";

const Auth = (props) => {
    const [state, setState] = useState({
        formElement: {
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
                },
                valid: {
                    value: false,
                    errorMessage: "",
                },
                touched: false,
            },
            password: {
                elementType: "input",
                elementConfig: {
                    type: "password",
                    placeholder: "Password",
                },
                value: "",
                validation: {
                    required: true,
                    minLength: 6,
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
    const [isLogin, setLogin] = useState(false);
    const { buildingBurger, redirectPath, onSetAuthPath } = props;

    useEffect(() => {
        if (!buildingBurger && redirectPath !== "/") {
            onSetAuthPath();
        }
    }, [buildingBurger, redirectPath, onSetAuthPath]);

    const inputChangedHandler = (e, identifier) => {
        const updatedForm = {
            ...state.formElement,
        };
        const updatedFormElement = {
            ...updatedForm[identifier],
        };
        updatedFormElement.value = e.target.value;
        const validity = cekVaidity(
            e.target.value,
            updatedFormElement.validation
        );
        updatedFormElement.valid = {
            value: validity.value,
            errorMessage: validity.message,
        };
        updatedFormElement.touched = true;
        updatedForm[identifier] = updatedFormElement;
        let formValid = true;
        for (const key in updatedForm) {
            formValid = updatedForm[key].valid.value && formValid;
        }
        setState({ formElement: updatedForm, formValid: formValid });
    };

    const loginHandler = (e) => {
        e.preventDefault();
        const formData = {};
        for (const key in state.formElement) {
            formData[key] = state.formElement[key].value;
        }
        props.onAuth(formData.email, formData.password);
    };

    const switchModeHandler = (e) => {
        e.preventDefault();
        setLogin((prevState) => !prevState);
    };

    let formElement = [];
    for (const key in state.formElement) {
        formElement.push({
            id: key,
            config: state.formElement[key],
        });
    }
    let form = <Spinner />;
    const url = "";
    let stateWord = isLogin ? "Login" : "Signup";
    let linkWord = isLogin ? "Signup" : "Login";
    let errorMessage = props.error
        ? props.error.split("_").join(" ").toLowerCase()
        : null;
    if (!props.loading) {
        form = (
            <div>
                <h3>{stateWord}</h3>
                <form>
                    {formElement.map((formItem) => {
                        return (
                            <Input
                                key={formItem.id}
                                elementType={formItem.config.elementType}
                                elementConfig={formItem.config.elementConfig}
                                value={formItem.config.value}
                                changed={(e) =>
                                    inputChangedHandler(e, formItem.id)
                                }
                                validity={formItem.config.valid}
                                touched={formItem.config.touched}
                                shouldValidate={formItem.config.validation}
                            />
                        );
                    })}
                    <h3
                        style={{
                            color: "red",
                            margin: "5px",
                            textTransform: "capitalize",
                        }}
                    >
                        {errorMessage}
                    </h3>
                    <Button
                        disabled={!state.formValid}
                        btnType="Success"
                        clicked={loginHandler}
                    >
                        {stateWord}
                    </Button>
                </form>
                <a href={url} onClick={switchModeHandler}>
                    {linkWord}
                </a>
            </div>
        );
    }
    let redirect = props.isAuthenticated ? (
        <Redirect to={props.redirectPath} />
    ) : null;
    return (
        <div className={classes.Auth}>
            {redirect}
            {form}
        </div>
    );
};
const mapStateToProps = (state) => {
    return {
        loading: state.authReducer.loading,
        error: state.authReducer.error,
        isAuthenticated: state.authReducer.token !== null,
        redirectPath: state.authReducer.pathToRedirect,
        buildingBurger: state.burgerBuilderReducer.buildingBurger,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onAuth: (email, password, isLogin) =>
            dispatch(action.authenticate(email, password, isLogin)),
        onSetAuthPath: () => dispatch(action.authSetPathRedeirect("/")),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
