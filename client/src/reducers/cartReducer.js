import * as types from '../actions/types';
var initalCart=[]



const initialState = {
    cart:initalCart
}
export default function (state = initialState.cart, action) {
	switch (action.type) {
		case types.GET_CART_SUCCESS:
			return state;
		case types.ADD_TO_CART_SUCCESS:

			var exists = false;
			const newState = state.map(item => {
				if (item.id === action.item.id) {
					exists = true;
					return {
						...item,
						quantity: action.item.quantity,
						price:action.item.price,
						selectedAttribute:action.item.selectedAttribute

					}
				} else {
					return item
				}
			});

			if (exists) {
				return newState;
			} else {
				return [
					...state,
					action.item
				];
			}
		case types.REMOVE_FROM_CART_SUCCESS:
			const remaingList = [
				...state.filter(i => i.id !== action.item.id)
			]
			return remaingList;
		case types.LOAD_CART:
			return action.item
		default:
			return state;
	}
}