import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';
import { getVehicles } from './apiService/vehicleApi.js';
import { getServices } from './apiService/serviceApi.js';
import { getMe } from './apiService/authApi.js';

import Navbar from './components/Navbar/Navbar.jsx';
import Dashboard from './components/Dashboard/Dashboard.jsx';
import MyVehicles from './components/MyVehicles/MyVehicles.jsx';
import VehicleDetails from './components/VehicleDetails/VehicleDetails.jsx';
import LogService from './components/LogService/LogService.jsx';
import LoginModal from './components/LoginModal/LoginModal.jsx';

function App() {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [vehicles, setVehicles] = useState([]);
  const [services, setServices] = useState([]);

  async function fetchVehicles() {
    const res = await getVehicles();
    setVehicles(res || []);
  }

  async function fetchServices() {
    const res = await getServices();
    setServices(res || []);
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getMe(token)
        .then((userData) => {
          setUser(userData);
        })
        .catch(() => {
          localStorage.removeItem('token');
          setUser(null);
        })
        .finally(() => setLoadingAuth(false));
    } else {
      setLoadingAuth(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchVehicles();
      fetchServices();
    } else {
      setVehicles([]);
      setServices([]);
    }
  }, [user]);

  function handleLoginSuccess(userData) {
    setUser(userData);
  }

  function handleLogout() {
    localStorage.removeItem('token');
    setUser(null);
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
                <Route
                  path="/"
                  element={<Dashboard vehicles={vehicles} services={services} />}
                />
                <Route
                  path="/vehicles"
                  element={
                    <MyVehicles
                      vehicles={vehicles}
                      fetchVehicles={fetchVehicles}
                    />
                  }
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
