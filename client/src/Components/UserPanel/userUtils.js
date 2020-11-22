import React, { Fragment, useEffect, useState } from "react";
import { makeStyles, Theme, withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import EditIcon from "@material-ui/icons/Edit";
import LockIcon from "@material-ui/icons/Lock";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import { Button, Paper, Snackbar } from "@material-ui/core";
import axios from "axios";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import UserOrders from "./userOrders";
import RateReviewIcon from '@material-ui/icons/RateReview';
import UserReviews from "./userReviews";

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-force-tabpanel-${index}`}
      aria-labelledby={`scrollable-force-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `scrollable-force-tab-${index}`,
    "aria-controls": `scrollable-force-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    width: "100%",
    backgroundColor: theme.palette.background.paper,
    border: "2px solid black",
  },
  classes: {
    backgroundColor: "black",
    color: "white",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    maxWidth: "50%",
    margin: "auto",
  },
  helperText: {
    paddingBottom: "15px",
  },
  button: {
    backgroundColor: "yellow",
  },
}));

export default function UserUtils(props) {
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const [name, setName] = useState("");
  const { user } = props;
  const [state, setState] = useState({
    name: user.name,
    username: user.username,
    email: user.email,
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [passwordError, setPwError] = useState(false);
  const [profileError, setProfileError] = useState({
    success: true,
    message: "",
  });
  const [pwError, setPasswordError] = useState({
    success: true,
    message: "",
  });
  const [alertPw, setPwAlert] = useState(false);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    passwordValidator();
    getUserOrders();
    getUserReviews();
  }, [state]);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  const handleInputChange = ({ target }) => {
    const { name, value } = target;
    setState({ ...state, [name]: value });
  };

  const passwordValidator = () => {
    state.newPassword !== state.confirmNewPassword
      ? setPwError(true)
      : setPwError(false);
  };

  const submitProfileEdit = () => {
    axios
      .put(`http://localhost:3100/users/update/${user.id}`, {
        name: state.name,
        username: state.username,
        email: state.email,
      })
      .then((response) => {
        setProfileError(response.data);
      })
      .catch((err) => console.log(err));
  };

  const handlePwChange = () => {
    axios
      .put(`http://localhost:3100/auth/change-password`, {
        userId: user.id,
        currentPw: state.currentPassword,
        newPw: state.newPassword,
      })
      .then((response) => {
        if (!response.data.success) {
          return setPasswordError(response.data);
        }
        setAlertPw();
        setPasswordError(response.data);
      });
  };

  const getUserOrders = () => {
    axios
      .get(`http://localhost:3100/users/${user.id}/orders`)
      .then((response) => setOrders(response.data))
      .catch((err) => console.log(err));
  };

  const getUserReviews = () => {
    axios
      .get(`http://localhost:3100/reviews/byUser/${user.id}`)
      .then((response) => setReviews(response.data))
      .catch((err) => console.log(err));
  };

  //ALERT HANDLE
  const setAlertPw = () => {
    setPwAlert(!alertPw);
  };
  const pwAlertClose = () => {
    setState({
      name: user.name,
      username: user.username,
      email: user.email,
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Tabs
          TabIndicatorProps={{ style: { background: "#ffff57" } }}
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="on"
          textColor="white"
          className={classes.classes}
        >
          <Tab label="EDITAR PERFIL" icon={<EditIcon />} {...a11yProps(0)} />
          <Tab label="SEGURIDAD" icon={<LockIcon />} {...a11yProps(1)} />
          <Tab
            label="VER ORDENES"
            icon={<ShoppingCartIcon />}
            {...a11yProps(2)}
          />
          <Tab
            label="MIS RESEÑAS"
            icon={<RateReviewIcon />}
            {...a11yProps(3)}
          />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <form className={classes.form} noValidate autoComplete="off">
          <FormControl>
            <InputLabel>Nombre</InputLabel>
            <Input
              value={state.name}
              name="name"
              onChange={handleInputChange}
            />
            <FormHelperText className={classes.helperText}>
              Edita tu nombre, este es mostrado públicamente
            </FormHelperText>
          </FormControl>
          <FormControl
            disabled={user.username === "Google User" ? true : false}
          >
            <InputLabel>Email</InputLabel>
            <Input
              value={state.email}
              name="email"
              onChange={handleInputChange}
            />
            {user.username === "Google User" ? (
              <FormHelperText className={classes.helperText}>
                Los usuarios de Google no pueden modificar su email
              </FormHelperText>
            ) : (
              <FormHelperText className={classes.helperText}>
                Edita tu email, este es usado para ingresar a la pagina
              </FormHelperText>
            )}
          </FormControl>
          <FormControl
            disabled={user.username === "Google User" ? true : false}
          >
            <InputLabel>Nombre de usuario</InputLabel>
            <Input
              value={state.username}
              name="username"
              onChange={handleInputChange}
            />
            {user.username === "Google User" ? (
              <FormHelperText className={classes.helperText}>
                Los usuarios de Google no pueden modificar su usuario
              </FormHelperText>
            ) : (
              <FormHelperText className={classes.helperText}>
                Edita tu nombre de usuario
              </FormHelperText>
            )}
            {!profileError.success ? (
              <FormHelperText error className={classes.helperText}>
                {profileError.message}
              </FormHelperText>
            ) : (
              <FormHelperText
                style={{ color: "green" }}
                className={classes.helperText}
              >
                {profileError.message}
              </FormHelperText>
            )}
          </FormControl>
          <Button
            style={{ backgroundColor: "#ffff57", color: "black" }}
            variant="contained"
            color="primary"
            onClick={submitProfileEdit}
          >
            MODIFICAR PERFIL
          </Button>
        </form>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <form className={classes.form} noValidate autoComplete="off">
          <FormControl
            disabled={user.username === "Google User" ? true : false}
            style={{ marginBottom: "15px" }}
          >
            <InputLabel>Contraseña actual</InputLabel>
            <Input
              value={state.currentPassword}
              name="currentPassword"
              onChange={handleInputChange}
              type="password"
            />
          </FormControl>
          <FormControl
            disabled={user.username === "Google User" ? true : false}
            style={{ marginBottom: "15px" }}
          >
            <InputLabel>Nueva contraseña</InputLabel>
            <Input
              value={state.newPassword}
              name="newPassword"
              onChange={handleInputChange}
              type="password"
            />
          </FormControl>
          <FormControl
            disabled={user.username === "Google User" ? true : false}
            error={passwordError}
            style={{ marginBottom: "15px" }}
          >
            <InputLabel>Confirma la nueva contraseña</InputLabel>
            <Input
              value={state.confirmNewPassword}
              name="confirmNewPassword"
              onChange={handleInputChange}
              type="password"
            />
            {passwordError ? (
              <FormHelperText className={classes.helperText}>
                Las contraseñas deben coincidir
              </FormHelperText>
            ) : (
              <Fragment />
            )}
            {!pwError.success ? (
              <FormHelperText error className={classes.helperText}>
                {pwError.message}
              </FormHelperText>
            ) : (
              <Fragment />
            )}
            {user.username === "Google User" ? (
              <FormHelperText error>
                Los usuarios de Google no tienen contraseña
              </FormHelperText>
            ) : (
              <Fragment />
            )}
          </FormControl>
          <Button
            style={{ backgroundColor: "#ffff57", color: "black" }}
            variant="contained"
            color="primary"
            disabled={state.newPassword.length < 1 || passwordError}
            onClick={handlePwChange}
          >
            MODIFICAR CONTRASEÑA
          </Button>
        </form>
      </TabPanel>
      <TabPanel value={value} index={2}>
        {orders[0] ? (
          <UserOrders orders={orders} />
        ) : (
          <Paper style={{backgroundColor: '#f44336', width:'40%', color: 'white', padding: '1em', margin: 'auto', textAlign: 'center'}}>No tienes ninguna orden en el historial ni activa</Paper>
        )}
      </TabPanel>
      <TabPanel value={value} index={3}>
        <UserReviews reviews={reviews}/>
      </TabPanel>
      {/* ALERTAS */}
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={alertPw}
        autoHideDuration={6000}
        onClose={setAlertPw}
      >
        <Alert onClose={pwAlertClose} severity="success">
          Tu contraseña se actualizó con éxito
        </Alert>
      </Snackbar>
    </div>
  );
}
