import {
  BottomNavigation,
  BottomNavigationAction,
  makeStyles,
  Paper,
  createStyles
} from "@material-ui/core";
import React from "react";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: 'white',
      backgroundColor: 'black'
    },
    link: {
        color: 'white'
    }
  }),
);


export default function FooterComp() {
  const [value, setValue] = React.useState("recents");
  const classes = useStyles();
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <footer
      style={{
        position: "relative",
        left: 0,
        bottom: 0,
        right: 0,
        minHeight: "100px",
      }}
    >
      <BottomNavigation
        value={value}
        onChange={handleChange}
        style={{
          width: "100%",
          height: "100%",
          minHeight: "100px",
          backgroundColor: "black",
          paddingTop: '30px'
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={6} sm={3}>
            <Paper className={classes.paper}><a className={classes.link} href='/login'>Ingresar</a></Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper className={classes.paper}><a className={classes.link} href='/sign-up'>Registrarse</a></Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper className={classes.paper}><a className={classes.link} href='/user/cart'>Mi carrito</a></Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper className={classes.paper}><a style={{color:'white'}} href='https://www.soyhenry.com/nosotros/'>¿Quienes Somos?</a></Paper>
          </Grid>
          <Grid item xs={6} sm={12}>
            <Paper className={classes.paper}>© 2020 - 2020 www.henry-store.com - All Rights Reserved.</Paper>
          </Grid>
        </Grid>
      </BottomNavigation>
    </footer>
  );
}