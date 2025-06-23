import { Routes, Route } from "react-router-dom";
import { mainRoute } from "./routes/mainRoute";
import RoleLayout from "./layouts/RoleLayout";
import SignInSide from "./components/Auth/SignInSide";
import ForgotPassword from "./components/Auth/ForgotPassword";
import PublicRoute from "./routes/publicRoute";
import VerifyOTP from "./components/Auth/VerifyOTP";
import ResetPassword from "./components/Auth/ResetPassword";
import PrivateRoute from "./routes/privateRoute";
import SakuraHome from "./components/SakuraHome";

function App() {
  return (
    <Routes>
      {/* Public pages */}
      <Route path="/" element={<SakuraHome />} />
      <Route path="/sign-in" element={<SignInSide />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route element={<PublicRoute />}>
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      {/* RBAC */}
      {Object.entries(mainRoute).map(([role, routes]) => (
        <Route key={role} element={<PrivateRoute allowedRoles={[role]} />}>
          <Route element={<RoleLayout />}>
            {routes.map(({ path, component: Component }) => (
              <Route key={path} path={path} element={<Component />} />
            ))}
          </Route>
        </Route>
      ))}
    </Routes>
  );
}

export default App;

