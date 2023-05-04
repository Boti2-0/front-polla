import { Box, Container, Grid, Typography } from "@mui/material";
import Sidebar from "./../../components/sidebar";
import Header from "../../components/header";
import Table from "../../components/table";
import { useEffect, useState } from "react";
import { CadastroEmpresaService } from "./../../services/api";
import { useUserStore } from "./../../stores/users";
import { EmpresaStore } from "../../stores/empresas";

const Empresas = ({ setAuth }) => {
  const token = useUserStore((state) => state.token);
  const cleanEmpresas = EmpresaStore((state) => state.clearEmpresa);
  const [users, getUsers] = useState(() => {
    CadastroEmpresaService.get("/empresa?search=id>0", {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => {
      getUsers(res.data);
    });
  });

  useEffect(() => {
    cleanEmpresas();
  }, [cleanEmpresas]);

  return (
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
          lg={10}
          md={10}
          xl={10}
          sx={{ marginTop: "100px", paddingRight: "20px", paddingLeft: "20px" }}
        >
          <Typography variant="h5" gutterBottom sx={{ marginBottom: "50px" }}>
            Gerenciar Empresas
          </Typography>
          {users !== undefined ? (
            <Table data={users} />
          ) : (
            <>
              <Typography variant="h4" textAlign={"center"} mt={10}>
                Sem dados disponiveis
              </Typography>
            </>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Empresas;
