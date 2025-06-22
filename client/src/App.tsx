import SakuraHome from "./page/SakuraHome";
import StudentRegistration from "./page/StudentRegistration";
import { Routes, Route } from "react-router-dom";
import DashboardLayoutBasic from "./layouts/sidebar";
import SignInSide from "./page/SignInSide";
import ForgotPassword from "./page/ForgotPassword";
import VerifyOTP from "./page/VerifyOTP";
import ResetPassword from "./page/ResetPassword";
import ParentHome from "./page/ParentHome";
import TimeTable from "./components/Parent/TimeTable";

function App() {
  return (
    <Routes>
      <Route path="/" element={<SakuraHome />} />
      <Route path="/parent-home" element={<ParentHome />} />
      <Route path="/time-table" element={<TimeTable />} />
      <Route path="/sign-in" element={<SignInSide />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/registration" element={<StudentRegistration />} />
      <Route path="/dashboard" element={<DashboardLayoutBasic />} />
    </Routes>
  );
}

export default App;
