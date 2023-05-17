import {
  Box,
  Chip,
  Table,
  TableCell,
  TableContainer,
  Typography,
} from "@mui/material";
import styled from "styled-components";

export const CustomTable = styled(TableContainer)`
  && {
    box-shadow: 0px 34px 34px rgba(13, 46, 97, 0.05);
    border-radius: 8px;
    width: 100%;
`;
export const TableMain = styled(Table)`
  && {
    min-width: 650px;
  }
`;

export const Cell = styled(TableCell)`
  && {
    color: #9fa2b4;
  }
`;

export const BoxRow = styled(Box)`
  display: flex;
  flex-direction: column;
`;

export const Date = styled(Typography)`
  && {
    font-size: 12px;
    font-weight: 700;
    color: #252733;
  }
`;

export const DateHour = styled(Typography)`
  && {
    font-size: 12px;
    font-weight: 400;
    color: #252733;
  }
`;

export const Title = styled(Typography)`
  && {
    font-size: 19px;
    font-weight: 500;
    color: #252733;
    margin-left: 16px;
    margin-bottom: 20px;
  }
`;

export const ChipAlert = styled(Chip)`
  && {
    background-color: #009fe3;
    color: white;
  }
`;
export const ChipSucess = styled(Chip)`
  && {
    background-color: #e96338;
    color: white;
  }
`;
