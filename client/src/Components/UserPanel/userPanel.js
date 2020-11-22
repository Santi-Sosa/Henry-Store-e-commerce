import React from "react";
import s from "../../Styles/userPanel.module.css";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import UtilsTab from "./userUtils";
import UserInfo from "./userInfo";
import { Redirect } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      marginBottom: "15px",
      textAlign: "center",
      color: theme.palette.text.secondary,
    },
    image: {
      width: 128,
      height: 128,
    },
    img: {
      margin: "auto",
      display: "block",
      maxWidth: "100%",
      maxHeight: "100%",
    },
    button: {
      padding: theme.spacing(2),
      marginBottom: "15px",
      textAlign: "center",
      color: theme.palette.text.secondary,
      width: "100%",
    },
  })
);

function UserPanel() {
  const classes = useStyles();

  const { userLogged } = useSelector((state) => state.authUser);

  return (
    <div className={s.mainDiv}>
      {!userLogged.id && <Redirect to="/login" />}
      <div className={s.box}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Paper className={classes.paper} style={{fontSize:'1.5em'}}>
              ¡Hola {userLogged.name}! Bienvenido a tu Panel de Usuario
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <UserInfo user={userLogged} />
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <UtilsTab user={userLogged}/>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default UserPanel;
