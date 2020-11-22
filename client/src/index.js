import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import store from "./Redux/store/store";
import LoadingScreen from "./Components/loadingScreen";
import FooterComp from "./Components/Footer/footer";
//Cuando se implemente redux hay que agregar reemplazar esto por esto
// ReactDOM.render(
//   <Provider>
//   <BrowserRouter>
//     <React.StrictMode>
//       <App />
//     </React.StrictMode>
//   </BrowserRouter>
//   </Provider>,
//   document.getElementById('root')
// );

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
