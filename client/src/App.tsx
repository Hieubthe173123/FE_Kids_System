import SakuraHome from "./page/SakuraHome";
import StudentRegistration from "./page/StudentRegistration";
import { Routes, Route } from "react-router-dom";
import DashboardLayoutBasic from "./layouts/sidebar";
import SignInSide from "./page/SignInSide";

function App() {
  return (
    <Routes>
      <Route path="/" element={<SakuraHome />} />
      <Route path="/sign-in" element={<SignInSide />} />
      <Route path="/registration" element={<StudentRegistration />} />
      <Route path="/dashboard" element={<DashboardLayoutBasic />} />
    </Routes>
  );
}

export default App;
