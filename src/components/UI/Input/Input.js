import classes from './Input.module.css';
import React from 'react';

const input = (props) => {
    let inputElement = null;
    let errorMessage = ''
    const inputClasses = [classes.Input];

    if (!props.validity.value && props.shouldValidate && props.touched) {
        inputClasses.push(classes.Invalid);
        errorMessage = props.validity.errorMessage
    }
    switch (props.elementType) {
        case ('input'):
            inputElement = <input className={inputClasses.join(' ')}
                {...props.elementConfig}
                value={props.value}
                onChange={props.changed}
            />
            break
        case ('select'):
            inputElement = <select className={inputClasses.join(' ')}
                value={props.value}
                onChange={props.changed}
            >
                {props.elementConfig.options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.display}</option>
                ))}
            </select>
            break
        case ('textarea'):
            inputElement = <textarea className={inputClasses.join(' ')}
                {...props.elementConfig}
                value={props.value}
                onChange={props.changed}
            />
            break
        default:
            inputElement = <input className={inputClasses.join(' ')}
                {...props.elementConfig}
                value={props.value}
                onChange={props.changed}
            />

    }
    return (
        <div className={classes.InputItem}>
            <label className={classes.Label} htmlFor="">{props.label}</label>
            {inputElement}
            <span className={classes.Error}>{errorMessage}</span>
        </div>
    )

}

export default input;
