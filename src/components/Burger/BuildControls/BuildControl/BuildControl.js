import React from 'react';
import calsses from './BuildControl.module.css';

const buildControl = (props) => {
    return (
        <div className={calsses.BuildControl}>
            <div className={calsses.Label}>{props.label}</div>
            <button 
                disabled={props.disabled} 
                className={calsses.Less} 
                onClick={props.removed}>
                Less
            </button>
            <button 
                className={calsses.More} 
                onClick={props.added}>
                More
            </button>
        </div>
    )
}

export default buildControl;

