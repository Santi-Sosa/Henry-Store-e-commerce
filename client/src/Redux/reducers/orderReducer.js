const initialState = {
  orderList:[],
  totalOrder:[]
};

function orderListReducer (state = initialState, action){    
  switch(action.type) {      
    case 'ORDER_LIST':      
      return {
        ...state,
        orderList: action.payload
      };
    default: 
      return state;
  }
};

function totalOrderReducer (state = initialState, action){
  switch(action.type) {  
    case 'TOTAL_ORDER':        
      let total = 0;
      const lineOrder = action.payload[0].products;        
      lineOrder.forEach( line => (total += line.price * line.amount.amount));        
      return {
        ...state,
        totalOrder: state.totalOrder.concat(total)
      };
    default: 
     return state;      
  }
}  

export {orderListReducer, totalOrderReducer};