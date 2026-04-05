import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Admin from "./pages/Admin";
import ProtectedRoute from "./components/ProtectedRoute";
import Auth from "./pages/Auth";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Auth */}
        <Route path="/" element={<Auth />} />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Transactions */}
        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <Transactions />
            </ProtectedRoute>
          }
        />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}