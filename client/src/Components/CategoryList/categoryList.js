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

function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [idCategory, setCategory] = useState(undefined);
  const [openSnack, setSnack] = useState(false);
  const [redirectCategory, setRedirect] = useState(false);

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = () => {
    fetch("http://localhost:3100/categories")
      .then((data) => data.json())
      .then((categories) => setCategories(categories))
      .catch((err) => console.log(err));
  };

  const handleClickOpen = (id) => {
    setOpen(true);
    setCategory(id);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleCloseDelete = () => {
    setOpen(false);
    handleDelete(idCategory);
  };

  const handleSnack = () => {
    setSnack(false);
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:3100/categories/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((data) => {
        getCategories();
        setSnack(true);
      })
      .catch((err) => console.log(err));
  };

  const handleUpdateProduct = (id) => {
    setCategory(id);
    setRedirect(true);
  };

  return (
    <Fragment>
      <div className={styles.content}>
        <div>
          <h3>Listado de Categorías</h3>
        </div>
        <div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>NOMBRE DE LA CATEGORÍA</th>
                <th>DESCRIPCION</th>
                <th>MANAGE</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td>{category.id}</td>
                  <td>{category.name}</td>
                  <td>{category.description}</td>
                  <td className={styles.buttonsRow}>
                    <Button
                      variant="contained"
                      className={styles.buttonDelete}
                      onClick={() => handleUpdateProduct(category.id)}
                    >
                      ACTUALIZAR
                    </Button>
                    <Button
                      variant="contained"
                      className={styles.buttonDelete}
                      onClick={() => handleClickOpen(category.id)}
                    >
                      BORRAR
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {redirectCategory && (
            <Redirect
              to={{
                pathname: "/product/admin/categories/update",
                search: `?id=${idCategory}`,
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
          {"¿Estás seguro que quieres borrar la categoría?"}
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
         La categoría fue borrada con éxito
        </Alert>
      </Snackbar>
    </Fragment>
  );
}
export default CategoryList;
