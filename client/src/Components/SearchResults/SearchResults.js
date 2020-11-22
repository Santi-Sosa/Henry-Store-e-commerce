import React from "react";
import styles from "../../Styles/searchResults.module.css";
import Product from "../Product/product";

const SearchBar = (props) => {
  console.log(props);
  if (!props.products[0]) window.location.href = "http://localhost:3000/";
  return (
    <div className={styles.divResults}>
      <h1>Resultados de la busqueda:</h1>
      {props.products.map((e, index) => (
        <Product product={e} key={index} />
      ))}
    </div>
  );
};

export default SearchBar;
