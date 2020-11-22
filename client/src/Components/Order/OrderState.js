import React, { useState } from "react";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog, { DialogProps } from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import UpdateIcon from "@material-ui/icons/Update";
import axios from "axios";
import { Snackbar } from "@material-ui/core";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import { listOrders } from "../../Redux/actions/orderActions";
import { useDispatch } from "react-redux";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    form: {
      display: "flex",
      flexDirection: "column",
      margin: "auto",
      width: "50%",
    },
    formControl: {
      marginBottom: theme.spacing(1),
      minWidth: 120,
    },
    formControlLabel: {
      marginTop: theme.spacing(1),
    },
    buttonClose: {
      width: "20% !important",
      margin: "0 auto",
      color: "black",
    },
    inputLabel: {
      width: "100%",
    },
  })
);

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function OrderState(props) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [fullWidth, setFullWidth] = useState(true);
  const [selectValue, setSelectValue] = useState("");
  const [alertSuccess, setAlert] = useState(false);
  const [alertCheckout, setAlertCheckout] = useState(false);
  const dispatch = useDispatch();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const options = [
    { name: "En carrito", state: "inCart" },
    { name: "Creada", state: "created" },
    { name: "Activa", state: "active" },
    { name: "En proceso", state: "processing" },
    { name: "Cancelada", state: "canceled" },
    { name: "Completada", state: "complete" },
  ];

  const handleSelectChange = (e) => {
    setSelectValue(e.target.value);
  };

  const handleSubmitStateChange = (orderId) => {
    axios
      .put(`http://localhost:3100/orders/${orderId}?state=${selectValue}`)
      .then((response) => {
        toggleAlert();
        dispatch(listOrders());
      })
      .catch((err) => console.log(err));
  };

  const toggleAlert = () => {
    setAlert(!alertSuccess);
  };
  const toggleAlertCheckout = () => {
    setAlertCheckout(!alertCheckout);
  };

  const handleCheckoutOrder = () => {
    axios
      .put(`http://localhost:3100/checkouts/${props.orderId}/completed`)
      .then((response) => {
        toggleAlertCheckout();
        dispatch(listOrders());
      });
  };

  return (
    <React.Fragment>
      <Button
        variant="outlined"
        style={{ borderColor: "black" }}
        onClick={handleClickOpen}
        style={{ marginRight: "15px" }}
      >
        <UpdateIcon style={{ color: "black" }} />
      </Button>
      <Button
        variant="outlined"
        style={{ borderColor: "black" }}
        onClick={handleCheckoutOrder}
      >
        Despachar
      </Button>
      <Dialog
        fullWidth={true}
        maxWidth={"sm"}
        open={open}
        onClose={handleClose}
        aria-labelledby="max-width-dialog-title"
      >
        <DialogTitle id="max-width-dialog-title">
          Cambia el estado de la orden ID {props.orderId}
        </DialogTitle>
        <DialogContent>
          <form className={classes.form} noValidate>
            <FormControl className={classes.formControl}>
              <InputLabel className={classes.inputLabel}>
                Selecciona el nuevo estado
              </InputLabel>
              <Select
                autoFocus
                value={selectValue}
                onChange={handleSelectChange}
              >
                {options.map((e) => (
                  <MenuItem value={e.state}>{e.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </form>
        </DialogContent>
        <DialogActions>
          <Button
            value={props.orderId}
            className={classes.buttonClose}
            onClick={() => handleSubmitStateChange(props.orderId)}
          >
            CONTINUAR
          </Button>
          <Button className={classes.buttonClose} onClick={handleClose}>
            CANCELAR
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={alertSuccess}
        autoHideDuration={6000}
        onClose={toggleAlert}
      >
        <Alert onClose={toggleAlert} severity="success">
          El estado de la orden se actualizó con éxito
        </Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={alertCheckout}
        autoHideDuration={6000}
        onClose={toggleAlertCheckout}
      >
        <Alert onClose={toggleAlertCheckout} severity="success">
          La orden fue despachada con éxito.
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
}
