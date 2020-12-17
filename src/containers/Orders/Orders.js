import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import Order from "../../components/Order/Order";
import axios from "../../axios-orders";
import Spinner from "../../components/UI/Spinener/Spinner";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import * as actions from "../../store/actions";
import Modal from "../../components/UI/Modal/Modal";
import Aux from "../../hoc/Aux/Aux";
import Button from "../../components/UI/Button/Button";

const Orders = (props) => {
    const [modalCancel, setModalCancel] = useState(false);
    const [deliveryName, setDeliveryName] = useState("");
    const [address, setAddress] = useState("");
    const [idOrder, setIdOrder] = useState("");
    const { onOrderInit } = props;
    useEffect(() => {
        const LOCAL_STORAGE = JSON.parse(localStorage.getItem("dataAuth"));
        onOrderInit(LOCAL_STORAGE.token, LOCAL_STORAGE.userId);
    }, [onOrderInit]);

    const onCancelHandlerModal = (id, data) => {
        const address = `${data.street} ${data.zipCode} ${data.country}`;
        setModalCancel(true);
        setDeliveryName(data.name);
        setAddress(address);
        setIdOrder(id);
    };
    const onNoHandler = (id) => {
        setModalCancel(false);
    };
    const onYesHandler = (id) => {
        setModalCancel(false);
        axios
            .delete("/orders/" + id + ".json?auth=" + props.token)
            .then((response) => {
                props.onOrderInit(props.token, props.userId);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const LOCAL_STORAGE = JSON.parse(localStorage.getItem("dataAuth"));
    let orderList = <Spinner />;
    if (!props.loading) {
        orderList = props.orders.map((item) => (
            <Order
                key={item.id}
                orderData={item.orderData}
                ingredients={item.ingredients}
                price={item.price}
                cancelOrder={() =>
                    onCancelHandlerModal(item.id, item.orderData)
                }
            />
        ));
    }
    let redirect = LOCAL_STORAGE ? null : <Redirect to="/" />;
    return (
        <Aux>
            {redirect}
            <Modal show={modalCancel} modalClosed={onNoHandler}>
                <div style={{ textAlign: "center" }}>
                    <h3>Please confirm to Cancel Order ?</h3>
                    <div
                        style={{
                            textAlign: "left",
                            display: "inline-block",
                            margin: "auto",
                        }}
                    >
                        <p>Deliver To :{deliveryName}</p>
                        <p>{address}</p>
                    </div>
                    <div>
                        <Button btnType={"Danger"} clicked={onNoHandler}>
                            No
                        </Button>
                        <Button
                            btnType={"Success"}
                            clicked={() => onYesHandler(idOrder)}
                        >
                            Yes, Cancel Order
                        </Button>
                    </div>
                </div>
            </Modal>
            <div style={{ width: "80%", margin: "auto" }}>{orderList}</div>
        </Aux>
    );
};

const mapStateToProps = (state) => {
    return {
        orders: state.orderReducer.orders,
        loading: state.orderReducer.loading,
        token: state.authReducer.token,
        isAuthenticated: state.authReducer.token !== null,
        userId: state.authReducer.userId,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onOrderInit: (token, userId) =>
            dispatch(actions.fetchOrder(token, userId)),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withErrorHandler(Orders, axios));
