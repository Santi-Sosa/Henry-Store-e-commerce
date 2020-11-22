import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { listOrders } from "../../Redux/actions/orderActions";
import OrderRow from "./OrderRow";
import ReactSelectMaterialUi from "react-select-material-ui";
import styles from "../../Styles/ordersTable.module.css";

function OrdersTable() {
    
  const { orderList } = useSelector((state) => state.orderList); 
  const [filterList, setFilterList] = useState();
  const [filter, setFilter] = useState(false);
    
  // const options = ["Sin Filtro", "inCart", "created","active", "processing", "canceled", "complete"]
  const options = ["Sin Filtro","Creada", "Activa", "En Carrito", "Cancelada", "En Proceso", "Completa"];

  const dispatch = useDispatch(); 
  
  useEffect(() => {
    dispatch(listOrders());         
  }, []);
  
  // const handleState = (selectedState) => {    
  //    if ( selectedState === "Sin Filtro" ){
  //      setFilter(false);       
  //    } else {
  //     setFilter(true);
  //     let filterList = orderList.filter( order => order.state === selectedState);      
  //     return setFilterList(filterList);
  //    }        
  // };

  
  const handleState = (selectedState) => {
    console.log('selectedState',selectedState);    
    switch (selectedState) {
      case "Sin Filtro": {
        return setFilter(false);
        };
        case "Creada":{
          setFilter(true);
          let filterList = orderList.filter( order => order.state === "created");
          return setFilterList(filterList);
          };
      case "Activa":{
        setFilter(true);
        let filterList = orderList.filter( order => order.state === "active");
        return setFilterList(filterList);
        };
        case "En Carrito":{
          setFilter(true);
          let filterList = orderList.filter( order => order.state === "inCart");
          return setFilterList(filterList);
        };
        case "Cancelada":{
          setFilter(true);
          let filterList = orderList.filter( order => order.state === "canceled");
          return setFilterList(filterList);
        };
        case "En Proceso":{
          setFilter(true);
          let filterList = orderList.filter( order => order.state === "processing");
        return setFilterList(filterList);
      }; 
        case "Completa":{
          setFilter(true);
          let filterList = orderList.filter( order => order.state === "complete");
          return setFilterList(filterList);
        };
    }
 }

 console.log('orderList',orderList);   
 console.log('filterList',filterList);   
 console.log('filter',filter);
  
  return (    
      <div className={styles.content}>
        <div>
          <h3>Listado de Ordenes</h3>

          <ReactSelectMaterialUi
            className={styles.selectState}
            options={options}
            onChange={handleState}
            placeholder="Filtrar Estado"
            SelectProps={{              
              msgNoOptionsAvailable: "No hay filtros cargados"              
            }}
          />
        </div>

        <div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>CREADA EL</th>
                <th>TOTAL</th>
                <th>USUARIO</th>
                <th>ESTADO</th>
                <th>CAMBIAR ESTADO</th>
              </tr>
            </thead>
            <tbody>
              { filter
                ?
                  filterList.map((order, index) => {                        
                    return (
                     <OrderRow order={order} key={index} />
                    );
                  })
                :
                  orderList.map((order, index) => {   
                    console.log(order)                     
                    return (
                      <OrderRow order={order} key={index} />
                    );
                  })
              }
            </tbody>
          </table>          
        </div>        
      </div>
    );
  }

export default OrdersTable;