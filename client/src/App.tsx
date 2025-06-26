import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./routes/privateRoute";
import PublicRoute from "./routes/publicRoute";
import { mainRoute } from "./routes/mainRoute";
import * as Components from "./components";
import { renderRoutes } from "./utils/renderRoutes";
import { useAppDispatch } from "./hooks/useAppDispatch";
import { useEffect } from "react";
import { restoreSession } from "./redux/auth/authAPI";

function App() {
  // const dispatch = useAppDispatch();

  // useEffect(() => {
  //   dispatch(restoreSession()); // tự động khôi phục phiên nếu F5 hoặc reload
  // }, [dispatch]);

  return (
    <Routes>
      <Route path="/" element={<Components.SakuraHome />} />
      <Route
        path="/registration"
        element={<Components.StudentRegistration />}
      />
      <Route path="/sign-in" element={<Components.SignInSide />} />
      <Route path="/forgot-password" element={<Components.ForgotPassword />} />

      <Route element={<PublicRoute />}>
        <Route path="/verify-otp" element={<Components.VerifyOTP />} />
        <Route path="/reset-password" element={<Components.ResetPassword />} />
      </Route>

      {/* ADMIN */}
      <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
        {renderRoutes(mainRoute.admin)}
      </Route>

      {/* SCHOOL PRINCIPAL */}
      <Route element={<PrivateRoute allowedRoles={["schoolprincipal"]} />}>
        {renderRoutes(mainRoute.schoolprincipal)}
      </Route>

      {/* TEACHER */}
      <Route element={<PrivateRoute allowedRoles={["teacher"]} />}>
        {renderRoutes(mainRoute.teacher)}
      </Route>

      {/* PARENT */}
      <Route element={<PrivateRoute allowedRoles={["parent"]} />}>
        {renderRoutes(mainRoute.parent)}
      </Route>
    </Routes>
  );
}

export default App;
