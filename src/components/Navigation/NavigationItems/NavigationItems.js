import React from 'react';
import classes from './NavigationItems.module.css'
import NavigationItem from './NavigationItem/NavigationItem';





const navigationItems = (props) => {
    return (
        <ul className={classes.NavigationItems}>
            <NavigationItem exact link="/burger-builder">Burger Builder</NavigationItem>
            {props.isAuthenticated ? <NavigationItem link="/orders">Orders</NavigationItem> : null}
            { props.isAuthenticated
                ? <NavigationItem exact link="/logout">Logout</NavigationItem>
                : <NavigationItem link="/auth">Login</NavigationItem>
            }
        </ul>
    )
}

export default navigationItems;
