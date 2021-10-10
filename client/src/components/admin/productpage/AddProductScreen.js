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

import skuGen from "./logic-sku/app";
import ListParentAttributeCategory from "../parentattributecategory/ListParentAttributeCategory";
import AddParentAttributeCategory from "./AddParentAttributeCategory";

// Imported
import { PropTypes } from "prop-types";
import { connect } from "react-redux";
import Footer from "../../layouts/Footer";
import { addProduct } from "../../../actions/productAction";
import { listCategory } from "../../../actions/categoryAction";
import { listSubCategoryOne } from "../../../actions/subCategoryAction";
import { listSubCategoryChildOne } from "../../../actions/subCategoryChildAction";
import ListAttributeMapping from "./ListAttributeMapping";

// import ArrowBackIcon from "@mui/icons-material";
import {
  ArrowBack,
  Publish,
  KeyboardArrowDown,
  KeyboardArrowUp
} from "@material-ui/icons";
import { listAttributeMapping } from "../../../actions/attributemappingAction";


const Toast = swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
});



class AddProductScreen extends React.Component {
  constructor() {
    super();
    this.state = {
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
      productValue: "",
      attributeValue: "",
      variantValue: "",
      count:0,
      sku:[{}],

    };


    this.onChange = this.onChange.bind(this);
      this.onSubmit = this.onSubmit.bind(this);
      this.onReset = this.onReset.bind(this);
      this.uploadImage = this.uploadImage.bind(this);
      this.uploadImageBulk = this.uploadImageBulk.bind(this);
      
  }

  componentDidMount() {
    this.props.listCategory();
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

        // self.setState({
        //     url:response.data,
        //     uploadStatus:'Uploaded SuccessFully'
        // })
      })
      .catch((err) => {
        console.log(err);
      });
  }

onSkuSubmit () {
  const result = skuGen(this.state.productValue, this.state.attributeValue, this.state.variantValue)
  console.log(result);
  // var joined = this.state.sku.concat(result)
  // this.setState({sku:joined})
  this.setState({sku:[ ...result]});
}


 onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
    // if(e.target.name==='authorID' && e.target.value !=""){
    //     this.props.listCategory({authorID:e.target.value});
    // }
      if (this.state.productValue) {
      this.setState({count:1})
    } else {
      this.setState({count:0})
    }

      if (this.state.attributeValue) {
      this.setState({count:2})
    } else {
      this.setState({count:1})
    }

      if (this.state.variantValue) {
      this.setState({count:3})
    } else {
      this.setState({count:2})
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
    e.preventDefault();
    const Data = {
      name: this.state.name,
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
    };
    this.props.addProduct(Data);
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

  
  render() {

console.log(this.state.sku[1]);


const list = this.state.sku.toString()
// const list = this.state.sku.length >1 && this.state.sku.forEach(function(result, idx) {
//   console.log('hiii')
//   return <li>{this.state.sku[idx]}</li>
// })
console.log(list)
    const {listattributemapping,attributemappingloading}=this.props.attributemapping;

    if (Object.keys(listAttributeMapping).length > 0){
      
      let fa = listattributemapping.map(result=>(result.mappingName))
      console.log(fa)
    } 
    
    
    console.log(this.props.attributemapping.listattributemapping)
    
    const { errors,productValue,count } = this.state;
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
        // if (Object.keys(filterSub).length > 0) {
        //   optionResultSubCategoryChild = listsubCategoryChiild.map((result) => {
        //     return (
        //       <option value={result._id}>{result.subCategoryChildName}</option>
        //     );
        //   });
        // } else {
        //   optionResultSubCategoryChild = (
        //     <option value=''>
        //       No SubCategory Found For Selected Category..
        //     </option>
        //   );
        // }
      } else {
        optionResultSubCategoryChild = (
          <option value=''>No SubCategory Found...</option>
        );
      }
    }


    
    return (
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
        <div className={"add_main_wrapper"}>
          <div className={"add_heading"}>
            <Link to='/'>
              <ArrowBack className='arrow_icon'></ArrowBack>
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
                    <input type='text' name='productValue' onChange={this.onChange} className='add_product_input' />
                  </div>
                </div>
                <div className='text_area_container'>
                  <label className='main_title'>Description</label>
                  <textarea   name='description'
                              onChange={this.onChange}
                              value={this.state.description} id='' cols='55' rows='5'></textarea>
                </div>
              </div>
              <div className='add_product_media_container'>
                <label className='main_title'>Media</label>
                <div className='media_row'>
                  <div className='media_col'>
                    <Publish className='upload_img_icon'></Publish>
                    <input
                      type='file'
                      name='photoUrl1'
                      onChange={(e) => this.uploadImage(e, "uploadStatus1")}
                      className='form-control_upload'
                      placeholder='Upload Image'
                      style={{display:'none'}}
                    />
                    <div className='product_img_titile'>Product Image 1 <span className='red' style={{color:'#ff0000'}}>*</span> </div>
                  </div>
                  <div className='media_col'>
                    <label htmlFor="file">
                    <Publish className='upload_img_icon'></Publish>
                    </label>
                    <input
                      type='file'
                      name='photoUrl1'
                      onChange={(e) => this.uploadImage(e, "uploadStatus1")}
                      className='form-control_upload'
                      placeholder='Upload Image'
                      style={{display:'none' }}
                    />
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
                  <label  className='main_title'>Discount Price</label>
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
                  <label style={{width:'100%'}} className='main_title'>Genarated SKU </label>
                  <div className='add_product_input sku_genarated_text'>
                    {this.state.sku.length > 1 ? <div>
                      {list}
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
                  <option value=''>Select</option>
                         {this.props.attributemapping.listattributemapping && this.props.attributemapping.listattributemapping.map((result) => (<option value={result.mappingName}> {result.mappingName} </option>))}
                  {/* {optionResultSubCategoryChild} */}
                </select>
                <span className='select_add_btn'>Add</span>
              </div>
              <div className='attribute_dropdown_container'>
                <div className='attirbute_dropdown_content'>

                color
                </div>
                <div className='attribute_dropdown_icon_container'>
                  <KeyboardArrowDown></KeyboardArrowDown>
                  <KeyboardArrowUp></KeyboardArrowUp>
                  <span className='attribute_dropdown_delete'>Delete</span>
                </div>
              </div>
              <div className='create_attribute_container'>
                <div className='create_attribute_row'>
                  <div className='add_product_title'>
                    <label className='main_title'>Select Parent Category</label>
                     <select
                       name='subcategoryChildID'
                       onChange={(e) => this.onChange(e)}
                       value={this.state.subcategoryChildID}
                       className='form-control_select'
                       placeholder=''
                      >
                        <option value=''>Select</option>
                          {/* {optionResultSubCategoryChild} */}
                      </select> 
                  </div>
                <div className='add_product_value'>
                  <label className='main_title'>Mapping Name</label>
                  <input type='text' className='add_product_input' />
                </div>
              </div>
                <div className='create_attribute_row'>
                  <div className='add_product_title'>
                    <label className='main_title'>Type</label>
                     <select
                       name='subcategoryChildID'
                       onChange={(e) => this.onChange(e)}
                       value={this.state.subcategoryChildID}
                       className='form-control_select'
                       placeholder=''
                      >
                        <option value=''>Select</option>
                          {/* {optionResultSubCategoryChild} */}
                      </select> 
                  </div>
                <div className='add_product_value'>
                  <label className='main_title'>Label</label>
                  <input type='text' className='add_product_input' />
                </div>
              </div>
              <div className='create_attribute_row'>
                  <div className='add_product_title'>
                    <label className='main_title'>isEnabled</label>
                     <select
                       name='subcategoryChildID'
                       onChange={(e) => this.onChange(e)}
                       value={this.state.subcategoryChildID}
                       className='form-control_select'
                       placeholder=''
                      > <option value=''>Select</option>
                          {/* {optionResultSubCategoryChild} */}
                      </select> 
                  </div>
                <div className='add_product_value'>
                  <label className='main_title'>Additional Cost</label>
                  <input type='text' className='add_product_input' />
                </div>
              </div>
              <div className='create_attribute_row'>
                <div className='add_product_value'>
                  <label className='main_title'>Sub Field</label>
                     <select
                       name='subcategoryChildID'
                       onChange={(e) => this.onChange(e)}
                       value={this.state.subcategoryChildID}
                       className='form-control_select'
                       placeholder=''
                      >
                        
                          {/* {optionResultSubCategoryChild} */}
                      </select>
                </div>
                  <div className='add_product_title'>
                    <label className='main_title'>Value</label>
                    <input name='attributeValue' onChange={(e) => this.onChange(e)} className='add_product_input' type='text'></input>
                  </div>
              </div>
              <div className='attribute_create_button'>
                <button onClick={() => this.onSkuSubmit()} className='product_publish_btn'>Save</button>
              </div>
            </div>
          </div>
{/* Attribute Container End */}
          <div className='add_variant_container'>
              <label className='main_title'>Add Variants</label>
          
                <div className='select_container'>
                <select
                  name='subcategoryChildID'
                  onChange={(e) => this.onChange(e)}
                  value={this.state.subcategoryChildID}
                  className='form-control_select'
                  placeholder=''
                  >
                      <option value=''>Select</option>
                    {this.props.attributemapping.listattributemapping && this.props.attributemapping.listattributemapping.map((result) => (<option value={result.mappingName}> {result.mappingName} </option>))}
                  {/* <option value={this.props.attributemapping.listattributemapping && this.props.attributemapping.listattributemapping.map((result) => (result.mappingName))}
                    
                   >{this.props.attributemapping.listattributemapping && this.props.attributemapping.listattributemapping.map((result) => (result.mappingName))}
                  </option> */}
                  {/* {optionResultSubCategoryChild} */}
                </select>
                <span className='select_add_btn'>Add</span>
              </div>
                <div className='attribute_dropdown_container'>
                  <div className='attirbute_dropdown_content'>
                    color
                  </div>
                  <div div className='attribute_dropdown_icon_container'>
                    <KeyboardArrowDown></KeyboardArrowDown>
                    <KeyboardArrowUp></KeyboardArrowUp>
                    <span className='attribute_dropdown_delete'>Delete</span>
                  </div>
                </div>
                  <div className='create_attribute_row'>
                    <div className='add_product_title'>
                      <label className='main_title'>Type</label>
                      <select
                        name='subcategoryChildID'
                        onChange={(e) => this.onChange(e)}
                        value={this.state.subcategoryChildID}
                        className='form-control_select'
                        placeholder=''
                        >
                          <option value=''>Select</option>
                            {/* {optionResultSubCategoryChild} */}
                      </select> 
                    </div>
                    <div className='add_product_value'>
                      <label className='main_title'>Label</label>
                      <input type='text' className='add_product_input' />
                    </div>
                  </div>
                  <div className='create_attribute_row'>
                   <div className='add_product_value'>
                      <label className='main_title'>Additional Cost</label>
                      <input type='text' className='add_product_input' />
                    </div>
                    <div className='add_product_value'>
                      <label className='main_title'>Value</label>
                      <input name='variantValue'  onChange={(e) => this.onChange(e)} type='text' className='add_product_input' />
                    </div>
                  </div>
            </div>
          </div>
            <div className='add_product_secondary_col'>
              <div className='product_status_container'>
                <div className='product_status'>Product Status</div>
                <div className='product_status_value_container'>
                  <div className='product_status_value'>Status: Draft</div>
                  <div className='product_status_value'>Visibility: Public</div>
                  <div className='product_status_value'>Created At: </div>
                </div>
                <div style={{marginLeft:'20px'}} className='product_publish_container'>
                  <button className='product_publish_btn'>Publish</button>
                </div>
              </div>
              <div className='product_group_container'>
                  <div className='product_status'>Product Group</div>
                    <div style={{padding:'30px 20px 0 20px'}} className='add_product_title'>
                      <label className='main_title'>Select Group</label>
                      <select
                              name='categoryID'
                              onChange={(e) => this.onChange(e)}
                              value={this.state.categoryID}
                        className='form-control_select'
                        placeholder=''
                        >
                          <option value=''>Select</option>
                            {/* {optionResultSubCategoryChild} */}
                      </select> 
                    </div>
                      <div style={{padding:'0 20px'}} className='add_product_title'>
                      <label className='main_title'>Select Sub Group</label>
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
                              {errors.subcategoryID}
                            </span>
                    </div>
                      <div style={{padding:'0 20px 30px 20px'}} className='add_product_title'>
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
                    <div style={{padding:'30px 20px 0 20px'}} className='add_product_title'>
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
                    <div style={{padding:'0 20px 0 20px'}} className='add_product_title'>
                      <label className='main_title'>Quick Ship</label>
                      <select
                        name='subcategoryChildID'
                        onChange={(e) => this.onChange(e)}
                        value={this.state.subcategoryChildID}
                        className='form-control_select'
                        placeholder=''
                        >
                          <option value=''>Select</option>
                            {/* {optionResultSubCategoryChild} */}
                      </select> 
                    </div>
                    <div style={{padding:'0px 20px 30px 20px'}} className='add_product_title'>
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
                            {/* {optionResultSubCategoryChild} */}
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
                    <div className='add_gallery_link'>
                    <Link to='#'>Add Product Image Gallery <span className='red' style={{color:'#ff0000'}}>*</span></Link>

                    </div>
                  <div className='product_btn_name_container'>
                    <label style={{marginLeft:'20px'}} className='main_title mt-3'>Button Name</label>
                    <input style={{width:'245px', marginTop:'10px', marginLeft:'20px', marginRight:'20px', marginBottom: '30px'}} type='text' className='add_product_input'></input>
                  </div>
                  </div>
                </div>
              </div>
              <div className='product_maintanence_container'>
                <div className='product_status'>Product Maintanence</div>
                <div className='maintancence_upload'>
                  <div className='add_gallery_link'>
                    <Link to='#'>Maintenance File Upload <span className='red' style={{color:'#ff0000'}}>*</span> </Link>
                    </div>
                </div>
                <div style={{padding:'30px 20px 0 20px'}} className='add_product_title'>
                        <label className='main_title'>Keyword (Optional)</label>
                        <textarea style={{height:'75px'}} type='text' />
                </div>
                <div style={{padding:'30px 20px 30px 20px'}} className='add_product_title'>
                        <label className='main_title'>Acoustic Text</label>
                        <textarea style={{height:'75px'}} type='text' />
                </div>
              </div>
            </div>
          </div>
          <div className='create_attribute_modal_container'>
            <div className='modal_attribute_row'>
              <div className='modal_attribute_col-1'>
                <AddParentAttributeCategory/>
            
              </div>
              <div className='modal_attribute_col-2'>
                <div className='main_heading'>Parent Attribute Category List</div>
                {/*Here add Parent Attribute */}
                <ListParentAttributeCategory/>                 
              </div>
            </div>
          </div>
        </div>
          <ListAttributeMapping history={this.props.history} location={this.props.location}></ListAttributeMapping>
        <Footer/>

      </div>
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
  attributemapping :state.attributemapping
});

export default connect(mapStateToProps, {
  addProduct,
  listCategory,
  listSubCategoryOne,
  listSubCategoryChildOne,
})(AddProductScreen);
