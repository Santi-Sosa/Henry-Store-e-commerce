import React, { useState, useEffect, Fragment } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import henryLogo from '../content/logo.jpg'

const LoadingScreen = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        height: "100vh",
        backgroundColor: "#151515",
        justifyContent:'center',
      }}
    >
      <div style={{
          margin: 'auto',
          display: 'flex',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'baseline'}}>
      <img src={henryLogo} style={{
          height:'auto',
          width:'150px',
          marginRight:'15%'

      }}></img>
        <CircularProgress
          size="150px "
          style={{ color: "Yellow" }}
          disableShrink
        />
      </div>
    </div>
  );
};

export default LoadingScreen;
