import * as React from "react";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";

import { Button, IconButton, TablePagination } from "@mui/material";
import { Cell, ChipAlert, ChipSucess, CustomTable, TableMain } from "./styled";
import { useNavigate } from "react-router-dom";
import ModalConfirm from "./../../components/modalConfirm";
import { EmpresaStore } from "../../stores/empresas";
import { cnpj } from "cpf-cnpj-validator";

export default function Table(data: any) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [empresa, setEmpresa] = React.useState({});
  const editEmpresa = EmpresaStore((state) => state.setEmpresa);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <>
      <ModalConfirm
        handleOpen={handleOpen}
        handleClose={handleClose}
        open={open}
        empresa={empresa}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "40px",
        }}
      >
        <Button
          variant="contained"
          endIcon={<AddIcon />}
          onClick={() => navigate("/new-empresa")}
        >
          Cadastrar nova empresa
        </Button>
      </div>

      <CustomTable>
        <TableMain>
          <TableHead>
            <TableRow>
              <Cell>Razão Social</Cell>
              <Cell>CNPJ</Cell>
              <Cell>Grupo</Cell>
              <Cell>UF</Cell>
              <Cell align="center">ICMS</Cell>
              <Cell align="center">ISS</Cell>
              <Cell>Editar</Cell>
              <Cell>Deletar</Cell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.data
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row: any, index: number) => (
                <TableRow key={index} hover>
                  <TableCell component="th" scope="row">
                    {row.razaoSocial}
                  </TableCell>
                  <TableCell align="left">{cnpj.format(row.cnpj)}</TableCell>
                  <TableCell align="left">{row.grupoName}</TableCell>
                  <TableCell align="left">{row.uf}</TableCell>
                  <TableCell align="center">
                    {row.icms ? (
                      <ChipAlert size="small" label={"ATIVO"} />
                    ) : (
                      <ChipSucess size="small" label={"DESATIVADO"} />
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {row.iss ? (
                      <ChipAlert size="small" label={"ATIVO"} />
                    ) : (
                      <ChipSucess size="small" label={"DESATIVADO"} />
                    )}
                  </TableCell>
                  <TableCell align="left">
                    <IconButton
                      aria-label="delete"
                      onClick={() => {
                        editEmpresa(row);
                        navigate("/new-empresa");
                      }}
                    >
                      <EditIcon fontSize="small" sx={{ color: "#E4BE34" }} />
                    </IconButton>
                  </TableCell>
                  <TableCell align="left">
                    <IconButton
                      aria-label="delete"
                      onClick={() => {
                        handleOpen();
                        setEmpresa(row);
                      }}
                    >
                      <DeleteIcon fontSize="small" sx={{ color: "#E96338" }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </TableMain>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 100]}
          component="div"
          count={data.data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </CustomTable>
    </>
  );
}
