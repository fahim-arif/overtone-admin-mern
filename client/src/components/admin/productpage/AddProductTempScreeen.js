import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import {  createDraftProduct } from "../../../actions/productAction";

export default function AdddProductTempScreen({history}) {
    // const history = useHistory();
    const dispatch = useDispatch()
    const product = useSelector((state) => state.product)
    const { addproduct } = product;
    useEffect(() => {
       
         dispatch(createDraftProduct())
       
    }, [dispatch])
    if(addproduct) {

        console.log(addproduct._id)
        history.push(`/admin/productpage/${addproduct._id}`)
    }

    return <div>Loading....</div>

}