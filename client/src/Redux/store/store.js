import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import { orderListReducer, totalOrderReducer } from "../reducers/orderReducer";
import userListReducer from "../reducers/userReducer";
import authReducer from "../reducers/authReducer";
import thunk from "redux-thunk";
import { loadState, saveState } from "../../Local-Storage/localStorage";
import {throttle} from 'lodash';
import loadingReducer from "../reducers/loadingReducer";

const reducer = combineReducers({
  orderList: orderListReducer,
  totalOrder: totalOrderReducer,
  authUser: authReducer,
  userList: userListReducer,
  isLoading: loadingReducer,
});

// const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() || compose;

const persistedState = loadState()
const store = createStore(reducer, persistedState, applyMiddleware(thunk));

store.subscribe(throttle(() => {
  saveState({
    authUser: store.getState().authUser
  });
}, 200));

//composeEnhancer(applyMiddleware(thunk))

export default store;
