export const serviceIntervals = {
  'Oil Change': { months: 6 },
  'Tyre Rotation': { months: 6 },
  'Inspection': { months: 12 },
  'Brakes': { months: 12 },
  'Gearbox Service': { months: 24 },
  'Timing Belt Service': { months: 60 },
};

export const DEFAULT_SERVICE_INTERVAL_MONTHS = 12;

export const serviceInterval = {
  oilChange: {
    months: 6,
  },
};

export function getServiceIntervalMonths(serviceType) {
  if (!serviceType) return DEFAULT_SERVICE_INTERVAL_MONTHS;
  const match = serviceIntervals[serviceType];
  return match ? match.months : DEFAULT_SERVICE_INTERVAL_MONTHS;
}

export function getServiceDueDate(service) {
  if (!service || !service.date) return 0;
  const lastDate = new Date(service.date);
  if (isNaN(lastDate.getTime())) return 0;

  const months = getServiceIntervalMonths(service.serviceType);
  const nextDueDate = new Date(lastDate);
  nextDueDate.setMonth(nextDueDate.getMonth() + months);
  return nextDueDate.getTime();
}

export function isServiceOverdue(service) {
  const due = getServiceDueDate(service);
  if (!due) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return due < today.getTime();
}

export function getServiceDueMessage(service) {
  const dueTimestamp = getServiceDueDate(service);
  if (!dueTimestamp) return null;

  const dueDate = new Date(dueTimestamp);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const daysUntilDue = Math.round((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (daysUntilDue < 0) {
    const overdueDays = Math.abs(daysUntilDue);
    return overdueDays === 1 ? 'Service overdue by 1 day' : `Service overdue by ${overdueDays} days`;
  }
  if (daysUntilDue === 0) return 'Service due today';
  if (daysUntilDue === 1) return 'Service due tomorrow';
  if (daysUntilDue <= 30) return `Service due in ${daysUntilDue} days`;
  return null;
}
