import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Box,
  Card,
  CardContent,
  Container,
  FormControl,
  Grid,
  Stack,
  TextField,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Sidebar from "./../../components/sidebar";
import Header from "../../components/header";
import { Form, FormikProvider, useFormik } from "formik";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoItem } from "@mui/x-date-pickers/internals/demo";
import { useUserStore } from "../../stores/users";
import { CSSProperties, useState } from "react";
import { CadastroEmpresaService } from "../../services/api";
import { FilesService } from "../../services/api";
import { ToastContainer, toast } from "react-toastify";
import { ChipAlert, ChipSucess } from "../../components/table/styled";
import { LoadingButton } from "@mui/lab";
import img from "../../assets/data.png";
import "dayjs/locale/pt-br";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import DashTable from "../../components/dashTable";
import { ClipLoader } from "react-spinners";

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
  const [faturamentos, setFaturamentos]: any = useState();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("md"));
  const width = matches ? 500 : 300;
  const [users, getUsers]: any = useState(() => {
    CadastroEmpresaService.get("/empresa?search=id>0", {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res: any) => {
      const result = res.data.map((item) => {
        return {
          id: item.id,
          label: item.codigo + " - " + item.razaoSocial,
        };
      });
      getUsers(result);
    });
  });
  const formik = useFormik({
    initialValues: {
      date: dayjs("2023-04-17"),
      id: "",
    },

    onSubmit: () => {
      getData(null);
      setFaturamentos(null);
      FilesService.get(
        `/files/comparar?empresa=${
          formik.values.id
        }&periodo=${formik.values.date.format("YYYY-MM-DD")}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
        .then((res: any) => {
          getData(res.data);
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
      FilesService.get(
        `/files/getFaturamentos?empresa=${
          formik.values.id
        }&periodo=${formik.values.date.format("YYYY-MM-DD")}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
        .then((res: any) => {
          setFaturamentos(res.data);
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

  const override: CSSProperties = {
    display: "block",
    margin: "auto",
    marginTop: "50px",
  };

  const { handleSubmit, setFieldValue, isSubmitting } = formik;
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
      <Container maxWidth={"xl"}>
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
            <Typography
              variant="h5"
              gutterBottom
              sx={{ marginBottom: "50px", marginLeft: "20px" }}
            >
              Dashboard
            </Typography>
            <FormikProvider value={formik}>
              <Form noValidate onSubmit={handleSubmit}>
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
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={2}
                      >
                        <LocalizationProvider
                          adapterLocale="pt-br"
                          dateAdapter={AdapterDayjs}
                        >
                          <DemoItem label="Data de pesquisa">
                            <DatePicker
                              views={["month", "year"]}
                              onChange={(value) =>
                                setFieldValue("date", value, true)
                              }
                              value={formik.values.date}
                              defaultValue={dayjs("2022-04-17")}
                              label="data"
                            />
                          </DemoItem>
                        </LocalizationProvider>
                        <DemoItem label="Escolha sua empresa">
                          <FormControl fullWidth variant="outlined">
                            {users !== undefined ? (
                              <Autocomplete
                                renderInput={(params) => (
                                  <TextField {...params} label="Empresa" />
                                )}
                                options={users}
                                onChange={(
                                  event,
                                  value: { id: Number; label: string }
                                ) => {
                                  setFieldValue("id", value.id);
                                }}
                                sx={{ minWidth: width }}
                              />
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

            {data && formik.isSubmitting !== true ? (
              <Grid container spacing={4}>
                <Grid item xs={12} md={4} lg={4} xl={4}>
                  {faturamentos ? <DashTable data={faturamentos} /> : null}
                </Grid>
                <Grid item xs={12} md={8} lg={8} xl={8}>
                  <Stack
                    component={motion.div}
                    initial={{ opacity: 0, y: 60 }}
                    animate={animate}
                    direction={{ xs: "column", sm: "column" }}
                    justifyContent={"center"}
                    alignItems={"center"}
                  >
                    {data
                      ? data.itens.map((item, index) => (
                          <div>
                            <Accordion
                              sx={{
                                marginTop: index === 0 ? "0px" : 1,
                                marginRight: 2,
                                boxShadow:
                                  "0px 34px 34px rgba(13, 46, 97, 0.09)",
                                borderRadius: "10px",
                              }}
                            >
                              <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1bh-content"
                                id="panel1bh-header"
                              >
                                <div
                                  style={{
                                    alignSelf: "center",
                                    marginRight: "20px",
                                  }}
                                >
                                  {item.statusAprovado ? (
                                    <ChipAlert
                                      size="small"
                                      label={"APROVADO"}
                                    />
                                  ) : (
                                    <ChipSucess
                                      size="small"
                                      label={"RECUSADO"}
                                    />
                                  )}
                                </div>
                                <Typography
                                  sx={{ width: "33%", flexShrink: 0 }}
                                >
                                  {item.item}
                                </Typography>
                                <Typography sx={{ color: "text.secondary" }}>
                                  {item.desc}
                                </Typography>
                              </AccordionSummary>
                              <AccordionDetails>
                                <Typography
                                  color={"white"}
                                  marginBottom={"-20px"}
                                >
                                  Nulla facilisi. Phasellus sollicitudin nulla
                                  et quam mattis feugiat. Aliquam eget maximus
                                  est, id dignissim quam.
                                </Typography>
                                {item.subDescricaoList ? (
                                  item?.subDescricaoList.map((sub) => (
                                    <>
                                      <Typography variant="h6">
                                        {sub.subDesc}
                                      </Typography>
                                      <a
                                        href={sub.link}
                                        rel="noreferrer"
                                        target="_blank"
                                      >
                                        Link para a nota
                                      </a>
                                    </>
                                  ))
                                ) : (
                                  <Typography variant="h6">
                                    Sem detalhes disponiveis
                                  </Typography>
                                )}
                              </AccordionDetails>
                            </Accordion>
                          </div>
                        ))
                      : null}
                  </Stack>
                </Grid>
              </Grid>
            ) : (
              <Box
                display={"flex"}
                alignContent={"center"}
                justifyContent={"center"}
                flexDirection={"column"}
              >
                {isSubmitting ? (
                  <ClipLoader
                    color={"#1565C0"}
                    loading={isSubmitting}
                    size={100}
                    cssOverride={override}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                ) : (
                  <>
                    <Typography variant="h4" textAlign={"center"} mt={10}>
                      Sem dados disponiveis
                    </Typography>
                    <Box
                      component="img"
                      src={img}
                      alt="logo"
                      width="45%"
                      margin={"auto"}
                    />
                  </>
                )}
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Home;
