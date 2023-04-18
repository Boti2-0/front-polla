import { Grid, Typography } from "@mui/material";
import Sidebar from "./../../components/sidebar";
import Header from "../../components/header";

const Home = ({ setAuth }) => {
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
      <Grid item xs={2} sx={{ marginTop: "100px" }}>
        <Sidebar />
      </Grid>
      <Grid item xs={10} sx={{ marginTop: "100px" }}>
        <Typography variant="h5" gutterBottom sx={{ marginBottom: "50px" }}>
          Dashboard
        </Typography>
      </Grid>
    </Grid>
  );
};

export default Home;
