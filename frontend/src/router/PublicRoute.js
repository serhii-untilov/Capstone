import { Navigate, Route } from "react-router-dom";

export const PublicRoute = ({ Component, isAuth, restricted, ...rest }) => (
    <Route
      {...rest}
      render={(props) =>
        isAuth && restricted ? (
          <Navigate to="/" />
        ) : (
          <Component {...props} />
        )
      }
    />
  )