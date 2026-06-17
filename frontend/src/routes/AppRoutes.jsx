import { Routes, Route } from "react-router-dom";

import Home from "../pages/home";
import Login from "../pages/login";
import Signup from "../pages/signup";
import Dashboard from "../pages/dashboard"

export default function AppRoutes() {
  return (
    <Routes>

      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/signup"
        element={<Signup />}
      />
       <Route
        path="/dashboard"
        element={<Dashboard />}
    />
    </Routes>
  );
}