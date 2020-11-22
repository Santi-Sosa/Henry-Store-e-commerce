import React, { useState, useEffect, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getTotal } from "../../Redux/actions/orderActions";
import styles from "../../Styles/ordersTable.module.css";
import OrderState from "./OrderState";

function OrderRow(props) {
  const { order } = props;
  const { user } = order;

  const { totalOrder } = useSelector((state) => state.totalOrder);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getTotal(order.id));
  }, []);

  return (
    user &&
    <Fragment>
      <tr>
        <td>{order.id}</td>
        <td>{order.createdAt.split("T")[0]}</td>
        <td>$ {totalOrder[order.id - 1]}</td>
        <td>{user.email}</td>
        <td style={{ textTransform: "capitalize" }}>{order.state}</td>
        <td style={{ display: "flex" }}>
          <OrderState orderId={order.id} />
        </td>
      </tr>
    </Fragment>
  );
}

export default OrderRow;
