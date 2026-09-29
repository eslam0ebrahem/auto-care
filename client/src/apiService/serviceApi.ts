/// <reference types="vite/client" />

const URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:3005';

export interface ServiceInput {
  vehicleId: number | string;
  serviceType: string;
  date: string;
  mileage: number | string;
  cost: number | string;
  notes?: string;
}

export interface ServiceVehicle {
  id: number;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  userId?: number;
}

export interface ServiceRecord {
  id: number;
  vehicleId: number;
  serviceType: string;
  date: string;
  mileage: number;
  cost: number;
  notes: string | null;
  Vehicle?: ServiceVehicle;
}

interface ServiceMutationResponse {
  msg: string;
  service?: ServiceRecord;
}

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : '',
  };
}

export async function getServices(): Promise<ServiceRecord[]> {
  try {
    const res = await fetch(`${URL}/services`, {
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch services: ${res.status}`);
    }
    return (await res.json()) as ServiceRecord[];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function addService(data: ServiceInput): Promise<ServiceMutationResponse | undefined> {
  try {
    const res = await fetch(`${URL}/services`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error(`Failed to add service: ${res.status}`);
    }

    return (await res.json()) as ServiceMutationResponse;
  } catch (error) {
    console.error(error);
  }
}

export async function removeService(id: number | string): Promise<ServiceMutationResponse | undefined> {
  try {
    const res = await fetch(`${URL}/services/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      throw new Error(`Failed to delete service: ${res.status}`);
    }

    return (await res.json()) as ServiceMutationResponse;
  } catch (error) {
    console.error(error);
  }
}

export async function editService(
  id: number | string,
  data: ServiceInput,
): Promise<ServiceMutationResponse | undefined> {
  try {
    const res = await fetch(`${URL}/services/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    return (await res.json()) as ServiceMutationResponse;
  } catch (error) {
    console.error(error);
  }
}