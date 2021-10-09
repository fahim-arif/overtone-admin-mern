import React from "react";
import "./addProductScreen.css";
import Sidebarmobile from "../../layouts/SidebarMobile";
import Asidebar from "../../layouts/Asidebar";
import Header from "../../layouts/Header";
import SubHeader from "../../layouts/SubHeader";
import HeaderTopbar from "../../layouts/HeaderTopbar";
import { Link } from "react-router-dom";
import axios from 'axios'

// Imported
import { PropTypes } from "prop-types";
import { connect } from "react-redux";
import Footer from "../../layouts/Footer";
import { addProduct } from "../../../actions/productAction";
import { listCategory } from "../../../actions/categoryAction";
import { listSubCategoryOne } from "../../../actions/subCategoryAction";
import { listSubCategoryChildOne } from "../../../actions/subCategoryChildAction";

// import ArrowBackIcon from "@mui/icons-material";
import {
  ArrowBack,
  Publish,
  KeyboardArrowDown,
  KeyboardArrowUp
} from "@material-ui/icons";

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

    };


    // this.onChange = this.onChange.bind(this);
    //   this.onSubmit = this.onSubmit.bind(this);
    //   this.onReset = this.onReset.bind(this);
    //   this.uploadImage = this.uploadImage.bind(this);
    //   this.uploadImageBulk = this.uploadImageBulk.bind(this);
      
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


  render() {
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
                    <input type='text' className='add_product_input' />
                  </div>
                  <div className='add_product_value'>
                    <label className='main_title'>Value</label>
                    <input type='text' className='add_product_input' />
                  </div>
                </div>
                <div className='text_area_container'>
                  <label className='main_title'>Description</label>
                  <textarea name='' id='' cols='55' rows='5'></textarea>
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
                      // onChange={(e) => uploadImage(e, "uploadStatus1")}
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
                      // onChange={(e) => uploadImage(e, "uploadStatus1")}
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
                  <input type='text' className='add_product_input' />
                </div>
                <div className='add_product_value'>
                  <label className='main_title'>Discount Price</label>
                  <input type='text' className='add_product_input' />
                </div>
              </div>
              <div className='add_inventory_container'>
                
                <div className='add_product_title'>
                  <label className='main_title'>Count In Stock</label>
                  <input type='text' className='add_product_input' />
                </div>
                <div className='add_product_value'>
                  <label className='main_title'>SKU (Manual)</label>
                  <input type='text' className='add_product_input' />
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
                        <option value=''>Select</option>
                          {/* {optionResultSubCategoryChild} */}
                      </select>
                </div>
                  <div className='add_product_title'>
                    <label className='main_title'>Value</label>
                    <input className='add_product_input' type='text'></input>
                  </div>
              </div>
              <div className='attribute_create_button'>
                <button className='product_publish_btn'>Save</button>
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
                  <option value=''>Select Attribute</option>
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
              <div className='product_gallery_conatiner'>
                <div className='product_status_container'>
                  <div className='product_status'>Product Gallery</div>
                  <div className='product_gallery_upload_container'>
                    <Link to='#'>Add Product Image Gallery</Link>
                  <div className='product_btn_name_container'>
                    <label className='main_title mt-3'>Button Name</label>
                    <input style={{width:'245px', marginTop:'10px', marginLeft:'20px', marginRight:'20px'}} type='text' className='add_product_input'></input>
                  </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='create_attribute_modal_container'>
            <div className='modal_attribute_row'>
              <div className='modal_attribute_col-1'>
                <div className='modal_col-1_container'>
                  <div className='main_heading'>Add Parent Attribute Category</div>
                </div>
                <div className='add_product_value'>
                  <label className='main_title'>Name</label>
                  <input type='text' className='add_product_input' />
                </div>
                <div className='add_product_value mt-2'>
                  <label className='main_title'>isEnabled</label>
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
                <div className='product_publish_container'>
                  <button className='product_publish_btn ml-0'>Save</button>
                </div>
              </div>
              <div className='modal_attribute_col-2'>
                <div className='main_heading'>Parent Attribute Category List</div>
                     <table   className="table table-striped table-bordered table-hover table-checkable">
                            <thead>
                            <tr>
                                <th>Category Name</th>
                                <th>Is Enabled</th>
                                <th>View/Edit</th>
                                <th>Delete</th>
                            </tr>
                            </thead>
                            <tbody>
                                  {/* {tableResult}                    */}
                                
                            </tbody>
                            <tfoot>
                                <tr>
                                <th>Category Name</th>
                                <th>Is Enabled</th>
                                <th>View/Edit</th>
                                <th>Delete</th>
                                </tr>
                            </tfoot>
                        </table>
              </div>
            </div>
          </div>
        </div>
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
});

export default connect(mapStateToProps, {
  addProduct,
  listCategory,
  listSubCategoryOne,
  listSubCategoryChildOne,
})(AddProductScreen);
