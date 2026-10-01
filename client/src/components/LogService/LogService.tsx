import { useState, useEffect, type FormEvent } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<ServiceForm>(() => {
    if (serviceEdit && services && services.length > 0) {
      const service = services.find((record) => record.id === Number(serviceEdit));
      if (service) {
        let formattedDate = "";
        try {
          formattedDate = format(parseISO(service.date), "yyyy-MM-dd");
        } catch {
          formattedDate = service.date ? String(service.date).split("T")[0] : "";
        }
        return {
          vehicleId: service.vehicleId,
          serviceType: service.serviceType,
          date: formattedDate,
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

  useEffect(() => {
    if (serviceEdit && services && services.length > 0) {
      const service = services.find((record) => record.id === Number(serviceEdit));
      if (service) {
        let formattedDate = "";
        try {
          formattedDate = format(parseISO(service.date), "yyyy-MM-dd");
        } catch {
          formattedDate = service.date ? String(service.date).split("T")[0] : "";
        }
        setForm({
          vehicleId: service.vehicleId,
          serviceType: service.serviceType,
          date: formattedDate,
          mileage: service.mileage,
          cost: service.cost,
          notes: service.notes || "",
        });
      }
    }
  }, [serviceEdit, services]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload: ServiceInput = {
        ...form,
        vehicleId: Number(form.vehicleId),
        mileage: Number(form.mileage),
        cost: Number(form.cost),
      };

      if (serviceEdit) {
        await editService(serviceEdit, payload);
      } else {
        await addService(payload);
      }

      await fetchServices();
      await fetchVehicles();

      const targetVehicleId = form.vehicleId || selectedVehicle;
      if (targetVehicleId) {
        navigate(`/vehicles/${targetVehicleId}`);
      } else {
        navigate("/");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to save service record. Please check your inputs.");
    } finally {
      setLoading(false);
    }
  }

  if (vehicles.length === 0) {
    return (
      <div className="text-neutral-400 bg-neutral-900 p-10 border border-neutral-700 rounded-xl text-center max-w-md mx-auto">
        You need to{" "}
        <Link to="/vehicles" className="text-orange-600 font-semibold hover:underline">
          add a vehicle
        </Link>{" "}
        first!
      </div>
    );
  }

  return (
    <div className="flex justify-center mt-1">
      <div className="bg-neutral-800 border border-neutral-800 rounded-xl p-8 w-full max-w-xl shadow-xl">
        <h2 className="text-2xl font-semibold mb-6 text-white">
          {serviceEdit ? "Edit Service Record" : "Log Service"}
        </h2>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1 text-slate-400">Vehicle</label>
            <select
              required
              value={form.vehicleId}
              onChange={(event) => setForm({ ...form, vehicleId: Number(event.target.value) })}
              className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 cursor-pointer hover:border-orange-500 focus:border-orange-500 focus:outline-none text-white"
            >
              <option value="">Select Vehicle</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.year} {vehicle.make} {vehicle.model} ({vehicle.licensePlate})
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
              className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 cursor-pointer hover:border-orange-500 focus:border-orange-500 focus:outline-none text-white"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1 text-slate-400">Date</label>
              <input
                required
                type="date"
                value={form.date}
                onClick={(event) => event.currentTarget.showPicker?.()}
                onChange={(event) => setForm({ ...form, date: event.target.value })}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 cursor-pointer hover:border-orange-500 focus:border-orange-500 focus:outline-none text-white"
              />
            </div>
            <div>
              <label className="block text-sm mb-1 text-slate-400">Mileage</label>
              <input
                required
                placeholder="e.g. 45000"
                type="number"
                min="0"
                value={form.mileage}
                onChange={(event) => setForm({ ...form, mileage: event.target.value })}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 hover:border-orange-500 focus:border-orange-500 focus:outline-none text-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1 text-slate-400">Cost (£)</label>
            <input
              required
              placeholder="e.g. 75.00"
              type="number"
              step="0.01"
              min="0"
              value={form.cost}
              onChange={(event) => setForm({ ...form, cost: event.target.value })}
              className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 hover:border-orange-500 focus:border-orange-500 focus:outline-none text-white"
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-slate-400">Notes (optional)</label>
            <textarea
              rows={4}
              placeholder="Additional details..."
              value={form.notes}
              onChange={(event) => setForm({ ...form, notes: event.target.value })}
              className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 hover:border-orange-500 focus:border-orange-500 focus:outline-none text-white"
            />
          </div>
          <div className="flex gap-4 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-orange-600 rounded-xl py-3 font-medium cursor-pointer hover:bg-orange-700 transition disabled:opacity-50 text-white"
            >
              {loading ? "Saving..." : serviceEdit ? "Update Service" : "Log Service"}
            </button>
            <button
              type="button"
              className="flex-1 bg-neutral-700 py-3 rounded-xl font-medium cursor-pointer hover:bg-neutral-600 transition text-white"
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