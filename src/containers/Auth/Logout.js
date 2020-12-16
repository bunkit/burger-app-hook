import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/';
import { Redirect } from 'react-router-dom';

class Logout extends Component {
    componentDidMount() {
        this.props.onFetchIngredients('https://react-my-burger-d4cec.firebaseio.com/ingredients.json');
        this.props.setPathRedirect()
        this.props.logout()
    }
    render() {
        return (
            <Redirect to="/auth" />
        )
    }
}


const mapDispatchToProps = dipsatch => {
    return {
        logout: () => dipsatch(actions.logout()),
        onFetchIngredients: (url) => dipsatch(actions.fetchIngredients(url)),
        setPathRedirect: () => dipsatch(actions.authSetPathRedeirect('/')),
    }
}

export default connect(null, mapDispatchToProps)(Logout);
