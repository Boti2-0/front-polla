import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, FormikProvider, useFormik } from "formik";
import * as Yup from "yup";

import {
  Box,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useUserStore } from "../../stores/users";
import { AuthService } from "../../services/api";
import { ToastContainer, toast } from "react-toastify";

let easing = [0.6, -0.05, 0.01, 0.99];
const animate = {
  opacity: 1,
  y: 0,
  transition: {
    duration: 0.6,
    ease: easing,
    delay: 0.16,
  },
};

const LoginForm = ({ setAuth }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/home";
  const setIsLogged = useUserStore((state) => state.setLogged);
  const setToken = useUserStore((state) => state.setToken);
  const setRefreshToken = useUserStore((state) => state.setRefreshToken);
  const [showPassword, setShowPassword] = useState(false);

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email("Digite o seu endereço de E-mail")
      .required("O E-mail é obrigatório"),
    password: Yup.string().required("A senha é obrigatória"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: LoginSchema,

    onSubmit: () => {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic 12345678`,
        },
      };
      AuthService.post("/auth/authenticate", formik.values, config)
        .then((res) => {
          setToken(res.data.authToken);
          setRefreshToken(res.data.refreshToken);
          setIsLogged(true);
          navigate(from, { replace: true });
        })
        .catch(() => {
          formik.setSubmitting(false);
          toast.error("Usuario ou senha errados! Tente novamente", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
        });
    },
  });

  const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Box
            component={motion.div}
            animate={{
              transition: {
                staggerChildren: 0.55,
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
              }}
              component={motion.div}
              initial={{ opacity: 0, y: 40 }}
              animate={animate}
            >
              <TextField
                fullWidth
                autoComplete="username"
                type="email"
                label="E-mail"
                {...getFieldProps("email")}
                error={Boolean(touched.email && errors.email)}
                helperText={touched.email && errors.email}
              />

              <TextField
                fullWidth
                autoComplete="current-password"
                type={showPassword ? "text" : "password"}
                label="Senha"
                {...getFieldProps("password")}
                error={Boolean(touched.password && errors.password)}
                helperText={touched.password && errors.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? (
                          <Icon icon="eva:eye-fill" />
                        ) : (
                          <Icon icon="eva:eye-off-fill" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Box
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={animate}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ my: 2 }}
              ></Stack>

              <LoadingButton
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                loading={isSubmitting}
              >
                {isSubmitting ? "Carregando..." : "Entrar"}
              </LoadingButton>
            </Box>
          </Box>
        </Form>
      </FormikProvider>
    </>
  );
};

export default LoginForm;
