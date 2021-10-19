const helper = (val1, val2, val3, val4, val5,val6,val7) => {
  let temp1;
  let temp2;
  let temp3 = [];
  let temp4 = [];
  let temp5 = [];
  let temp6 = [];
  let temp7 = [];
  let tempRes;
  let result = [];
  console.log(val3)
  if (typeof val1 === "string") val1 = val1.split(",");
  if (typeof val2 === "string") val2 = val2.split(",");
  if (val3 && typeof val3 === "string") val3 = val3.split(",");
  if (val4 && typeof val4 === "string") val4 = val4.split(",");
  if (val5 && typeof val5 === "string") val5 = val5.split(",");
  if (val6 && typeof val6 === "string") val6 = val6.split(",");
   if (val7 && typeof val7 === "string") val7 = val7.split(",");





  console.log(val2)
  // val2 = val2.split(",");
  let max = 0;
  //   if (val1.length > max) {
  //     max = val1.length;
  //   }

  //   if (val2.length > max) {
  //     max = val2.length;
  //   }

  for (let i = 0; i < val1.length; i = i + 1) {
    for (let j = 0; j < val2.length; j = j + 1) {
      temp1 = val1[i];
      temp2 = val2[j];
      tempRes = `${temp1}-${temp2}`;
      console.log(tempRes);
      result.push(tempRes);
    }
  }

  if (val3) {
    
    tempRes='';
    for(let i = 0; i < result.length; i = i + 1) {
        for (let j = 0; j < val3.length; j = j + 1) {
          temp1 = result[i];
          temp2 = val3[j];
          tempRes = `${temp1}-${temp2}`;
          console.log('hello world');
            temp3.push(tempRes);
           }
           
          }
          console.log(tempRes)
}

console.log(val4,'val4')

  if (val4) {
    console.log('hi there')
    tempRes='';
    for(let i = 0; i < temp3.length; i = i + 1) {
        for (let j = 0; j < val4.length; j = j + 1) {
          temp1 = temp3[i];
          temp2 = val4[j];
          tempRes = `${temp1}-${temp2}`;
          console.log('hello world');
            temp4.push(tempRes);
           }
           
          }
}

  if (val5) {
    console.log('hi there')
    tempRes='';
    for(let i = 0; i < temp4.length; i = i + 1) {
        for (let j = 0; j < val5.length; j = j + 1) {
          temp1 = temp4[i];
          temp2 = val5[j];
          tempRes = `${temp1}-${temp2}`;
            temp5.push(tempRes);
           }
           
          }
         
}

  if (val6) {
    console.log('hi there 6')
    tempRes='';
    for(let i = 0; i < temp5.length; i = i + 1) {
        for (let j = 0; j < val6.length; j = j + 1) {
          temp1 = temp5[i];
          temp2 = val6[j];
          tempRes = `${temp1}-${temp2}`;
            temp6.push(tempRes);
           }
           
          }
}


  if (val7) {
    console.log('hi there 7')
    tempRes='';
    for(let i = 0; i < temp6.length; i = i + 1) {
        for (let j = 0; j < val7.length; j = j + 1) {
          temp1 = temp6[i];
          temp2 = val7[j];
          tempRes = `${temp1}-${temp2}`;
            temp7.push(tempRes);
           }
           
          }
          return temp7;
}


console.log(temp3.length)
if (temp6.length > 0) {
  console.log('no')
  return temp5;
}
if (temp5.length > 0) {
  return temp5;
}
  if (temp4.length > 0) {
    return temp4;
  }
   if (temp3.length > 0) {
     return temp3
   }
  return result;
};

// let attributes = window.prompt("Enter the arrtribute number: ");
const skuGen = (val1, val2,val3,val4,val5,val6,val7) => {
 
    console.log(val1)
      console.log(val2)
  console.log(val3)
  console.log(val4)
  console.log(val5)
  // attributes = Number(attributes);
  // ['OTP-1', 'OTP-2', 'OTP-3']
  // let val1 = 'dress';
  // let val2 = 'MK,KT'
  // let val3 = 'RED,BLU,BLK'
  // let val4 = 'Size'
  // let val5 = '11,12,13'
  
  let res = helper(val1, val2, val3, val4, val5,val6,val7);
  
  
  console.log(res);
  return res;
}

export default skuGen;
