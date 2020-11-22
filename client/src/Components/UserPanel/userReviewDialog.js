import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import axios from "axios";
import Rating from "@material-ui/lab/Rating";
import { Box, FormHelperText, makeStyles } from "@material-ui/core";

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

export default function UserReviewDialog(props) {
  const [open, setOpen] = useState(false);
  const { review } = props;
  const [reload, setReload] = useState(false);
  const [rating, setNewRating] = useState(review.value);
  const [description, setNewDescription] = useState(review.review);
  const [hover, setHover] = useState(-1);
  const classes = useStyles();
  const [responseMessage, setResponse] = useState('');
  console.log(rating);
  console.log(description);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseModify = () => {
    axios
      .put(`http://localhost:3100/reviews/update`, {
        id: review.id,
        rating: rating,
        description: description,
      })
      .then((data) => {
        setResponse(data.data.message);
      });
  };

  const handleReviewDelete = () => {
    axios
      .delete(`http://localhost:3100/reviews/delete/${review.id}`)
      .then((data) => {
        window.location.reload();
      })
      .catch((err) => console.log(err));
  };

  const handleRatingChange = (e) => {
    setNewRating(e.target.value);
  };
  const handleDescriptionChange = (e) => {
    setNewDescription(e.target.value);
  };
  return (
    <div>
      <Button
        variant="contained"
        style={{
          margin: "0 15px",
          width: "125px",
          color: "white",
        }}
        color="primary"
        onClick={handleClickOpen}
      >
        Editar
      </Button>
      <Button
        variant="contained"
        style={{
          margin: "0 15px",
          width: "125px",
          backgroundColor: "#f44336",
          color: "white",
        }}
        onClick={handleReviewDelete}
      >
        Eliminar
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Editar Reseña</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Para editar la reseña llena los siguientes campos:
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Nueva descripcion"
            type="email"
            fullWidth
            placeholder={review.review}
            defaultValue={review.review}
            value={description}
            onChange={handleDescriptionChange}
          />
          <Rating
            name="rating"
            value={rating}
            onChange={handleRatingChange}
            onChangeActive={(event, newHover) => {
              setHover(newHover);
            }}
          />
          {rating !== null && (
            <Box
              className={classes.root}
              ml={0}
              style={{ marginBottom: "10px" }}
            >
              {labels[hover !== -1 ? hover : rating]}
            </Box>
          )}
          <FormHelperText>{responseMessage}</FormHelperText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            CANCELAR
          </Button>
          <Button onClick={handleCloseModify} color="primary">
            MODIFICAR RESEÑA
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
