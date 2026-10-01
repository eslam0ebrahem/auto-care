import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getVehicleById, removeVehicle, type VehicleRecord } from "../../apiService/vehicleApi";
import { removeService } from "../../apiService/serviceApi";
import AddVehicle from "../AddVehicle/AddVehicle";

interface VehicleDetailsProps {
  fetchVehicles: () => Promise<void>;
  fetchServices: () => Promise<void>;
}

export default function VehicleDetails({ fetchVehicles, fetchServices }: VehicleDetailsProps) {
  const navigate = useNavigate();
  const { id } = useParams();

  const [vehicle, setVehicle] = useState<VehicleRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const loadVehicle = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const result = await getVehicleById(id);
      if (!result) {
        setError("Vehicle not found or has been deleted.");
      } else {
        setVehicle(result);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to load vehicle details.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadVehicle();
  }, [loadVehicle]);

  async function handleDelete() {
    const confirmed = window.confirm("Are you sure you want to delete this vehicle?");
    if (!confirmed) return;

    try {
      await removeVehicle(id);
      await fetchVehicles();
      await fetchServices();
      navigate("/vehicles");
    } catch (err: any) {
      alert(err?.message || "Failed to delete vehicle.");
    }
  }

  async function handleServiceDelete(serviceId: number) {
    const confirmed = window.confirm("Are you sure you want to delete this service?");
    if (!confirmed) return;

    try {
      await removeService(serviceId);
      await fetchServices();
      await loadVehicle();
    } catch (err: any) {
      alert(err?.message || "Failed to delete service.");
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 text-neutral-400">
        <p className="animate-pulse">Loading vehicle details...</p>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="bg-neutral-800 border border-neutral-700 p-8 rounded-xl text-center max-w-md mx-auto mt-10">
        <p className="text-red-400 mb-4 font-medium">{error || "Vehicle not found."}</p>
        <button
          onClick={() => navigate("/vehicles")}
          className="bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded-lg text-white font-medium cursor-pointer transition"
        >
          Back to Vehicles
        </button>
      </div>
    );
  }

  const services = vehicle.Services ?? [];

  return (
    <div>
      <div className="flex justify-between items-start mb-8">
        <div className="flex items-center gap-3">
          <span className="p-2 py-2 rounded-lg bg-neutral-800 border border-neutral-700">
            <svg xmlns="http://www.w3.org/2000/svg" height="47px" viewBox="0 -960 960 960" width="48px" fill="#e3e3e3">
              <path d="M200-204v54q0 12.75-8.62 21.37Q182.75-120 170-120h-20q-12.75 0-21.37-8.63Q120-137.25 120-150v-324l85-256q5-14 16.5-22t26.5-8h464q15 0 26.5 8t16.5 22l85 256v324q0 12.75-8.62 21.37Q822.75-120 810-120h-21q-13 0-21-8.63-8-8.62-8-21.37v-54H200Zm3-330h554l-55-166H258l-55 166Zm-23 60v210-210Zm105.76 160q23.24 0 38.74-15.75Q340-345.5 340-368q0-23.33-15.75-39.67Q308.5-424 286-424q-23.33 0-39.67 16.26Q230-391.47 230-368.24q0 23.24 16.26 38.74 16.27 15.5 39.5 15.5ZM675-314q23.33 0 39.67-15.75Q731-345.5 731-368q0-23.33-16.26-39.67Q698.47-424 675.24-424q-23.24 0-38.74 16.26-15.5 16.27-15.5 39.5 0 23.24 15.75 38.74Q652.5-314 675-314Zm-495 50h600v-210H180v210Z" />
            </svg>
          </span>
          <div className="flex flex-col">
            <h1 className="text-3xl font-semibold">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h1>
            <p className="text-slate-400 text-sm font-mono tracking-wider mt-0.5">{vehicle.licensePlate}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(true)}
            className="bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white px-3 py-2 rounded-lg transition font-medium cursor-pointer flex items-center gap-1.5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e3e3e3">
              <path d="M216-216h51l375-375-51-51-375 375v51Zm-72 72v-153l498-498q11-11 23.84-16 12.83-5 27-5 14.16 0 27.16 5t24 16l51 51q11 11 16 24t5 26.54q0 14.45-5.02 27.54T795-642L297-144H144Zm600-549-51-51 51 51Zm-127.95 76.95L591-642l51 51-25.95-25.05Z" />
            </svg>
            Edit
          </button>
          <button
            onClick={handleDelete}
            title="Delete Vehicle"
            className="bg-red-500 hover:bg-red-600 px-3 py-2 rounded-lg transition font-semibold cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="23px" viewBox="0 -960 960 960" width="23px" fill="#e3e3e3">
              <path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z" />
            </svg>
          </button>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
              <path d="M666-163 475-354q-20 8-43.5 12.5T384-337q-99 0-169.5-70T144-576q0-37.78 9.5-71.89T182-711l144 144 70-70-144-144q29-17 62.5-26t69.5-9q100 0 170 71t70 170.19q0 22.81-4.5 42.31Q615-513 607-493l195 194q14 14.35 14 34.67Q816-244 802-230l-68 67q-14.09 14-34.04 14Q680-149 666-163Zm34-68 35-34-215-213q20-24 26-52.5t6-44.5q0-66.85-47.5-116.42Q457-741 390-744l82 81q11 11.18 11 26.09t-11.29 26.12L351.29-491.21Q340-480 325.82-480T301-491l-85-85q0 69 49.5 118T384-409q17 0 47-7t56-28l213 213ZM476-488Z" />
            </svg>
            Service History
          </h2>
          <button
            onClick={() => navigate(`/logService?vehicleId=${vehicle.id}`)}
            className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg text-sm transition cursor-pointer font-semibold text-white"
          >
            + Log Service
          </button>
        </div>

        {services.length === 0 ? (
          <div className="border border-neutral-700 rounded-xl p-8 text-slate-400 text-sm text-center">
            No services logged yet for this vehicle.
          </div>
        ) : (
          <div className="space-y-3">
            {services.map((service) => {
              const costNumber = Number(service.cost);
              const formattedCost = isNaN(costNumber) ? "0.00" : costNumber.toFixed(2);

              return (
                <div
                  key={service.id}
                  className="bg-neutral-800 border border-neutral-700/60 rounded-xl p-4 flex justify-between items-center hover:border-orange-500/80 transition"
                >
                  <div>
                    <p className="font-semibold text-white">{service.serviceType}</p>
                    <p className="text-sm text-neutral-400 mt-1">
                      {new Date(service.date).toLocaleDateString("en-GB")} • {service.mileage.toLocaleString()} mi
                    </p>
                    {service.notes && <p className="text-sm text-neutral-400 mt-1">{service.notes}</p>}
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-semibold text-lg">£{formattedCost}</p>
                    <button
                      onClick={() => navigate(`/logService?vehicleId=${vehicle.id}&edit=${service.id}`)}
                      title="Edit Service"
                      className="p-1.5 hover:bg-neutral-700 cursor-pointer rounded transition"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e3e3e3">
                        <path d="M216-216h51l375-375-51-51-375 375v51Zm-72 72v-153l498-498q11-11 23.84-16 12.83-5 27-5 14.16 0 27.16 5t24 16l51 51q11 11 16 24t5 26.54q0 14.45-5.02 27.54T795-642L297-144H144Zm600-549-51-51 51 51Zm-127.95 76.95L591-642l51 51-25.95-25.05Z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleServiceDelete(service.id)}
                      title="Delete Service"
                      className="p-1.5 cursor-pointer hover:bg-red-600 rounded transition"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e3e3e3">
                        <path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {isEditing && (
        <AddVehicle
          onClose={() => setIsEditing(false)}
          fetchVehicles={fetchVehicles}
          vehicleToEdit={vehicle}
          onVehicleUpdated={loadVehicle}
        />
      )}
    </div>
  );
}