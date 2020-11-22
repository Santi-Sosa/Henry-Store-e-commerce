import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "../../Styles/productDetail.module.css";
import Button from "@material-ui/core/Button";
import Chip from "@material-ui/core/Chip";
import { makeStyles } from "@material-ui/core/styles";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";
import henryShirt from "../../content/henryShirt.png";
import axios from "axios";
import Review from "../Review/Review";
import { useSelector, useDispatch } from "react-redux";
import { isLoggedIn } from "../../Redux/actions/authActions";

import Carousel from "react-material-ui-carousel";
import { Paper } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  button: {
    backgroundColor: "#ffff5a",
    height: "50px",
    width: "auto",
  },
}));

const ProductCard = () => {
  console.log(useParams());
  let { id } = useParams();
  const [product, setProduct] = useState({});

  const classes = useStyles();
  //Asignando el hook de dispatch a una constante
  const dispatch = useDispatch();

  //Se asigna el valor de userLogged por destructuring
  const userLogged = useSelector((state) => state.authUser);

  useEffect(() => {
    dispatch(isLoggedIn());
    getProduct();
  }, []);

  const getProduct = () => {
    fetch(`http://localhost:3100/products/${id}`)
      .then((data) => data.json())
      .then((product) => setProduct(product))
      .catch((err) => console.log(err));
  };

  const handleAddToCart = () => {
    if (userLogged.loggedIn) {
      axios({
        method: "post",
        url: `http://localhost:3100/users/${userLogged.userLogged.id}/cart`, //cuando se cree el sistema de autentificacion el "1" deberia ser reemplazado por el id del usuario
        data: {
          idProducto: product.id,
          amount: 1,
        },
      });
    } else {
      var storage = JSON.parse(localStorage.getItem("guestCart"));
      if (storage == null) {
        storage = [];
      }

      var doesExist = storage.findIndex((e) => e.productId === product.id);
      if (doesExist === -1) {
        var data = { productId: product.id, amount: 1 };
        storage.push(data);
      } else {
        storage[doesExist].amount += 1;
      }

      localStorage.setItem("guestCart", JSON.stringify(storage));
    }
  };

  
  return (
    <div className={styles.container}>
      <div className={styles.divCard}>
        <div className={styles.mainInfo}>
          <div className={styles.imgBx}>
            <Carousel>
              {product.images && product.images.map((item, i) => (
                <Item key={i} item={item} />
              ))}
            </Carousel>
          </div>
          <div className={styles.divButtons}>
            <span>
              <p>{product.name}</p>
            </span>
            <p>${product.price}</p>
            <div className={styles.chipDiv}>
              {product.categories &&
                product.categories.map((e) => (
                  <Chip
                    variant="outlined"
                    color="primary"
                    label={e.name}
                    className={styles.chip}
                    title={e.description}
                  />
                ))}
              {product.stock === 0 && (
                <Chip
                  variant="outlined"
                  color="secondary"
                  label="Sin Stock"
                  className={styles.chip}
                  title="Actualmente no tenemos stock de este producto"
                />
              )}
            </div>
            <Button
              variant="contained"
              disabled={product.stock === 0}
              style={{ width: "90%", marginTop: "10px" }}
              onClick={handleAddToCart}
              href="http://localhost:3000/user/cart/"
              className={classes.button}
              startIcon={<AddShoppingCartIcon />}
            >
              Comprar
            </Button>
          </div>
        </div>
        <div className={styles.divContent}>
          <div className={styles.divDescription}>
            <p>{product.description}</p>
          </div>
        </div>
        <div className={styles.reviewsDiv}>
          <Review product={product} />
        </div>
      </div>
    </div>
  );
};

function Item(props) {
  return (
      <img src={props.item.img} style={{padding:'0 50px'}}></img>
  );
}

export default ProductCard;
