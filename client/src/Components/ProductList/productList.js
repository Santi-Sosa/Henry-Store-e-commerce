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

function ProductList() {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [idProduct, setProduct] = useState(undefined);
  const [openSnack, setSnack] = useState(false);
  const [redirectProduct, setRedirectProduct] = useState(false);

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = () => {
    fetch("http://localhost:3100/products")
      .then((data) => data.json())
      .then((products) => {
        setProducts(products);
      })
      .catch((err) => console.log(err));
  };

  const handleClickOpen = (id) => {
    setOpen(true);
    setProduct(id);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleCloseDelete = () => {
    setOpen(false);
    handleDelete(idProduct);
  };

  const handleSnack = () => {
    setSnack(false);
  };

  const handleDelete = (id) => {    
    fetch(`http://localhost:3100/products/${id}/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((data) => {
        getProducts();
        setSnack(true);
      })
      .catch((err) => console.log(err));
  };

  const handleUpdateProduct = (id) => {
    setProduct(id);
    setRedirectProduct(true);
  };  

  return (
    <Fragment>
      <div className={styles.content}>
        <div>
          <h3>Listado de Productos</h3>
        </div>
        <div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>NOMBRE DEL PRODUCTO</th>
                <th>CATEGORIAS</th>
                <th>DESCRIPCION</th>
                <th>PRECIO</th>
                <th>STOCK</th>
                <th>MANAGE</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>
                    <a href={`/product/detailed/${product.id}`} target="_blank">
                      {product.name}
                    </a>
                  </td>
                  <td>{product.categories.map((e) => e.name + '-')}</td>
                  <td>{product.description}</td>
                  <td>${product.price}</td>
                  <td>{product.stock}</td>
                  <td className={styles.buttonsRow}>
                    <Button
                      variant="contained"
                      className={styles.buttonDelete}
                      onClick={() => handleUpdateProduct(product.id)}
                    >
                      ACTUALIZAR
                    </Button>
                    <Button
                      variant="contained"
                      className={styles.buttonDelete}
                      onClick={() => handleClickOpen(product.id)}
                    >
                      BORRAR
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {redirectProduct && (
            <Redirect
              to={{
                pathname: "/product/admin/update",
                search: `?id=${idProduct}`,
              }}
            />
          )}
        </div>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"¿Estás seguro que quieres borrar el producto?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            style={{ textAlign: "center", paddingBottom: "5px" }}
          >
            Esta acción es irreversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            color="primary"
            style={{
              maxWidth: "25%",
              color: "white",
              backgroundColor: "black",
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleCloseDelete}
            color="primary"
            autoFocus
            style={{
              maxWidth: "25%",
              color: "black",
              backgroundColor: "#ffff01",
            }}
          >
            Continuar
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={openSnack} autoHideDuration={6000} onClose={handleSnack}>
        <Alert
          onClose={handleSnack}
          severity="success"
          style={{ backgroundColor: "#ffff5a", color: "black" }}
        >
          El producto fue borrado con exito
        </Alert>
      </Snackbar>
    </Fragment>
  );
}
export default ProductList;
