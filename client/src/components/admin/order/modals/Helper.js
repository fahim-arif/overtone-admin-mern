import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  attributePrice,
  createAttributeItems,
} from "../../../../actions/attributeAction";
import { productAttributes } from "../../../../actions/productAction";
import { addToCart, getCart } from "../../../../actions/cartAction";
import { groupBy } from "./groupBy";
import axios from "axios";
import "./helper.css";
import swal from 'sweetalert2';
let datas = [];
let queryString = "";
let imgPath = "http://54.227.86.199:3000/static/";
let qString = "";
let list = [];


const Toast = swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000
});

export default function Helper({
  id,
  price,
  photo,
  name = "",
  email,
  submit,
  qty
}) {

  const API_URL = 'http://54.227.86.199:3000';
  const IMAGE_URL = 'http://54.227.86.199:3000/static/';
  const SUCCESS_URL = 'http://54.227.86.199:3000/paymentsuccess';
  const FAILURE_URL = 'http://54.227.86.199:3000/paymentfailed';

  // const API_URL = 'https://warm-lake-60018.herokuapp.com';
  // const IMAGE_URL = 'https://warm-lake-60018.herokuapp.com/static/';
  // const SUCCESS_URL = 'https://warm-lake-60018.herokuapp.com/paymentsuccess';
  // const FAILURE_URL = 'https://warm-lake-60018.herokuapp.com/paymentfailed';

  const dispatch = useDispatch();

  const attributeItems = useSelector((state) => state.attributeItems);
  const cart = useSelector((state) => state.cart)
  const { attributeList } = attributeItems;
  const { adduser } = useSelector((state) => state.user)

  // console.log(attributeList, "attributeItems");

  name = name.split(" ")[0];

  const [dat, setDat] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [query, setQuery] = useState("");
  const [totalQuery, SetTotalQuery] = "";
  const [newUser, setNewUser] = useState(false)
  const [userInfo, setUserInfo] = useState([])
  const [imgAttribute, setImgAttribute] = useState('')
  const [productData, setProductData] = useState({})
  const [productLoading, setProductLoading] = useState(false)
  const [attributeLoading, setAttributeLoading] = useState(false)
  const [attributeData, setAttributeData] = useState({})
  const [selectedAttribute, setSelectedAttribute] = useState([])
  const [totalPrice, setTotalPrice] = useState(0)
  const [currentIndex, setCurrentIndex] = useState(0)




  // To know that there is a newly created user
  useEffect(() => {

    if (adduser && adduser.success) {
      setNewUser(true)
      setUserInfo(adduser.payload)
    }
  }, [adduser])

  useEffect(() => {
    if (id) {
      axios.post(API_URL + `api/attributemapping/getattributebyproduct`, { productID: id })
        .then(result => {
          setImgAttribute(result.data)

        })
        .catch(err => {
          setProductData({})
          setProductLoading(false)
          // this.setState({
          //     productLoading: false,
          //     productData: {}
          // })
        })


      axios.post(API_URL + `/api/product/detail`, { productID: id })
        .then(result => {
          setProductLoading(false)
          setProductData(result.data)
          // this.setState({
          //     productLoading: false,
          //     productData: result.data
          // })
        })
        .catch(err => {
          // this.setState({
          //     productLoading: false,
          //     productData: {}
          // })
          setProductLoading(false)
          setProductData({})
        })


      axios.post(API_URL + `/api/product/attribute`, { productID: id })
        .then(result => {

          setAttributeLoading(false)
          setAttributeData(result.data)
          // this.setState({
          //   attributeLoading: false,
          //   attributeData: result.data
          // })
        })
        .catch(err => {
          setAttributeData(false)
          setAttributeData({})
          // this.setState({
          //   attributeLoading: false,
          //   attributeData: {}
          // })
        })
    }
  }, [id])


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
        "http://54.227.86.199:3000/api/product/attribute/",
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

  // select attribute list

  const onSelectList = (key, value, price, parentKey = "") => {
    var temp = selectedAttribute;
    var findKey = temp.find(x => x.key === key)

    if (findKey) {
      temp = temp.filter(x => x.key != key)
      temp = temp.filter(x => x.parentKey != key)
    }
    temp.push({ key: key, value: value, price: price, parentKey: parentKey })
    var total = temp.reduce((acc, curr) => acc + parseFloat(curr.price), 0)
    setTotalPrice(total)
    setSelectedAttribute(temp)
    // this.setState({
    //     selectedAttribute: temp,
    //     totalPrice: total
    // })
  }


  // on selecting dropdown
  const onSelectDropdown = (e, keys, parentKey = "") => {
    var temp = selectedAttribute;
    var price = e.target.selectedOptions[0].getAttribute('data-price');
    var findKey = temp.find(x => x.key === keys)

    if (findKey) {
      temp = temp.filter(x => x.key != keys)
      temp = temp.filter(x => x.parentKey != keys)

    }
    temp.push({ key: keys, value: e.target.value, price: price, parentKey: parentKey })
    var total = temp.reduce((acc, curr) => acc + parseFloat(curr.price), 0)

    setSelectedAttribute(temp)
    setTotalPrice(total)
    // this.setState({
    //     selectedAttribute: temp,
    //     totalPrice: total
    // })
  }

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
    let result = `${id}&name=${name}&imgurl=${photo}&prodPrice=${price}&qty=${qty}&key=${key}&value=${mapValue}&price=${additionalPrice}`;

    // console.log(result);
    if (submit) {
      try {


        const cartItem = {
          "id": id,
          "image": photo,
          "name": name,
          "categoryID": productData.categoryID,
          "quantity": qty,
          "price": totalPrice,
          "selectedAttribute": selectedAttribute
        }
        // console.log(cartItem)

        const finalCart = JSON.stringify(cartItem)
        const encodedString = btoa(finalCart)
        console.log(encodedString)
        console.log(cart)

        
        // let u = new URLSearchParams(finalCart).toString();

        // console.log(u);


        // JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}')

        // await axios.post(
        //   `http://localhost:5000/api/orderemail/productId=${result}`,
        //   // `https://warm-lake-60018.herokuapp.com/api/orderemail/productId=${result}`,

        //   { email: email, newUser: newUser, userInfo },
        //   config
        // );
        // console.log("success");
      } catch (error) {
        console.error(error);
      }
      // setTimeout(() => {
      //   window.location.reload()
      // }, 5000)
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
    // const config = {
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // };

    // let mail = "fahim1.618555@gmail.com";
    // let result = `${id}&name=${name}&imgurl=${photo}&prodPrice=${price}&qty=${qty}&key=${key}&value=${mapValue}&price=${additionalPrice}`;
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
      attributeList.map((item) => { });

      // important
      let result = `${id}&name=${name}&imgurl=${photo}&prodPrice=${price}&qty=${qty}${query}`;
      if (submit) {
        try {
         

          // let u = new URLSearchParams(finalCart).toString();

          // console.log(u);

        
         
          console.log(cart)
          const totalCart = JSON.stringify(cart)
          const encodedCart = btoa(totalCart)
          await axios.post(
            `http://54.227.86.199:3000/api/orderemail/${encodedCart}`,
            // `http://localhost:5000/api/orderemail/productId=${result}`,
            // `https://warm-lake-60018.herokuapp.com/api/orderemail/productId=${result}`,

            { email: email, newUser, userInfo },
            config
          );
          console.log("success");
        } catch (error) {
          console.error(error);
        }
      }
    };
    submitOrder();
    // setTimeout(() => {
    //   window.location.reload()
    // }, 10000)
  }


  const OnSaveCart = () => {
    document.querySelector("#exampleModal").click()

    // cart Data
    const cartItem = {
      "id": id,
      "image": photo,
      "name": productData.name,
      "categoryID": productData.categoryID,
      "quantity": qty,
      "price": totalPrice,
      "selectedAttribute": selectedAttribute
    }


    if (totalPrice === 0) {
      Toast.fire({
        type: 'error',
        title: 'Select Attribute List',
      })
      return;
    }

        if (!qty) {
      Toast.fire({
        type: 'error',
        title: 'Please Add Quantity First, then click on the add button',
      })
      return;
    }
    dispatch(addToCart(cartItem))
    setSelectedAttribute([])
// this.props.addToCart(cartItem);
  }
  const demo = () => {
    return <h1>Dropdown</h1>
  }

  let attributeLists;
  const atbList = () => {

    if (!attributeLoading && Object.keys(attributeData).length > 0) {
      // return <h1>fahim</h1>
      attributeLists = attributeData.map((result, index) => {
        var attributes = result.attributes;
        const groupedAttribute = groupBy(attributes, 'attributeName');

        var fields = [];

        Object.entries(groupedAttribute).map(([key, value]) => {
          if (value.length > 0) {
            var mappingType = value[0].mappingType;

            if (mappingType === "dropdown") {
              fields.push(<h6 key={key}>{key}</h6>)
              fields.push(<select id="select-el" className="combo combo-input" onChange={(e) => onSelectDropdown(e, key)}>
                <option value="">Select</option>
                {value.sort(function (a, b) {
                  return new Date(a.date) - new Date(b.date);
                }).map(attrres => {
                  var findSelected = selectedAttribute.find(x => x.value === attrres.mappingValue)
                  return <option selected={findSelected ? true : null} value={attrres.mappingValue} data-price={attrres.additionalPrice} >{attrres.mappingLabel} {parseInt(attrres.additionalPrice) > 0 && `[+ $ ${attrres.additionalPrice} ]`}</option>
                })}
              </select>)

            }
            if (mappingType === "image+text") {
              fields.push(<ul className="profile-g pointer">
                {value.sort(function (a, b) {
                  return new Date(a.date) - new Date(b.date);
                }).map(attrres => {
                  var findSelected = selectedAttribute.find(x => x.value === attrres.mappingValue)
                  return <li className={findSelected ? "border" : null} onClick={() => onSelectList(key, attrres.mappingValue, attrres.additionalPrice)}>
                    <img src={`${IMAGE_URL}${attrres.photoUrl}`} />
                    <span>{attrres.mappingLabel} {parseInt(attrres.additionalPrice) > 0 && `[+ $ ${attrres.additionalPrice} ]`}</span>
                  </li>
                })}
              </ul>)
            }
            if (mappingType === "color") {
              fields.push(<ul className="profile-g pointer">
                {value.sort(function (a, b) {
                  return new Date(a.date) - new Date(b.date);
                }).map(attrres => {
                  var findSelected = selectedAttribute.find(x => x.value === attrres.mappingValue)
                  return <li className={findSelected ? "border" : null} onClick={() => onSelectList(key, attrres.mappingValue, attrres.additionalPrice)}><span>{attrres.mappingLabel} {parseInt(attrres.additionalPrice) > 0 && `[+ $ ${attrres.additionalPrice} ]`}</span></li>
                })}
              </ul>)
            }
            //FIND ARRAY
            var findSelectedAttribute = selectedAttribute.find(x => x.key === key)
            if (findSelectedAttribute) {
              var subFields = value.find(x => x.mappingValue === findSelectedAttribute.value);
              if (subFields) {
                var dependentField = JSON.parse(subFields.dependentField)

                fields.push(onRenderSubField(dependentField, findSelectedAttribute.key))
              }
            }

          }
        })
        return <div>
          {/* edited here */}
          {/* <input id={`ac-${index}`} name="accordion-1" type="radio"

            defaultChecked={index === currentIndex}

          /> */}
          {/* font-size: 18px;
    font-weight: 600; */}
          <label style={{fontSize:'18px', fontWeight:'600', marginTop:'16px'}} htmlFor={`ac-${index}`}><span>{index + 1}</span> {result.parentAttributeName}</label>
          <article>
            <div className="row">
              <div className="col-md-12">
                {fields}
              </div>
            </div>
          </article>
        </div>

      })

    }
    return attributeLists
  }


  const onRenderSubField = (data, parentKey) => {
    var dependentField = [];
    var datas = data.map(result => {
      if (result.type === "dropdown") {
        return <React.Fragment>
          <h6 key={parentKey} style={{ marginTop: 20 }}>{result.label}</h6>
          <select id="select-el" className="combo combo-input" onChange={(e) => onSelectDropdown(e, result.label, parentKey)}>
            <option value="">Select</option>
            {result.list.map(attrres => {
              var findSelected = selectedAttribute.find(x => x.value === attrres.value)
              return <option selected={findSelected ? true : null} value={attrres.value} data-price={attrres.additionalPrice}>{attrres.label} {parseInt(attrres.additionalPrice) > 0 && `[+ $ ${attrres.additionalPrice} ]`}</option>
            })}
          </select>
        </React.Fragment>
      }
      if (result.type === "image+text") {
        return <ul className="profile-g pointer" style={{ marginTop: 20 }}>
          {result.list.map(attrres => {
            var findSelected = selectedAttribute.find(x => x.value === attrres.mappingValue)

            return <li className={findSelected ? "border" : null} onClick={() => onSelectList(attrres.label, attrres.value, attrres.additionalPrice, parentKey)}><img src={`${IMAGE_URL}${attrres.photoUrl}`} /><span>{attrres.mappingLabel} {parseInt(attrres.additionalPrice) > 0 && `[+ $ ${attrres.additionalPrice} ]`}</span></li>
          })}
        </ul>
      }
      if (result.type === "color") {
        return <ul className="profile-g pointer" style={{ marginTop: 20 }}>
          {result.list.map(attrres => {
            var findSelected = selectedAttribute.find(x => x.value === attrres.value)
            return <li className={findSelected ? "border" : null} onClick={() => onSelectList(attrres.label, attrres.value, attrres.additionalPrice, parentKey)}><span style={{ width: 25, height: 25, backgroundColor: attrres.value, borderColor: "#fff" }}></span><span>{attrres.label} {parseInt(attrres.additionalPrice) > 0 && `[+ $ ${attrres.additionalPrice} ]`}</span></li>
          })}
        </ul>
      }

    })
    return datas
  }


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
          class='modal'
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
              <div class='modal-body p-4'>
                {atbList()}

                {/* {dat.length > 0 &&
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
                  ))} */}
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
                  onClick={
                    OnSaveCart}
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
