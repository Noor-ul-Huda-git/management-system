import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import { useUser } from "@clerk/clerk-react"; // ✅ correct

// Pages
import Hero from "./pages/Hero";
import Home from "./pages/Home";
import Add from "./pages/Add";
import List from "./pages/List";
import Appointments from "./pages/Appointments";
import SerDashboard from "./pages/SerDashboard";
import ListService from "./pages/ListService";
import ServiceAppointments from "./pages/ServiceAppointments";
import AddService from "./pages/AddService";

// 🔐 Auth Wrapper
function RequireAuth({ children }) {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) return <div>Loading...</div>;

  if (!isSignedIn) {
    return (
      <div className="min-h-screen font-mono flex items-center justify-center bg-linear-to-b from emerald-50 via-green-50 to emerald-100 px-4">
        <div className="text-center">
          <p className="text-emerald-800 font-semibold text-lg sm:text-2xl mb-4 animated fadeIn">
            Please sign in to view this page.
          </p>

          <div className="flex justify-center">
            <Link
              to="/"
              className="px-4 py-2 text-sm rounded-full bg-emerald-600 text-white
               shadow-sm hover:bg-emerald-700 transition-all duration-300
               ease-in-out animate-bounce-subtle"
            >
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return children; // ✅ correct place
}

// 🚀 App
const App = () => {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Hero />} />

      {/* Protected */}
      <Route
        path="/home"
        element={
          <RequireAuth>
            <Home />
          </RequireAuth>
        }
      />

      <Route
        path="/add"
        element={
          <RequireAuth>
            <Add />
          </RequireAuth>
        }
      />

      <Route
        path="/list"
        element={
          <RequireAuth>
            <List />
          </RequireAuth>
        }
      />

      <Route
        path="/appointments"
        element={
          <RequireAuth>
            <Appointments />
          </RequireAuth>
        }
      />

      <Route
        path="/service-dashboard"
        element={
          <RequireAuth>
            <SerDashboard />
          </RequireAuth>
        }
      />

      <Route
        path="/AddService"
        element={
          <RequireAuth>
            <AddService />
          </RequireAuth>
        }
      />

      <Route
        path="/list-service"
        element={
          <RequireAuth>
            <ListService />
          </RequireAuth>
        }
      />

      <Route
        path="/service-appointments"
        element={
          <RequireAuth>
            <ServiceAppointments />
          </RequireAuth>
        }
      />
    </Routes>
  );
};

export default App;