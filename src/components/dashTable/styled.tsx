import { Box, Table, TableCell, TableContainer } from "@mui/material";
import styled from "styled-components";

export const CustomTable = styled(TableContainer)`
    && {
      box-shadow: 0px 34px 34px rgba(13, 46, 97, 0.05);
      border-radius: 8px;
      width:100%;
      margin-left: 14px;
      background-color: white;
      margin-bottom: 40px;
  `;
export const TableMain = styled(Table)`
  && {
  }
`;

export const Cell = styled(TableCell)`
  && {
    color: #00000;
  }
`;

export const BoxRow = styled(Box)`
  display: flex;
  flex-direction: column;
`;
