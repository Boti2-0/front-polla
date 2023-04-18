import React from "react";
import { Link } from "react-router-dom";
import { Box } from "@mui/material";
import img from "../../assets/logo_01.png";

const Logo = () => {
  return (
    <Box>
      <Link to="/">
        <Box component="img" src={img} alt="logo" />
      </Link>
    </Box>
  );
};

export default Logo;
