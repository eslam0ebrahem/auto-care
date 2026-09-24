import { useMemo } from "react";
import { serviceInterval } from "../../serviceInterval.js";

function downloadServiceCsv(service) {
  const escapeCsvValue = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;
  const cost = Number(service.cost);
  const headers = ['Registration', 'Service Type', 'Date', 'Mileage (mi)', 'Cost (GBP)', 'Notes'];
  const values = [
    service.Vehicle?.licensePlate,
    service.serviceType,
    new Date(service.date).toLocaleDateString('en-GB'),
    service.mileage,
    Number.isFinite(cost) ? cost.toFixed(2) : '',
    service.notes,
  ];
  const csv = [headers, values]
    .map((row) => row.map(escapeCsvValue).join(','))
    .join('\r\n');
  const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const registration = service.Vehicle?.licensePlate?.replace(/[^a-z0-9]/gi, '-') || 'service';

  link.href = url;
  link.download = `${registration}-service.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

function getServiceDueMessage(service) {
  const [year, month, day] = service.date.split('T')[0].split('-').map(Number);
  const dueDate = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const daysUntilDue = Math.round((dueDate - today) / (1000 * 60 * 60 * 24));

  if (daysUntilDue < 0) return 'Service overdue';
  if (daysUntilDue > 3) return null;
  if (daysUntilDue === 0) return 'Service due today';
  if (daysUntilDue === 1) return 'Service due tomorrow';
  return `Service due in ${daysUntilDue} days`;
}

function getServiceDueDate(service) {
  const [year, month, day] = service.date.split('T')[0].split('-').map(Number);
  return new Date(year, month - 1, day).getTime();
}

export default function Dashboard ({vehicles, services}) {
  const recentActivity = useMemo(() => {
    return [...services]
      .sort((firstService, secondService) => getServiceDueDate(firstService) - getServiceDueDate(secondService))
      .slice(0, 5);
  }, [services]);
  
  const overdueServices = useMemo(() => {
    return vehicles.filter((v) => {
      const oilChange = v.Services?.filter((s) => s.serviceType === 'Oil Change');
      
      if (!oilChange || oilChange.length === 0) return false;
    
      const lastOilChange = oilChange.reduce((latest, current) =>
        new Date(current.date) > new Date(latest.date) ? current : latest 
      );

      const {months} = serviceInterval.oilChange;
      const lastChanged = new Date(lastOilChange.date);
      const nextDue = new Date(lastChanged);
      nextDue.setMonth(nextDue.getMonth() + months);
      
      return new Date() >= nextDue;
    }).length;
  }, [vehicles]); 

  return (
  <div>
    <div>
      <h1 className="text-3xl mb-6 font-bold">Dashboard</h1>
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-neutral-800 border border-neutral-800 flex items-center p-5 rounded-xl">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            height="50px" 
            viewBox="0 -960 960 960" 
            width="50px" 
            fill="#e3e3e3"><path d="M200-204v54q0 12.75-8.62 21.37Q182.75-120 170-120h-20q-12.75 0-21.37-8.63Q120-137.25 120-150v-324l85-256q5-14 16.5-22t26.5-8h464q15 0 26.5 8t16.5 22l85 256v324q0 12.75-8.62 21.37Q822.75-120 810-120h-21q-13 0-21-8.63-8-8.62-8-21.37v-54H200Zm3-330h554l-55-166H258l-55 166Zm-23 60v210-210Zm105.76 160q23.24 0 38.74-15.75Q340-345.5 340-368q0-23.33-15.75-39.67Q308.5-424 286-424q-23.33 0-39.67 16.26Q230-391.47 230-368.24q0 23.24 16.26 38.74 16.27 15.5 39.5 15.5ZM675-314q23.33 0 39.67-15.75Q731-345.5 731-368q0-23.33-16.26-39.67Q698.47-424 675.24-424q-23.24 0-38.74 16.26-15.5 16.27-15.5 39.5 0 23.24 15.75 38.74Q652.5-314 675-314Zm-495 50h600v-210H180v210Z"/>
        </svg>
          <div className="ml-3">
            <p className="text-2xl font-bold">{vehicles.length}</p>
            <p className="text-neutral-400">Vehicles</p>
          </div>
        </div>
        <div className="bg-neutral-800 border border-neutral-800 flex items-center p-5 rounded-xl">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            height="50px" 
            viewBox="0 -960 960 960" 
            width="50px" 
            fill="#e3e3e3"><path d="M764-120 523.67-360.33l66-66L830-186l-66 66Zm-571.33 0-66-66L412-471.33l-94-94-24.67 24.66L247-587v84l-25.33 25.33L100-599.33l25.33-25.34H210l-48.67-48.66L296-808q18-18 39-25t45-7q24 0 45 8.67 21 8.66 39 26.66l-102 102L410.67-654l-25.34 25.33 92 92L588.67-648q-6.67-12.33-10.5-27.67-3.84-15.33-3.84-32 0-55 39.17-94.16Q652.67-841 707.67-841q15 0 26.5 3t20.83 8.33L665.33-740l74 74L829-755.67q5.67 10 8.83 22.17 3.17 12.17 3.17 27.17 0 55-39.17 94.16Q762.67-573 707.67-573q-16 0-28.67-2.33-12.67-2.34-23.67-7.34L192.67-120Z"/>
          </svg>
          <div className="ml-3">
            <p className="text-2xl font-bold mt-1">{services.length}</p>
            <p className="text-neutral-400">Service Records</p>
          </div>
        </div>
        <div className="bg-neutral-800 border border-neutral-800 flex items-center p-5 rounded-xl">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            height="48px" 
            viewBox="0 -960 960 960" 
            width="48px" 
            fill="#e82c0fff"><path d="m40-120 440-760 440 760H40Zm104-60h672L480-760 144-180Zm361.5-65.68q8.5-8.67 8.5-21.5 0-12.82-8.68-21.32-8.67-8.5-21.5-8.5-12.82 0-21.32 8.68-8.5 8.67-8.5 21.5 0 12.82 8.68 21.32 8.67 8.5 21.5 8.5 12.82 0 21.32-8.68ZM454-348h60v-224h-60v224Zm26-122Z"/>
          </svg>
          <div className="ml-3">
            <p className="text-2xl font-bold mt-1">{overdueServices}</p>
            <p className="text-neutral-400">Overdue Services</p>
          </div>
        </div>
      </div>
    </div>
    <h2 className="text-3xl mb-5 font-bold">Recent Activity</h2>
    {recentActivity.length === 0 ? (
      <div className="border border-neutral-700 rounded-xl p-6 text-neutral-400 text-sm text-center">
        No services logged yet.
      </div>
    ) : (
      recentActivity.map((s) => (
        <div key={s.id} className="bg-neutral-800 border border-neutral-800 rounded-xl mb-3 flex justify-between">
          <div className="p-3">
            <div className="flex gap-1 text-neutral-400">
              <p>{s.Vehicle.licensePlate}</p>
            </div>
            <p className="font-medium">{s.serviceType}</p>
            <p className="text-sm text-neutral-400 mb-1"> {new Date(s.date).toLocaleDateString()} • {s.mileage.toLocaleString()} mi </p>
            <p className="text-sm text-neutral-400 mt-1">{s.notes}</p>
          </div>
          <div className="flex-1 flex items-center justify-center px-4 text-center text-orange-400 text-sm font-semibold">
            {getServiceDueMessage(s)}
          </div>
          <div className="flex items-center justify-end gap-6 p-3 content-center">
            <button onClick={() => downloadServiceCsv(s)} className="bg-orange-500 hover:bg-orange-700 px-3 py-2 rounded-lg text-sm font-semibold cursor-pointer">Export CSV</button>
            <button onClick={() => window.print()} className="bg-neutral-600 hover:bg-neutral-500 px-3 py-2 rounded-lg text-sm font-semibold cursor-pointer">Print PDF</button>
            <p className="ml-2 text-4xl font-bold whitespace-nowrap">£{s.cost.toFixed(2)}</p>
          </div>
        </div>
      ))
    )}
  </div>
  );
}