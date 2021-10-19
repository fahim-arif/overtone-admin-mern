 onSkuSubmit(submit = false, index = null) {
    let atbName = this.state.dependentField.map((res) => res.mappingValue)
    this.setState({ tempAtbName: [...this.state.tempAtbName, atbName] })
    let firstPortion = this.state.productValue;

    // if (!firstPortion) {
    //   if (!(atbValue && thirdArg)) {
    //     Toast.fire({
    //       type: 'error',
    //       title: 'Please Enter the product value 1',
    //     })
    //     return;
    //   }
    // }
    // second portion
    let atbValue = this.state.dependentField.map((res) => res.mappingValue).toString();

    let variantLen = atbValue.toString().split(',').length;
    this.setState({ tempVarLen: [...this.state.tempVarLen, variantLen] });
    let thirdArg = ''
    let forthArg = ''

    if (this.state.dependentField.length == 2) {

      thirdArg = this.state.dependentField[1].mappingValue;
      atbValue = this.state.dependentField[0].mappingValue;
      if (!(atbValue)) {
        Toast.fire({
          type: 'error',
          title: 'Enter value field 2',
        })
        return;
      }
    }
     else if (this.state.dependentField.length == 3) {
      thirdArg = this.state.dependentField[1].mappingValue;
      atbValue = this.state.dependentField[0].mappingValue;
      forthArg = this.state.dependentField[2].mappingValue;
      if (!(atbValue && thirdArg && forthArg)) {
        Toast.fire({
          type: 'error',
          title: 'Please Enter value field',
        })
        return;
      }
    }

    if (!submit) {
      Toast.fire({
        type: 'success',
        title: 'An Attribute Value was added',
      })
    }

    if (submit) {

      console.log(forthArg);
      const result = skuGen(firstPortion, atbValue, thirdArg, forthArg)
      console.log(result);
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

    console.log(index,'jj')
    console.log(this.state.dependentField[index],'all')
    if (this.state.dependentField[index].subField === 'No') {
      newVarient = [
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

    let newVarient = [];
    if ((typeof index) === 'number') {

      newVarient = [
        {
          type: this.state.type,
          label: this.state.label,
          list: this.state.variantDependentField[index]
        }
      ]
      console.log(newVarient,'look');
      if (this.state.dependentField[index].subField === 'No') {
        newVarient = [
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
      let tempAttribute = this.state.dependentField[index];
      let saveAttribute = {
        ...tempAttribute,
        photoUrl: '',
        dependentField: JSON.stringify(newVarient),
        productID: this.state.productID
      }
      this.props.addAttributeMapping(saveAttribute);
      console.log(saveAttribute)
    }

    window.location.reload();
  }