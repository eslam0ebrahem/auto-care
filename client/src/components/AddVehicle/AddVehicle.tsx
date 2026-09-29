import { useState, type FormEvent } from "react";
import { addVehicle, editVehicle } from "../../apiService/vehicleApi";
import type { VehicleInput, VehicleRecord } from "../../apiService/vehicleApi";

interface AddVehicleProps {
  onClose: () => void;
  fetchVehicles: () => Promise<void>;
  vehicleToEdit?: VehicleRecord | null;
  onVehicleUpdated?: () => Promise<void> | void;
}

interface VehicleForm {
  make: string;
  model: string;
  year: string | number;
  licensePlate: string;
}

export default function AddVehicle({
  onClose,
  fetchVehicles,
  vehicleToEdit,
  onVehicleUpdated,
}: AddVehicleProps) {
  const currentYear = new Date().getFullYear();
  const [form, setForm] = useState<VehicleForm>(() => {
    if (vehicleToEdit) {
      return {
        make: vehicleToEdit.make || "",
        model: vehicleToEdit.model || "",
        year: vehicleToEdit.year || "",
        licensePlate: vehicleToEdit.licensePlate || "",
      };
    }
    return {
      make: "",
      model: "",
      year: "",
      licensePlate: "",
    };
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload: VehicleInput = {
      ...form,
      year: Number(form.year),
    };

    if (vehicleToEdit) {
      await editVehicle(vehicleToEdit.id, payload);
      if (onVehicleUpdated) {
        await onVehicleUpdated();
      }
    } else {
      await addVehicle(payload);
    }

    await fetchVehicles();
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-neutral-800 border border-neutral-700 p-6 rounded-xl w-96 shadow-2xl">
        <div className="flex justify-between items-start">
          <h2 className="text-xl mb-4 text-white font-semibold">
            {vehicleToEdit ? "Edit Vehicle" : "Add Vehicle"}
          </h2>
          <button className="hover:bg-red-500 rounded cursor-pointer p-1 transition" onClick={onClose}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="25px"
              viewBox="0 -960 960 960"
              width="25px"
              fill="#e3e3e3"><path d="m291-240-51-51 189-189-189-189 51-51 189 189 189-189 51 51-189 189 189 189-51 51-189-189-189 189Z" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="ml-1 text-sm text-neutral-300">
              Make
            </label>
            <input
              required
              type="text"
              placeholder="e.g. Toyota, BMW"
              value={form.make}
              onChange={(event) => setForm({ ...form, make: event.target.value })}
              className="bg-neutral-800 border border-neutral-700 p-2 rounded-xl w-full mt-1 text-white hover:border-orange-500 focus:border-orange-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="ml-1 text-sm text-neutral-300">
              Model
            </label>
            <input
              required
              type="text"
              placeholder="e.g. Camry, M3"
              value={form.model}
              onChange={(event) => setForm({ ...form, model: event.target.value })}
              className="bg-neutral-800 border border-neutral-700 p-2 rounded-xl w-full mt-1 text-white hover:border-orange-500 focus:border-orange-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="ml-1 text-sm text-neutral-300">
              Year
            </label>
            <input
              required
              type="number"
              min="1900"
              max={currentYear + 1}
              step="1"
              placeholder={`e.g. ${currentYear}`}
              value={form.year}
              onChange={(event) => setForm({ ...form, year: event.target.value })}
              className="bg-neutral-800 border border-neutral-700 p-2 rounded-xl w-full mt-1 text-white hover:border-orange-500 focus:border-orange-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="ml-1 text-sm text-neutral-300">
              License Plate
            </label>
            <input
              required
              type="text"
              placeholder="e.g. ABC-1234"
              value={form.licensePlate}
              onChange={(event) => setForm({ ...form, licensePlate: event.target.value.toUpperCase() })}
              className="bg-neutral-800 border border-neutral-700 p-2 rounded-xl w-full mt-1 text-white uppercase hover:border-orange-500 focus:border-orange-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-center mt-5">
            <button type="submit" className="bg-orange-600 px-3 py-2 rounded-xl w-full cursor-pointer hover:bg-orange-700 text-white font-medium transition">
              {vehicleToEdit ? "Save Changes" : "Add Vehicle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}