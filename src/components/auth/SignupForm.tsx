import * as Yup from "yup";
import { useState } from "react";
import { useFormik, Form, FormikProvider } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Stack,
  Box,
  TextField,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import { AuthService } from "./../../services/api";
import { useUserStore } from "./../../stores/users";

/////////////////////////////////////////////////////////////
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

const SignupForm = ({ setAuth }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const setIsLogged = useUserStore((state) => state.setLogged);
  const setToken = useUserStore((state) => state.setToken);
  const setRefreshToken = useUserStore((state) => state.setRefreshToken);

  const [showPassword, setShowPassword] = useState(false);

  const SignupSchema = Yup.object().shape({
    firstname: Yup.string()
      .min(2, "Muito Curto!")
      .max(50, "Muito Longo!")
      .required("Nome obrigatório"),
    lastname: Yup.string()
      .min(2, "Muito Curto!")
      .max(50, "Muito Longo!")
      .required("Último nome obrigatório"),
    email: Yup.string()
      .email("O E-mail deve ser valído")
      .required("O E-mail é obrigatório"),
    password: Yup.string().required("A senha é obrigatória"),
  });

  const formik = useFormik({
    initialValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
    },
    validationSchema: SignupSchema,

    onSubmit: () => {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic 12345678`,
        },
      };
      AuthService.post("/user/register", formik.values, config)
        .then((res) => {
          setToken(res.data.authToken);
          setRefreshToken(res.data.refreshToken);
          setIsLogged(true);
          navigate(from, { replace: true });
        })
        .catch((res) => {
          formik.setSubmitting(false);
          toast.error("Ooops! Algo deu errado, tente novamente", {
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

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

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
          <Stack spacing={3}>
            <Stack
              component={motion.div}
              initial={{ opacity: 0, y: 60 }}
              animate={animate}
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
            >
              <TextField
                fullWidth
                label="Nome"
                {...getFieldProps("firstname")}
                error={Boolean(touched.firstname && errors.firstname)}
                helperText={touched.firstname && errors.firstname}
              />

              <TextField
                fullWidth
                label="Sobrenome"
                {...getFieldProps("lastname")}
                error={Boolean(touched.lastname && errors.lastname)}
                helperText={touched.lastname && errors.lastname}
              />
            </Stack>

            <Stack
              spacing={3}
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
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        <Icon
                          icon={
                            showPassword ? "eva:eye-fill" : "eva:eye-off-fill"
                          }
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                error={Boolean(touched.password && errors.password)}
                helperText={touched.password && errors.password}
              />
            </Stack>

            <Box
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={animate}
            >
              <LoadingButton
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                loading={isSubmitting}
              >
                {isSubmitting ? "Carregando..." : "Cadastre-se"}
              </LoadingButton>
            </Box>
          </Stack>
        </Form>
      </FormikProvider>
    </>
  );
};

export default SignupForm;
