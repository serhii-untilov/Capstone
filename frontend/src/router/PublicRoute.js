import { Navigate, Route } from "react-router-dom";

export const PublicRoute = ({ Component, isAuthenticated, restricted, ...rest }) => (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated && restricted ? (
          <Navigate to="/" />
        ) : (
          <Component {...props} />
        )
      }
    />
  )