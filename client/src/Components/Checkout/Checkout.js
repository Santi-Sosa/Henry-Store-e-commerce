import React, { useState } from "react";
import axios from "axios";
import styles from "../../Styles/checkout.module.css";
import Button from "@material-ui/core/Button";
import { useParams } from "react-router-dom";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { useSelector } from "react-redux";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function Checkout() {
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState("cash");
  const [openCreate, setOpenCreate] = useState(false);
  const { userLogged } = useSelector((state) => state.authUser);
  let { idUser } = useParams();
  let { idOrder } = useParams();

  const handleCloseCreate = () => {
    setOpenCreate(!openCreate);
    window.location.href = "http://localhost:3000/";
  };

  const handleSubmit = () => {
    axios
      .post(`http://localhost:3100/checkouts/${idUser}/add`, {
        address: address,
        payment: payment,
        orderId: idOrder,
      })
      .then(() => {
        axios
          .put(`http://localhost:3100/orders/${idOrder}?state=complete`)
          .then(() => {
            setOpenCreate(true);
            axios
              .post(`http://localhost:3100/orders/checkout`, {
                orderId: idOrder,
                buyerEmail: userLogged.email,
              })
              .then((data) => console.log(data));
          });
      })
      .catch((err) => console.log(err));
    setAddress("");
    setPayment("cash");
  };

  const handleChange = (e) => {
    setAddress(e.target.value);
  };
  const handleSelected = (e) => {
    setPayment(e.target.value);
  };

  return (
    <div className={styles.checkoutContainer}>
      <form onSubmit={handleSubmit} className={styles.checkoutForm}>
        <h2 className={styles.checkoutTittle}>CHECKOUT</h2>
        <h3 className={styles.checkoutLabel}>
          {" "}
          Seleccione su metodo de pago:{" "}
        </h3>
        <select
          name="payment"
          id="select"
          onChange={handleSelected}
          className={styles.checkoutSelect}
        >
          <option name="cash" value="cash">
            Efectivo
          </option>
          <option name="card" value="card">
            Tarjeta
          </option>
        </select>
        <h3 className={styles.checkoutLabel}>
          Ingrese su dirección de envio:{" "}
        </h3>
        <input
          type="text"
          name="address"
          value={address}
          onChange={handleChange}
          className={styles.checkoutInput}
        />
        <Button
          variant="contained"
          color="secondary"
          onClick={handleSubmit}
          style={{
            backgroundColor: "#ffff5a",
            color: "black",
            marginTop: "1em",
          }}
        >
          CONFIRMAR COMPRA
        </Button>
      </form>
      <Snackbar
        open={openCreate}
        autoHideDuration={3500}
        onClose={handleCloseCreate}
      >
        <Alert
          onClose={handleCloseCreate}
          severity="success"
          style={{ backgroundColor: "#ffff5a", color: "black" }}
        >
          La compra se ha confirmado con éxito, en breves recibirás un mail con
          los detalles.
        </Alert>
      </Snackbar>
    </div>
  );
}
