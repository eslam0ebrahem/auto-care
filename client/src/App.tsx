import { useEffect, useState, useCallback } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import { getVehicles, type VehicleRecord } from "./apiService/vehicleApi";
import { getServices, type ServiceRecord } from "./apiService/serviceApi";
import { getMe, type AuthUser } from "./apiService/authApi";

import Navbar from "./components/Navbar/Navbar";
import Dashboard from "./components/Dashboard/Dashboard";
import MyVehicles from "./components/MyVehicles/MyVehicles";
import VehicleDetails from "./components/VehicleDetails/VehicleDetails";
import LogService from "./components/LogService/LogService";
import LoginModal from "./components/LoginModal/LoginModal";

function App() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(() => !!localStorage.getItem("token"));
  const [vehicles, setVehicles] = useState<VehicleRecord[]>([]);
  const [services, setServices] = useState<ServiceRecord[]>([]);

  const fetchVehicles = useCallback(async () => {
    const result = await getVehicles();
    setVehicles(result);
  }, []);

  const fetchServices = useCallback(async () => {
    const result = await getServices();
    setServices(result);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    let isMounted = true;
    getMe(token)
      .then((userData) => {
        if (isMounted) setUser(userData);
      })
      .catch(() => {
        localStorage.removeItem("token");
        if (isMounted) setUser(null);
      })
      .finally(() => {
        if (isMounted) setLoadingAuth(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!user) return;

    let isMounted = true;
    Promise.all([getVehicles(), getServices()]).then(([vehicleResult, serviceResult]) => {
      if (isMounted) {
        setVehicles(vehicleResult);
        setServices(serviceResult);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [user]);

  function handleLoginSuccess(userData: AuthUser) {
    setUser(userData);
  }

  function handleLogout() {
    localStorage.removeItem("token");
    setUser(null);
    setVehicles([]);
    setServices([]);
  }

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center">
        <p className="text-neutral-400 font-medium">Loading AutoCare...</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-neutral-900 text-white">
        {!user ? (
          <LoginModal onLoginSuccess={handleLoginSuccess} />
        ) : (
          <>
            <Navbar user={user} onLogout={handleLogout} />
            <div className="p-8 max-w-6xl mx-auto">
              <Routes>
                <Route path="/" element={<Dashboard vehicles={vehicles} services={services} />} />
                <Route
                  path="/vehicles"
                  element={<MyVehicles vehicles={vehicles} fetchVehicles={fetchVehicles} />}
                />
                <Route
                  path="/vehicles/:id"
                  element={
                    <VehicleDetails
                      fetchVehicles={fetchVehicles}
                      fetchServices={fetchServices}
                    />
                  }
                />
                <Route
                  path="/logService"
                  element={
                    <LogService
                      vehicles={vehicles}
                      services={services}
                      fetchServices={fetchServices}
                      fetchVehicles={fetchVehicles}
                    />
                  }
                />
              </Routes>
            </div>
          </>
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;