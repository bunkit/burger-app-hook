import React, { useEffect } from "react";
import { connect } from "react-redux";
import * as actions from "../../store/actions/";
import { Redirect } from "react-router-dom";

const Logout = (props) => {
    useEffect(() => {
        props.onFetchIngredients(
            "https://react-my-burger-d4cec.firebaseio.com/ingredients.json"
        );
        props.setPathRedirect();
        props.logout();
    }, [props]);
    return <Redirect to="/auth" />;
};

const mapDispatchToProps = (dipsatch) => {
    return {
        logout: () => dipsatch(actions.logout()),
        onFetchIngredients: (url) => dipsatch(actions.fetchIngredients(url)),
        setPathRedirect: () => dipsatch(actions.authSetPathRedeirect("/")),
    };
};

export default connect(null, mapDispatchToProps)(Logout);
