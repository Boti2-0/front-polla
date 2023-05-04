import React from "react";
import { Route, Routes } from "react-router-dom";
import { ProtectedRouteProps } from "./routes/PrivateRoute";
import ProtectedRoute from "./routes/PrivateRoute";
import LoginPage from "./pages/login";
import Register from "./pages/register";
import Home from "./pages/home";
import { useUserStore } from "./stores/users";
import CustomRoute from "./routes/CustomRoute";
import Empresas from "./pages/empresas";
import NewEmpresa from "./pages/newEmpresa";
import GlobalStyle from "./assets/styles/global";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";


const App: React.FC = () => {
  const isLogged = useUserStore((state) => state.isLogged);
  const defaultProtectedRouteProps: Omit<ProtectedRouteProps, "outlet"> = {
    isAuthenticated: isLogged,
    authenticationPath: "/login",
  };
  return (
    <>
      <GlobalStyle />
      <Routes>
        <Route path="/" element={<CustomRoute isLoggedIn={isLogged} />} />
        <Route
          path="home"
          element={
            <ProtectedRoute
              authenticationPath={""}
              {...defaultProtectedRouteProps}
              outlet={<Home setAuth={isLogged} />}
            />
          }
        />
        <Route
          path="empresas"
          element={
            <ProtectedRoute
              authenticationPath={""}
              {...defaultProtectedRouteProps}
              outlet={<Empresas setAuth={isLogged} />}
            />
          }
        />
        <Route
          path="new-empresa"
          element={
            <ProtectedRoute
              authenticationPath={""}
              {...defaultProtectedRouteProps}
              outlet={<NewEmpresa setAuth={isLogged} />}
            />
          }
        />
        <Route path="login" element={<LoginPage setAuth={isLogged} />} />
        <Route path="register" element={<Register setAuth={isLogged} />} />
      </Routes>
    </>
  );
};

export default App;
