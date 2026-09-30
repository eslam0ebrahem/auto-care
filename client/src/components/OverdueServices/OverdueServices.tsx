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
			{services.map((service) => (
				<div key={service.id} className="bg-neutral-800 border border-neutral-800 rounded-xl mb-3 flex justify-between">
					<div className="p-3">
						<div className="flex gap-1 text-neutral-400">
							<p>{service.Vehicle?.licensePlate}</p>
						</div>
						<p className="font-medium">{service.serviceType}</p>
						<p className="text-sm text-neutral-400 mb-1">
							{new Date(service.date).toLocaleDateString()} • {service.mileage.toLocaleString()} mi
						</p>
						<p className="text-sm text-neutral-400 mt-1">{service.notes}</p>
					</div>
					<ServiceReminder service={service} />
					<div className="flex items-center justify-end gap-6 p-3 content-center">
						<ExportPrintButton service={service} />
						<p className="ml-2 text-4xl font-bold whitespace-nowrap">£{service.cost.toFixed(2)}</p>
					</div>
				</div>
			))}
		</div>
	);
}
