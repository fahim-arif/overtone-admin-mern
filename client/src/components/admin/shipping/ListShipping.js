import React, { Component } from 'react';
import {PropTypes} from 'prop-types';
import {connect} from 'react-redux';
import Sidebarmobile from '../../layouts/SidebarMobile';
import Asidebar from '../../layouts/Asidebar';
import Header from '../../layouts/Header';
import HeadeTopbar from '../../layouts/HeaderTopbar';
import SubHeader from '../../layouts/SubHeader';
import Footer from '../../layouts/Footer';
import {listShipping,deleteShipping} from '../../../actions/shippingAction'
import swal from 'sweetalert2';
import SearchInput, {createFilter} from 'react-search-input';
import {checkPermission} from '../../common/MenuList'

const KEYS_TO_FILTERS = ['shippingName','shippingDesc','amount'];
const Toast = swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 1000
});


class ListShipping extends Component {
  constructor(){
    super();
    this.state={
       errors:{},
       searchTerm: '',
  
    }   
    this.onEditClick = this.onEditClick.bind(this);
    this.onDeleteClick = this.onDeleteClick.bind(this);
    this.searchUpdated = this.searchUpdated.bind(this);

  
}
componentDidMount(){
  this.props.listShipping();
}

//calls when edit button is clicked
onEditClick(res){
  localStorage.setItem('editshipping',JSON.stringify(res))
  this.props.history.push('editshipping')
}
//calls when delete button is clicked
onDeleteClick(id){
  const deleteData={
      id:id
  }
  this.props.deleteShipping(deleteData)
}
searchUpdated (term) {
    this.setState({searchTerm: term})
}
componentWillReceiveProps(nextProps){
 
  if(nextProps.shipping.deleteshipping !== this.props.shipping.deleteshipping){
      Toast.fire({
          type: 'success',
          title: 'Shipping Deleted Successfully',
        }).then(getResult=>{
          this.props.listShipping();
        })

  }
  if(nextProps.errors !== this.props.errors){
      Toast.fire({
          type: 'error',
          title: 'Check all the fields',
        })
      this.setState({errors:nextProps.errors});
  }
}

render() {
  const {listshipping,shippingloading}=this.props.shipping;
  var tableResult;
  if(listshipping==null ||shippingloading){
      tableResult=(<tr><td colSpan={6} className="text-center">Loading.....</td></tr>)
  }else{
      if(Object.keys(listshipping).length >0){
        var filterData= listshipping.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS))
          tableResult=filterData.map(result=>{
                  return <tr>
                  <td>{result.shippingName}</td>
                  <td>{result.amount}</td>
                  {/* <td><button className="btn btn-link" onClick={()=>this.onEditClick(result)}><span className="kt-badge kt-badge--brand kt-badge--inline kt-badge--pill">View/Edit</span></button></td>
                  <td><button  className="btn btn-link" onClick={()=>this.onDeleteClick(result._id)}><span className="kt-badge kt-badge--brand kt-badge--inline kt-badge--danger">Delete</span></button></td> */}
                  <td>
                    {checkPermission(this.props.auth,"SHIPPING","UPDATE")&&
                    <button className="btn btn-link" onClick={()=>this.onEditClick(result)}><span className="kt-badge kt-badge--brand kt-badge--inline kt-badge--pill">Edit</span>
                    </button>}
                    </td>
                  <td>
                  {checkPermission(this.props.auth,"SHIPPING","DELETE")&&
                    <button  className="btn btn-link" onClick={()=>this.onDeleteClick(result._id)}><span className="kt-badge kt-badge--brand kt-badge--inline kt-badge--danger">Delete</span>
                    </button>}
                  </td>
              </tr>
          })
      }else{
          tableResult=(<tr><td colSpan={6} className="text-center">No Record Found.....</td></tr>)
      }

  }

   return (
      <div>
     <Sidebarmobile/>
      <div className="kt-grid kt-grid--hor kt-grid--root">
        <div className="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--ver kt-page">
          {/* begin:: Aside */}
          <Asidebar/>
          {/* end:: Aside */}
          <div className="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor kt-wrapper" id="kt_wrapper">
            {/* begin:: Header */}
            <div id="kt_header" className="kt-header kt-grid__item  kt-header--fixed ">
              {/* begin:: Header Menu */}
               <Header />
              {/* end:: Header Menu */}
              {/* begin:: Header Topbar */}
             <HeadeTopbar />
              {/* end:: Header Topbar */}
            </div>
            {/* end:: Header */}
            <div className="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor">
              {/* begin:: Subheader */}
              <SubHeader first="Home" second="List Shipping" third=""/>
              {/* end:: Subheader */}
              {/* begin:: Content */}
              <div className="kt-content  kt-grid__item kt-grid__item--fluid" id="kt_content">
                    <div className="kt-portlet">
                        <div className="kt-portlet__head kt-portlet__head--lg">
                            <div className="kt-portlet__head-label">
                                <span className="kt-portlet__head-icon">
                                <i className="kt-font-brand flaticon2-line-chart" />
                                </span>
                                <h3 className="kt-portlet__head-title">
                            List Shipping
                                </h3>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-12">
                                    <SearchInput  placeholder="Search by Shipping Name,Store Name" onChange={this.searchUpdated} className="search-input" />
                        </div>
                        <div className="kt-portlet__body" >
                        {/*begin: Datatable */}
                        <table   className="table table-striped table-bordered table-hover table-checkable">
                            <thead>
                            <tr>
                               
                                <th>Shipping Name</th>
                                <th>Amount</th>
                                <th>View/Edit</th>
                                <th>Delete</th>
                            </tr>
                            </thead>
                            <tbody>
                                  {tableResult}                   
                                
                            </tbody>
                            <tfoot>
                                <tr>
                                
                               <th>Shipping Name</th>
                                <th>Amount</th>
                                <th>View/Edit</th>
                                <th>Delete</th>
                                </tr>
                            </tfoot>
                        </table>
                        {/*end: Datatable */}
                        </div>
                    </div>
                
             </div>
              {/* end:: Content */}
            </div>
            {/* begin:: Footer */}
            <Footer/>
            {/* end:: Footer */}
          </div>
        </div>
      </div>
    </div>
    )
  }
}

ListShipping.propTypes ={
    auth: PropTypes.object.isRequired,
    listShipping: PropTypes.func.isRequired,
    deleteShipping: PropTypes.func.isRequired,
}

const mapStateToProps = (state)=>({
  auth : state.auth,
  errors: state.errors,
  shipping :state.shipping
});

export default connect(mapStateToProps,{listShipping,deleteShipping})(ListShipping);