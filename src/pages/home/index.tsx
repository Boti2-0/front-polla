import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  CardContent,
  Container,
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
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
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
import "dayjs/locale/pt-br";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import DashTable from "../../components/dashTable";

const itens = {
  itens: [
    {
      item: "Valor",
      statusAprovado: false,
      desc: "O Valor do Pgdas é maior que o do Das",
      subDescricaoList: [
        {
          subDesc: "Valor Pgdas: R$1378.74",
          link: "https://saoluizengenharia1-my.sharepoint.com/personal/devteste_saoluizengenharia_com_br/Documents/DEPARTAMENTO%20FISCAL/EMPRESAS/1019-BOARON/MOVIMENTO%20FISCAL/2023/03/1019-PGDAS%20RETIF%202-%20(2).pdf",
        },
        {
          subDesc: "Valor Das: R$394.56",
          link: "https://saoluizengenharia1-my.sharepoint.com/personal/devteste_saoluizengenharia_com_br/Documents/DEPARTAMENTO%20FISCAL/EMPRESAS/1019-BOARON/MOVIMENTO%20FISCAL/2023/03/1019-DAS%20RETIF%202%20(1).pdf",
        },
      ],
    },
    {
      item: "Cnpj",
      statusAprovado: true,
      desc: "O CNPJ está igual em todos os arquivos",
      subDescricaoList: null,
    },
    {
      item: "Periodo",
      statusAprovado: true,
      desc: "Os Periodos são iguais",
      subDescricaoList: [
        {
          subDesc: "Datas Pgdas: 2023-02-01 a 2023-02-28",
          link: "https://saoluizengenharia1-my.sharepoint.com/personal/devteste_saoluizengenharia_com_br/Documents/DEPARTAMENTO%20FISCAL/EMPRESAS/1019-BOARON/MOVIMENTO%20FISCAL/2023/03/1019-PGDAS%20RETIF%202-%20(2).pdf",
        },
        {
          subDesc: "Datas relatorio: 2023-02-01 a 2023-02-28",
          link: "https://saoluizengenharia1-my.sharepoint.com/personal/devteste_saoluizengenharia_com_br/Documents/DEPARTAMENTO%20FISCAL/EMPRESAS/1019-BOARON/MOVIMENTO%20FISCAL/2023/03/1019-Servi%C3%A7os%20RETIF%2002%20(1).pdf",
        },
        {
          subDesc: "Data Das: Fevereiro/2023",
          link: "https://saoluizengenharia1-my.sharepoint.com/personal/devteste_saoluizengenharia_com_br/Documents/DEPARTAMENTO%20FISCAL/EMPRESAS/1019-BOARON/MOVIMENTO%20FISCAL/2023/03/1019-DAS%20RETIF%202%20(1).pdf",
        },
      ],
    },
    {
      item: "Receita",
      statusAprovado: true,
      desc: "Os Valores de Receita do PgDas e do Relatorio de Serviços são iguais",
      subDescricaoList: [
        {
          subDesc: "Receita Pgdas: R$12919.52",
          link: "https://saoluizengenharia1-my.sharepoint.com/personal/devteste_saoluizengenharia_com_br/Documents/DEPARTAMENTO%20FISCAL/EMPRESAS/1019-BOARON/MOVIMENTO%20FISCAL/2023/03/1019-PGDAS%20RETIF%202-%20(2).pdf",
        },
        {
          subDesc: "Receita Relatorio: R$12919.52",
          link: "https://saoluizengenharia1-my.sharepoint.com/personal/devteste_saoluizengenharia_com_br/Documents/DEPARTAMENTO%20FISCAL/EMPRESAS/1019-BOARON/MOVIMENTO%20FISCAL/2023/03/1019-Servi%C3%A7os%20RETIF%2002%20(1).pdf",
        },
      ],
    },
  ],
  mesesPassados: [
    {
      mes: "mai/2022",
      receita: 0.0,
    },
    {
      mes: "jun/2022",
      receita: 6799.57,
    },
    {
      mes: "jul/2022",
      receita: 9183.79,
    },
    {
      mes: "ago/2022",
      receita: 8905.02,
    },
    {
      mes: "set/2022",
      receita: 8959.26,
    },
    {
      mes: "out/2022",
      receita: 9004.07,
    },
    {
      mes: "nov/2022",
      receita: 7168.35,
    },
    {
      mes: "dez/2022",
      receita: 12184.26,
    },
    {
      mes: "jan/2023",
      receita: 12237.63,
    },
  ],
};

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
        `/files/comparar?empresa=${
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

  const { handleSubmit, getFieldProps, setFieldValue, isSubmitting } = formik;
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
              alignItems={"center"}
            >
              {data ? (
                data.itens.map((item) => (
                  <div>
                    <Accordion
                      sx={{
                        marginTop: 1,

                        boxShadow: "0px 34px 34px rgba(13, 46, 97, 0.09)",
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
                            <ChipAlert size="small" label={"APROVADO"} />
                          ) : (
                            <ChipSucess size="small" label={"RECUSADO"} />
                          )}
                        </div>
                        <Typography sx={{ width: "33%", flexShrink: 0 }}>
                          {item.item}
                        </Typography>
                        <Typography sx={{ color: "text.secondary" }}>
                          {item.desc}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography color={"white"} marginBottom={"-20px"}>
                          Nulla facilisi. Phasellus sollicitudin nulla et quam
                          mattis feugiat. Aliquam eget maximus est, id dignissim
                          quam.
                        </Typography>
                        {item.subDescricaoList ? (
                          item?.subDescricaoList.map((sub) => (
                            <>
                              <Typography variant="h6">
                                {sub.subDesc}
                              </Typography>
                              <a href={sub.link} rel="noreferrer" target="_blank">
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
              ) : (
                <>
                  <Typography variant="h4" textAlign={"center"} mt={10}>
                    Sem dados disponiveis
                  </Typography>
                  <Box component="img" src={img} alt="logo" width="50%" />
                </>
              )}
              {data?.mesesPassados ? (
                <DashTable data={itens.mesesPassados} />
              ) : null}
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Home;
