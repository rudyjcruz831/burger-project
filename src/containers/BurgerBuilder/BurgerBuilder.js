import React, {Component} from 'react';
import axios from '../../axios-orders';

import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OderSummery';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'

const INGREDIENTS_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
};

class BurgerBuilder extends Component {

    state = {
        ingredients: null,
        totalPrice: 4,
        purchasable: false,
        purchasing: false,
        loading: false,
        error : false
    };

    componentDidMount() {
        axios.get('/ingreidents.json')
        .then(response => {
            console.log(response);
            this.setState({ingredients : response.data})
        })
        .catch(error => {
            this.setState({error: true});
        });
    }

    updatePurchasableState (ingredients) {
        const sum = Object.keys(ingredients)
        .map(igKey => {
            return ingredients[igKey];
        })
        .reduce((sum, el) => {
            return sum + el;
        },0);
        this.setState({purchasable: sum >0})
    }

    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type]
        const updatedCount = oldCount + 1
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceAddition = INGREDIENTS_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;
        this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
        this.updatePurchasableState(updatedIngredients);
    }

    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type]
        if(oldCount <= 0) {
            return;

        }

        const updatedCount = oldCount - 1
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceSubtraction = INGREDIENTS_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceSubtraction;
        this.setState({totalPrice: newPrice, ingredients: updatedIngredients})
        this.updatePurchasableState(updatedIngredients);
    }

    purchaseHandler = () => {
        this.setState({purchasing: true});
    }

    purchasedCancelHandler = () => {
        this.setState({purchasing: false});
    }
    purchasedContinueHandler = () => {
        // alert("You Continue!");
        this.setState({loading: true})
        const order = {
            ingredients : this.state.ingredients,
            price: this.state.totalPrice,
            customer: {
                name: 'Rudy Cruz',
                address: {
                    street: 'Teststreet 1',
                    zipCode: '99923',
                    country: 'United State'
                },
                email: 'foo@gmail.com'
            },
            deliveryMethod: 'fastest'
        }

        axios.post('/orders.json', order)
            .then(response => {
                this.setState({loading: false , purchasing: false});
            })
            .catch(error => {
                this.setState({loading: false, purchasing: false});
            });
    }
    
    render(){
        const disableInfo = {
            ...this.state.ingredients
        };
        for(let key in disableInfo) {
            disableInfo[key] = disableInfo[key] <= 0
        }

        let orderSummary = null;
        let burger = this.state.error ? <p>The page can't load</p>:<Spinner/>;

        if(this.state.ingredients) {
            burger =  ( 
                <Aux> 
                    <Burger ingredients={this.state.ingredients} ></Burger>
                        <BuildControls 
                            ingredientRemove= {this.removeIngredientHandler}
                            ingredientAdded= {this.addIngredientHandler}
                            disabled = {disableInfo}
                            purchasable = {this.state.purchasable}
                            ordered = {this.purchaseHandler}
                            price={this.state.totalPrice}/>
                </Aux>
            );
            orderSummary = <OrderSummary
                price={this.state.totalPrice}
                purchaseCancelled={this.purchasedCancelHandler}
                purchaseContinued={this.purchasedContinueHandler}
                ingredients ={this.state.ingredients}
                prices = {INGREDIENTS_PRICES}/>;
            
            if(this.state.loading) {
                orderSummary =<Spinner/>
            }
    
        }



        return (
            <Aux>
                <Modal 
                    show={this.state.purchasing}
                    modalClosed= {this.purchasedCancelHandler}>
                    {orderSummary}
                </Modal>
                {/* { this.burger : this.burger : } */}
                {burger}
                    
            </Aux>
        );
    }
}

export default withErrorHandler(BurgerBuilder, axios);