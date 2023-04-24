import {
  Box,
  Card,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import Sidebar from "./../../components/sidebar";
import Header from "../../components/header";
import { Form, FormikProvider, useFormik } from "formik";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import {
  DatePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoItem } from "@mui/x-date-pickers/internals/demo";
import { useUserStore } from "../../stores/users";
import { useState } from "react";
import { CadastroEmpresaService } from "../../services/api";
import { FilesService } from "../../services/api";
import { ToastContainer, toast } from "react-toastify";
import { ChipAlert, ChipSucess } from "../../components/table/styled";
import { LoadingButton } from "@mui/lab";
import img from "../../assets/data.png";

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

const Home = ({ setAuth }) => {
  const token = useUserStore((state) => state.token);
  const [data, getData]: any = useState();
  const [users, getUsers]: any = useState(() => {
    CadastroEmpresaService.get("/empresa?search=id>0", {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res: any) => {
      const result = res.data.map((item) => {
        return {
          id: item.id,
          razaoSocial: item.razaoSocial,
        };
      });
      console.log(result);
      getUsers(result);
    });
  });
  const formik = useFormik({
    initialValues: {
      date: dayjs("2023-04-17"),
      id: "",
    },

    onSubmit: () => {
      FilesService.get(
        `/onedrive/DAS?empresa=${
          formik.values.id
        }&periodo=${formik.values.date.format("YYYY-MM-DD")}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
        .then((res: any) => {
          getData(res.data);
          formik.setSubmitting(false);
        })
        .catch(() => {
          formik.setSubmitting(false);
          toast.error("Sem dados para esse período!", {
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

  const {
    handleSubmit,
    getFieldProps,
    setFieldValue,
    isSubmitting,
  } = formik;
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
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
          md={10}
          lg={10}
          justifyContent={"center"}
          alignContent={"center"}
          sx={{ marginTop: "100px" }}
        >
          <Typography variant="h5" gutterBottom sx={{ marginBottom: "50px", marginLeft: '20px' }}>
            Dashboard
          </Typography>
          <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
              <Card
                component={motion.div}
                initial={{ opacity: 0, y: 60 }}
                animate={animate}
                sx={{
                  margin: 2,
                  boxShadow: "0px 34px 34px rgba(13, 46, 97, 0.05)",
                  borderRadius: "10px",
                }}
              >
                <CardContent>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent={"space-between"}
                    pl={2}
                    pr={2}
                  >
                    <Stack direction={{ xs: "column", sm: "row" }}>
                      <div style={{ marginRight: "20px" }}>
                        <DemoItem label="Data de pesquisa">
                          <DatePicker
                            onChange={(value) =>
                              setFieldValue("date", value, true)
                            }
                            value={formik.values.date}
                            defaultValue={dayjs("2022-04-17")}
                            label="data"
                          />
                        </DemoItem>
                      </div>

                      <DemoItem label="Escolha sua empresa">
                        <FormControl fullWidth variant="outlined">
                          <InputLabel id="brazilian-states-label">
                            Empresa
                          </InputLabel>
                          {users !== undefined ? (
                            <Select
                              labelId="Empresa"
                              label="Empresa"
                              sx={{ minWidth: 300 }}
                              {...getFieldProps("id")}
                            >
                              {users.map((state) => (
                                <MenuItem key={state.id} value={state.id}>
                                  {state.razaoSocial}
                                </MenuItem>
                              ))}
                            </Select>
                          ) : null}
                        </FormControl>
                      </DemoItem>
                    </Stack>

                    <Box
                      component={motion.div}
                      initial={{ opacity: 0, y: 20 }}
                      animate={animate}
                      justifyContent={"end"}
                    >
                      <LoadingButton
                        fullWidth
                        sx={{ marginTop: "32px" }}
                        size="large"
                        type="submit"
                        loading={isSubmitting}
                        variant="contained"
                      >
                        Pesquisar
                      </LoadingButton>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Form>
          </FormikProvider>
          <Stack
            component={motion.div}
            initial={{ opacity: 0, y: 60 }}
            animate={animate}
            direction={{ xs: "column", sm: "column" }}
            justifyContent={"center"}
            spacing={2}
            alignItems={"center"}
          >
            {data ? (
              data.map((item) => (
                <>
                  <Card
                    sx={{
                      marginTop: 10,
                      width: "90%",
                      boxShadow: "0px 34px 34px rgba(13, 46, 97, 0.09)",
                      borderRadius: "10px",
                    }}
                  >
                    <CardContent>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                        }}
                      >
                        {item.statusAprovado ? (
                          <ChipAlert size="small" label={"APROVADO"} />
                        ) : (
                          <ChipSucess size="small" label={"RECUSADO"} />
                        )}
                      </div>

                      <Typography variant="h5" component="div">
                        {item.item}
                      </Typography>

                      <Typography variant="body2">{item.desc}</Typography>
                    </CardContent>
                  </Card>
                </>
              ))
            ) : (
              <>
                <Typography variant="h4" textAlign={"center"} mt={10}>
                  Sem dados disponiveis
                </Typography>
                <Box component="img" src={img} alt="logo" width="50%" />
              </>
            )}
          </Stack>
        </Grid>
      </Grid>
    </LocalizationProvider>
  );
};

export default Home;
