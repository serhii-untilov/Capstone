import { Navigate, Route } from "react-router-dom";

export const PrivateRoute = ({ Component, isAuth, ...rest }) => (
    <Route
      {...rest}
      render={(props) =>
        isAuth ? (
          <Component {...props} />
        ) : (
          <Navigate to="/login" />
        )
      }
    />
  );
