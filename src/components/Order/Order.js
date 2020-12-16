import React from 'react';
import classes from './Order.module.css'
const order = (props) => {
    const ingredients = [];
    for (const key in props.ingredients) {
        if (props.ingredients[key] > 0)
            ingredients.push(key + ' : (' + props.ingredients[key] + ')')
    }
    return (
        <div className={classes.Order}>
            <p><strong>INGREDIENTS</strong>:</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {ingredients.map((ig, idx) => {
                    let className = '';
                    if (ig.includes('bacon')) {
                        className = classes.Bacon;
                    }
                    if (ig.includes('meat')) {
                        className = classes.Meat;
                    }
                    if (ig.includes('cheese')) {
                        className = classes.Cheese;
                    }
                    if (ig.includes('salad')) {
                        className = classes.Salad;
                    }
                    return (
                        <li className={className} key={idx}>{ig}</li>
                    )
                }
                )}
            </ul>
            <div>
                <h3>Deliver to: {props.orderData.name}</h3>
                <p>{props.orderData.street + ' ' + props.orderData.zipCode + ' ' + props.orderData.country}</p>
                <p>Dilevery method: {props.orderData.deliveryMethod}</p>
                <br />
            </div>
            <p className={classes.Price}> <strong> USD {props.price} </strong> </p>
            <button onClick={props.cancelOrder} className={classes.Cancel}>Cancel Order</button>
        </div>
    )
}


export default order;
