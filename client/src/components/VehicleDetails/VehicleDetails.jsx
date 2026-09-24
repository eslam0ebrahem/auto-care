import { useEffect, useState } from 'react';
import {useNavigate, useParams} from 'react-router'
import { getVehicleById, removeVehicle } from '../../apiService/vehicleApi';
import { removeService } from '../../apiService/serviceApi';
import AddVehicle from '../AddVehicle/AddVehicle';

export default function VehicleDetails ({fetchVehicles, fetchServices}) {
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const {id} = useParams();

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const getVehicle = async () => {
      const res = await getVehicleById(id);
      setVehicle(res);
    };
    getVehicle();
  }, [id]);

  async function refreshVehicleDetails() {
    const res = await getVehicleById(id);
    setVehicle(res);
  }

  async function handleDelete () {
    const confirmed = window.confirm('Are you sure you want to delete this vehicle?');

    if (!confirmed) return;

    await removeVehicle(id);
    await fetchVehicles();
    await fetchServices();
    navigate('/vehicles');
  }

  async function handleServiceDelete (serviceId) {
    const confirmed = window.confirm('Are you sure you want to delete this service?');

    if(!confirmed) return;

    await removeService(serviceId);
    await fetchServices();
    
    const updateVehicle = await getVehicleById(id);
    setVehicle(updateVehicle);
  }

  if(!vehicle) {
    return <p>Loading... Please wait!</p>
  }

  return (
  <div>
    <div className="flex justify-between items-start mb-8">
      <div className='flex'>
        <span className=" p-2 py-2 rounded-lg">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            height="47px" 
            viewBox="0 -960 960 960" 
            width="48px" 
            fill="#e3e3e3"><path d="M200-204v54q0 12.75-8.62 21.37Q182.75-120 170-120h-20q-12.75 0-21.37-8.63Q120-137.25 120-150v-324l85-256q5-14 16.5-22t26.5-8h464q15 0 26.5 8t16.5 22l85 256v324q0 12.75-8.62 21.37Q822.75-120 810-120h-21q-13 0-21-8.63-8-8.62-8-21.37v-54H200Zm3-330h554l-55-166H258l-55 166Zm-23 60v210-210Zm105.76 160q23.24 0 38.74-15.75Q340-345.5 340-368q0-23.33-15.75-39.67Q308.5-424 286-424q-23.33 0-39.67 16.26Q230-391.47 230-368.24q0 23.24 16.26 38.74 16.27 15.5 39.5 15.5ZM675-314q23.33 0 39.67-15.75Q731-345.5 731-368q0-23.33-16.26-39.67Q698.47-424 675.24-424q-23.24 0-38.74 16.26-15.5 16.27-15.5 39.5 0 23.24 15.75 38.74Q652.5-314 675-314Zm-495 50h600v-210H180v210Z"/>
          </svg>
        </span>
          <div className='flex items-center flex-cols mt-2'>
            <h1 className="text-3xl font-semibold">
              {vehicle.year} {vehicle.make} {vehicle.model}
              <p className="text-slate-400 text-sm">
                {vehicle.licensePlate}
              </p>
            </h1>
          </div>
      </div>
      <div className="flex gap-2">
        <button 
          onClick={() => setIsEditing(true)} 
          className="bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white mt-4 px-3 py-2 rounded-lg transition font-medium cursor-pointer flex items-center gap-1">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            height="20px" 
            viewBox="0 -960 960 960" 
            width="20px" 
            fill="#e3e3e3"><path d="M216-216h51l375-375-51-51-375 375v51Zm-72 72v-153l498-498q11-11 23.84-16 12.83-5 27-5 14.16 0 27.16 5t24 16l51 51q11 11 16 24t5 26.54q0 14.45-5.02 27.54T795-642L297-144H144Zm600-549-51-51 51 51Zm-127.95 76.95L591-642l51 51-25.95-25.05Z"/>
          </svg>
          Edit
        </button>
        <button onClick={handleDelete} className="bg-red-500 hover:bg-red-600 mt-4 px-3 py-2 rounded-lg transition font-semibold cursor-pointer">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            height="23px" 
            viewBox="0 -960 960 960" 
            width="23px" 
            fill="#e3e3e3"><path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z"/>
          </svg>
        </button>
      </div>
    </div>
    <div>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold flex items-center gap-1">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            height="25px" 
            viewBox="0 -960 960 960" 
            width="25px" 
            fill="#e3e3e3"><path d="M666-163 475-354q-20 8-43.5 12.5T384-337q-99 0-169.5-70T144-576q0-37.78 9.5-71.89T182-711l144 144 70-70-144-144q29-17 62.5-26t69.5-9q100 0 170 71t70 170.19q0 22.81-4.5 42.31Q615-513 607-493l195 194q14 14.35 14 34.67Q816-244 802-230l-68 67q-14.09 14-34.04 14Q680-149 666-163Zm34-68 35-34-215-213q20-24 26-52.5t6-44.5q0-66.85-47.5-116.42Q457-741 390-744l82 81q11 11.18 11 26.09t-11.29 26.12L351.29-491.21Q340-480 325.82-480T301-491l-85-85q0 69 49.5 118T384-409q17 0 47-7t56-28l213 213ZM476-488Z"/>
          </svg>
          Service History
        </h2>
        <button
          onClick={() => navigate(`/logService?vehicleId=${vehicle.id}`)}
          className="bg-orange-500 hover:bg-orange-700 px-4 py-2 rounded-lg text-sm transition cursor-pointer font-semibold">
          + Log Service
        </button>
      </div>
      {vehicle.Services?.length === 0 ? (
        <div className="border border-neutral-700 rounded-xl p-6 text-slate-400 text-sm text-center">
          No services logged yet.
        </div>
      ) : (
        <div className="space-y-4">
          {vehicle.Services.map((s) => (
            <div
              key={s.id}
              className="bg-neutral-800 border border-neutral-800 rounded-xl p-3 flex justify-between items-center hover:border-orange-500">
              <div>
                <p className="font-medium">
                  {s.serviceType}
                </p>
                <p className="text-sm text-neutral-400 mt-1">
                  {new Date(s.date).toLocaleDateString('en-GB')} • {s.mileage.toLocaleString()} mi
                </p>
                {s.notes && (
                  <p className="text-sm text-neutral-400 mt-1">
                    {s.notes}
                  </p>
                )}
              </div>
              <div className='flex gap-2'>
                <p className="font-semibold">
                  £{s.cost.toFixed(2)}
                </p>
                <button onClick={() => navigate(`/logService?vehicleId=${vehicle.id}&edit=${s.id}`)} className='hover:bg-neutral-600 cursor-pointer rounded'>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    height="20px" 
                    viewBox="0 -960 960 960" 
                    width="20px" 
                    fill="#e3e3e3"><path d="M216-216h51l375-375-51-51-375 375v51Zm-72 72v-153l498-498q11-11 23.84-16 12.83-5 27-5 14.16 0 27.16 5t24 16l51 51q11 11 16 24t5 26.54q0 14.45-5.02 27.54T795-642L297-144H144Zm600-549-51-51 51 51Zm-127.95 76.95L591-642l51 51-25.95-25.05Z"/>
                  </svg>
                </button>
                <button onClick={() => handleServiceDelete(s.id)} className='cursor-pointer hover:bg-red-600 rounded'>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    height="20px" 
                    viewBox="0 -960 960 960" 
                    width="20px" 
                    fill="#e3e3e3"><path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>

    {isEditing && (
      <AddVehicle
        onClose={() => setIsEditing(false)}
        fetchVehicles={fetchVehicles}
        vehicleToEdit={vehicle}
        onVehicleUpdated={refreshVehicleDetails}
      />
    )}
  </div>
);
}