import { useState } from "react";
import type { VehicleRecord } from "../../apiService/vehicleApi";
import VehicleCard from "../VehicleCard/VehicleCard";
import AddVehicle from "../AddVehicle/AddVehicle";

interface MyVehiclesProps {
  vehicles: VehicleRecord[];
  fetchVehicles: () => Promise<void>;
}

export default function MyVehicles({ vehicles, fetchVehicles }: MyVehiclesProps) {
  const [isSeen, setIsSeen] = useState(false);

  return (
    <div>
      <div className="flex justify-between items-start mb-8">
        <h1 className="text-3xl font-bold">My Vehicles</h1>
        <button
          onClick={() => setIsSeen(true)}
          className="bg-orange-600 hover:bg-orange-700 px-5 py-2 rounded-lg font-medium cursor-pointer"
        >
          + Add Vehicle
        </button>
      </div>
      <div className="grid grid-cols-3">
        {vehicles.length === 0 ? (
          <div className="bg-neutral-900 p-8 px-20 rounded-xl text-center w-max text-neutral-400 ml-70 border border-neutral-700">
            You don't have any vehicles yet. Add your first one!
          </div>
        ) : (
          vehicles.map((vehicle) => <VehicleCard key={vehicle.id} vehicle={vehicle} />)
        )}
      </div>
      {isSeen && <AddVehicle onClose={() => setIsSeen(false)} fetchVehicles={fetchVehicles} />}
    </div>
  );
}