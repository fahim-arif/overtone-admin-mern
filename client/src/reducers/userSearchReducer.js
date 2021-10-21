import {
  SEARCH_USER_FAIL,
  SEARCH_USER_REQUEST,
  SEARCH_USER_SUCCESS,
} from "../actions/types";

const initialState = {
  userList: [],
};

export const userSearchReducer = (state = initialState, action) => {
  switch (action.type) {
    case SEARCH_USER_REQUEST:
      return { loading: true };
    case SEARCH_USER_SUCCESS:
      return { loading: false, userList: action.payload };
    case SEARCH_USER_FAIL:
      return { loading: false, error: action.paylaod };
    default:
      return state;
  }
};
