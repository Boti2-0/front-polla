import { Navigate } from 'react-router-dom';

const CustomRoute = ({ isLoggedIn, ...rest }) => {
  if (isLoggedIn) {
    return <Navigate to="/home" />;
  } else {
    return <Navigate to="/login" />;
  }
};

export default CustomRoute;