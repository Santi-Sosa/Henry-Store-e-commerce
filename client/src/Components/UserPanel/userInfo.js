import React from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import henryLogo from "../../content/logo.jpg";
import Typography from "@material-ui/core/Typography";
import ButtonBase from "@material-ui/core/ButtonBase";
import { Box, Icon } from "@material-ui/core";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      margin: "auto",
      maxWidth: 500,
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
    info: {
        verticalAlign: 'middle',
        margin: 'auto'
    }
  })
);

export default function UserInfo(props) {
  const classes = useStyles();
  console.log(props);
  const { user } = props;

  return (
    <Box className={classes.paper} style={{ height: "40%" }}>
      <Grid container spacing={2} xs={12}>
        <Grid item>
          <ButtonBase className={classes.image}>
            <img className={classes.img} alt="complex" src={henryLogo} />
          </ButtonBase>
        </Grid>
        <Grid item xs={12} sm container>
          <Grid item xs={12} className={classes.info} container direction="column" spacing={2}>
              <Typography align="right" gutterBottom variant="subtitle1">
                  <PersonOutlineIcon style={{verticalAlign: 'middle', marginRight:'10px'}} title="Nombre" />
                 {user.name}
              </Typography>
              <Typography align="right" variant="body2" gutterBottom>
                  <MailOutlineIcon style={{verticalAlign: 'middle', marginRight:'10px'}} title="Email" />
                <p style={{verticalAlign:'middle', display: 'inline-block', lineHeight: 'normal'}}>{user.email}</p>
              </Typography>
              <Typography align="right" variant="body2" color="textSecondary">
                ID de Usuario: {user.id}
              </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
