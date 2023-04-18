import { Grid, Typography } from "@mui/material";
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
    <Grid
      container
      maxWidth="xl"
      sx={{
        display: "flex",
        height: "100vh",
      }}
    >
      <Header />
      <Grid item xs={0} sm={2} lg={2} md={2} xl={2} sx={{ marginTop: "100px" }}>
        <Sidebar />
      </Grid>
      <Grid item xs={12} lg={10} md={10} xl={10} sx={{ marginTop: "100px" }}>
        <Typography variant="h5" gutterBottom sx={{ marginBottom: "50px" }}>
          Gerenciar Empresas
        </Typography>
        {users !== undefined ? <Table data={users} /> : null}
      </Grid>
    </Grid>
  );
};

export default Empresas;
