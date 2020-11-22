const listUser = () => {  
    return function(dispatch) {      
      return fetch(`http://localhost:3100/users/`)
        .then(response => response.json())
          .then(json => {
          dispatch({ type: "USER_LIST", payload: json });
        });
   };
}

export default listUser;

