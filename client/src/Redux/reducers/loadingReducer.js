const initialState = {
    isLoading: false,
  };
  
  function loadingReducer(state = initialState, action) {
    switch (action.type) {
      case "SWITCH_STATE":
        return {
          ...state,
          isLoading: action.payload
        };
    }
    return state
  }
  export default loadingReducer;