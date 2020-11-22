import React, { Fragment, useState, useEffect } from "react";
import styles from "../../Styles/landing.module.css";
import logoText from "../../content/logoComplete.png";
// import Catalogo from "../Product/Catalogo/catalogo.js";
import ReactSelectMaterialUi from "react-select-material-ui";
import { useSelector, useDispatch } from "react-redux";
import Product from "../../Components/Product/product"

export default function Landing() {  
  const [allProducts, setProducts] = useState([]);
  const [allCategories, setCategories] = useState([]);
  const [selectedCategory, setCategory] = useState("");

  const dispatch = useDispatch()

  useEffect(() => {
    setProducts([]);
    if ( selectedCategory !== "Todas las Categorias" && selectedCategory) {      
      fetch(`http://localhost:3100/categories/category/${selectedCategory}`)
        .then((data) => data.json())
        .then((data) => { 
          data.products.forEach((e) => {            
            if (e.stock > 0){              
              setProducts((previousState) => previousState.concat(e));
            }
          });          
        })
        .catch((err) => console.log(err));
    } else {
      fetch("http://localhost:3100/products/")
        .then((data) => data.json())
        .then((data) => {          
          data.forEach((e) => {            
            if (e.stock > 0){              
              setProducts((previousState) => previousState.concat(e));
            }
          });          
        })
        .catch((err) => console.log(err));
    }
    fetch("http://localhost:3100/categories")
      .then((data) => data.json())
      .then((data) => setCategories(data));
  }, [selectedCategory]);

  const options = allCategories.map((e) => e.name);
  const handleCategoryChange = function (selectedCategory) {
    setCategory(selectedCategory);
  };

  return (
    <Fragment>
      <section id="section-one">
        <div className={styles.textBox}>
          <h2>BIENVENIDO A</h2>
          <img className={styles.henryLogo} src={logoText} alt="Logo Henry" />
          <p>STORE</p>
          <a href="#section-two">VER CATÁLOGO</a>
        </div>
      </section>
      <section id="section-two" className={styles.productSection}>
        <div className={styles.divSelector}>
          <span>
            <h1>CATÁLOGO</h1>
          </span>

          <ReactSelectMaterialUi
            className={styles.selectCategory}
            value={selectedCategory}
            options={options}            
            onChange={handleCategoryChange}
            placeholder="Seleccione una Categoria"
            style={{zIndex: '100'}}
            SelectProps={{              
              msgNoOptionsAvailable: "No hay Categorias cargadas"              
            }}
          />
        </div>
        {allProducts.map((product, index) => <Product product={product} key={product.id} />)}        
      </section>
    </Fragment>
  );
}
