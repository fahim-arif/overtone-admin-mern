import {
  ADD_ATTRIBUTE_ITEM,
  ADD_ATTRIBUTE_PRICE,
  REMOVE_ATTRIBUTE_ITEM,
} from "../actions/types";

let subtotal = 0;
export const attributePriceReducer = (state = {}, action) => {
  switch (action.type) {
    case ADD_ATTRIBUTE_PRICE:
      return { subtotal: subtotal + Number(action.payload) };
    default:
      return state;
  }
};

export const attributeItemsReducer = (
  state = { attributeList: [] },
  action
) => {
  switch (action.type) {
    case ADD_ATTRIBUTE_ITEM:
      return action.payload;
    case REMOVE_ATTRIBUTE_ITEM:
      return action.payload;
    default:
      return state;
  }
};

// export const removeAttributeReducer = (state = { attributes: [] }, action) => {
//   switch (action.type) {
//     case REMOVE_ATTRIBUTE_ITEM:
//       return { attributes: action.payload };
//     default:
//       return state;
//   }
// };
