const initialState = {
  loggedIn: false,
  userLogged: {
    role: "client",
  },
};

function authReducer(state = initialState, action) {
  switch (action.type) {
    case "GET_LOGGED_USER":
      return {
        ...state,
        loggedIn: action.payload.success,
        userLogged: action.payload.user,
      };
    case "LOGOUT_USER":
      return {
        ...state,
        loggedIn: false,
        userLogged: {
          role: "guest",
        },
      };
    default:
      return state;
  }
}
export default authReducer;
