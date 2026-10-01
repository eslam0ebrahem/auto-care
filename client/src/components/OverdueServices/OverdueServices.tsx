import type { ServiceRecord } from "../../apiService/serviceApi";
import ExportPrintButton from "../ExportPrintButton/ExportPrintButton";
import ServiceReminder from "../ServiceReminder/ServiceReminder";

interface OverdueServicesProps {
  services: ServiceRecord[];
}

export default function OverdueServices({ services }: OverdueServicesProps) {
  if (services.length === 0) {
    return (
      <div className="border border-neutral-700 rounded-xl p-6 text-neutral-400 text-sm text-center">
        No overdue services.
      </div>
    );
  }

  return (
    <div>
      {services.map((service) => {
        const costNumber = Number(service.cost);
        const formattedCost = isNaN(costNumber) ? "0.00" : costNumber.toFixed(2);

        return (
          <div
            key={service.id}
            className="bg-neutral-800 border border-neutral-800 rounded-xl mb-3 flex flex-col sm:flex-row justify-between gap-4 p-4"
          >
            <div className="p-1">
              <div className="flex gap-1 text-neutral-400 font-mono text-sm">
                <p>{service.Vehicle?.licensePlate || "N/A"}</p>
              </div>
              <p className="font-semibold text-lg">{service.serviceType}</p>
              <p className="text-sm text-neutral-400 mb-1">
                {new Date(service.date).toLocaleDateString()} • {service.mileage.toLocaleString()} mi
              </p>
              {service.notes && <p className="text-sm text-neutral-400 mt-1">{service.notes}</p>}
            </div>
            <ServiceReminder service={service} />
            <div className="flex items-center justify-end gap-4 p-1">
              <ExportPrintButton service={service} />
              <p className="text-2xl sm:text-3xl font-bold whitespace-nowrap">£{formattedCost}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
