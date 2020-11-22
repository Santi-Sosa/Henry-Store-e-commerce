import React, { useState, useEffect, Fragment } from "react";
import styles from "../../Styles/ordersTable.module.css";
import axios from "axios";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { Redirect } from "react-router-dom";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
// la tabla esta mostrando un listado de productos para visualizarla
// habria que reemplazar la consulta en el action para que traiga las ordenes

export default function ListCheckouts() {
  const [checkouts, setCheckouts] = useState([]);
const [user, setUser] = useState({});

  useEffect(() => {
    getCheckouts();
  }, []);

  const getCheckouts = () => {
    fetch("http://localhost:3100/checkouts")
      .then((data) => data.json())
      .then((checkoutsFinded) =>{ 
        setCheckouts(checkoutsFinded);   
        fetch(`http://localhost:3100/users/${checkoutsFinded[0].userId}`)
        .then((data) => data.json())
        .then((userFinded) =>{ 
          setUser(userFinded);    
        })
      })
      .catch((err) => console.log(err));
  };



  return (
      <div className={styles.content}>
        <div>
          <h3>Listado de Checkouts</h3>
        </div>
        <div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>DIRECCION</th>
                <th>METODO DE PAGO</th>
                <th>NOMBRE DEL USUARIO</th>
                <th>EMAIL DEL USUARIO</th>
                <th>ID DE LA ORDEN</th>
              </tr>
            </thead>
            <tbody>
              {checkouts.map((checkout) => (
                <tr key={checkout.id}>
                  <td>{checkout.id}</td>
                  <td>{checkout.address}</td>
                  <td>{checkout.payment}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{checkout.orderId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
  );
}
