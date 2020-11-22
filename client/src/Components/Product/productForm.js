import React, { useState, useEffect } from "react";
import styles from "../../Styles/productForm.module.css";
import logoText from "../../Styles/Assets/logo henry black.png";
import axios from "axios";
import Button from "@material-ui/core/Button";
import PublishIcon from "@material-ui/icons/Publish";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    margin: 2,
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },
  button: {
    marginBottom: '15px',
    maxWidth: '150px'
  }
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: "500px",
    },
  },
};

function getStyles(name, personName, theme) {
  return {
    backgroundColor: personName.indexOf(name) === -1 ? "white" : "#dddd37",
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

function ProductForm() {
  //Estado para Alerta crear categoria
  const [openCreate, setOpenCreate] = useState(false);

  //Funciones para control de Alerta crear categoria

  const handleCloseCreate = () => {
    setOpenCreate(false);
    window.location.href = "http://localhost:3000/product/admin/product-table";
  };

  const classes = useStyles();
  /* Estados */
  const [state, setState] = useState({});
  const [categories, setCategories] = useState([]);
  const theme = useTheme();
  const [personName, setPersonName] = useState([]);
  const [imageUpload, setImages] = useState([]);

  const handleChanges = (event) => {
    setPersonName(event.target.value);
  };

  /* Peticion GET a categories */
  useEffect(() => {
    fetch("http://localhost:3100/categories")
      .then((data) => data.json())
      .then((data) => {
        setCategories(data);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleChange = ({ target }) => {
    const { name, value } = target;
    setState({ ...state, [name]: value });
  };

  const handleOnChangeImg = (e) => {
    
    var imageArray = [];

    for(const file of e.target.files){
      var reader = new FileReader();
      (function(file) {
        var reader = new FileReader();
        reader.onload = function(image) {
          setImages((e) => e.concat(image.target.result))
        };
        reader.readAsDataURL(file);
      })(file);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    axios({
      method: "post",
      url: "http://localhost:3100/products/create-product",
      data: {
        name: state.name,
        description: state.description,
        price: state.price,
        stock: state.stock,
        images: imageUpload
      },
    })
      .then((data) => {
        console.log(data)
        if (personName.length > 0) {
          personName.forEach((e) => {
            axios({
              method: "post",
              url: `http://localhost:3100/products/${data.data.id}/addCategory/${e}`,
            });
          });
        }
      })
      .then(() => {
        setOpenCreate(true);
      })
      .catch((err) => console.log(err));
    setState({ ...state, name: "", description: "", price: "", stock: "" });
  };

  return (
    <div>
      <form className={styles.form}>
        <div className={styles.container}>
          <div className={styles.inputs}>
            <div className={styles.inputDiv}>
              <label>Nombre</label>
              <input name="name" onChange={handleChange} value={state.name} />
              <label>Descripción</label>
              <input
                name="description"
                onChange={handleChange}
                value={state.description}
              />
              <label>Precio</label>
              <input
                type="number"
                name="price"
                min="0.00"
                step="0.01"
                onChange={handleChange}
                value={state.price}
              />
              <label>Stock</label>
              <input
                type="number"
                name="stock"
                min="0"
                step="1"
                onChange={handleChange}
                value={state.stock}
              />
              <label>Subir Imágenes </label>
              <input
                type="file"
                id="file"
                accept=".png"
                name="img"
                multiple
                onChange={handleOnChangeImg}
              />
            </div>
              <Button
                variant="contained"
                color="secondary"
                className={classes.button}
                onClick={handleSubmit}
                style={{ backgroundColor: "#ffff5a", color: "black" }}
                endIcon={<PublishIcon />}
              >
                CREAR
              </Button>
          </div>

          <div className={styles.buttons}>
            <h3 className={styles.h3Title}>Crear Producto</h3>
            {/* Selector multiple de categorias */}
            {state.img && (
              <img
                style={{ height: "auto", width: "20%", margin: "0 auto" }}
                src={state.img.toString("utf8")}
              ></img>
            )}
            <div className={styles.Multiselect}>
              <h2>Seleccionar Categorias: </h2>
              {categories.length > 0 && (
                <FormControl style={{ width: "80%" }}>
                  <InputLabel id="demo-mutiple-name-label">
                    Categorías
                  </InputLabel>
                  <Select
                    labelId="demo-mutiple-name-label"
                    id="demo-mutiple-name"
                    multiple
                    value={personName}
                    onChange={handleChanges}
                    input={<Input />}
                    MenuProps={MenuProps}
                  >
                    {categories.map((name, index) => (
                      <MenuItem
                        key={index}
                        value={name.id}
                        style={getStyles(name.id, personName, theme)}
                      >
                        {name.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </div>
            <img className={styles.imgLogo} src={logoText} alt="logoHenry" />
          </div>
        </div>
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
          El producto fue creado con éxito.
        </Alert>
      </Snackbar>
    </div>
  );
}
export default ProductForm;
