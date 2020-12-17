import React, { useState } from "react";
import { connect } from "react-redux";

import Aux from "../Aux/Aux";
import classes from "./Layout.module.css";
import Toolbar from "../../components/Navigation/Toolbar/Toolbar";
import SideDrawer from "../../components/Navigation/SideDrawer/SideDrawer";

const Layout = (props) => {
    const [showSideDrawer, setShowSideDrawer] = useState(false);
    const sideDrawerClosed = () => {
        setShowSideDrawer(false);
    };
    // const sideDrawerOpen = () => {
    //     setShowSideDrawer(true);
    // };
    const sideDrawerToggle = () => {
        setShowSideDrawer((prevState) => !prevState);
    };
    return (
        <Aux>
            <Toolbar
                clickedMenu={sideDrawerToggle}
                isAuthenticated={props.isAuthenticated}
            />
            <SideDrawer
                isAuthenticated={props.isAuthenticated}
                open={showSideDrawer}
                closed={sideDrawerClosed}
            />
            <main className={classes.Content}>{props.children}</main>
        </Aux>
    );
};

const mapStateToProps = (state) => {
    return {
        isAuthenticated: state.authReducer.token !== null,
    };
};

export default connect(mapStateToProps)(Layout);
