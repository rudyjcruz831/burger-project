import React, {Component} from 'react';
import Aux from '../../../hoc/Aux/Aux';
import Button from '../../UI/Button/Button'


class OrderSummary extends Component {
    
    componentWillUpdate() {
        console.log('[OrderSummary] WillUpdate');
    }
    
    render() {
        const ingredientSummary =Object.keys(this.props.ingredients)
        .map(igKeys => {
            return (
                    <li key ={igKeys} >
                    <span style= {{textTransform: 'capitalize'}}>
                        {igKeys}</span>
                    : {this.props.ingredients[igKeys]} x ${this.props.prices[igKeys].toFixed(2)}</li>)
        });
    
        return (
            <Aux>
                <h3>Your Order</h3>
                <p>A delicious burger with the following ingredient</p>
                <ul>
                    {ingredientSummary}
                </ul>
                <p><strong>Total Price: ${this.props.price.toFixed(2)}</strong></p>
                <p>Continue to Checkout?</p>
                <Button
                    btnType="Danger"
                    clicked={this.props.purchaseCancelled}>CANCEL</Button>
                <Button
                    btnType="Success"
                    clicked={this.props.purchaseContinued}>CONTINUE</Button>
            </Aux>
        )
    }

};

export default OrderSummary;