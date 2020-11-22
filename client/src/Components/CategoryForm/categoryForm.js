import React from "react";
import styles from "../../Styles/categoryForm.module.css";
import axios from "axios";
import { useState } from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

//Formulario para crear categorias
function CategoryForm() {
  //Estado para Alerta crear categoria
  const [openCreate, setOpenCreate] = useState(false);

  //Funciones para control de Alerta crear categoria

  const handleCloseCreate = () => {
    setOpenCreate(false);
    window.location.href = "http://localhost:3000/product/admin/category-table";
  };

  //Otros estados

  const [state, setState] = useState({
    name: "",
    description: "",
  });
  const [error, setError] = useState(false);

  const handleChange = ({ target }) => {
    const { name, value } = target;
    setState({ ...state, [name]: value });
  };

  const { name, description } = state;
  const handleSubmit = (event) => {
    event.preventDefault();

    if (name === "" || description === "") {
      setError(true);
      return;
    }
    setError(false);

    if (!error) {
      axios({
        method: "post",
        url: "http://localhost:3100/categories/create-category",
        data: {
          name,
          description,
        },
      })
        .then(() => {
          setOpenCreate(true);
        })
        .catch((err) => console.log(err));
      setState({ name: "", description: "" });
    }
  };

  return (
    <div className={styles.containerCategoryForm}>
      <form className={styles.cardCategoryForm} onSubmit={handleSubmit}>
        <h3>Crear Categoria</h3>
        {error ? (
          <p style={{ color: "red" }}>Todos los campos son obligatorios</p>
        ) : null}
        <input
          key="name"
          type="text"
          placeholder="Nombre de la categoría"
          name="name"
          className={styles.inputCategory}
          value={name}
          onChange={handleChange}
        />
        <input
          key="description"
          type="text"
          placeholder="Descripción de la categoría"
          name="description"
          className={styles.inputCategory}
          value={description}
          onChange={handleChange}
        />
        <input
          key="submit"
          type="submit"
          className={styles.submitCategoryForm}
        />
      </form>
      <Snackbar
        open={openCreate}
        autoHideDuration={7000}
        onClose={handleCloseCreate}
      >
        <Alert
          onClose={handleCloseCreate}
          severity="success"
          style={{ backgroundColor: "#ffff5a", color: "black" }}
        >
          La categoria fue creada con éxito.
        </Alert>
      </Snackbar>
    </div>
  );
}

export default CategoryForm;
