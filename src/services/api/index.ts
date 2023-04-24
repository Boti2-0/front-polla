import api from "./api";

export const AuthService = api("https://api.pollacontadores.com.br/auth-service/api/v1");
export const CadastroEmpresaService = api(
  "https://api.pollacontadores.com.br/CADASTRO-SERVICE/api/v1"
);
export const FilesService = api(
  "https://api.pollacontadores.com.br/FILES-SERVICE/api/v1"
);
