import React, { Fragment, useState } from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Paper } from "@material-ui/core";
import s from './styles/userOrders.module.css'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      flexBasis: "33.33%",
      flexShrink: 0,
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
    },
  })
);

export default function UserOrders(props) {
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
      {props.orders.map((e) => (
        <div id={e.id} onClick={handleChange}>
          <Accordion
            id={e.id}
            expanded={state[e.id]}
            style={{ marginBottom: "5px" }}
          >
            <AccordionSummary
              id={e.id}
              expandIcon={<ExpandMoreIcon id={e.id} onClick={handleChange} />}
              aria-controls="panel3bh-content"
            >
              <Typography id={e.id} className={classes.heading}>
                ID de la orden: {e.id}
              </Typography>
              <Typography
                error={e.state === "canceled"}
                id={e.id}
                className={classes.secondaryHeading}
              >
                Estado: {e.state}
              </Typography>
            </AccordionSummary>
            <AccordionDetails id={e.id}>
              <Typography style={{width: '100%'}} id={e.id}>
                  <table className={s.userTable}>
                    <thead>
                      <tr>
                        <th>NOMBRE</th>
                        <th>DESCRIPCIÓN</th>
                        <th>PRECIO UNIDAD</th>
                        <th>CANTIDAD</th>
                      </tr>
                    </thead>
                    <tbody>
                    {e.products.map((e) => (
                      <tr>
                        <td>{e.name}</td>
                        <td>{e.description}</td>
                        <td>${e.price}</td>
                        <td>{e.amount.amount}</td>
                      </tr>))}
                    </tbody>
                  </table>
              </Typography>
            </AccordionDetails>
          </Accordion>
        </div>
      ))}
    </div>
  );
}
