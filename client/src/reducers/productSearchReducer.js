import {
  SEARCH_PRODUCT_FAIL,
  SEARCH_PRODUCT_REQUEST,
  SEARCH_PRODUCT_SUCCESS,
} from "../actions/types";

const initialState = {
  searchList: null,
};

export const productSearchReducer = (state = initialState, action) => {
  switch (action.type) {
    case SEARCH_PRODUCT_REQUEST:
      return { loading: true };
    case SEARCH_PRODUCT_SUCCESS:
      return { loading: false, searchList: action.payload };
    case SEARCH_PRODUCT_FAIL:
      return { loading: false, error: action.paylaod };
    default:
      return state;
  }
};
