import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import CryptoJS, { enc } from "crypto-js";
import { Button, Grid, Typography } from "@mui/material";
import React, { useContext, useEffect } from "react";
import CloudIcon from "../../assets/cloud.png";
import { FcGoogle } from "react-icons/fc";
import classes from "./LoginPage.module.css";
import { auth, db } from "../../../firebase";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../../contexts/LoginContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, handleSetUserData } = useContext(LoginContext);

  const handleLogin = async () => {
    const googleProvider = new GoogleAuthProvider();
    const response = await signInWithPopup(auth, googleProvider);
    handleSetUserData(response.user);
  };

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard");
    else navigate("/login");
  }, [isAuthenticated, navigate]);

  return (
    <Grid container item width="100%" height="100vh" alignItems="center">
      <Grid
        container
        item
        xs={7}
        direction="column"
        gap={5}
        alignItems="center"
      >
        <Typography
          component="header"
          variant="h3"
          className={classes.headerText}
        >
          SecuCloud
        </Typography>
        <img src={CloudIcon} alt="cloud" width="150px" height="150px" />
        <Button
          variant="contained"
          startIcon={<FcGoogle />}
          sx={{ width: "50%", bgcolor: "#1565c0" }}
          onClick={handleLogin}
        >
          Sign in with Google
        </Button>
      </Grid>
      <Grid
        container
        item
        className={classes.imageContainer}
        xs={5}
        height="100vh"
      ></Grid>
    </Grid>
  );
};

export default LoginPage;
