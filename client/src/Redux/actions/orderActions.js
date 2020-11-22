const listOrders = () => {  
  return function(dispatch) {      
    return fetch(`http://localhost:3100/orders/`)
      .then(response => response.json())
        .then(json => {
        dispatch({ type: "ORDER_LIST", payload: json });
      });
 };
}

const getTotal = (orderId) => { 
return function (dispatch){
  return fetch (`http://localhost:3100/orders/products/${orderId}`)
    .then ( response => response.json())
      .then(json => {          
        dispatch({ type: "TOTAL_ORDER", payload: json });
      });
  };
}

export {listOrders, getTotal};