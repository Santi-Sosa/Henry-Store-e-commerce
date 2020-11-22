import React, { Fragment, useEffect, useState } from "react";
import styles from "../../Styles/review.module.css";
import Rating from "@material-ui/lab/Rating";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import Axios from "axios";
import { Chip } from "@material-ui/core";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const labels = {
  1: "Malo",
  2: "Regular",
  3: "Satisfactorio",
  4: "Bueno",
  5: "Excelente",
};

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(2),
      width: "90%",
    },
  },
}));

export default function Review({ product }) {
  const [reviews, setReviews] = useState([]);
  const [value, setValue] = useState(null);
  const [valueNew, setNewValue] = useState(0);
  const [hover, setHover] = useState(-1);
  const [open, setOpen] = useState(false);
  const [openSnack, setSnack] = useState(false);
  const [description, setDescription] = useState("");
  const classes = useStyles();

  const { userLogged } = useSelector((state) => state.authUser);

  //la Id del producto deberia llegar como props o como parametro
  //const id = product.id
  useEffect(() => {
    if (product.id) getReviews();
  }, [product.id]);

  const getReviews = () => {
    /* fetch(`http://localhost:3100/reviews/${id}`) */
    //Usada id 1 para ejemplificar reviews, las id se pasaran por productCard

    fetch(`http://localhost:3100/reviews/${product.id}`)
      .then((data) => data.json())
      .then((allReviews) => setReviews(allReviews))
      .catch((err) => console.log(err));
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleClickOpen = (id) => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleCloseDelete = () => {
    setOpen(false);
    handleAddReview(product.id, userLogged.id);
  };
  const handleSnack = () => {
    setSnack(false);
  };

  const handleAddReview = (productId, userId) => {
    Axios.post(`http://localhost:3100/reviews/${productId}/add`, {
      userId: userId,
      rating: valueNew,
      description: description,
    })
      .then((data) => {
        getReviews();
        setSnack(true);
      })
      .catch((err) => console.log(err));
  };
  return (
    <Fragment>
      <div className={styles.reviewContainer}>
        {userLogged.id && (
          <div className={styles.inputReviewDiv}>
            <h2>
              ¿Has comprado este producto? ¡Comparte tu opinión con el resto!
            </h2>
            <form
              className={classes.root}
              noValidate
              autoComplete="off"
              onSubmit={() => console.log("holaaaaa")}
            >
              <TextField
                required
                id="outlined-basic"
                label="Escribe tu reseña"
                variant="outlined"
                onChange={handleDescriptionChange}
                value={description}
              />
            </form>
            <Rating
              name="hover-feedback"
              value={valueNew}
              precision={1}
              onChange={(event, newValue) => {
                setNewValue(newValue);
              }}
              onChangeActive={(event, newHover) => {
                setHover(newHover);
              }}
            />
            {valueNew !== null && (
              <Box ml={0} style={{ marginBottom: "10px" }}>
                {labels[hover !== -1 ? hover : valueNew]}
              </Box>
            )}
            <Button
              variant="contained"
              color="primary"
              style={{ width: "200px" }}
              className={styles.addReview}
              onClick={handleClickOpen}
            >
              AÑADIR RESEÑA
            </Button>
          </div>
        )}

        <h3 className={styles.reviewTittle}>
          Mira las críticas de {product.name}{" "}
        </h3>
        {reviews.length > 0 ? (
          reviews.map((e) => (
            <div className={styles.reviewCard}>
              <div className={styles.reviewRating}>
                <Box
                  component="fieldset"
                  mb={1} 
                  borderColor="transparent"
                >
                  <Typography component="legend">Valoracion: </Typography>
                  <Rating name="read-only" value={e.value} readOnly />
                  <p style={{alignSelf:"flex-start"}}> <Chip
                    variant="outlined"
                    color="primary"
                    label={`Autor: ${e.author.name} (Usuario ID: #${e.author.id}) `}
                    className={styles.chip}
                    title={e.description}
                  /> </p>
                </Box>
              </div>
              <div className={styles.reviewContent}>
                <span>{e.review}</span>
              </div>
            </div>
          ))
        ) : (
          <h2>No se encontraron reviews para este producto.</h2>
        )}
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"¿Estas seguro de añadir reseña?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            style={{ textAlign: "center", paddingBottom: "5px" }}
          >
            Esta acción puede ser modificada en tu panel de usuario.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            color="primary"
            style={{
              maxWidth: "25%",
              color: "white",
              backgroundColor: "black",
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleCloseDelete}
            color="primary"
            autoFocus
            style={{
              maxWidth: "25%",
              color: "black",
              backgroundColor: "#ffff01",
            }}
          >
            Continuar
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={openSnack} autoHideDuration={6000} onClose={handleSnack}>
        <Alert
          onClose={handleSnack}
          severity="success"
          style={{ backgroundColor: "#3f51b5", color: "white" }}
        >
          La reseña fue añadida con exito
        </Alert>
      </Snackbar>
    </Fragment>
  );
}
