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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Vehicles</h1>
        <button
          onClick={() => setIsSeen(true)}
          className="bg-orange-600 hover:bg-orange-700 px-5 py-2.5 rounded-xl font-medium cursor-pointer transition shadow-lg text-white"
        >
          + Add Vehicle
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.length === 0 ? (
          <div className="col-span-full bg-neutral-800/60 border border-neutral-700/80 p-12 rounded-2xl text-center text-neutral-400">
            <p className="text-lg font-medium mb-1 text-white">No vehicles found</p>
            <p className="text-sm">You haven't added any vehicles yet. Add your first one to start tracking maintenance!</p>
          </div>
        ) : (
          vehicles.map((vehicle) => <VehicleCard key={vehicle.id} vehicle={vehicle} />)
        )}
      </div>
      {isSeen && <AddVehicle onClose={() => setIsSeen(false)} fetchVehicles={fetchVehicles} />}
    </div>
  );
}