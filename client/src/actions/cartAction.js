import *  as types from './types';

export function getCart() {
    return (dispatch) => {
        dispatch({
            type: types.GET_CART_SUCCESS
        });
    }
}
export function loadCart(productList) {
    return (dispatch) => {
        dispatch({
            type: types.LOAD_CART,
            item: productList
        });
    }   
}

export function addToCart(cartItem) {
    return (dispatch) => {
     

        dispatch({
            type: types.ADD_TO_CART_SUCCESS,
            item: cartItem
        });
    }   
}

export function removeFromCart(item) {
    return (dispatch) => {
        dispatch({
            type: types.REMOVE_FROM_CART_SUCCESS,
            item: item
        });
    }
}