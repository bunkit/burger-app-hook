import React from 'react';
import Aux from '../../../hoc/Aux/Aux';
import classes from './Modal.module.css'
import BackDrop from '../Backdrop/Backdrop';

const Modal = (props) => {
    return (
        <Aux>
            <BackDrop show={props.show} clicked={props.modalClosed} />
            <div
                className={classes.Modal}
                style={{
                    transform: props.show ? 'translateY(0)' : 'translateY(-100vh)',
                    opacity: props.show ? 1 : 0,
                }}
            >
                {props.children}
            </div>
        </Aux>
    )
}

export default React.memo(Modal, (prevProps, nextProps) => {
    return (
        prevProps.show === nextProps.show || prevProps.children === nextProps.children
        // false
    )
});
