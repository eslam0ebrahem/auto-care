export function getServiceDueDate(service) {
  const [year, month, day] = service.date.split('T')[0].split('-').map(Number);
  return new Date(year, month - 1, day).getTime();
}

function getServiceDueMessage(service) {
  const dueDate = new Date(getServiceDueDate(service));
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const daysUntilDue = Math.round((dueDate - today) / (1000 * 60 * 60 * 24));

  if (daysUntilDue < 0) return 'Service overdue';
  if (daysUntilDue > 3) return null;
  if (daysUntilDue === 0) return 'Service due today';
  if (daysUntilDue === 1) return 'Service due tomorrow';
  return `Service due in ${daysUntilDue} days`;
}

export default function ServiceReminder ({service}) {
  return (
    <div className="flex-1 flex items-center justify-center px-4 text-center text-orange-400 text-sm font-semibold">
      {getServiceDueMessage(service)}
    </div>
  );
}
