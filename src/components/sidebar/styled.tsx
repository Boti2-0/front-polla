import { Card } from '@material-ui/core'
import { Box, Typography } from '@mui/material'
import styled from 'styled-components'

export const CustomCard = styled(Card)`
  && {
    display: flex;
    border-radius: 15px;
    width: 220px;
    height: 150px;
    background-color: #ffffff;
    box-shadow: 0px 34px 34px rgba(13, 46, 97, 0.05);
  }
`
export const BoxRow = styled(Box)`
  display: flex;
  flex-direction: row;
  margin: 16px 24px 16px 24px;
`

export const OutsideBox = styled(Box)`
  display: flex;
  flex-direction: column;
  text-align: left;
  margin-top: 10px;
`
export const Title = styled(Typography)`
  && {
    margin-left: 26px;
    font-size: 14px;
    font-weight: 200;
    color: #000000;
    cursor: pointer;
  }

  &&:hover {
    color: #009FE3;
    font-weight: 500;
  }
`
