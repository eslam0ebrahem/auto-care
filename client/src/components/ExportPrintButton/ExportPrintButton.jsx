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

export default function ExportPrintButton ({service}) {
  return (
    <>
      <button
        onClick={() => downloadServiceCsv(service)}
        className="bg-orange-500 hover:bg-orange-700 px-3 py-2 rounded-lg text-sm font-semibold cursor-pointer">
        Export CSV
      </button>
      <button
        onClick={() => window.print()}
        className="bg-neutral-600 hover:bg-neutral-500 px-3 py-2 rounded-lg text-sm font-semibold cursor-pointer">
        Print PDF
      </button>
    </>
  );
}
