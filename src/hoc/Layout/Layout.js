import React, { Component } from 'react';
import { connect } from 'react-redux';

import Aux from '../Aux/Aux';
import classes from './Layout.module.css'
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';


class Layout extends Component {
    state = {
        showSideDrawer: false,
    }
    sideDrawerClosed = () => {
        this.setState({ showSideDrawer: false })
    }
    sideDrawerOpen = () => {
        this.setState({ showSideDrawer: true })
    }
    sideDrawerToggle = () => {
        this.setState((prevState) => {
            return { showSideDrawer: !prevState.showSideDrawer }
        });
    }
    render() {
        return (
            <Aux>
                <Toolbar clickedMenu={this.sideDrawerToggle} isAuthenticated={this.props.isAuthenticated} />
                <SideDrawer
                    isAuthenticated={this.props.isAuthenticated}
                    open={this.state.showSideDrawer}
                    closed={this.sideDrawerClosed}
                />
                <main className={classes.Content}>
                    {this.props.children}
                </main>
            </Aux>
        )
    }
};

const mapStateToProps = state => {

    return {
        isAuthenticated: state.authReducer.token !== null
    }
}

export default connect(mapStateToProps)(Layout);
