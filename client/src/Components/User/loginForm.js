import React, { useState, useEffect } from "react";
import styles from "../../Styles/loginForm.module.css";
import logoHenry from "../../Styles/Assets/logo henry black.png";
import axios from "axios";
import Button from "@material-ui/core/Button";
import { Icon } from "@material-ui/core";
import googleLogo from '../../content/googlelogo.png'

function LoginForm() {
  const [state, setState] = useState({});



  const handleChange = ({ target }) => {
    const { name, value } = target;
    setState({ ...state, [name]: value });
  };

  const handleSubmit = (e) => {
    axios({
      method: "post",
      url: "http://localhost:3100/auth/login",
      data: {
        email: state.username,
        password: state.password,
      },
      withCredentials: true,
    }).then((data) => {      
      if (data.data.success) {
        window.location.href = "http://localhost:3000/user/cart";
      } else {
        document.getElementById('error-message').innerHTML = data.data.info.message;
        document.getElementById('error-message').style.color = 'red'
      }
    });
  };

  return (
    <div>
      <form className={styles.form}>
        <div className={styles.buttons}>
          <h3 className={styles.h3Title}>INICIA SESION</h3>

            <p id='error-message' style={{fontSize: '1.2em'}}>
              con tu usuario y contraseña.
            </p>
            <Button
            variant="contained"
            href='http://localhost:3100/auth/google'
            style={{backgroundColor: 'white', marginBottom: '1em', maxWidth:'50%', alignSelf:'center'}}
            endIcon={<img src={googleLogo} style={{height: 'auto', maxWidth: '45px'}}
            />}
          >...o con Google</Button>
            <img src={logoHenry} alt="logoHenry" className={styles.imgLogo} />
        </div>

        <div className={styles.inputs}>        
            <label>Email</label>
            <input name="username" onChange={handleChange} />
            <label>Contraseña</label>
            <input name="password" type="password" onChange={handleChange} />

            <div className={styles.button}>
              <Button
                variant="contained"
                color="secondary"
                style={{ backgroundColor: "#ffff5a", color: "black" }}
                onClick={handleSubmit}
              >
                INICIAR SESION
              </Button>

              <label style={{ marginLeft: "15px" }}>
                o <a href="http://localhost:3000/sign-up">Regístrate</a>
              </label>

            </div>        
          </div>
      </form>
    </div>
  );
}

export default LoginForm;