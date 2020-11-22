import React, { useState, useEffect, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import listUser from "../../Redux/actions/userActions";
import styles from "../../Styles/ordersTable.module.css";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}


function OrdersTable() {
  const { userList } = useSelector((state) => state.userList);
  const dispatch = useDispatch();

  const [idUser, setUser] = useState(undefined);

   //Estados para control de alertas Borrar
  const [openDelete, setOpenDelete] = useState(false);
  const [openSnackDelete, setSnackDelete] = useState(false);

   //Estados para control de alertas Promover
  const [openPromote, setOpenPromote] = useState(false);
  const [openSnackPromote, setSnackPromote] = useState(false);

  //Funciones control de alertas Borrar
  const handleClickOpenDelete = (id) => {
    setOpenDelete(true);
    setUser(id);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
    handleDelete(idUser);
  };

  const handleSnackDelete = () => {
    setSnackDelete(false);
  };

   //Funciones control de alertas Promover
  const handleClickOpenPromote = (id) => {
    setOpenPromote(true);
    setUser(id);
  };

  const handleClosePromote = () => {
    setOpenPromote(false);
    handlePromote(idUser);
  };

  const handleSnackPromote = () => {
    setSnackPromote(false);
  }; 
  
  useEffect(() => {
    dispatch(listUser());
  }, []);

  const handleDelete = (id) => {
    console.log(id);
    fetch(`http://localhost:3100/users/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((data) => {
        dispatch(listUser());
        setSnackDelete(true);
      })
      .catch((err) => console.log(err));
  };
  
  const handlePromote = (id) => {
    fetch(`http://localhost:3100/users/promote/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((data) => {
        dispatch(listUser());
        setSnackPromote(true);
      })
      .catch((err) => console.log(err));
  };

  return (
    <Fragment>
      <div className={styles.content}>
        <div>
          <h3>Listado de Usuarios</h3>
        </div>
        <div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>USERNAME</th>
                <th>EMAIL</th>
                <th>ROLE</th>
                <th style={{ textAlign: "center" }}>MANAGE</th>
              </tr>
            </thead>
            <tbody>
              {userList.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td style={{ textAlign: "center" , display: "flex" , justifyContent: "space-around"}}>
                    <Button
                      variant="contained"
                      className={styles.buttonDelete}
                      onClick={() => handleClickOpenDelete(user.id)}
                    >
                      BORRAR
                    </Button>
                    <Button
                      variant="contained"
                      className={styles.buttonDelete}
                      onClick={() => handleClickOpenPromote(user.id)}
                    >
                      PROMOVER
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Dialog
        open={openDelete}
        onClose={handleCloseDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"¿Estás seguro que quieres borrar el usuario?"}
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
            onClick={handleCloseDelete}
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
      <Snackbar open={openSnackDelete} autoHideDuration={6000} onClose={handleSnackDelete}>
        <Alert onClose={handleSnackDelete} severity="success" style={{backgroundColor: '#ffff5a', color: 'black'}}>
          El usuario fue borrado con exito
        </Alert> 
      </Snackbar>
      
      <Dialog
        open={openPromote}
        onClose={handleClosePromote}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"¿Estás seguro que quieres promover el usuario?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            style={{ textAlign: "center", paddingBottom: "5px" }}
          >
            Podrá acceder al Admin Panel junto con todas las funciones de un administrador.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClosePromote}
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
            onClick={handleClosePromote}
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
      <Snackbar open={openSnackPromote} autoHideDuration={6000} onClose={handleSnackPromote}>
        <Alert onClose={handleSnackPromote} severity="success" style={{backgroundColor: '#ffff5a', color: 'black'}}>
          El usuario fue promovido con exito
        </Alert> 
      </Snackbar>
    </Fragment>
  );
}
export default OrdersTable;
