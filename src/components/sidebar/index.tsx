import { BoxRow, CustomCard, OutsideBox, Title } from "./styled";

import dash from "./../../assets/images/dashboard.png";
import empresas from "./../../assets/images/companhia.png";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  return (
    <CustomCard>
      <OutsideBox>
        <BoxRow>
          <img src={dash} width={24} height={24} alt="Dashboard"/>
          <Title onClick={() => navigate("/home")}>
            Dashboard
          </Title>
        </BoxRow>
        <BoxRow>
          <img src={empresas} width={24} height={24} alt="empresas" />
          <Title onClick={() => navigate("/empresas")}>Empresas</Title>
        </BoxRow>
      </OutsideBox>
    </CustomCard>
  );
}
