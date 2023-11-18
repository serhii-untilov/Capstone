import { Navigate, Route } from "react-router-dom";

export const PrivateRoute = ({ Component, isAuthenticated, ...rest }) => (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Navigate to="/login" />
        )
      }
    />
  );
