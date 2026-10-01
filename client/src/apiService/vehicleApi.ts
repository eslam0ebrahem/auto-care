/// <reference types="vite/client" />

import type { ServiceRecord } from './serviceApi';

const URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:3005';

export interface VehicleInput {
  make: string;
  model: string;
  year: number | string;
  licensePlate: string;
}

export interface VehicleRecord extends VehicleInput {
  id: number;
  year: number;
  userId?: number;
  Services?: ServiceRecord[];
}

interface VehicleMutationResponse {
  msg: string;
  vehicle?: VehicleRecord;
}

interface VehicleDeleteResponse {
  msg: string;
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

export async function getVehicles(): Promise<VehicleRecord[]> {
  try {
    const res = await fetch(`${URL}/vehicles`, {
      headers: getAuthHeaders(),
    });
    return await parseResponse<VehicleRecord[]>(res, 'Failed to fetch vehicles');
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getVehicleById(id: number | string | undefined): Promise<VehicleRecord | undefined> {
  const res = await fetch(`${URL}/vehicles/${id}`, {
    headers: getAuthHeaders(),
  });
  return await parseResponse<VehicleRecord>(res, 'Failed to fetch vehicle');
}

export async function addVehicle(data: VehicleInput): Promise<VehicleMutationResponse> {
  const res = await fetch(`${URL}/vehicles`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return await parseResponse<VehicleMutationResponse>(res, 'Failed to add vehicle');
}

export async function removeVehicle(id: number | string | undefined): Promise<VehicleDeleteResponse> {
  const res = await fetch(`${URL}/vehicles/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return await parseResponse<VehicleDeleteResponse>(res, 'Failed to delete vehicle');
}

export async function editVehicle(
  id: number | string,
  data: Partial<VehicleInput>,
): Promise<VehicleMutationResponse> {
  const res = await fetch(`${URL}/vehicles/${id}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return await parseResponse<VehicleMutationResponse>(res, 'Failed to edit vehicle');
}