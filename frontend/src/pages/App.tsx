import { useState } from "react";
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
      {/* <UserProvider> */}
      <NotificationProvider>
        <BrowserRouter>
          {/* 🔔 Eğer mesaj varsa Notification bileşeni göster */}
          

          <Routes>
            {/* Ana dizin yönlendirmesi */}
            <Route path={ROUTES.HOME} element={<RootRedirect />} />

            {/* Giriş ve kayıt (eğer giriş yaptıysa yönlendir) */}
            
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

            {/* Sadece giriş yaptıysa açılabilecek route - Layout ile sarmalanmış */}
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
      {/* </UserProvider> */}
    </div>
  );
}

export default App;
