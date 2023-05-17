import React, { useState } from "react";
import { Formik, Form } from "formik";
import { Button, TextField, Grid, Autocomplete } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { cpf } from "cpf-cnpj-validator";
import { ToastContainer, toast } from "react-toastify";
import { CadastroEmpresaService } from "../../services/api";
import { useUserStore } from "../../stores/users";
import { EmpresaStore } from "../../stores/empresas";

const AddSocio = ({ onSociosChange }) => {
  const edit = EmpresaStore((state) => state.Empresa);
  const initialValues = {
    socios: edit.socios,
  };
  const [socios, setSocios]: any = useState(initialValues.socios);
  const [options, setOptions]: any = useState([]);
  const token = useUserStore((state) => state.token);

  const handleSubmit = (values) => {
    console.log("Submitted values:", values);
  };

  const handleInputChange = (event, index, field) => {
    const newSocios = [...socios];
    if (options[index]?.id !== undefined) {
      newSocios[index]["id"] = options[index].id;
    }
    newSocios[index][field] = event;
    setSocios(newSocios);
    CadastroEmpresaService.get(
      `/socio/name-or-cpf/${event.replace(/[^a-z0-9]/gi, "")}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    ).then((res) => {
      setOptions(res.data);
    });

    const result = newSocios.map((obj) => {
      return {
        ...obj, // copy all fields from original object
        cpf: obj.cpf.replace(/\D/g, ""), // replace cpf field with digits only
      };
    });
    onSociosChange(result);
  };

  const addUser = () => {
    if (
      socios.length > 0 &&
      cpf.isValid(socios[socios.length - 1].cpf) === false
    ) {
      toast.error("CPF invalido! Digite novamente", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return;
    } else {
      const newSocios = [...socios, { nome: "", cpf: "" }];
      setSocios(newSocios);
      const result = newSocios.map((obj) => {
        return {
          ...obj, // copy all fields from original object
          cpf: obj.cpf.replace(/\D/g, ""), // replace cpf field with digits only
        };
      });
      onSociosChange(result);
    }
  };

  const removeUser = (index) => {
    const newSocios = socios.filter((_, i) => i !== index);
    setSocios(newSocios);
    const result = newSocios.map((obj) => {
      return {
        ...obj, // copy all fields from original object
        cpf: obj.cpf.replace(/\D/g, ""), // replace cpf field with digits only
      };
    });

    onSociosChange(result);
  };

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
      <Formik initialValues={{ socios }} onSubmit={handleSubmit}>
        {({ values }) => (
          <Form>
            <Grid container spacing={2}>
              {socios.map((user, index) => (
                <React.Fragment key={index}>
                  <Grid item xs={5}>
                    <Autocomplete
                      freeSolo
                      id="nome"
                      disableClearable
                      value={socios[index].nome}
                      onChange={(e, newValue) =>
                        handleInputChange(newValue, index, "nome")
                      }
                      options={options.map((option) => option.nome)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          variant="outlined"
                          label="Nome"
                          name={`socios.${index}.nome`}
                          value={socios[index].nome}
                          onChange={(e) =>
                            handleInputChange(e.target.value, index, "nome")
                          }
                          InputProps={{
                            ...params.InputProps,
                            type: "search",
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={5}>
                    <Autocomplete
                      freeSolo
                      id="cpf"
                      disableClearable
                      value={socios[index].cpf}
                      onChange={(e, newValue) =>
                        handleInputChange(newValue, index, "cpf")
                      }
                      options={options.map((option) => option.cpf)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          name={`socios.${index}.cpf`}
                          onChange={(e) =>
                            handleInputChange(e.target.value, index, "cpf")
                          }
                          label="CPF"
                          value={user.cpf}
                          fullWidth
                          InputProps={{
                            ...params.InputProps,

                            type: "search",
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <Button
                      variant="contained"
                      onClick={() => removeUser(index)}
                    >
                      <DeleteIcon />
                    </Button>
                  </Grid>
                </React.Fragment>
              ))}
              <Grid item xs={12}>
                <Button variant="contained" color="primary" onClick={addUser}>
                  Adicionar Sócio
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default AddSocio;
