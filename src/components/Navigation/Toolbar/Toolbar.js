import React from 'react';
import classes from './Toolbar.module.css';
import Logo from '../../Logo/Logo';
import NavigationItems from '../NavigationItems/NavigationItems';
import DrawerToggle from '../SideDrawer/DrawerToggle/DrawerToogle';
const toolbar = (props) => (
    <header className={classes.Toolbar}>
        <DrawerToggle clicked={props.clickedMenu} />
        <div className={[classes.Logo].join(' ')}>
            <Logo />
        </div>
        <nav className={classes.DesktopOnly}>
            <NavigationItems isAuthenticated={props.isAuthenticated} />
        </nav>
    </header>
)

export default toolbar
