import {
  ADD_ATTRIBUTE_ITEM,
  ADD_ATTRIBUTE_PRICE,
  REMOVE_ATTRIBUTE_ITEM,
} from "./types";
// const attribute = [];
export const attributePrice = (price) => (dispatch) => {
  dispatch({ type: ADD_ATTRIBUTE_PRICE, payload: price });
};

export const createAttributeItems =
  (id, key, price) => (dispatch, getState) => {
    const { attributeItems } = getState();
    const found = attributeItems.attributeList.find((idx) => idx.key == key);
    if (found) {
      //   const index = attributeItems.attributeList.findIndex(
      //     (idx) => idx.key == key
      //   );
      attributeItems.attributeList = attributeItems.attributeList.filter(
        (idx) => idx.key != key
      );
    }

    if (attributeItems.attributeList.find((idx) => idx.productId == id)) {
      // attributeItems.attributeList
    }
    const item = [
      id,
      {
        price,
        key,
      },
    ];
    attributeItems.attributeList.push({
      productId: id,
      price,
      key,
    });

    dispatch({ type: ADD_ATTRIBUTE_ITEM, payload: attributeItems });
  };

export const deleteAttributeItems = (id) => (dispatch, getState) => {
  const {
    attributeItems: { attributeList },
  } = getState();

  const index = attributeList.findIndex((id) => id.productId == id);
  let newAttributes = attributeList.filter((item) => item.productId != id);

  dispatch({
    type: REMOVE_ATTRIBUTE_ITEM,
    payload: { attributeList: newAttributes },
  });
};
