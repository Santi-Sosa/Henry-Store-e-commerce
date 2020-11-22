import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { getLoggedUser } from '../../Redux/actions/userActions';
import { Route, Redirect, Link } from 'react-router-dom';
import { loadState } from "../../Local-Storage/localStorage";

function PrivateRoute({ component: Component, ...rest }) {

    const userLogged = loadState().authUser
    return (
        <Route {...rest} render={props => {
            // const user = accountService.userValue;
            if (!userLogged.loggedIn) {
                // no hay un usuario loggeado, se redirige a la pagina de login
                return (<div>
                    <h1 style={{color: 'white', textAlign: 'center'}}>No tienes permiso para ver esta página</h1>
                    <Link to="/" className="nav-item nav-link">Volver al inicio</Link>
                </div>)
            }

            // verifica si la ruta esta restringida por el rol
            // (roles && roles.indexOf(user.role) === -1)
            if (userLogged.userLogged.role !== 'admin') {
                // role no autorizado, se redirige al componente landing
                return <Redirect to={{ pathname: '/'}} />
            }

            // esta autorizado, retorna el componente junto con las props
            return <Component {...props} />
        }} />
    );
}

export { PrivateRoute };