import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import { Cell, CustomTable, TableMain } from "./styled";

export default function DashTable(data: any) {
  return (
    <CustomTable>
      <TableMain>
        <TableHead>
          <TableRow>
            <Cell align="center">Mês</Cell>
            <Cell align="center">Receita</Cell>
            <Cell align="center">Imposto</Cell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.data.map((row: any, index: number) => (
            <TableRow key={index} hover>
              <TableCell align="center">{row.mes}</TableCell>
              <TableCell align="center">R$ {row.receita}</TableCell>
              <TableCell align="center">{row.imposto !== null ?  'R$ '+ row.imposto : 'Sem valor'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </TableMain>
    </CustomTable>
  );
}
