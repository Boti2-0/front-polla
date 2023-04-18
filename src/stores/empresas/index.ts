import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface Empresa {
  id: number;
  razaoSocial: string;
  cnpj: string;
  grupo: string;
  regime: string;
  codigo: number;
  uf: string;
  icms: boolean;
  iss: boolean;
  socios: SociosItems[];
}

interface Socios {
  nome: string;
  cpf: string;
  id: number;
}

interface SociosItems extends Array<Socios>{}
interface StoreState {
  Empresa: Empresa;
  setEmpresa: (empresa: Empresa) => void;
  clearEmpresa: () => void;
}

export const EmpresaStore = create<StoreState>()(
  devtools(
    persist(
      (set) => ({
        Empresa: {
          id: 0,
          razaoSocial: "",
          cnpj: "",
          grupo: "",
          regime: "",
          codigo: 0,
          uf: "",
          icms: false,
          iss: false,
          socios: [],
        },
        setEmpresa: (empresa: Empresa) => set(() => ({ Empresa: empresa })),
        clearEmpresa: () =>
          set(() => ({
            Empresa: {
              id: 0,
              razaoSocial: "",
              cnpj: "",
              grupo: "",
              regime: "",
              codigo: 0,
              uf: "",
              icms: false,
              iss: false,
              socios: [],
            },
          })),
      }),
      {
        name: "EmpresaStore",
      }
    )
  )
);
