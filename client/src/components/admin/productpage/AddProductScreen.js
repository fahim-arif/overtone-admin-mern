import React from "react";
import "./addProductScreen.css";
import Sidebarmobile from "../../layouts/SidebarMobile";
import Asidebar from "../../layouts/Asidebar";
import Header from "../../layouts/Header";
import SubHeader from "../../layouts/SubHeader";
import HeaderTopbar from "../../layouts/HeaderTopbar";
import { Link } from "react-router-dom";
import axios from 'axios'
import swal from "sweetalert2";
// import DemoModal from './DemoModal'
// import DeleteModal from "./DeleteUser";

import skuGen from "./logic-sku/app";
import ListParentAttributeCategory from "../parentattributecategory/ListParentAttributeCategory";
import AddParentAttributeCategory from "./AddParentAttributeCategory";

// Imported
import { PropTypes } from "prop-types";
import { connect } from "react-redux";
import Footer from "../../layouts/Footer";
import { addProduct, createDraftProduct } from "../../../actions/productAction";
import { listParentAttributeCategory } from '../../../actions/parentattributecategoryAction';
import { listAttributeMapping, deleteAttributeMapping } from '../../../actions/attributemappingAction'
import { listAttributeCategory } from '../../../actions/attributecategoryAction';
import { addAttributeMapping, addAttributeMappingDraft, editAttributeMapping } from '../../../actions/attributemappingAction';
import { listCategory } from "../../../actions/categoryAction";
import { listSubCategoryOne } from "../../../actions/subCategoryAction";
import { listSubCategoryChildOne } from "../../../actions/subCategoryChildAction";
import { listProductOne } from '../../../actions/productAction';
import ListAttributeMapping from "./ListAttributeMapping";
import EditAttributeMapping from "./EditAttributeMapping";
import { editProduct } from "../../../actions/productAction";


const Toast = swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
});

let lenRes = 1;

class AddProductScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      errors: {},
      name: "",
      productId: "",
      description: "",
      price: "",
      discountPrice: "",
      stockCount: "",
      photoUrl1: "",
      photoUrl2: "",
      documents: [{ url: "", uploadstatus: "", fileName: "", buttonName: "" }],
      maintenanceText: "",
      maintenanceBtnText: "",
      maintenanceFileUrl: "",
      acousticsText: "",
      categoryID: "",
      subcategoryID: "",
      subcategoryChildID: "",
      isEnabled: "Yes",
      keyword: "",
      productValue: "",
      attributeValue: "",
      variantValue: "",
      count: 0,
      sku: [],
      click: false,
      attributeCount: 0,
      demo: [1, 2, 3],
      tempAtbName: [],
      tempAtbValue: [],
      tempVarLen: [{ num: '' }],
      demoValue: [{ num: '' }],
      quickship: 'Yes',
      dependentField: [{ type: '', label: '', parentAttributeCategoryID: '', attributeCategoryID: '', mappingType: "", mappingLabel: "", mappingValue: "", additionalPrice: "0", mappingName: '', isEnabled: '', subField: '', addOn: 'No' }],
      parentAttributeCategoryID: '',
      productID: "",
      mappingName: '',
      mappingLabel: '',
      mappingType: '',
      mappingValue: '',
      photoUrl: '',
      additionalPrice: "0",
      isEnabled: '',
      subField: "No",
      parsed: "",
      nextScreen: false,
      collpase: [{ click: false }],
      label: '',
      type: '',
      imageURL: [],
      listVariants: [{
        type: '', label: '', list: [{
          additionalPrice: "0",
          label: "",
          sku: "",
          value: ""
        }]
      }],
      variantDependentField: [
        {

          label: "", value: "", additionalPrice: "0", sku: ''
        },
      ],
      finalVariant: [],
      attributeList: [],
      variantList: [],

    };


    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onReset = this.onReset.bind(this);
    this.uploadImage = this.uploadImage.bind(this);
    this.uploadImageBulk = this.uploadImageBulk.bind(this);

  }

  componentDidMount() {
    // this.props.createDraftProduct();
    this.props.listCategory();
    this.props.listParentAttributeCategory();
    this.props.listAttributeCategory();
    this.setState({ productID: this.props.match.params.id })
    this.props.listAttributeMapping({ productID: this.props.match.params.id });
    this.setState({ sku: JSON.parse(localStorage.getItem('sku')) })


    // edit start *************

    // let extraVariant = [
    //   {
    //     type: "",
    //     label: "",
    //     list: [{ label: "", value: "", additionalPrice: "0", type: '', sku: '' }]
    //   }
    // ]
    // let saveAttribute = {

    //   parentAttributeCategoryID: '', attributeCategoryID: '', mappingType: "", mappingLabel: "", mappingValue: "", additionalPrice: "0", mappingName: '', isEnabled: '', subField: '',
    //   photoUrl: '',
    //   dependentField: JSON.stringify(extraVariant),
    //   productID: this.props.match.params.id
    // }
    // this.props.addAttributeMappingDraft(saveAttribute);

    // edit finish ***************
    var editResult = {}
    if (!localStorage.editproduct) {
      // this.props.history.push('/admin/listproduct')

    } else {
      editResult = JSON.parse(localStorage.getItem('editproduct'))
    }
    this.setState({
      _id: editResult._id,
      name: editResult.name,
      productValue: editResult.value,
      description: editResult.description,
      price: editResult.price,
      discountPrice: editResult.discountPrice,
      stockCount: editResult.stockCount,
      photoUrl1: editResult.photoUrl1,
      photoUrl2: editResult.photoUrl2,
      documents: editResult.documents ? JSON.parse(editResult.documents) : [{ url: '', uploadstatus: '', fileName: '' }],
      maintenanceText: editResult.maintenanceText,
      maintenanceBtnText: editResult.maintenanceBtnText,
      maintenanceFileUrl: editResult.maintenanceFileUrl,
      acousticsText: editResult.acousticsText,
      categoryID: editResult.categoryID,
      subcategoryID: editResult.subcategoryID,
      subcategoryChildID: editResult.subcategoryChildID,
      isEnabled: editResult.isEnabled,
      quickship: editResult.quickship,
      keyword: editResult.keyword,
      subField: editResult.subField,
    }, () => {

      this.props.listSubCategoryOne({ categoryID: this.state.categoryID });
      this.props.listSubCategoryChildOne({ subcategoryID: this.state.subcategoryID });
    })


  }

  componentDidUpdate(nextProps) {


    if (nextProps.attributemapping.deleteattributemapping !== this.props.attributemapping.deleteattributemapping) {
      Toast.fire({
        type: 'success',
        title: ' Attribute Deleted Successfully',
      }).then(getResult => {
        console.log(getResult)
        this.props.listAttributeMapping({ productID: this.props.match.params.id });
        // this.setState({ dependentField: this.props.attributemapping.listattributemapping })
        console.log(this.state.dependentField, 'fahim arif')
        this.setState(prevState => ({ variantDependentField: [...prevState.variantDependentField, this.state.variantDependentField] }))
        this.props.listAttributeMapping({ productID: this.props.match.params.id });
        this.setState({ dependentField: this.props.attributemapping.listattributemapping })
      })

    }

    if (nextProps.attributemapping.listattributemapping !== this.props.attributemapping.listattributemapping) {
      console.log(this.props.attributemapping.listattributemapping, 'fahim arif2')
      console.log(this.props.attributemapping.listattributemapping)
      this.setState({ dependentField: this.props.attributemapping.listattributemapping })
      if (this.props.attributemapping.listattributemapping[0]) {

        // if (this.props.attributemapping.listattributemapping.length) {

        // }
        //  for (let i = 0; i < this.props.attributemapping.listattributemapping.length; i++) {

        //  }
        let varF = []
        let varFinal = []
        let collpase = []
        for (let i = 0; i < this.props.attributemapping.listattributemapping.length; i++) {
          varF = (JSON.parse(this.props.attributemapping.listattributemapping[i].dependentField));
          varF = [...varF]
          varFinal.push(...varF)
          collpase.push({ click: false })
          console.log('hi there')
        }
        this.setState({ collpase })
        // }
        this.setState({ listVariants: varFinal })
        console.log(varFinal)


        for (let i = 0; i < this.props.attributemapping.listattributemapping.length - 1; i++) {
          this.setState(prevState => ({ variantDependentField: [...prevState.variantDependentField, ...this.state.variantDependentField] }))

        }
        // this.setState({variantDependefinalVariantntField: this.props.attributemapping.listattributemapping})
      }
      // this.props.listAttributeMapping({ productID: this.props.match.params.id });
    }

    if (nextProps.attributemapping.addattributemapping !== this.props.attributemapping.addattributemapping) {
      this.setState(prevState => ({ click: !prevState.click }))
      console.log('added')
      this.props.listAttributeMapping({ productID: this.props.match.params.id });
      // console.log(this.state.dependentField, 'fahim arif')
      // this.setState({ dependentField: this.props.attributemapping.listattributemapping })
      // this.props.listAttributeMapping({ productID: this.props.match.params.id });
      // console.log('added')
      // console.log(this.props.attributemapping.addattributemapping)
      this.setState({ dependentField: this.props.attributemapping.listattributemapping })
    }

    if (nextProps.errors !== this.props.errors) {
      Toast.fire({
        type: 'error',
        title: 'Check all the fields',
      })
      this.setState({ errors: nextProps.errors });
    }
  }

  addDocument() {
    const documents = this.state.documents.concat([
      { url: "", uploadstatus: "", fileName: "", buttonName: "" },
    ]);
    this.setState({ documents });
  }

  removeDocument(idx, sub) {
    this.setState({
      documents: this.state.documents.filter((s, sidx) => idx !== sidx),
    });
  }


  // upload attribute images

  uploadAttributeImage(e, index) {
    var self = this;
    const data = new FormData();
    data.append("file", e.target.files[0]);
    data.append("filename", e.target.files[0].name);
    axios
      .post("/upload", data)
      .then(function (response) {
        self.setState(prevState => ({
          imageURL: [...prevState.imageURL, response.data.file],
        }));
      })
      .catch(function (error) {
        console.log(error);
      });


  }


  //for upload image
  uploadImage(e, status) {
    var self = this;
    var name = e.target.name;
    const data = new FormData();
    data.append("file", e.target.files[0]);
    data.append("filename", e.target.files[0].name);
    axios
      .post("/upload", data)
      .then(function (response) {
        self.setState({
          [name]: response.data.file,
          [status]: "Uploaded SuccessFully",
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  //for upload url
  uploadImageBulk(e, index) {
    var self = this;
    const data = new FormData();
    var sFileName = e.target.files[0].name;
    let temp = this.state.documents;
    temp[index].uploadstatus = "Uploading please wait..";
    this.setState({ documents: temp });
    console.log("temp");
    var sFileExtension = sFileName
      .split(".")
    [sFileName.split(".").length - 1].toLowerCase();

    data.append("file", e.target.files[0]);
    data.append("filename", e.target.files[0].name);
    axios
      .post("/upload", data)
      .then((response) => {
        temp[index].url = response.data.file;
        temp[index].fileName = sFileName;
        temp[index].uploadstatus = "Uploaded SuccessFully";
        self.setState({ documents: temp }, () => {
          Toast.fire({
            type: "success",
            title: "File Uploaded SuccessFully",
          });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }



  // Multiple attribute submit

  onAttributeSubmit(index, edit = false) {
    if (!this.state.sku) {
      Toast.fire({
        type: 'error',
        title: 'Please add sku value first',
      })
      return;
    }

    if (this.state.dependentField[index].mappingType === 'imageUpload') {
      let dependentField = this.state.dependentField[index];
      dependentField.parentAttributeCategoryID = "61662bd68685fae970b65809"
      dependentField.attributeCategoryID = "61663d18c59ffa1d143c5d3e"
      dependentField.isEnabled = 'Yes'
      dependentField.mappingValue = '0'
      dependentField.mappingLabel = '0'
      dependentField.mappingName = 'fahim'
      dependentField.adminID = "5e77100738941733c325cf2d"
      this.props.editAttributeMapping(dependentField)
      return;
    }
    // if (this.state.dependentField[index])
    let tempLabel = this.state.dependentField[index].mappingLabel.split(',');
    let tempPrice = this.state.dependentField[index].additionalPrice.split(',');

    let demoVariant = [
      {
        type: '',
        label: "",
        list: [
          {

            label: "", value: "", additionalPrice: "0", type: '', sku: this.state.sku[index]
          },
        ],
      }
    ]

    // edited
    let finalVariation = [
      {
        type: this.state.listVariants[index].type,
        label: this.state.listVariants[index].label,
        list: this.state.variantDependentField[index]
      }
    ]
    console.log(finalVariation, 'before')

    // edit
    if (this.state.dependentField[index].subField === 'No') {
      finalVariation = [
        {
          type: '',
          label: "",
          list: [
            {

              label: "", value: "", additionalPrice: "0", sku: ''
            },
          ],
        }
      ]
    }

    console.log(finalVariation, 'important')

    let attributeValues = this.state.dependentField[index].mappingValue.split(',')
    let attributeLength = attributeValues.length;
    // let label = this.state.label.split(',');
    console.log(attributeLength)
    // console.log(this.state.dependentField[0])
    let attributes = {
      ...this.state.dependentField[index],
      photoUrl: '',
      dependentField: JSON.stringify(finalVariation),
      productID: this.state.productID,
    }
    console.log(attributes)

    for (let i = 0; i < attributeLength; i++) {
      attributes = {
        ...attributes,
        mappingValue: attributeValues[i],
        mappingLabel: tempLabel[i],
        photoUrl: this.state.imageURL[i],
        additionalPrice: tempPrice[i]
      }



      if (edit) {
        this.props.editAttributeMapping(attributes)
        return;
      }
      this.props.editAttributeMapping(attributes)
      // this.props.addAttributeMapping(attributes)
      console.log(attributes);
      // console.log(attributeValues[i])
    }
    // this.setState(prevState => ({ variantDependentField: [...prevState.variantDependentField, this.state.finalVariant] }))
    // window.location.reload();
    // setTimeout(() => {
    //   window.location.reload()
    // }, 500)
  }

  addVariant(index, edit) {
    const listVariants = this.state.listVariants.concat({
      type: 'dropdown', label: '', list: [{
        additionalPrice: "0",
        label: "",
        sku: "",
        value: ""
      }]
    })
    console.log(listVariants)
    this.setState({ listVariants })
  }

  // handle variant **
  onVariantSubmit(index, edit = false) {

    if (!this.state.sku) {
      Toast.fire({
        type: 'error',
        title: 'Please add sku first',
      })
      return
    }
    let temp = this.state.variantDependentField;
    let variantType = this.state.listVariants[index].type.split(',')
    let variantLabel = this.state.listVariants[index].label.split(',')
    let varValue = this.state.listVariants[index].list[0].value.split(',');
    let varPrice = this.state.listVariants[index].list[0].additionalPrice.split(',')
    let varLabel = this.state.listVariants[index].list[0].label.split(',')
    let totalVariations = this.state.listVariants[index].list[0];

    console.log(this.state.listVariants[index].list[0].value)
    console.log(varValue)
    console.log(varPrice)
    console.log(varLabel)
    console.log(totalVariations)


    let varLoop = [];
    for (let i = 0; i < varValue.length; i++) {
      totalVariations = {
        ...totalVariations,
        label: varLabel[i],
        additionalPrice: varPrice[i],
        value: varValue[i],
        sku: this.state.sku[i]
        // label: varValue[i],
      }
      varLoop.push(totalVariations)
      this.setState(prevState => ({ finalVariant: [...prevState.finalVariant, totalVariations] }));
      // this.setState(prevState => ({ variantDependentField: [...prevState.variantDependentField, totalVariations] }));
      console.log(totalVariations)
    }
    let tempo = this.state.variantDependentField;
    console.log(temp[index]);
    temp[index] = [...varLoop];
    console.log([temp[index]])
    temp[index] = [...temp[index]]
    this.setState({ variantDependentField: tempo });
    console.log(this.state.variantDependentField)
  }


  // handle sku
  onSkuSubmit(submit = false, index = null) {
    let atbName = this.state.dependentField.map((res) => res.mappingValue)
    this.setState({ tempAtbName: [...this.state.tempAtbName, atbName] })
    let firstPortion = this.state.productValue;

    if (!firstPortion) {
      if (!(atbValue && thirdArg)) {
        Toast.fire({
          type: 'error',
          title: 'Please Enter the product value',
        })
        return;
      }
    }
    // second portion
    let atbValue = this.state.dependentField.map((res) => res.mappingValue).toString();

    console.log(this.state.dependentField, 'depend')
    console.log(atbValue, 'here is')

    let variantLen = atbValue.toString().split(',').length;
    this.setState({ tempVarLen: [...this.state.tempVarLen, variantLen] });
    let thirdArg = ''
    let forthArg = ''
    let fifthArg = ''
    let sixthArg = ''
    let seventhArg = ''

    if (this.state.dependentField[0] && this.state.dependentField[0].subField === 'Yes') {
      thirdArg = this.state.listVariants[0].list[0].value;
      atbValue = this.state.dependentField[0].mappingValue;
      forthArg = null;
      fifthArg = null;
      sixthArg = null;
      seventhArg = null;
      console.log(this.state.listVariants[0].list[0].value)
    } else if (this.state.dependentField[0] && this.state.dependentField[0].subField === 'No') {
      thirdArg = null;
      atbValue = this.state.dependentField[0].mappingValue;
      forthArg = null;
      fifthArg = null;
      sixthArg = null;
      seventhArg = null;
    }

    if (this.state.dependentField[1] && this.state.dependentField[1].subField === 'Yes') {
      console.log('dep1')
      forthArg = this.state.dependentField[1].mappingValue;
      fifthArg = this.state.listVariants[1].list[0].value;
    } else if (this.state.dependentField[1] && this.state.dependentField[1].subField === 'No') {
      console.log('dep2')
      forthArg = null;

      if (thirdArg) {
        forthArg = this.state.dependentField[1].mappingValue;
      } else {

        thirdArg = this.state.dependentField[1].mappingValue;
      }
    }

    if (this.state.dependentField[2] && this.state.dependentField[2].subField === 'Yes') {
      // sixthArg = null;
      fifthArg = this.state.dependentField[2].mappingValue;
      // if (fifthArg) {
      sixthArg = this.state.listVariants[2].list[0].value;
      // } 
      // else {

      //   fifthArg = this.state.listVariants[2].list[0].value;
      // }
    } else if (this.state.dependentField[2] && this.state.dependentField[2].subField === 'No') {
      if (fifthArg) {
        console.log('hi there')
        sixthArg = this.state.dependentField[2].mappingValue;
      } else if (forthArg) {
        fifthArg = this.state.dependentField[2].mappingValue;
      } else {

        forthArg = this.state.dependentField[2].mappingValue;
      }
    }

    if (this.state.dependentField[3] && this.state.dependentField[3].subField === 'Yes') {
      fifthArg = this.state.listVariants[3].list[0].value;


    } else if (this.state.dependentField[3] && this.state.dependentField[3].subField === 'No') {

      if (sixthArg) {
        seventhArg = this.state.dependentField[3].mappingValue;
      } else {

        forthArg = this.state.dependentField[3].mappingValue;
      }
    }




    if (!submit) {
      Toast.fire({
        type: 'success',
        title: 'An Attribute Value was added',
      })
    }

    if (submit) {

      if (!atbValue) {
        Toast.fire({
          type: 'error',
          title: 'Please add product value and atleast one attribute value ',
        })
        return
      }
      const result = skuGen(firstPortion, atbValue, thirdArg, forthArg, fifthArg, sixthArg, seventhArg)
      console.log(result);
      localStorage.setItem('sku', JSON.stringify(result))
      this.setState({ sku: result });

      // const tempVarLen = {...result}
      // this.setState({tempVarLen});

      let varLength = this.state.tempAtbValue;
      for (let i = 0; i < result.length; i++) {
        varLength = this.state.tempAtbValue.concat([{ num: '1' }])
      }
      this.setState({ tempVarLen: varLength })

      Toast.fire({
        type: 'success',
        title: 'SKU has been generated Successfully',
      })
    }



    // lenRes = 1;
    // lenRes = lenRes * variantLen;
    // console.log(lenRes)


    // const demoValue = this.state.demoValue.concat([{ num: '' }])
    // this.setState({ demoValue })
    // console.log(this.state.dependentField)

    // if ((typeof index) === 'number') {

    //   let newVarient = [
    //     {
    //       type: '',
    //       label: "",
    //       list: this.state.variantDependentField
    //     }
    //   ]
    //   let tempAttribute = this.state.dependentField[index];
    //   let saveAttribute = {
    //     ...tempAttribute,
    //     photoUrl: '',
    //     dependentField: JSON.stringify(newVarient),
    //     productID: this.state.productID
    //   }
    //   this.props.addAttributeMapping(saveAttribute);
    //   console.log(saveAttribute)
    // }


    // if (this.state.dependentField.length > 0) {

    //   for (let i = 0; i < this.state.dependentField.length; i++) {
    //     console.log(i,'index')
    //     this.props.editAttributeMapping(this.state.dependentField[i])
    //   }
    // }
    // window.location.reload()
  }



  onChange(e) {

    this.setState({ [e.target.name]: e.target.value });
    // if(e.target.name==='authorID' && e.target.value !=""){
    //     this.props.listCategory({authorID:e.target.value});
    // }
    if (this.state.productValue) {
      this.setState({ count: 1 })
    } else {
      this.setState({ count: 0 })
    }

    if (this.state.attributeValue) {
      this.setState({ count: 2 })
    } else {
      this.setState({ count: 1 })
    }

    if (this.state.variantValue) {
      this.setState({ count: 3 })
    } else {
      this.setState({ count: 2 })
    }

    if (e.target.name === "categoryID" && e.target.value != "") {
      this.props.listSubCategoryOne({ categoryID: e.target.value });
    }
    if (e.target.name === "subcategoryID" && e.target.value != "") {
      this.props.listSubCategoryChildOne({ subcategoryID: e.target.value });
    }
  }

  onSubmit(e) {
    this.setState({ errors: {} });
    // e.preventDefault();
    const Data = {
      _id: this.state.productID,
      name: this.state.name,
      value: this.state.productValue,
      description: this.state.description,
      price: this.state.price,
      discountPrice: this.state.discountPrice,
      stockCount: this.state.stockCount,
      photoUrl1: this.state.photoUrl1,
      photoUrl2: this.state.photoUrl2,
      documents: JSON.stringify(this.state.documents),
      maintenanceText: this.state.maintenanceText,
      maintenanceBtnText: this.state.maintenanceBtnText,
      maintenanceFileUrl: this.state.maintenanceFileUrl,
      acousticsText: this.state.acousticsText,
      categoryID: this.state.categoryID,
      subcategoryID: this.state.subcategoryID,
      subcategoryChildID: this.state.subcategoryChildID,
      isEnabled: this.state.isEnabled,
      keyword: this.state.keyword,
      quickship: this.state.quickship,
    };
    console.log(Data)
    // console.log(this.props.product.addproduct._id)
    // this.props.addProduct(Data);
    // const res = axios.get('/api/product/fahim')
    // console.log(res)

    if (this.state.categoryID && this.state.subcategoryID) {

      this.props.editProduct(Data);

      Toast.fire({
        type: 'success',
        title: 'A Product Was Added SuccessFully',
      })
    } else {
      Toast.fire({
        type: 'error',
        title: 'Please select a categroy group and sub group',
      })
    }

    localStorage.setItem('editproduct', JSON.stringify(Data))

    console.log(this.state.dependentField[0].mappingName)
    if (this.state.dependentField[0].mappingName) {

      for (let i = 0; i < this.state.dependentField.length; i++) {
        let id = this.state.dependentField[i]._id;
        const deleteData = {
          id: id
        }
        if (this.state.dependentField[i].mappingName) {


          console.log('chekc', check)

          let check = this.state.dependentField[i].mappingValue && this.state.dependentField[i].mappingValue.split(',')
          console.log(this.state.dependentField[i].mappingValue.split(','))

          if (check && check.length > 1) {
            this.props.deleteAttributeMapping(deleteData)

          }



        }
        if (!(this.state.dependentField[i].mappingName)) {
          this.props.deleteAttributeMapping(deleteData)
          return;
        }
      }
    }
  }


  //Reset all statevalues
  onReset() {
    this.setState({
      errors: {},
      name: "",
      description: "",
      price: "",
      discountPrice: "",
      stockCount: "",
      photoUrl1: "",
      photoUrl2: "",
      documents: [{ url: "", uploadstatus: "", fileName: "", buttonName: "" }],
      maintenanceText: "",
      maintenanceBtnText: "",
      maintenanceFileUrl: "",
      acousticsText: "",
      categoryID: "",
      subcategoryID: "",
      subcategoryChildID: "",
      isEnabled: "Yes",
      keyword: "",
    });
  }


  handleChange(e, index) {
    const temp = this.state.documents;
    const name = e.target.name;
    const value = e.target.value;
    if (name === "buttonName") {
      temp[index].buttonName = value;
    }
    this.setState({
      documents: temp,
    });
  }

  onCollpase(index) {
    let collpase = this.state.collpase;
    collpase[index].click = !this.state.collpase[index].click
    console.log(collpase)
    this.setState({ collpase })
  }

  onAttributeAdd(index, edit = false) {
    let collpase = this.state.collpase.concat([{ click: false }])
    this.setState({ collpase })
    let dependentField = [];
    if (!this.state.dependentField) {
      this.setState({ dependentField: [{ type: '', label: '', parentAttributeCategoryID: '', attributeCategoryID: '', mappingType: "", mappingLabel: "", mappingValue: "", additionalPrice: "0", mappingName: '', isEnabled: '', subField: '', photoUrl: '', list: [{ label: "", value: "", additionalPrice: "0" }] }] })
    } else {

      dependentField = this.state.dependentField.concat([{ type: '', label: '', parentAttributeCategoryID: '', attributeCategoryID: '', mappingType: "", mappingLabel: "", mappingValue: "", additionalPrice: "0", mappingName: '', isEnabled: '', subField: '', photoUrl: '', list: [{ label: "", value: "", additionalPrice: "0" }] }]);
    }
    console.log(this.state.dependentField)
    // this.setState({ attributeCount: this.state.attributeCount + 1 });
    console.log(dependentField)
    this.setState({ dependentField });


    // edit here happended
    let listVariants = [{
      type: '', label: '', list: [{
        additionalPrice: "0",
        label: "",
        sku: "",
        value: ""
      }]
    }];
    this.setState({ listVariants })





    //  this.props.addAttributeMapping(dependentField)

    let extraVariant = [
      {
        type: "",
        label: "",
        list: [{ label: "", value: "", additionalPrice: "0", type: '', sku: '' }]
      }
    ]
    let saveAttribute = {

      parentAttributeCategoryID: '', attributeCategoryID: '', mappingType: "", mappingLabel: "", mappingValue: "", additionalPrice: "0", mappingName: '', isEnabled: '', subField: '',
      photoUrl: '',
      dependentField: JSON.stringify(extraVariant),
      productID: this.state.productID
    }
    this.props.addAttributeMappingDraft(saveAttribute);

    // setTimeout(() => {

    //   window.location.reload()
    // }, 1000)


  }


  onhandleChangeField(e, index) {
    const name = e.target.name;
    const value = e.target.value;
    if (name === "type") {
      this.setState({ type: value });
    } else if (name === "label") {
      this.setState({ label: value });
    }

  }


  // need to uncomment 437 for productId
  onhandleChangeSubField(e, index) {
    const name = e.target.name;
    const value = e.target.value;
    console.log(value)
    console.log(index)
    // editing here
    const temp = this.state.dependentField;
    console.log(temp)



    if (name === "label") {
      temp[index].mappingLabel = value;
    } else if (name === "value") {
      temp[index].mappingValue = value;
    } else if (name === "additionalPrice") {
      temp[index].additionalPrice = value;
    } else if (name === 'parentCategory') {
      temp[index].parentAttributeCategoryID = value;
    } else if (name === 'category') {
      temp[index].attributeCategoryID = value;
    } else if (name === 'mappingName') {
      temp[index].mappingName = value;
    } else if (name === "isEnabled") {
      temp[index].isEnabled = value;
    } else if (name === "subField") {
      temp[index].subField = value;
    } else if (name === 'type') {
      temp[index].mappingType = value;
    } else if (name === 'addOn') {
      temp[index].addOn = value;
    }


    if (temp[index].subField === "YES") {
      console.log('hello ')
      // temp[index].subField = value;
    }

    this.setState({
      dependentField: temp
    })
  }

  onhandleChangeVariantField(e, index, subIndex, edit = false, sku) {
    const name = e.target.name;
    const value = e.target.value;

    const temp = this.state.listVariants;
    console.log(this.state.listVariants)
    console.log(index)
    console.log(subIndex)

    if (name === 'type') {
      temp[index].type = value
    } else if (name === 'name') {
      temp[index].label = value
    }
    if (name === 'label') {
      temp[index].list[subIndex].label = value;
    } else if (name === "value") {
      temp[index].list[subIndex].value = value;
    }
    else if (name === "additionalPrice") {
      temp[index].list[subIndex].additionalPrice = value;
    }
    this.setState({ listVariants: temp })

    // editing here
    // const temp = this.state.variantDependentField;
    // if (name === "label") {
    //   temp[index].label = value;
    // } else if (name === "value") {
    //   temp[index].value = value;
    // } else if (name === "additionalPrice") {
    //   temp[index].additionalPrice = value;
    // } else if (name === 'type') {
    //   temp[index].type = value;
    // }
    // console.log('hello')
    // console.log(value);

    // if (sku) {
    //   temp[index].sku = sku;
    // }
    // this.setState({
    //   variantDependentField: temp,
    // });
  }

  resetAllAttribute() {
    this.setState({
      errors: {},
      parentAttributeCategoryID: '',
      attributeCategoryID: '',
      // productID:'',
      mappingName: '',
      mappingLabel: '',
      mappingType: '',
      mappingValue: '',
      photoUrl: '',
      additionalPrice: '',
      dependentField: [{ type: "", label: "", list: [{ label: "", value: "", additionalPrice: "0" }] }],
      variantDependentField: [
        {

          label: "", value: "", additionalPrice: "0", type: '', sku: ''
        },
      ]
    })
    // window.location.reload();
  }


  onEditAttribute(index) {


    let finalVariation = [
      {
        type: this.state.type,
        label: this.state.label,
        list: this.state.variantDependentField[index]
      }
    ]
    console.log(finalVariation, 'before')

    // edit
    if (this.state.dependentField[index].subField === 'No') {
      finalVariation = [
        {
          type: '',
          label: "",
          list: [
            {

              label: "", value: "", additionalPrice: "0", sku: ''
            },
          ],
        }
      ]
      console.log('error')
    }


    let attributes = {
      ...this.state.dependentField[index],
      // photoUrl: '',
      dependentField: JSON.stringify(finalVariation),
      productID: this.state.productID,
    }

    console.log(attributes)
    console.log(this.state.dependentField[index])
    this.props.editAttributeMapping(attributes)


    Toast.fire({
      type: 'success',
      title: 'Attribute was edited successfully',
    })


    setTimeout(() => {

      window.location.reload();
    }, 1000)
  }

  deleteAttribute(index, id) {
    // console.log(index)
    console.log(id)
    if (this.state.dependentField.length > 1) {

      let temporary = this.state.dependentField;
      temporary.splice(index, 1)
      console.log(temporary)
      this.setState({ dependentField: temporary })
    }

    const deleteData = {
      id: id
    }
    this.props.deleteAttributeMapping(deleteData)

    this.props.listAttributeMapping({ productID: this.props.match.params.id });
    this.setState({ dependentField: this.props.attributemapping.listattributemapping })
    // setTimeout(() => {

    //   window.location.reload();
    // },1000)
    // console.log(this.state.dependentField[index])

  }


  render() {
    console.log(this.state.collpase)

    // this.setState({ dependentField: this.props.attributemapping.listattributemapping })
    console.log(this.state.dependentField)

    const skus = []

    if (this.state.sku) {

      for (const [index, value] of this.state.sku.entries()) {
        skus.push(<li>

          {value}
        </li>
        )
      }
    }

    console.log(this.state.listVariants, 'list variant')
    // console.log(this.state.variantDependentField)
    // console.log(this.state.imageURL)
    // console.log(this.state.photoUrl)

    console.log(this.state.dependentField, 'dependent');

    console.log(this.state.finalVariant)
    // console.log(this.state.variantDependentField)

    const { addproduct } = this.props.product;


    if (addproduct) {

      //   let prodId = this.props.product.addproduct._id;
      //   console.log(prodId)

      // this.setState({ productID: addproduct._id })
    }
    const elements = ['one', 'two', 'three'];

    const items = []

    const { listparentattributecategory, parentattributecategoryloading } = this.props.parentattributecategory;

    var optionParentCategory = [];
    if (listparentattributecategory == null || parentattributecategoryloading) {
      optionParentCategory = (<option value="">Loading...</option>)
    } else {
      if (Object.keys(listparentattributecategory).length > 0) {
        optionParentCategory = listparentattributecategory.map(result => {
          return <option value={result._id}>{result.attributeName}</option>
        })
      } else {
        optionParentCategory = (<option value="">No Parent Attributes  Found...</option>)
      }
    }


    // const list = this.state.sku.toString()
    // const list = this.state.sku.length >1 && this.state.sku.forEach(function(result, idx) {
    //   console.log('hiii')
    //   return <li>{this.state.sku[idx]}</li>
    // })
    const { listattributemapping, attributemappingloading } = this.props.attributemapping;

    if (Object.keys(listAttributeMapping).length > 0) {

      let fa = listattributemapping.map(result => (result.mappingName))
      console.log(fa)
    }


    console.log(this.props.attributemapping.listattributemapping, 'props.listattribute')

    const { errors, productValue, count } = this.state;
    const { productloading } = this.props.product;


    //category  list
    const { listcategory, categoryloading } = this.props.category;

    var optionResultCategory = [];
    if (listcategory == null || categoryloading) {
      optionResultCategory = <option value=''>Loading...</option>;
    } else {
      if (Object.keys(listcategory).length > 0) {
        optionResultCategory = listcategory.map((result) => {
          return <option value={result._id}>{result.categoryName}</option>;
        });
      } else {
        optionResultCategory = <option value=''>No Category Found...</option>;
      }
    }

    // Learn this

    const { listsubCategory, subCategoryloading } = this.props.subCategory;

    var optionResultSubCategory = [];
    if (listsubCategory == null || subCategoryloading) {
      optionResultSubCategory = <option value=''>Loading...</option>;
    } else {
      if (
        Object.keys(listsubCategory).length > 0 &&
        this.state.categoryID != ""
      ) {
        var filterSub = listsubCategory.filter(
          (x) => x.categoryID === this.state.categoryID
        );
        if (Object.keys(filterSub).length > 0) {
          optionResultSubCategory = listsubCategory.map((result) => {
            return <option value={result._id}>{result.subCategoryName}</option>;
          });
        } else {
          optionResultSubCategory = (
            <option value=''>
              No SubCategory Found For Selected Category..
            </option>
          );
        }
      } else {
        optionResultSubCategory = (
          <option value=''>No SubCategory Found...</option>
        );
      }
    }

    const { listsubCategoryChild, subCategoryChildloading } =
      this.props.subCategoryChild;

    var optionResultSubCategoryChild = [];
    if (listsubCategoryChild == null || subCategoryChildloading) {
      optionResultSubCategoryChild = <option value=''>Loading...</option>;
    } else {
      if (
        Object.keys(listsubCategoryChild).length > 0 &&
        this.state.categoryID != ""
      ) {
        var filterSub = listsubCategoryChild.filter(
          (x) => x.categoryID === this.state.categoryID
        );
        if (Object.keys(filterSub).length > 0) {
          optionResultSubCategoryChild = listsubCategoryChild.map((result) => {
            return (
              <option value={result._id}>{result.subCategoryChildName}</option>
            );
          });
        } else {
          optionResultSubCategoryChild = (
            <option value=''>
              No SubCategory Found For Selected Category..
            </option>
          );
        }
      } else {
        optionResultSubCategoryChild = (
          <option value=''>No SubCategory Found...</option>
        );
      }
    }


    // Parent Attribute

    // Document

    const documents = this.state.documents.map((value, index) => {
      return (
        <React.Fragment>
          <div className='col-lg-12 mt-3'>
            <label style={{ minWidth: '200px' }} className='col-lg-2 col-form-label main_title'>Button Name</label>
            <div className='col-lg-3'>
              <input
                style={{ minWidth: '245px', border: '1px solid #000' }}
                type='text'
                required
                name='buttonName'
                onChange={(e) => this.handleChange(e, index)}
                className='form-control'
                placeholder=''
              />
              <div className='row'>
              </div>
              <label style={{ minWidth: '200px' }} className='col-lg-2 col-form-label main_title'>
                File {index + 1}
              </label>
              <div className='col-lg-3'>
                <div className='kt-input-icon'>
                  {value.fileName === "" ? (
                    <input
                      style={{ minWidth: '245px', marginLeft: '-8px', border: '1px solid #000' }}
                      type='file'
                      required
                      name='url'
                      onChange={(e) => this.uploadImageBulk(e, index)}
                      className='form-control'
                      placeholder=''
                    />
                  ) : (
                    <button
                      type='button'
                      value={value.fileName}
                      className='btn btn-success btn-sm mt-1'
                    >
                      {value.fileName}
                    </button>
                  )}
                  <span className='form-text text-danger'>{errors.url}</span>
                </div>
                <span className='form-text text-success'>
                  {value.uploadstatus}
                </span>
                <span style={{ minWidth: '200px' }} className='col-lg-2 col-form-label main_title'>Upload Image Only</span>
              </div>
              <div className='col-lg-2'>
              </div>
            </div>
          </div>
        </React.Fragment>
      );
    });




    //AttributeCategory list
    const { listattributecategory, attributecategoryloading } =
      this.props.attributecategory;

    var optionCategory = [];
    if (listattributecategory == null || attributecategoryloading) {
      optionCategory = <option value=''>Loading...</option>;
    } else {
      if (Object.keys(listattributecategory).length > 0) {
        optionCategory = listattributecategory.map((result) => {
          return <option value={result._id}>{result.attributeName}</option>;
        });
      } else {
        optionCategory = (
          <option value=''>No Attributes Category Found...</option>
        );
      }
    }

    // Variant list


    return (
      <React.Fragment>
        <div className={"add_product_screen"}>
          <Asidebar></Asidebar>
          <div
            id='kt_header'
            className='kt-header kt-grid__item  kt-header--fixed '
          >
            <Header></Header>
            <HeaderTopbar></HeaderTopbar>
            <SubHeader first='Home' second='Add Product' third=''></SubHeader>
          </div>
          <div id='dark-bg' className={"add_main_wrapper"}>
            <div className={"add_heading"}>
              <Link to='/'>
                {/* <ArrowBack className='arrow_icon'></ArrowBack> */}
              </Link>
              <span className={"add_main_title"}>Add Product</span>
            </div>
            <div className='add_product_row'>
              <div className='add_product_main_col'>
                <div className='main_content_container'>
                  <div className='title_and_value'>
                    <div className='add_product_title'>
                      <label className='main_title'>Title</label>
                      <input
                        name='name'
                        onChange={this.onChange}
                        value={this.state.name}
                        type='text' className='add_product_input'
                      />
                      <span className='form-text text-danger'>
                        {errors.name}
                      </span>
                    </div>
                    <div className='add_product_value'>
                      <label className='main_title'>Value</label>
                      <input value={this.state.productValue} type='text' name='productValue' onChange={this.onChange} className='add_product_input' />
                    </div>
                  </div>
                  <div className='text_area_container'>
                    <label className='main_title'>Description</label>
                    <textarea name='description'
                      onChange={this.onChange}
                      value={this.state.description} id='' cols='55' rows='5'></textarea>
                  </div>
                </div>
                <div className='add_product_media_container'>
                  <label className='main_title'>Media</label>
                  <div className='media_row'>
                    <div className='media_col'>
                      <label htmlFor='file'>

                        {/* <Publish className='upload_img_icon'></Publish> */}
                      </label>
                      <input
                        type='file'
                        name='photoUrl1'
                        onChange={(e) => this.uploadImage(e, "uploadStatus1")}
                        className='form-control_upload'
                        placeholder='Upload Image'
                        style={{ margin: '20px 0 15px 100px' }}
                      // style={{ display: 'none' }}
                      />
                      <span className="form-text text-danger">{errors.photoUrl1}</span>
                      <span className="form-text text-success">{this.state.uploadStatus1}</span>

                      <div className='product_img_titile'>Product Image 1 <span className='red' style={{ color: '#ff0000' }}>*</span> </div>
                    </div>
                    <div className='media_col'>
                      <label htmlFor="file">
                        {/* <Publish className='upload_img_icon'></Publish> */}
                      </label>
                      <input
                        type='file'
                        name='photoUrl2'
                        onChange={(e) => this.uploadImage(e, "uploadStatus2")}
                        className='form-control_upload'
                        placeholder='Upload Image'
                        style={{ margin: '20px 0 15px 100px' }}
                      // style={{ display: 'none' }}
                      />
                      <span className="form-text text-danger">{errors.photoUrl2}</span>
                      <span className="form-text text-success">{this.state.uploadStatus2}</span>
                      <div className='product_img_titile'>Product Image 2</div>
                    </div>
                  </div>
                </div>
                <div className='add_price_container'>
                  <div className='add_product_title'>
                    <label className='main_title'>Price</label>
                    <input type='text' name='price'
                      onChange={this.onChange}
                      value={this.state.price} className='add_product_input' />
                    <span className='form-text text-danger'>
                      {errors.price}
                    </span>
                  </div>
                  <div className='add_product_value'>
                    <label className='main_title'>Discount Price</label>
                    <input
                      name='discountPrice'
                      onChange={this.onChange}
                      value={this.state.discountPrice} type='text' className='add_product_input' />
                    <span className='form-text text-danger'>
                      {errors.discountPrice}
                    </span>
                  </div>
                </div>
                <div className='add_inventory_container'>

                  <div className='add_product_title'>
                    <label className='main_title'>Count In Stock</label>
                    <input name='stockCount'
                      onChange={this.onChange}
                      value={this.state.stockCount} type='text' className='add_product_input' />
                    <span className='form-text text-danger'>
                      {errors.stockCount}
                    </span>
                  </div>
                  <div className='add_product_title'>
                    <label style={{ width: '100%' }} className='main_title'>Genarated SKU </label>
                    <div className='add_product_input sku_genarated_text'>
                      {localStorage.getItem('sku') ? <div>
                        {this.state.sku && skus}
                        {/* {JSON.parse(localStorage.getItem('sku'))} */}
                        {/* {list} */}
                      </div> :
                        <p>

                          No SKU Genarated
                        </p>
                      }


                    </div>
                  </div>
                </div>

                <div className='add_attribute_container'>
                  <label className='main_title'>Add Attribute</label>
                  <div className='select_container'>
                    <select
                      name='subcategoryChildID'
                      onChange={(e) => this.onChange(e)}
                      value={this.state.subcategoryChildID}
                      className='form-control_select'
                      placeholder=''
                    >
                      <option value=''>Custom Add Attribute</option>
                    </select>
                    <span onClick={() => this.onAttributeAdd()} className='select_add_btn'>Add</span>
                    <span onClick={() => this.onSkuSubmit(true)} className='select_add_btn'>Create SKU</span>
                  </div>
                  {/* change here happended */}
                  {/* {this.state.dependentField && this.state.dependentField[0] ? this.state.dependentField.map((res, index) => ( */}
                  {this.state.dependentField && this.state.dependentField[0] ? this.state.dependentField.map((res, index) => (
                    <div className={`attribute_dropdown_container`}>
                      <div className='attribute_dropdown_wrapper'>
                        <div className='attirbute_dropdown_content'>
                          New Attribute
                        </div>
                        <div onClick={() => this.onCollpase(index)} style={{ width: '76%' }} className='collapse_container'>
                          <i className="fas fa-sort-down"></i>
                        </div>
                        <div className='attribute_dropdown_icon_container'>

                          {/* <KeyboardArrowDown></KeyboardArrowDown>
                          <KeyboardArrowUp></KeyboardArrowUp> */}
                          <button onClick={() => this.deleteAttribute(index, res._id)} className='attribute_dropdown_delete'>Delete</button>
                        </div>
                      </div>
                      <div className={`create_attribute_container  ${this.state.collpase[index].click ? 'hide' : 'show'}`}>
                        {this.state.dependentField[index].mappingType === 'imageUpload' ? "" :
                          <div className='create_attribute_row'>
                            <div className='add_product_title'>
                              <label className='main_title'>Select Parent Category</label>
                              <select
                                name='parentCategory'
                                onChange={(e) => this.onhandleChangeSubField(e, index)}
                                value={this.state.dependentField[index].parentAttributeCategoryID ? this.state.dependentField[index].parentAttributeCategoryID : ''}
                                className='form-control_select'
                                placeholder=''
                              >
                                <option value=''>Select Category</option>
                                {optionParentCategory}
                              </select>
                              <span className="form-text text-danger">{errors.parentAttributeCategoryID}</span>
                            </div>
                            <div className='add_product_value'>
                              <label className='main_title'>Title </label>
                              <input type='text' name='mappingName' onChange={(e) => this.onhandleChangeSubField(e, index)}
                                value={this.state.dependentField[index].mappingName ? this.state.dependentField[index].mappingName : ''}
                                // value={this.state.dependentField[index].mappingName}
                                className='add_product_input' />
                            </div>
                          </div>
                        }
                        {this.state.dependentField[index].mappingType === 'imageUpload' ? "" :
                          <div className='create_attribute_row'>
                            <div className='add_product_title'>
                              <label className='main_title'>Select Category</label>
                              <select name="category" onChange={(e) => this.onhandleChangeSubField(e, index)} value={res.attributeCategoryID ? this.state.dependentField[index].attributeCategoryID : ''} className="form-control_select" placeholder="" >
                                <option value="">Select</option>
                                {optionCategory}
                              </select>
                              <span className="form-text text-danger">{errors.attributeCategoryID}</span>
                            </div>
                            <div className='add_product_value'>
                              <label className='main_title'>Addional Cost</label>
                              <input name='additionalPrice' onChange={(e) => this.onhandleChangeSubField(e, index)}
                                value={this.state.dependentField[index].additionalPrice ? this.state.dependentField[index].additionalPrice : ''} type='text' className='add_product_input' />
                            </div>

                            {/* */}
                          </div>
                        }

                        <div className='create_attribute_row'>
                          <div className='add_product_title'>
                            <label className='main_title'>Type</label>
                            <select
                              name='type'
                              onChange={(e) => this.onhandleChangeSubField(e, index)}
                              value={this.state.dependentField[index].mappingType ? this.state.dependentField[index].mappingType : ''}
                              className='form-control_select'
                              placeholder=''
                            >
                              <option value=''>Select</option>
                              <option value="dropdown">Dropdown</option>
                              <option value="color">Color Code</option>
                              <option value="image+text">Image+Text</option>
                              <option value="imageUpload">Image Upload</option>
                            </select>
                          </div>


                          {this.state.dependentField[index].mappingType === 'imageUpload' ? "" :

                            <div className='add_product_value'>
                              <label className='main_title'>Option Name</label>
                              <input type='text' name='label' onChange={(e) => this.onhandleChangeSubField(e, index)}
                                value={this.state.dependentField[index].mappingLabel ? this.state.dependentField[index].mappingLabel : ''} className='add_product_input' />
                            </div>
                          }


                        </div>
                        {this.state.dependentField[index].mappingType === 'imageUpload' ? "" :

                          <div className='create_attribute_row'>
                            <div className='add_product_title'>
                              <label className='main_title'>isEnabled</label>
                              <select
                                name='isEnabled'
                                onChange={(e) => this.onhandleChangeSubField(e, index)}
                                value={res.isEnabled ? this.state.dependentField[index].isEnabled : ''}
                                className='form-control_select'
                                placeholder=''
                              >
                                <option value="">Select isEnabled</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                              </select>
                            </div>
                            <div className='add_product_value'>
                              <div className='add_product_title'>
                                <label className='main_title'>Value</label>
                                <input name='value' onChange={(e) => this.onhandleChangeSubField(e, index)}
                                  value={this.state.dependentField[index].mappingValue ? this.state.dependentField[index].mappingValue : ''} className='add_product_input' type='text'></input>
                              </div>
                            </div>
                          </div>
                        }
                        {this.state.dependentField[index].mappingType === 'imageUpload' ? "" :
                          <div className='create_attribute_row'>
                            <div className='add_product_title'>

                              <label className='main_title'>Sub Field</label>
                              <select
                                name='subField'
                                onChange={(e) => this.onhandleChangeSubField(e, index)}
                                value={this.state.dependentField[index].subField ? this.state.dependentField[index].subField : ''}
                                className='form-control_select'
                                placeholder=''
                              >
                                <option value='select'>Select</option>
                                <option value='Yes'>Yes</option>
                                <option value='No'>No</option>
                              </select>
                            </div>

                            <div className='add_product_title'>
                              {this.state.dependentField[index].mappingType === "image+text" && <React.Fragment>
                                <label className="main_title">Upload  Image:</label>
                                <input type="file" name="photoUrl" onChange={(e) => this.uploadAttributeImage(e, index)} className='form-control_upload'
                                  placeholder='Upload Image'
                                />
                                <span className="form-text text-danger">{errors.photoUrl}</span>
                                <span className="form-text text-success">{this.state.uploadStatus}</span>
                                <span className="form-text text-muted">File Resolution (292px X 69px)</span>
                              </React.Fragment>}
                            </div>
                          </div>
                        }
                        {this.state.dependentField[index].mappingType === 'imageUpload' ? "" :
                          <div style={{ marginTop: '20px' }} className='add_product_title'>

                            <label className='main_title'>Add-on Attribute</label>
                            <select
                              name='addOn'
                              onChange={(e) => this.onhandleChangeSubField(e, index)}
                              value={this.state.dependentField[index].addOn ? this.state.dependentField[index].addOn : ''}
                              className='form-control_select'
                              placeholder=''
                            >
                              <option value='No'>No</option>
                              <option value='Yes'>Yes</option>
                            </select>
                          </div>
                        }
                        {/* variant */}
                        {this.state.dependentField[index].subField === 'Yes' &&
                          // this.state.listVariants.map((value, index) => (


                          <div style={{ padding: '0' }} className='add_variant_container'>
                            <label className='main_title'>Add Variants</label>
                            <div style={{ marginTop: '35px' }} className='create_attribute_row'>
                              <div className='add_product_value'>

                                <label className='main_title'>Variant Type</label>
                                <select
                                  name='type'
                                  onChange={(e) => this.onhandleChangeVariantField(e, index)}
                                  value={this.state.listVariants[index].type}
                                  className='form-control_select'
                                  placeholder=''
                                >
                                  <option value=''>Select type</option>
                                  <option value='dropdown'>Dropdown</option>
                                  <option value='color'>Color Code</option>
                                </select>
                              </div>
                              <div className='add_product_value'>
                                <label className='main_title'>Variant Name</label>
                                <input
                                  type='text'
                                  name='name'
                                  onChange={(e) => this.onhandleChangeVariantField(e, index)}
                                  value={this.state.listVariants[index].label}
                                  className='add_product_input'
                                  placeholder=''
                                />
                              </div>
                            </div>
                            {/* variation editing */}
                            {/* <button style={{ margin: '17px 0 10px 0' }} onClick={() => this.resetAllAttribute()} className='select_add_btn'>Add New</button> */}
                            {/* {res.(JSO)} */}
                            <div style={{ backgroundColor: '#fff' }} className='attribute_dropdown_container'>
                              {this.state.listVariants[index].list.map((value, idx) => (
                                <div className='attribute_list_container'>
                                  <div className='attribute_dropdown_wrapper'>

                                    <div className='attirbute_dropdown_content'>
                                      Added Variants SKU: {this.state.sku && this.state.sku[idx]}
                                    </div>
                                    <div div className='attribute_dropdown_icon_container'>
                                      {/* <KeyboardArrowDown></KeyboardArrowDown>
                                   <KeyboardArrowUp></KeyboardArrowUp> */}
                                      {/* <span className='attribute_dropdown_delete'>Delete</span> */}
                                    </div>
                                  </div>

                                  <div className='create_attribute_row'>
                                    <div className='add_product_value'>
                                      <label className='main_title'>Label</label>
                                      <input value={value.label} required name='label' onChange={(e) =>
                                        this.onhandleChangeVariantField(e, index, idx, true)
                                      }
                                        // value={this.state.variantDependentField[index].label}  

                                        type='text'
                                        className='add_product_input' />
                                    </div>
                                    <div className='add_product_value'>
                                      <label className='main_title'>Price</label>
                                      <input value={value.additionalPrice} name='additionalPrice'
                                        onChange={(e) =>
                                          this.onhandleChangeVariantField(e, index, idx, true)
                                        }
                                        // value={this.state.variantDependentField[index].additionalPrice} 

                                        type='text' className='add_product_input' />
                                    </div>


                                  </div>
                                  <div className='create_attribute_row'>

                                    <div className='add_product_value'>
                                      <label className='main_title'>Value</label>
                                      <input value={value.value} required name='value'
                                        // onChange={(e) =>
                                        //   this.onhandleChangeSubField(e, index)
                                        // }
                                        // value={this.state.variantDependentField[index].value}                                                            name='value'        
                                        onChange={(e) => this.onhandleChangeVariantField(e, index, idx, true)} type='text' className='add_product_input' />

                                    </div>
                                  </div>
                                </div>
                              ))}
                              <button style={{ backgroundColor: '#FF5243', marginBottom: '25px' }} onClick={() => this.onVariantSubmit(index, false)} className='product_publish_btn mt-4'>Save Variant</button>
                              {/* <button style={{ backgroundColor: '#FF5243', marginBottom: '25px' }} onClick={() => this.addVariant(index, false)} className='product_publish_btn mt-4'>Add Anothers</button> */}
                            </div>
                          </div>
                          // ))
                        }

                        <div className='attribute_create_button'>
                          <button onClick={() => this.onAttributeSubmit(index)} className='product_publish_btn'>Save New</button>
                          <button style={{ marginLeft: '20px', backgroundColor: '#9b9b9b' }} onClick={() => this.onAttributeSubmit(index, true)} className='product_publish_btn'>Edit</button>
                        </div>
                      </div>

                    </div>
                  )) :

                    // <div className='attribute_dropdown_container'>
                    //   <div className='attribute_dropdown_wrapper'>
                    //     <div className='attirbute_dropdown_content'>
                    //       New Attribute
                    //     </div>
                    //     <div className='attribute_dropdown_icon_container'>
                    //       {/* <KeyboardArrowDown></KeyboardArrowDown>
                    //       <KeyboardArrowUp></KeyboardArrowUp> */}
                    //       <span onClick={() => this.deleteAttribute(0, this.state.dependentField[0]._id)} className='attribute_dropdown_delete'>Delete</span>
                    //     </div>
                    //   </div>
                    //   <div className='create_attribute_container'>
                    //     <div className='create_attribute_row'>
                    //       <div className='add_product_title'>
                    //         <label className='main_title'>Select Parent Category</label>
                    //         <select
                    //           name='parentCategory'
                    //           onChange={(e) => this.onhandleChangeSubField(e, 0)}
                    //           value={this.state.dependentField[0].parentAttributeCategoryID}
                    //           className='form-control_select'
                    //           placeholder=''
                    //         >
                    //           <option value=''>Select Category</option>
                    //           {optionParentCategory}
                    //         </select>
                    //         <span className="form-text text-danger">{errors.parentAttributeCategoryID}</span>
                    //       </div>
                    //       <div className='add_product_value'>
                    //         <label className='main_title'>Mapping Name</label>
                    //         <input type='text' name='mappingName' onChange={(e) => this.onhandleChangeSubField(e, 0)}
                    //           value={this.state.dependentField[0].mappingName}
                    //           className='add_product_input' />
                    //       </div>
                    //     </div>
                    //     <div className='create_attribute_row'>
                    //       <div className='add_product_title'>
                    //         <label className='main_title'>Select Category</label>
                    //         <select name="category" onChange={(e) => this.onhandleChangeSubField(e, 0)} value={this.state.dependentField[0].attributeCategoryID} className="form-control_select" placeholder="" >
                    //           <option value="">Select</option>
                    //           {optionCategory}
                    //         </select>
                    //         <span className="form-text text-danger">{errors.attributeCategoryID}</span>
                    //       </div>
                    //       <div className='add_product_value'>
                    //         <label className='main_title'>Additional Costs</label>
                    //         <input name='additionalPrice' onChange={(e) => this.onhandleChangeSubField(e, 0)}
                    //           value={this.state.dependentField[0].additionalPrice} type='text' className='add_product_input' />
                    //       </div>

                    //       {/* */}
                    //     </div>
                    //     <div className='create_attribute_row'>
                    //       <div className='add_product_title'>
                    //         <label className='main_title'>Type</label>
                    //         <select
                    //           name='type'
                    //           onChange={(e) => this.onhandleChangeSubField(e, 0)}
                    //           value={this.state.dependentField[0].mappingType}
                    //           className='form-control_select'
                    //           placeholder=''
                    //         >
                    //           <option value=''>Select</option>
                    //           <option value="dropdown">Dropdown</option>
                    //           <option value="color">Color Code</option>
                    //           <option value="image+text">Image+Text</option>
                    //         </select>
                    //       </div>
                    //       <div className='add_product_value'>
                    //         <label className='main_title'>Attribute Title</label>
                    //         <input type='text' name='label' onChange={(e) => this.onhandleChangeSubField(e, 0)}
                    //           value={this.state.dependentField[0].mappingLabel} className='add_product_input' />
                    //       </div>


                    //     </div>
                    //     <div className='create_attribute_row'>
                    //       <div className='add_product_title'>
                    //         <label className='main_title'>isEnabled</label>
                    //         <select
                    //           name='isEnabled'
                    //           onChange={(e) => this.onhandleChangeSubField(e, 0)}
                    //           value={this.state.dependentField[0].isEnabled}
                    //           className='form-control_select'
                    //           placeholder=''
                    //         >
                    //           <option value="">Select isEnabled</option>
                    //           <option value="Yes">Yes</option>
                    //           <option value="No">No</option>
                    //         </select>
                    //       </div>
                    //       <div className='add_product_value'>
                    //         <div className='add_product_title'>
                    //           <label className='main_title'>Value</label>
                    //           <input name='value' onChange={(e) => this.onhandleChangeSubField(e, 0)}
                    //             value={this.state.dependentField[0].mappingValue} className='add_product_input' type='text'></input>
                    //         </div>

                    //       </div>



                    //     </div>
                    //     <div className='create_attribute_row'>
                    //       <div className='add_product_title'>

                    //         <label className='main_title'>Sub Field</label>
                    //         <select
                    //           name='subField'
                    //           onChange={(e) => this.onhandleChangeSubField(e, 0)}
                    //           value={this.state.dependentField[0].subField}
                    //           className='form-control_select'
                    //           placeholder=''
                    //         >
                    //           <option value='select'>Select</option>
                    //           <option value='Yes'>Yes</option>
                    //           <option value='No'>No</option>
                    //         </select>
                    //       </div>
                    //       <div className='add_product_title'>
                    //         {this.state.dependentField[0].mappingType === "image+text" && <React.Fragment>
                    //           <label className="main_title">Upload  Image:</label>
                    //           <input type="file" name="photoUrl" onChange={(e) => this.uploadAttributeImage(e, 0)} className='form-control_upload'
                    //             placeholder='Upload Image'
                    //           />
                    //           <span className="form-text text-danger">{errors.photoUrl}</span>
                    //           <span className="form-text text-success">{this.state.uploadStatus}</span>
                    //           <span className="form-text text-muted">File Resolution (292px X 69px)</span>
                    //         </React.Fragment>}
                    //       </div>

                    //     </div>
                    //     {/* variant  for the first one*/}
                    //     {this.state.dependentField[0].subField === 'Yes' &&
                    //       <div style={{ padding: '0' }} className='add_variant_container'>
                    //         <label className='main_title'>Add Variants</label>

                    //         <div style={{ marginTop: '35px' }} className='create_attribute_row'>
                    //           <div className='add_product_value'>

                    //             <label className='main_title'>Variant Type</label>
                    //             <select
                    //               name='type'
                    //               onChange={(e) => this.onhandleChangeField(e)}
                    //               value={this.state.type}
                    //               className='form-control_select'
                    //               placeholder=''
                    //             >
                    //               <option value=''>Select type</option>
                    //               <option value='dropdown'>Dropdown</option>
                    //               <option value='color'>Color Code</option>
                    //             </select>
                    //           </div>
                    //           <div className='add_product_value'>
                    //             <label className='main_title'>Variant Name</label>
                    //             <input
                    //               type='text'
                    //               name='label'
                    //               onChange={(e) => this.onhandleChangeField(e)}
                    //               value={this.state.label}
                    //               className='add_product_input'
                    //               placeholder=''
                    //             />
                    //           </div>
                    //         </div>
                    //         {/* <button style={{ margin: '17px 0 10px 0' }} onClick={() => this.resetAllAttribute()} className='select_add_btn'>Add New</button> */}

                    //         {this.state.listVariants[0].list.map((value, idx) => (


                    //           <div style={{ backgroundColor: '#fff' }} className='attribute_dropdown_container'>
                    //             <div className='attribute_dropdown_wrapper'>

                    //               <div className='attirbute_dropdown_content'>
                    //                 Added Variants SKU:
                    //               </div>
                    //               <div div className='attribute_dropdown_icon_container'>
                    //                 {/* <KeyboardArrowDown></KeyboardArrowDown>
                    //                <KeyboardArrowUp></KeyboardArrowUp>  */}
                    //               </div>
                    //             </div>
                    //             <div className='create_attribute_row'>
                    //               <div className='add_product_value'>
                    //                 <label className='main_title'>Label</label>
                    //                 <input
                    //                   value={this.state.listVariants[0].list[idx].label}
                    //                   required name='label' onChange={(e) =>
                    //                     this.onhandleChangeVariantField(e, 0, idx, true)
                    //                   }
                    //                   // value={this.state.variantDependentField[index].label}  

                    //                   type='text'
                    //                   className='add_product_input' />
                    //               </div>
                    //               <div className='add_product_value'>
                    //                 <label className='main_title'>Price</label>
                    //                 <input
                    //                   value={this.state.listVariants[0].list[idx].additionalPrice}
                    //                   name='additionalPrice'
                    //                   onChange={(e) =>
                    //                     this.onhandleChangeVariantField(e, 0, idx, true)
                    //                   }
                    //                   // value={this.state.variantDependentField[index].additionalPrice} 

                    //                   type='text' className='add_product_input' />
                    //               </div>


                    //             </div>
                    //             <div className='create_attribute_row'>

                    //               <div className='add_product_value'>
                    //                 <label className='main_title'>Value</label>
                    //                 <input
                    //                   value={this.state.listVariants[0].list[idx].value}
                    //                   required name='value' onChange={(e) =>
                    //                     this.onhandleChangeVariantField(e, 0, idx)
                    //                   }
                    //                   // value={this.state.variantDependentField[index].value}                                                            name='value'        
                    //                   onChange={(e) => this.onhandleChangeVariantField(e, 0, idx)} type='text' className='add_product_input' />

                    //               </div>
                    //             </div>
                    //             <button style={{ backgroundColor: '#FF5243', marginBottom: '25px' }} onClick={() => this.onVariantSubmit(0)} className='product_publish_btn mt-4'>Save Variant</button>
                    //           </div>
                    //         ))}
                    //       </div>
                    //     }
                    //     {/* variant end */}
                    //   </div>
                    //   <div className='attribute_create_button'>
                    //     <button onClick={() => this.onAttributeSubmit(0)} className='product_publish_btn'>Save New</button>
                    //     {/* <button onClick={() => this.onSkuSubmit(false, 0)} className='product_publish_btn'>Save New</button> */}
                    //     <button style={{ marginLeft: '20px', backgroundColor: '#9b9b9b' }} onClick={() => this.onEditAttribute(0)} className='product_publish_btn'>Edit</button>
                    //   </div>
                    // </div>
                    <h1></h1>
                  }


                </div>
                {/* Attribute Container End */}
                {/* <EditAttributeMapping /> */}
              </div>
              <div className='add_product_secondary_col'>
                <div className='product_status_container'>
                  <div className='product_status'>Product Status</div>
                  <div className='product_status_value_container'>
                    <div className='product_status_value'>Status: Draft</div>
                    <div className='product_status_value'>Visibility: Public</div>
                    <div className='product_status_value'>Created At: </div>
                  </div>
                  <div style={{ marginLeft: '20px' }} className='product_publish_container'>
                    <button onClick={() => this.onSubmit()} className='product_publish_btn'>Publish</button>
                  </div>
                </div>
                <div className='product_group_container'>
                  <div className='product_status'>Product Group</div>
                  <div style={{ padding: '30px 20px 0 20px' }} className='add_product_title'>
                    <label className='main_title'>Select Group  <span className='red' style={{ color: '#ff0000' }}>*</span></label>
                    <select
                      required
                      name='categoryID'
                      onChange={(e) => this.onChange(e)}
                      value={this.state.categoryID}
                      className='form-control_select'
                      placeholder=''
                    >
                      <option value=''>Select Group</option>

                      {optionResultCategory}
                    </select>
                  </div>
                  <div style={{ padding: '0 20px' }} className='add_product_title'>
                    <label className='main_title'>Select Sub Group  <span className='red' style={{ color: '#ff0000' }}>*</span></label>
                    <select
                      required
                      name='subcategoryID'
                      onChange={(e) => this.onChange(e)}
                      value={this.state.subcategoryID}
                      className='form-control_select'
                      placeholder=''
                    >
                      <option value=''>Select Sub-Group</option>
                      {optionResultSubCategory}
                    </select>
                    <span className='form-text text-danger'>
                      {errors.subcategoryID}
                    </span>
                  </div>
                  <div style={{ padding: '0 20px 30px 20px' }} className='add_product_title'>
                    <label className='main_title'>Select Sub Group Child</label>
                    <select
                      name='subcategoryChildID'
                      onChange={(e) => this.onChange(e)}
                      value={this.state.subcategoryChildID}
                      className='form-control_select'
                      placeholder=''
                    >
                      <option value=''>Select</option>
                      {optionResultSubCategoryChild}
                    </select>
                    <span className='form-text text-danger'>
                      {errors.subcategoryChildID}
                    </span>
                  </div>
                </div>
                <div className='product_options_container'>
                  <div className='product_status'>Product Options</div>
                  <div style={{ padding: '30px 20px 0 20px' }} className='add_product_title'>
                    <label className='main_title'>Keyword (Optional)</label>
                    <input
                      name='keyword'
                      onChange={this.onChange}
                      value={this.state.keyword}
                      className='form-control_select'
                      placeholder=''
                    >
                    </input>
                    <span className='form-text text-danger'>
                      {errors.keyword}
                    </span>
                    <span className='form-text'>
                      Enter the values seprated by Comma (Dress,Jeans)
                    </span>
                  </div>
                  <div style={{ padding: '0 20px 0 20px' }} className='add_product_title'>
                    <label className='main_title'>Quick Ship</label>
                    <select
                      onChange={this.onChange} value={this.state.quickship}
                      name='quickship'

                      className='form-control_select'
                      placeholder=''
                    >
                      <option value=''>Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div style={{ padding: '0px 20px 30px 20px' }} className='add_product_title'>
                    <label className='main_title'>isEnabled</label>
                    <select
                      name='isEnabled'
                      onChange={this.onChange}
                      value={this.state.isEnabled}
                      className='form-control_select'
                      placeholder=''
                    >
                      <option value=''>Select isEnabled</option>
                      <option value='Yes'>Yes</option>
                      <option value='No'>No</option>
                    </select>
                    <span className='form-text text-danger'>
                      {errors.isEnabled}
                    </span>
                  </div>
                </div>
                <div className='product_gallery_conatiner'>
                  <div className='product_status_container'>
                    <div className='product_status'>Product Gallery</div>
                    <div className='product_gallery_upload_container'>
                      {documents}
                      {/* <div className='add_gallery_link'>
                    <Link to='#'>Add Product Image Gallery <span className='red' style={{color:'#ff0000'}}>*</span></Link>

                    </div>
                  <div className='product_btn_name_container'>
                    <label style={{marginLeft:'20px'}} className='main_title mt-3'>Button Name</label>
                    <input name='buttonName'
                  onChange={(e) => this.handleChange(e, index)} style={{width:'245px', marginTop:'10px', marginLeft:'20px', marginRight:'20px', marginBottom: '30px'}} type='text' className='add_product_input'></input>
                  </div> */}
                    </div>
                  </div>
                </div>
                <div className='product_maintanence_container'>
                  <div className='product_status'>Product Maintanence</div>
                  <div className='maintancence_upload'>
                    <div className='add_gallery_link'>
                      <Link to='#'>Maintenance File Upload </Link>
                      <input
                        type='file'
                        name='maintenanceFileUrl'
                        onChange={(e) =>
                          this.uploadImage(e, "uploadStatus3")
                        }
                        className='form-control'
                        placeholder=''
                      />
                    </div>
                    <span className='form-text text-danger'>
                      {errors.maintenanceFileUrl}
                    </span>

                    <span className='form-text text-success'>
                      {this.state.uploadStatus3}
                    </span>
                  </div>
                  <div style={{ padding: '30px 20px 0 20px' }} className='add_product_title'>
                    <label className='main_title'>Maintanence Button Text</label>
                    <textarea type='text'
                      name='maintenanceBtnText'
                      onChange={this.onChange}
                      value={this.state.maintenanceBtnText} style={{ height: '30px' }} type='text' />
                  </div>
                  <span className='form-text text-danger'>
                    {errors.maintenanceBtnText}
                  </span>
                  <div style={{ padding: '30px 20px 0 20px' }} className='add_product_title'>
                    <label className='main_title'>Maintanence Text</label>
                    <textarea name='maintenanceText'
                      onChange={this.onChange}
                      value={this.state.maintenanceText} style={{ height: '75px' }} type='text' />
                    <span className='form-text text-danger'>
                      {errors.maintenanceText}
                    </span>
                  </div>
                  <div style={{ padding: '30px 20px 30px 20px' }} className='add_product_title'>
                    <label className='main_title'>Acoustic Text</label>
                    <textarea name='acousticsText'
                      onChange={this.onChange}
                      value={this.state.acousticsText} style={{ height: '75px' }} type='text' />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div style={{ marginTop: '700px' }}>

            {/* width: 100%;
    bottom: 0; */}
            <Footer style={{ marginTop: '280px' }} />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

AddProductScreen.propTypes = {
  auth: PropTypes.object.isRequired,
  addProduct: PropTypes.func.isRequired,
  listCategory: PropTypes.func.isRequired,
  listSubCategoryOne: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
  product: state.product,
  author: state.author,
  category: state.category,
  subCategory: state.subCategory,
  subCategoryChild: state.subCategoryChild,
  attributemapping: state.attributemapping,
  parentattributecategory: state.parentattributecategory,
  attributecategory: state.attributecategory,
  addAttributeMapping: state.addAttributeMapping,
});

export default connect(mapStateToProps, {
  addProduct,
  listCategory,
  listSubCategoryOne,
  listSubCategoryChildOne,
  editProduct,
  createDraftProduct,
  listParentAttributeCategory,
  addAttributeMapping,
  listAttributeCategory,
  editAttributeMapping,
  listProductOne,
  deleteAttributeMapping,
  listAttributeMapping,
  addAttributeMappingDraft


})(AddProductScreen);
