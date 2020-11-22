import React from "react";
import { Link } from "react-router-dom";
import styles from "../../Styles/navBar.module.css";
import { Avatar } from "@material-ui/core";

export default function NavBar() {
  const userLogged = true;

  return (
    <nav className={styles.menu}>
      <ul>
        <li>
          {/* user.role === Role.Admin */}
          {true && <Link to="/product/admin">Admin</Link>}
        </li>
        <li>
          <a href="http://localhost:3000/user/cart">Carrito</a>
        </li>
        <li>
          <a href="/sign-up">Registrarse</a>
        </li>
        <li>
          {!userLogged ? (
            <a href="/login">LogIn</a>
          ) : (
            <div className={styles.dropdown}>
              <Avatar
                style={{ background: "#ffb400", cursor: "pointer" }}
                onClick={() => console.log("holaaaaaaaaaa")}
              ></Avatar>
              <div className={styles.dropdownContent}>
                <a href="#">Hola {"user.name"}</a>
                <a href="#">Ver Ordenes</a>
                <a href="#">Ver Reviews</a>
                <a href="#">Modificar Datos</a>
                <a href="#">LogOut</a>
              </div>
            </div>
          )}
        </li>
      </ul>
    </nav>
  );
}
