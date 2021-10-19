import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  attributePrice,
  createAttributeItems,
} from "../../../../actions/attributeAction";
import { productAttributes } from "../../../../actions/productAction";
import axios from "axios";
import "./helper.css";
let datas = [];
let queryString = "";
let imgPath = "http://ec2-3-239-208-80.compute-1.amazonaws.com:5000/static/";
let qString = "";
let list = [];

export default function Helper({
  id,
  price,
  photo,
  name = "",
  email,
  submit,
  elementRef,
}) {
  const dispatch = useDispatch();

  const attributeItems = useSelector((state) => state.attributeItems);
  const { attributeList } = attributeItems;
  // console.log(attributeList, "attributeItems");

  name = name.split(" ")[0];

  const [dat, setDat] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [query, setQuery] = useState("");
  const [totalQuery, SetTotalQuery] = "";

  useEffect(() => {
    attributes.map((attribute) => {
      return (qString = `$&key=${attribute.key}&value=${attribute.mapValue}&price=${attribute.additionalPrice}`);
    });
    setQuery((prev) => prev + qString);
  }, [attributes]);

  // console.log(query);
  useEffect(() => {
    const attri = async () => {
      const { data } = await axios.post(
        "http://ec2-3-239-208-80.compute-1.amazonaws.com:5000/api/product/attribute/",
        {
          productID: id,
        }
      );

      setDat(data);
    };
    attri();
  }, [id]);

  const onClickAttribute = async (value) => {
    let key = value.attributeName;
    let mapValue = value.mappingValue;
    let additionalPrice = value.additionalPrice;

    dispatch(attributePrice(additionalPrice));
    const newData = {
      key,
      mapValue,
      additionalPrice,
      parentKey: "",
    };
    dispatch(createAttributeItems(id, key, additionalPrice));

    if (attributes.find((val) => val.key == key)) {
      let index = attributes.map((idx) => idx.key).indexOf(key);
      let filtered = attributes.filter((idx) => idx.key != key);

      setAttributes(filtered);
    }

    setAttributes((state) => [...state, newData]);
    dispatch(productAttributes(newData));
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
  };

  const onChangeDropdown = async (value) => {
    let key = value.attributeName;
    let mapValue = value.mappingValue;
    let additionalPrice = value.additionalPrice;

    // if (attributes.find((val) => val.key == key)) {
    //   return;
    // }
    const newData = {
      key,
      mapValue,
      additionalPrice,
      parentKey: "",
    };

    dispatch(createAttributeItems(id, key, additionalPrice));
    if (attributes.find((val) => val.key == key)) {
      let index = attributes.map((idx) => idx.key).indexOf(key);
      let filtered = attributes.filter((idx) => idx.key != key);

      setAttributes(filtered);
    }
    setAttributes((state) => [...state, newData]);
    dispatch(productAttributes(newData));
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    let mail = "fahim1.618555@gmail.com";
    let result = `${id}&name=${name}&imgurl=${photo}&prodPrice=${price}&key=${key}&value=${mapValue}&price=${additionalPrice}`;
    // console.log(result);
    if (submit) {
      try {
        await axios.post(
          `http://localhost:5000/api/orderemail/productId=${result}`,

          { email: email },
          config
        );
        // console.log("success");
      } catch (error) {
        console.error(error);
      }
    }
  };
  const onColorClick = async (value) => {
    let key = value.attributeName;
    let mapValue = value.mappingValue;
    let additionalPrice = value.additionalPrice;

    const newData = {
      key,
      mapValue,
      additionalPrice,
      parentKey: "",
    };

    dispatch(createAttributeItems(id, key, additionalPrice));

    if (attributes.find((val) => val.key == key)) {
      let index = attributes.map((idx) => idx.key).indexOf(key);
      let filtered = attributes.filter((idx) => idx.key != key);

      setAttributes(filtered);
    }

    setAttributes((state) => [...state, newData]);
    dispatch(productAttributes(newData));
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    let mail = "fahim1.618555@gmail.com";
    let result = `${id}&name=${name}&imgurl=${photo}&prodPrice=${price}&key=${key}&value=${mapValue}&price=${additionalPrice}`;
  };
  // console.log(totalQuery);
  if (submit) {
    attributeList.map((item) => {
      if (list.find((idx) => idx == item.productId)) {
        console.log("matched");
        queryString += ``;
      }
      list.push(item.productId);
      console.log("matched", list);
      // SetTotalQuery((state) => state + (item.productId + item.type));
    });
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const submitOrder = async () => {
      attributeList.map((item) => {});

      let result = `${id}&name=${name}&imgurl=${photo}&prodPrice=${price}${query}`;
      if (submit) {
        try {
          await axios.post(
            `http://localhost:5000/api/orderemail/productId=${result}`,

            { email: email },
            config
          );
          console.log("success");
        } catch (error) {
          console.error(error);
        }
      }
    };
    submitOrder();
  }

  console.log(attributes);
  return (
    <div>
      <div>
        {/* here */}
        <button
          style={{ opacity: "0" }}
          id='modal_btn'
          type='button'
          class='btn btn-primary'
          data-toggle='modal'
          data-target='#exampleModal'
        >
          Launch demo modal
        </button>

        <div
          class='modal show'
          id='exampleModal'
          tabindex='-1'
          role='dialog'
          aria-labelledby='exampleModalLabel'
          aria-hidden='true'
        >
          <div class='modal-dialog' role='document'>
            <div class='modal-content'>
              <div class='modal-header'>
                <h5 class='modal-title' id='exampleModalLabel'>
                  Add Attributes
                </h5>
                <button
                  type='button'
                  class='close'
                  data-dismiss='modal'
                  aria-label='Close'
                >
                  <span aria-hidden='true'>&times;</span>
                </button>
              </div>
              <div class='modal-body'>
                {dat.length > 0 &&
                  dat.map((result, index) => (
                    <React.Fragment key={index}>
                      {result.attributes[0].mappingType === "image+text" && (
                        <div>
                          {result.attributes &&
                            result.attributes.map((value, idx) => (
                              <div key={idx}>
                                <ul
                                  onClick={() => onClickAttribute(value)}
                                  className='d-flex attribute_img_text_container'
                                >
                                  <li className='pr-3'>
                                    {value.mappingName}: {value.mappingLabel}{" "}
                                    [+$ {value.additionalPrice}]
                                  </li>
                                  <img
                                    src={imgPath + value.photoUrl}
                                    alt=''
                                    height={50}
                                    width={50}
                                  />
                                </ul>
                              </div>
                            ))}
                        </div>
                      )}

                      {result.attributes[0].mappingType === "dropdown" && (
                        <div className='d-flex attribute_img_text_container'>
                          {result.attributes &&
                            result.attributes.map((value, idx) => (
                              <div key={idx} className='p-2'>
                                <label>
                                  {" "}
                                  {value.mappingName}: {value.mappingLabel} [+$
                                  {value.additionalPrice}]
                                </label>
                                <input
                                  className='p-2'
                                  onClick={() => onChangeDropdown(value)}
                                  type='radio'
                                  id='html'
                                  name='fav_language'
                                  value='HTML'
                                ></input>
                              </div>
                            ))}
                        </div>
                      )}
                      {result.attributes[0].mappingType === "color" && (
                        <div className='d-flex attribute_img_text_container'>
                          {result.attributes &&
                            result.attributes.map((value, idx) => (
                              <li key={idx} onClick={() => onColorClick(value)}>
                                {value.mappingName}: {value.mappingLabel} [+$
                                {value.additionalPrice}]
                              </li>
                            ))}
                        </div>
                      )}
                    </React.Fragment>
                  ))}
              </div>
              {/*  */}
              <div class='modal-footer'>
                <button
                  type='button'
                  class='btn btn-secondary'
                  data-dismiss='modal'
                >
                  Close
                </button>
                <button
                  type='button'
                  onClick={() =>
                    document.querySelector("#exampleModal").click()
                  }
                  class='btn btn-primary'
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* end */}
      </div>
    </div>
  );
}
