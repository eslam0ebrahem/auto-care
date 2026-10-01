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
  cost: number | string;
  notes: string | null;
  Vehicle?: ServiceVehicle;
}

interface ServiceMutationResponse {
  msg: string;
  service?: ServiceRecord;
}

interface ApiErrorResponse {
  msg?: string;
  error?: string;
}

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : '',
  };
}

async function parseResponse<T>(res: Response, fallbackMessage: string): Promise<T> {
  let data: any = {};
  try {
    data = await res.json();
  } catch {
    // Non-JSON response
  }

  if (!res.ok) {
    const errorMsg = (data as ApiErrorResponse)?.msg || (data as ApiErrorResponse)?.error || fallbackMessage;
    throw new Error(errorMsg);
  }

  return data as T;
}

export async function getServices(): Promise<ServiceRecord[]> {
  try {
    const res = await fetch(`${URL}/services`, {
      headers: getAuthHeaders(),
    });
    return await parseResponse<ServiceRecord[]>(res, 'Failed to fetch services');
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function addService(data: ServiceInput): Promise<ServiceMutationResponse> {
  const res = await fetch(`${URL}/services`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return await parseResponse<ServiceMutationResponse>(res, 'Failed to add service');
}

export async function removeService(id: number | string): Promise<ServiceMutationResponse> {
  const res = await fetch(`${URL}/services/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return await parseResponse<ServiceMutationResponse>(res, 'Failed to delete service');
}

export async function editService(
  id: number | string,
  data: Partial<ServiceInput>,
): Promise<ServiceMutationResponse> {
  const res = await fetch(`${URL}/services/${id}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return await parseResponse<ServiceMutationResponse>(res, 'Failed to edit service');
}