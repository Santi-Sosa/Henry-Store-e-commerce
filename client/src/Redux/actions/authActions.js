import axios from "axios";
export const isUserLoggedIn = "GET_LOGGED_USER";
export const logOut = "LOGOUT_USER";

export const isLoggedIn = () => {
  return function (dispatch) {
    axios
      .get("http://localhost:3100/auth/info", { withCredentials: true })
      .then((response) => {
        dispatch({ type: isUserLoggedIn, payload: response.data });
      });
  };
};

export const logOutUser = () => {
  return function (dispatch) {
    axios
      .get("http://localhost:3100/auth/logout", { withCredentials: true })
      .then((response) => {
        console.log(response);
        dispatch({ type: logOut, payload: response.data });
      });
  };
};
