import {
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import Sidebar from "./../../components/sidebar";
import Header from "../../components/header";
import { Form, FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";

import AddSocio from "./addSocios";
import { cnpj } from "cpf-cnpj-validator";
import { brazilianStates } from "./../../utils/BrazilStates";
import { useState } from "react";
import InputMask from "react-input-mask";
import { CadastroEmpresaService } from "./../../services/api";
import { useUserStore } from "./../../stores/users";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import React from "react";
import { EmpresaStore } from "../../stores/empresas";

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

const NewEmpresa = ({ setAuth }) => {
  const SignupSchema = Yup.object().shape({
    razaoSocial: Yup.string()
      .min(2, "Muito Curto!")
      .max(50, "Muito Longo!")
      .required("Nome obrigatório"),
    cnpj: Yup.string().test("test-invalid-cpf", "CNPJ inválido", (res: any) =>
      cnpj.isValid(res)
    ),
    grupo: Yup.string().required("O Grupo é obrigatório"),
    regime: Yup.string().required("O Regime é obrigatório"),
    codigo: Yup.string().required("O Código é obrigatório"),
    uf: Yup.string().required("O Estado é obrigatório"),
  });

  const [socios, setSocios] = useState([]);
  const token = useUserStore((state) => state.token);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/empresas";
  const edit = EmpresaStore((state) => state.Empresa);
  const cleanEmpresas = EmpresaStore((state) => state.clearEmpresa);
  const [grupos, setGrupos]: any = React.useState(() => {
    CadastroEmpresaService.get("/empresa/grupos", {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => {
      const data = res.data;

      // Mapear o objeto para um array de objetos com chaves e valores
      const mappedOptions = Object.entries(data).map(([key, value]) => ({
        key,
        value,
      }));

      setGrupos(mappedOptions);
    });
  });
  const [regimes, setRegimes]: any = React.useState(() => {
    CadastroEmpresaService.get("/empresa/regimes", {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => {
      const data = res.data;

      // Mapear o objeto para um array de objetos com chaves e valores
      const mappedOptions = Object.entries(data).map(([key, value]) => ({
        key,
        value,
      }));

      setRegimes(mappedOptions);
    });
  });

  const handleSociosChange = (updatedSocios) => {
    setSocios(updatedSocios);
  };

  const formik = useFormik({
    initialValues: {
      id: edit.id,
      razaoSocial: edit.razaoSocial,
      cnpj: edit.cnpj,
      grupo: edit.grupo,
      regime: edit.regime,
      codigo: edit.codigo,
      uf: edit.uf,
      icms: edit.iss,
      iss: edit.iss,
      socios: edit.socios,
    },
    validationSchema: SignupSchema,
    onSubmit: () => {
      formik.values.socios = socios;
      formik.values.cnpj = formik.values.cnpj.replace(/\D/g, "");

      CadastroEmpresaService.post("/empresa/create", formik.values, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(() => {
          cleanEmpresas();
          navigate(from, { replace: true });
        })
        .catch((err) => {
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

  const { errors, touched, handleSubmit, getFieldProps } = formik;
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
      <Container maxWidth={'xl'}>
        <Grid container>
          <Header />
          <Box
            component={Grid}
            item
            xs={2}
            sx={{ marginTop: "100px" }}
            display={{ xs: "none", lg: "block" }}
          >
            <Sidebar />
          </Box>
          <Grid
            item
            xs={12}
            md={9}
            lg={9}
            justifyContent={"center"}
            alignContent={"center"}
            sx={{ marginTop: "100px" }}
          >
            <Typography
              variant="h5"
              gutterBottom
              sx={{ marginBottom: "50px", marginLeft: "20px" }}
            >
              {edit.id > 0 ? `Editar ${edit.razaoSocial}` : "Cadastrar Empresa"}
            </Typography>
            <FormikProvider value={formik}>
              <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                <Stack
                  spacing={3}
                  sx={{ marginLeft: "20px", marginRight: "20px" }}
                >
                  <Stack
                    component={motion.div}
                    initial={{ opacity: 0, y: 60 }}
                    animate={animate}
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                  >
                    <TextField
                      fullWidth
                      label="Razão Social"
                      {...getFieldProps("razaoSocial")}
                      error={Boolean(touched.razaoSocial && errors.razaoSocial)}
                      helperText={touched.razaoSocial && errors.razaoSocial}
                    />
                    <InputMask
                      mask="99.999.999/9999-99"
                      disabled={false}
                      maskChar=" "
                      {...getFieldProps("cnpj")}
                      error={Boolean(touched.cnpj && errors.cnpj)}
                      helperText={touched.cnpj && errors.cnpj}
                    >
                      {() => (
                        <TextField
                          fullWidth
                          label="CNPJ"
                          {...getFieldProps("cnpj")}
                          error={Boolean(touched.cnpj && errors.cnpj)}
                          helperText={touched.cnpj && errors.cnpj}
                        />
                      )}
                    </InputMask>
                  </Stack>

                  <Stack
                    component={motion.div}
                    initial={{ opacity: 0, y: 60 }}
                    animate={animate}
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                  >
                    <FormControl fullWidth variant="outlined">
                      <InputLabel id="brazilian-states-label">Grupo</InputLabel>
                      <Select
                        labelId="grupo"
                        label="grupo"
                        {...getFieldProps("grupo")}
                      >
                        {grupos?.map((grupo) => (
                          <MenuItem key={grupo.key} value={grupo.key}>
                            {grupo.value}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel id="brazilian-states-label">
                        Regime
                      </InputLabel>
                      <Select
                        labelId="regime"
                        label="regime"
                        {...getFieldProps("regime")}
                      >
                        {regimes?.map((regime) => (
                          <MenuItem key={regime.key} value={regime.key}>
                            {regime.value}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Stack>
                  <Stack
                    component={motion.div}
                    initial={{ opacity: 0, y: 60 }}
                    animate={animate}
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                  >
                    <TextField
                      fullWidth
                      label="Código"
                      type="number"
                      {...getFieldProps("codigo")}
                      error={Boolean(touched.codigo && errors.codigo)}
                      helperText={touched.codigo && errors.codigo}
                    />
                    <FormControl fullWidth variant="outlined">
                      <InputLabel id="brazilian-states-label">UF</InputLabel>
                      <Select
                        labelId="brazilian-states-label"
                        label="Brazilian States"
                        {...getFieldProps("uf")}
                      >
                        {brazilianStates.map((state) => (
                          <MenuItem
                            key={state.abbreviation}
                            value={state.abbreviation}
                          >
                            {state.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControlLabel
                      value={edit.icms}
                      control={
                        <Switch
                          color="primary"
                          {...getFieldProps("icms")}
                          defaultChecked={edit.icms}
                        />
                      }
                      label="ICMS"
                      labelPlacement="top"
                    />
                    <FormControlLabel
                      value={edit.iss}
                      control={
                        <Switch
                          color="primary"
                          defaultChecked={edit.iss}
                          {...getFieldProps("iss")}
                          value={edit.iss}
                        />
                      }
                      label="ISS"
                      labelPlacement="top"
                    />
                  </Stack>
                  <Stack
                    component={motion.div}
                    initial={{ opacity: 0, y: 60 }}
                    animate={animate}
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                  >
                    <AddSocio onSociosChange={handleSociosChange} />
                  </Stack>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      marginTop: "50px",
                    }}
                  >
                    <Box
                      component={motion.div}
                      initial={{ opacity: 0, y: 20 }}
                      animate={animate}
                    >
                      <Button
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
                      >
                        {edit.id > 0 ? "Editar Empresa" : "Cadastre-se"}
                      </Button>
                    </Box>
                  </div>
                </Stack>
              </Form>
            </FormikProvider>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default NewEmpresa;
