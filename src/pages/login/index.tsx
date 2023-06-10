import { Container, Typography, Link, Box, Divider } from "@mui/material";
import styled from "@emotion/styled";
import { motion } from "framer-motion";
import Logo from "../../components/logo/Logo";
import LoginForm from "../../components/auth/LoginForm";

//////////////////////////////////
const RootStyle = styled("div")({
  background: "rgb(249, 250, 251)",
  height: "100vh",
  display: "grid",
  placeItems: "center",
});

const HeadingStyle = styled(Box)({
  textAlign: "center",
});

const ContentStyle = styled("div")({
  maxWidth: 480,
  padding: 25,
  margin: "auto",
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
  background: "#fff",
});

let easing = [0.6, -0.05, 0.01, 0.99];
const fadeInUp = {
  initial: {
    y: 60,
    opacity: 0,
    transition: { duration: 0.6, ease: easing },
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: easing,
    },
  },
};

const Login = ({ setAuth }) => {
  return (
    <RootStyle>
      <Container maxWidth="sm">
        <ContentStyle>
          <HeadingStyle component={motion.div} {...fadeInUp}>
            <Logo />
            <Typography sx={{ color: "text.secondary", mb: 5 }}>
              Entre na sua conta
            </Typography>
          </HeadingStyle>

          <Divider sx={{ my: 3 }} component={motion.div} {...fadeInUp} />
          <LoginForm setAuth={setAuth} />
        </ContentStyle>
      </Container>
    </RootStyle>
  );
};

export default Login;
