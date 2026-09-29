import { useState, type FormEvent } from "react";
import { useNavigate, useSearchParams, Link } from "react-router";
import { addService, editService, type ServiceInput, type ServiceRecord } from "../../apiService/serviceApi";
import type { VehicleRecord } from "../../apiService/vehicleApi";
import { format, parseISO } from "date-fns";

interface LogServiceProps {
  vehicles: VehicleRecord[];
  services: ServiceRecord[];
  fetchServices: () => Promise<void>;
  fetchVehicles: () => Promise<void>;
}

interface ServiceForm {
  vehicleId: number | string;
  serviceType: string;
  date: string;
  mileage: number | string;
  cost: number | string;
  notes: string;
}

export default function LogService({
  vehicles,
  services,
  fetchServices,
  fetchVehicles,
}: LogServiceProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const selectedVehicle = searchParams.get("vehicleId");
  const serviceEdit = searchParams.get("edit");

  const [form, setForm] = useState<ServiceForm>(() => {
    if (serviceEdit) {
      const service = services.find((record) => record.id === Number(serviceEdit));
      if (service) {
        return {
          vehicleId: service.vehicleId,
          serviceType: service.serviceType,
          date: format(parseISO(service.date), "yyyy-MM-dd"),
          mileage: service.mileage,
          cost: service.cost,
          notes: service.notes || "",
        };
      }
    }
    return {
      vehicleId: selectedVehicle || "",
      serviceType: "",
      date: "",
      mileage: "",
      cost: "",
      notes: "",
    };
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload: ServiceInput = form;

    if (serviceEdit) {
      await editService(serviceEdit, payload);
    } else {
      await addService(payload);
    }

    await fetchServices();
    await fetchVehicles();

    if (selectedVehicle) {
      navigate(`/vehicles/${selectedVehicle}`);
    } else {
      navigate("/");
    }
  }

  if (vehicles.length === 0) {
    return (
      <div className="text-neutral-400 bg-neutral-900 p-10 border border-neutral-700 rounded-xl text-center max-w-md mx-auto">
        You need to <Link to="/vehicles" className="text-orange-600">add a vehicle</Link> first!
      </div>
    );
  }

  return (
    <div className="flex justify-center mt-1">
      <div className="bg-neutral-800 border border-neutral-800 rounded-xl p-8 w-[550px] shadow-xl">
        <h2 className="text-2xl font-semibold mb-6 text-white">Log Service</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1 text-slate-400">Vehicle</label>
            <select
              required
              value={form.vehicleId}
              onChange={(event) => setForm({ ...form, vehicleId: Number(event.target.value) })}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-xl p-2 cursor-pointer hover:border-orange-500 active:outline-orange-500 focus:outline-none"
            >
              <option value="">Select Vehicle</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1 text-slate-400">Service Type</label>
            <select
              required
              value={form.serviceType}
              onChange={(event) => setForm({ ...form, serviceType: event.target.value })}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-xl p-2 cursor-pointer hover:border-orange-500 active:outline-orange-500 focus:outline-none"
            >
              <option value="">Select Service Type</option>
              <option>Oil Change</option>
              <option>Inspection</option>
              <option>Tyre Rotation</option>
              <option>Brakes</option>
              <option>Gearbox Service</option>
              <option>Timing Belt Service</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1 text-slate-400">Date</label>
              <input
                required
                type="date"
                value={form.date}
                onClick={(event) => event.currentTarget.showPicker?.()}
                onChange={(event) => setForm({ ...form, date: event.target.value })}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl p-2 cursor-pointer hover:border-orange-500 active:outline-orange-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm mb-1 text-slate-400">Mileage</label>
              <input
                required
                placeholder="Enter mileage..."
                type="number"
                value={form.mileage}
                onChange={(event) => setForm({ ...form, mileage: event.target.value })}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl p-2 hover:border-orange-500 active:outline-orange-500 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1 text-slate-400">Cost (£)</label>
            <input
              required
              placeholder="Enter cost..."
              type="number"
              value={form.cost}
              onChange={(event) => setForm({ ...form, cost: event.target.value })}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-xl p-2 hover:border-orange-500 active:outline-orange-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-slate-400">Notes (optional)</label>
            <textarea
              rows={4}
              placeholder="Additional details..."
              value={form.notes}
              onChange={(event) => setForm({ ...form, notes: event.target.value })}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-xl p-2 hover:border-orange-500 active:outline-orange-500 focus:outline-none"
            />
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              className="w-60 bg-orange-600 rounded-lg py-2 font-medium mt-2 cursor-pointer hover:bg-orange-700"
            >
              {serviceEdit ? "Update Service" : "Log Service"}
            </button>
            <button
              className="w-60 bg-red-600 py-2 mt-2 rounded-lg font-medium cursor-pointer hover:bg-red-800"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}