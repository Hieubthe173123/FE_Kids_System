// import { Routes, Route } from "react-router-dom";
// import PrivateRoute from "./routes/privateRoute";
// import { mainRoute } from "./routes/mainRoute";
// import PublicRoute from "./routes/publicRoute";
// import * as Components from "./components";


// function App() {
//   return (
//     <Routes>
//       <Route path="/" element={<Components.SakuraHome />} />
//       <Route path="/registration" element={<Components.StudentRegistration />} />
//       <Route path="/sign-in" element={<Components.SignInSide />} />
//       <Route path="/forgot-password" element={<Components.ForgotPassword />} />

//       <Route element={<PublicRoute />}>
//         <Route path="/verify-otp" element={<Components.VerifyOTP />} />
//         <Route path="/reset-password" element={<Components.ResetPassword />} />
//       </Route>

//       {/* ADMIN */}
//       <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
//         <Route element={<Components.AdminHome />}>
//           {mainRoute.admin.map((route, i) => (
//             <Route key={i} path={route.path} element={<route.component />} />
//           ))}
//         </Route>
//       </Route>

//       {/* SCHOOL PRINCIPAL */}
//       <Route element={<PrivateRoute allowedRoles={["schoolprincipal"]} />}>
//         <Route element={<Components.PrincipalHome />}>
//           {mainRoute.schoolprincipal.map((route, i) => (
//             <Route key={i} path={route.path} element={<route.component />} />
//           ))}
//         </Route>
//       </Route>

//       {/* TEACHER */}
//       <Route element={<PrivateRoute allowedRoles={["teacher"]} />}>
//         <Route element={<Components.TeacherHome />}>
//           {mainRoute.teacher.map((route, i) => (
//             <Route key={i} path={route.path} element={<route.component />} />
//           ))}
//         </Route>
//       </Route>

//       {/* PARENT */}
//       <Route element={<PrivateRoute allowedRoles={["parent"]} />}>
//         <Route element={<Components.ParentHome />}>
//           {mainRoute.parent.map((route, i) => (
//             <Route key={i} path={route.path} element={<route.component />} />
//           ))}
//         </Route>
//       </Route>
//     </Routes>
//   );
// }

// export default App;


import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './routes/privateRoute';
import PublicRoute from './routes/publicRoute';
import { mainRoute } from './routes/mainRoute';
import * as Components from './components';
import { renderRoutes } from './utils/renderRoutes';

function App() {
  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route path="/" element={<Components.SakuraHome />} />
      <Route path="/registration" element={<Components.StudentRegistration />} />
      <Route path="/sign-in" element={<Components.SignInSide />} />
      <Route path="/forgot-password" element={<Components.ForgotPassword />} />

      <Route element={<PublicRoute />}>
        <Route path="/verify-otp" element={<Components.VerifyOTP />} />
        <Route path="/reset-password" element={<Components.ResetPassword />} />
      </Route>

      {/* ADMIN */}
      <Route element={<PrivateRoute allowedRoles={['admin']} />}>
        {renderRoutes(mainRoute.admin)}
      </Route>

      {/* SCHOOL PRINCIPAL */}
      <Route element={<PrivateRoute allowedRoles={['schoolprincipal']} />}>
        {renderRoutes(mainRoute.schoolprincipal)}
      </Route>

      {/* TEACHER */}
      <Route element={<PrivateRoute allowedRoles={['teacher']} />}>
        {renderRoutes(mainRoute.teacher)}
      </Route>

      {/* PARENT */}
      <Route element={<PrivateRoute allowedRoles={['parent']} />}>
        {renderRoutes(mainRoute.parent)}
      </Route>
    </Routes>
  );
}

export default App;

