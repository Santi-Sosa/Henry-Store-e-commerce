import React, { useState, useEffect } from "react";
import styles from "../../Styles/cart.module.css";
import CancelIcon from "@material-ui/icons/Cancel";
import axios from "axios";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";

function Cart() {
  const [orders, setOrders] = useState([]);
  const [totalPrice, setTotal] = useState(0);
  //Asignando el hook de dispatch a una constante
  //Se asigna el valor de userLogged por destructuring
  const { userLogged } = useSelector((state) => state.authUser);

  useEffect(() => {
    getOrders();
  }, [userLogged]);

  const handleConfirm = (order) => {
    axios({
      method: "put",
      url: `http://localhost:3100/orders/${order.id}?state=processing`,
    }).then((data) => {
      console.log(data.data);
      window.location.href = `http://localhost:3000/checkout/${data.data.userId}/${data.data.id}`;
    });
  };

  const getOrders = () => {
    if (userLogged.id) {
      axios
        .get(`http://localhost:3100/users/${userLogged.id}/orders`)
        .then((response) => {
          // Looks for users' orders
          let activeOrder = response.data.find((e) => (e.state === "active"));
          console.log(activeOrder)
          if (activeOrder && activeOrder.id) {
            axios
              .get(`http://localhost:3100/orders/products/${activeOrder.id}`) //Looks for the information of the active order
              .then((data) => {
                setOrders(data.data[0]);
                let total = 0;
                data.data[0].products.forEach(
                  (e) => (total += e.price * e.amount.amount)
                );
                setTotal(total);
              })
              .catch((err) => console.log(err));
          }
        });
    }
  };
  const handleRemoveCart = (id) => {
    axios({
      method: "delete",
      url: `http://localhost:3100/users/${orders.id}`,
      data: {
        product: id,
      },
    }).then((data) => getOrders());
  };

  const handleRemoveAllCart = () => {
    orders.products.forEach((e) => {
      axios({
        method: "delete",
        url: `http://localhost:3100/users/${orders.id}`,
        data: {
          product: e.id,
        },
      }).then((data) => getOrders());
    });
  };

  const handleAddQty = (productId) => {
    axios({
      method: "put",
      url: `http://localhost:3100/users/${userLogged.id}/cart`,
      data: {
        productId: productId,
        orderId: orders.id,
        amountToSet: 1,
      },
    }).then((data) => getOrders());
  };

  const handleRemoveQty = (productId) => {
    axios({
      method: "put",
      url: `http://localhost:3100/users/${userLogged.id}/cart`, //cuando se cree el sistema de autentificacion el "1" deberia ser reemplazado por el id del usuario
      data: {
        productId: productId,
        orderId: orders.id,
        amountToSet: -1,
      },
    }).then((data) => getOrders());
  };
  console.log(orders)
  return (
    <div className={styles.title}>
      {!userLogged.id && <Redirect to="/guest/cart" />}
      {orders.products ? <h1>ID de la orden: {orders.id}</h1> : <h1></h1>}
      <div className={styles.sectionTable}>
        <table className={styles.cartTable}>
          {orders.products ? (
            orders.products.map((order, index) => (
              <tbody key={index}>
                <tr>
                  {/* <td>Imagen</td> */}
                  <td style={{ color: "white" }}>{order.name}</td>
                  <td style={{ color: "white" }}>{order.description}</td>
                  <td style={{ color: "white" }}>
                    Cantidad a comprar: {order.amount.amount}
                  </td>
                  <td style={{ color: "white" }}>
                    {order.amount.amount > -1 &&
                      order.stock > order.amount.amount && (
                        <IconButton
                          className={styles.buttonsAddRemove}
                          onClick={(e) => handleAddQty(order.id)}
                          aria-label="add"
                        >
                          <AddIcon className={styles.iconAddRemove} />
                        </IconButton>
                      )}
                    {order.amount.amount > 1 && (
                      <IconButton
                        className={styles.buttonsAddRemove}
                        onClick={(e) => handleRemoveQty(order.id)}
                        aria-label="add"
                      >
                        <RemoveIcon className={styles.iconAddRemove} />
                      </IconButton>
                    )}
                  </td>
                  <td style={{ color: "white" }}>${order.price}</td>
                  <a href="#">
                    <CancelIcon
                      style={{ color: "white", marginTop: "12px" }}
                      className={styles.buttonsRemove}
                      key={index}
                      onClick={() => handleRemoveCart(order.id)}
                    />
                  </a>
                  {!(order.stock > order.amount.amount) && (
                    <td style={{ color: "red" }}>
                      <span>Limite de Stock</span>
                    </td>
                  )}
                </tr>
              </tbody>
            ))
          ) : (
            <div>
              <h1 style={{ color: "white" }}>
                No tienes ningun producto en el carrito
              </h1>
              <Button
                variant="contained"
                style={{
                  backgroundColor: "white",
                  color: "black",
                  maxWidth: "200px",
                  marginTop: "15px",
                  marginBottom: "15px",
                }}
                href="http://localhost:3000/#section-two"
              >
                Ir al catalogo
              </Button>
            </div>
          )}
        </table>
        {orders.products && orders.products[0] ? (
          <Button
            variant="contained"
            style={{
              backgroundColor: "black",
              color: "white",
              maxWidth: "200px",
              marginTop: "15px",
            }}
            onClick={handleRemoveAllCart}
          >
            VACIAR CARRITO
          </Button>
        ) : (
          <h2></h2>
        )}
      </div>
      {orders.products && orders.products[0] ? (
        <div>
          <h2>Total: ${totalPrice}</h2>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              console.log(orders);
              handleConfirm(orders);
            }}
            style={{
              backgroundColor: "#ffff5a",
              color: "black",
              margin: "1em",
              width: "35%",
              flexGrow: "1",
            }}
          >
            FINALIZAR COMPRA
          </Button>
        </div>
      ) : (
        false
      )}
    </div>
  );
}

export default Cart;
