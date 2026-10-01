import type { ServiceRecord } from "../../apiService/serviceApi";
import { getServiceDueMessage } from "../../serviceInterval.js";

interface ServiceReminderProps {
  service: ServiceRecord;
}

export default function ServiceReminder({ service }: ServiceReminderProps) {
  const message = getServiceDueMessage(service);

  if (!message) {
    return <div className="flex-1 px-4" />;
  }

  const isOverdue = message.toLowerCase().includes("overdue");

  return (
    <div
      className={`flex-1 flex items-center justify-center px-4 text-center text-sm font-semibold ${
        isOverdue ? "text-red-400" : "text-orange-400"
      }`}
    >
      {message}
    </div>
  );
}