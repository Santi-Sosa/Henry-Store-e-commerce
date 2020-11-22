import React, { Fragment, useState } from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Button, Paper } from "@material-ui/core";
import s from "./styles/userOrders.module.css";
import Rating from "@material-ui/lab/Rating";
import UserReviewDialog from "./userReviewDialog";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      width: "100%",
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      flexBasis: "33.33%",
      flexShrink: 0,
      verticalAlign: "middle",
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
    },
  })
);

export default function UserReviews(props) {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
  const [state, setState] = useState({});

  const handleChange = (e) => {
    let key = e.target.id;
    setState({
      ...state,
      key: true,
    });
  };

  return (
    <div className={classes.root}>
      {props.reviews[0] ? props.reviews.map((e) => (
        <div id={e.id} onClick={handleChange}>
          <Accordion
            id={e.id}
            expanded={state[e.id]}
            style={{
              marginBottom: "5px",
              backgroundColor: "whitesmoke",
              verticalAlign: "middle",
            }}
          >
            <AccordionSummary
              id={e.id}
              expandIcon={<ExpandMoreIcon id={e.id} onClick={handleChange} />}
              aria-controls="panel3bh-content"
            >
              <Typography id={e.id} className={classes.heading}>
                Producto:{" "}
                <a href={`/product/detailed/${e.product.id}`}>
                  {e.product.name}
                </a>
              </Typography>
              <Typography
                error={e.state === "canceled"}
                id={e.id}
                className={classes.secondaryHeading}
                style={{ display: "flex", flexDirection: "column" }}
              >
                Valoracion otorgada:
                <Rating readOnly name="rating" value={e.value} />
              </Typography>
            </AccordionSummary>
            <AccordionDetails id={e.id}>
              <Typography style={{ width: "100%" }} id={e.id}>
                <table className={s.userTable}>
                  <thead style={{ backgroundColor: "whitesmoke" }}>
                    <tr>
                      <th>RESEÑA</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{e.review}</td>
                      <td
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                          paddingTop: "15px",
                        }}
                      >
                        <UserReviewDialog review={e}/>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Typography>
            </AccordionDetails>
          </Accordion>
      </div>
      )) : <Paper style={{backgroundColor: '#f44336', width:'40%', color: 'white', padding: '1em', margin: 'auto', textAlign: 'center'}}>No tienes ninguna reseña realizada</Paper>}
    </div>
  );
}
