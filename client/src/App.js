import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { checkAuth } from "./store/authSlice.js";
import Layout from "./Header/Layout.jsx";
import HomePage from "./Components/questpages/HomePage.jsx";
import Dashboard from "./Components/Dashboard/Dashboard.js";
import Profile from "./Components/Dashboard/pages/Profile.js";
import Settings from "./Components/Dashboard/pages/Settings.jsx";
import Reports from "./Components/Dashboard/pages/Reports.js";
import ProtectedRoute from "./Components/Dashboard/ProtectedRoute.js";
import { onMessageListener } from "./firebase";
import { addNotification } from "./store/notificationSlice.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation(); // Mevcut rotayı almak için

  // Korumalı rotalar listesi
  const protectedRoutes = [
    "/dashboard",
    "/dashboard/profile",
    "/dashboard/settings",
    "/dashboard/reports",
  ];

  // Oturum kontrolü yalnızca korumalı rotalarda yapılsın
  useEffect(() => {
    if (protectedRoutes.includes(location.pathname)) {
      dispatch(checkAuth());
    }
  }, [dispatch, location.pathname]);

  // Gerçek zamanlı bildirim dinleyicisi
  useEffect(() => {
    if (isAuthenticated) {
      const unsubscribe = onMessageListener()
        .then((payload) => {
          console.log("Yeni Bildirim Geldi: ", payload);
          toast.info(
            `${payload.notification.title}: ${payload.notification.body}`
          );
          dispatch(addNotification(payload.notification));
        })
        .catch((err) => console.log("failed: ", err));

      return () => {
        unsubscribe
          .then((fn) => fn())
          .catch((err) => console.log("unsubscribe failed", err));
      };
    }
  }, [isAuthenticated, dispatch]);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />}>
              <Route index element={<Profile />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />
              <Route path="reports" element={<Reports />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </>
  );
}

// App bileşenini BrowserRouter ile sar
function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

export default AppWrapper;
