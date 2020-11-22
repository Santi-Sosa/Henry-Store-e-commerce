import React, { useState, useEffect, useCallback, Fragment } from "react";
import styles from "../../Styles/cart.module.css";
import CancelIcon from "@material-ui/icons/Cancel";
import axios from "axios";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { FormHelperText, Typography } from "@material-ui/core";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import googleLogo from "../../content/googlelogo.png";
import { loadingFalse, loadingTrue } from "../../Redux/actions/loadingActions";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      width: "100%",
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },
    accordionDetails: {
      height: "100%",
      display: "flex",
      flexDirection: "column",
    },
  })
);

function GuestCart() {
  const [totalPrice, setTotal] = useState(0);
  const userLogged = useSelector((state) => state.authUser);
  const [responseData, setResponseData] = useState([]);
  const [dialogOpen, setDialog] = useState(false);
  const classes = useStyles();
  const [state, setState] = useState({});
  const [pwError, setPwError] = useState({
    success: true,
    message: "",
  });
  const dispatch = useDispatch();

  var storage = JSON.parse(localStorage.getItem("guestCart"));

  const handleAddQty = useCallback((productId) => {
    var indexOfProductId = storage.findIndex((e) => e.productId === productId);
    storage[indexOfProductId].amount += 1;
    localStorage.setItem("guestCart", JSON.stringify(storage));
    window.location.reload();
    // Por X razon no actualiza el componente tras setear el nuevo estado
    // setResponseData((previousState) => {
    //   var array = previousState;
    //   array[array.findIndex((e) => e.id === productId)].amount += 1;
    //   return array;
    // });
  }, []);

  const handleRemoveQty = useCallback((productId) => {
    var indexOfProductId = storage.findIndex((e) => e.productId === productId);
    storage[indexOfProductId].amount -= 1;
    localStorage.setItem("guestCart", JSON.stringify(storage));
    window.location.reload();

    // Por X razon no actualiza el componente tras setear el nuevo estado
    // setResponseData((previousState) => {
    //   var array = previousState;
    //   array[array.findIndex((e) => e.id === productId)].amount += 1;
    //   return array;
    // });
  }, []);

  const fetchData = useCallback(() => {
    storage.forEach((e) => {
      axios
        .get(`http://localhost:3100/products/${e.productId}`)
        .then((data) => {
          setResponseData((previousState) =>
            previousState.concat({ ...data.data, amount: e.amount })
          );
        })
        .catch((error) => {
          console.log(error);
        });
    });
    // let total = 0;
    // responseData.forEach(e => {
    //   total = e.price * e.amount;
    // })
    // setTotal(total)
  }, []);

  useEffect(() => {
    if (storage) fetchData();
  }, []);

  useEffect(() => {
    passwordValidator();
  }, [state]);

  const passwordValidator = () => {
    state.password !== state.confirmPassword
      ? setPwError(true)
      : setPwError(false);
  };

  const handleRemoveAllCart = () => {
    localStorage.removeItem("guestCart");
    window.location.reload();
  };

  const handleRemoveCart = useCallback((productId) => {
    let storageToEdit = JSON.parse(localStorage.getItem("guestCart"));
    var indexOfProductId = storageToEdit.findIndex(
      (e) => e.productId === productId
    );
    storageToEdit.splice(indexOfProductId, 1);
    localStorage.setItem("guestCart", JSON.stringify(storageToEdit));
    window.location.reload();

    // Por X razon no actualiza el componente tras setear el nuevo estado
    // setResponseData((previousState) => {
    //   var array = previousState;
    //   array[array.findIndex((e) => e.id === productId)].amount += 1;
    //   return array;
    // });
  }, []);
  
  //
  // HANDLE GUEST CHECKOUT
  //
  const handleGuestCheckout = () => {
    dispatch(loadingTrue());
    console.log(state);
    axios
      .post("http://localhost:3100/users/create", {
        name: state.name,
        username: state.username,
        email: state.email,
        password: state.password,
      })
      .then((response) => {
        if (response.data.success) {
          storage.forEach((product) => {
            console.log(product);
            axios
              .post(
                `http://localhost:3100/users/${response.data.user.id}/cart`, //cuando se cree el sistema de autentificacion el "1" deberia ser reemplazado por el id del usuario
                {
                  idProducto: product.productId,
                  amount: product.amount,
                }
              )
              .then((data) => {
                setTimeout(() => dispatch(loadingFalse()), 300);
                window.location.href = "http://localhost:3000/login";
              })
              .catch((err) => alert(err));
          });
        }
        setTimeout(() => dispatch(loadingFalse()), 300);
      })
      .catch((err) => alert(err));

    let cartStorage = JSON.parse(localStorage.getItem("guestCart"));
  };

  const handleClose = () => {
    setDialog(!dialogOpen);
  };

  //SIGNUP Form State Handler
  const handleChange = ({ target }) => {
    const { id, value } = target;
    setState({ ...state, [id]: value });
  };

  return (
    <div className={styles.title}>
      {userLogged.loggedIn && <Redirect to="/user/cart" />}
      <h1>Carrito de invitado </h1>
      <div className={styles.sectionTable}>
        <table className={styles.cartTable}>
          {responseData[0] ? (
            responseData.map((order, index) => (
              <tbody key={index}>
                <tr>
                  {/* <td>Imagen</td> */}
                  <td style={{ color: "white" }}>{order.name}</td>
                  <td style={{ color: "white" }}>{order.description}</td>
                  <td style={{ color: "white" }}>
                    Cantidad a comprar: {order.amount}
                  </td>
                  <td style={{ color: "white" }}>
                    {order.amount > -1 && (
                      <IconButton
                        className={styles.buttonsAddRemove}
                        onClick={(e) => handleAddQty(order.id)}
                        aria-label="add"
                      >
                        <AddIcon className={styles.iconAddRemove} />
                      </IconButton>
                    )}
                    {order.amount > 1 && (
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
        {responseData[0] && (
          <div style={{ display: "flex", justifyContent: "space-evenly" }}>
            <Button
              variant="contained"
              style={{
                backgroundColor: "#f44336",
                color: "white",
                maxWidth: "200px",
                marginTop: "25px",
              }}
              onClick={handleRemoveAllCart}
            >
              VACIAR CARRITO
            </Button>
            <Button
              variant="contained"
              style={{
                backgroundColor: "#558b2f",
                color: "white",
                maxWidth: "200px",
                marginTop: "25px",
              }}
              onClick={handleClose}
            >
              FINALIZAR COMPRA
            </Button>
          </div>
        )}
      </div>
      <h2></h2>
      {/* No lo pude hacer funcionar <h2>Total: ${totalPrice}</h2> */}
      {/* USER CREATION DIALOG HANDLE */}
      <Fragment>
        <Dialog
          open={dialogOpen}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle style={{ textAlign: "center" }} id="form-dialog-title">
            Regístrate
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Para proceder con la compra debes crearte una cuenta.
            </DialogContentText>
            <Accordion className={classes}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography className={classes.heading}>
                  Quiero registrarme con un email y contraseña
                </Typography>
              </AccordionSummary>
              <AccordionDetails className={classes.accordionDetails}>
                <TextField
                  autoFocus
                  margin="dense"
                  id="name"
                  label="Nombre"
                  type="text"
                  fullWidth
                  value={state.name}
                  onChange={handleChange}
                />
                <TextField
                  autoFocus
                  margin="dense"
                  id="username"
                  label="Nombre de usuario"
                  type="text"
                  fullWidth
                  value={state.username}
                  onChange={handleChange}
                />
                <TextField
                  autoFocus
                  margin="dense"
                  id="email"
                  label="Email"
                  type="email"
                  fullWidth
                  value={state.email}
                  onChange={handleChange}
                />
                <TextField
                  autoFocus
                  margin="dense"
                  id="password"
                  label="Contraseña"
                  type="password"
                  fullWidth
                  value={state.password}
                  onChange={handleChange}
                />
                <TextField
                  autoFocus
                  margin="dense"
                  id="confirmPassword"
                  label="Confirmar contraseña"
                  type="password"
                  fullWidth
                  value={state.confirmPassword}
                  onChange={handleChange}
                />
                {pwError ? (
                  <FormHelperText error className={classes.helperText}>
                    Las contraseñas deben coincidir
                  </FormHelperText>
                ) : (
                  <Fragment />
                )}
                <Button
                  onClick={handleGuestCheckout}
                  style={{ margin: "1em" }}
                  color="primary"
                >
                  REGISTRARSE
                </Button>
              </AccordionDetails>
            </Accordion>
            <Accordion className={classes}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography className={classes.heading}>
                  Quiero registrarme con Google
                </Typography>
              </AccordionSummary>
              <AccordionDetails className={classes.accordionDetails}>
                <Button
                  variant="contained"
                  href="http://localhost:3100/auth/google"
                  style={{
                    backgroundColor: "white",
                    marginBottom: "1em",
                    maxWidth: "50%",
                    alignSelf: "center",
                  }}
                  endIcon={
                    <img
                      src={googleLogo}
                      style={{ height: "auto", maxWidth: "45px" }}
                    />
                  }
                >
                  Registrarse
                </Button>
              </AccordionDetails>
            </Accordion>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              VOLVER AL CARRITO
            </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    </div>
  );
}

export default GuestCart;
