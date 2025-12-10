import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "./store/hooks";
import { checkAuth } from "./store/slices/authSlice";
import Login from "./pages/Login";
import { ROUTES } from "./constants/routes";

function App() {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <Routes>
      <Route
        path={ROUTES.LOGIN}
        element={
          isAuthenticated ? (
            <Navigate to={ROUTES.DASHBOARD} replace />
          ) : (
            <Login />
          )
        }
      />
      <Route
        path={ROUTES.DASHBOARD}
        element={
          isAuthenticated ? (
            <div className="p-8 text-center">Widgets app</div>
          ) : (
            <Navigate to={ROUTES.LOGIN} replace />
          )
        }
      />
      <Route
        path={ROUTES.ROOT}
        element={<Navigate to={ROUTES.DASHBOARD} replace />}
      />
    </Routes>
  );
}

export default App;
