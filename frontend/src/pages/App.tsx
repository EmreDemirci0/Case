import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginForm from "../features/auth/pages/LoginForm";
import RegisterForm from "../features/auth/pages/RegisterForm";

import RequireAuth from "../components/auth/RequireAuth";
import RedirectIfAuth from "../components/auth/RedirectIfAuth";
import RootRedirect from "../components/auth/RootRedirect";
import { ROUTES } from "../config/routes";
import Game from "../features/Game/pages/Game";
import { NotificationProvider } from "../components/common/NotificationContext";



function App() {
  
  return (
    <div className="App">
      <NotificationProvider>
        <BrowserRouter>
          <Routes>
            <Route path={ROUTES.HOME} element={<RootRedirect />} />
            <Route
              path={ROUTES.LOGIN}
              element={
                <RedirectIfAuth>
                  <LoginForm />
                </RedirectIfAuth>
              }
            />
            <Route
              path={ROUTES.REGISTER}
              element={
                <RedirectIfAuth>
                  <RegisterForm />
                </RedirectIfAuth>
              }
            />

            <Route
              path={ROUTES.GAME}
              element={
                 <RequireAuth>
                    <Game />
                 </RequireAuth>
              }
            />
          </Routes>

        </BrowserRouter>
        </NotificationProvider>
    </div>
  );
}
export default App;
