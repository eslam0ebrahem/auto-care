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

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : '',
  };
}

export async function getVehicles(): Promise<VehicleRecord[]> {
  try {
    const res = await fetch(`${URL}/vehicles`, {
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch vehicles: ${res.status}`);
    }
    return (await res.json()) as VehicleRecord[];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getVehicleById(id: number | string | undefined): Promise<VehicleRecord | undefined> {
  try {
    const res = await fetch(`${URL}/vehicles/${id}`, {
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch vehicle: ${res.status}`);
    }
    return (await res.json()) as VehicleRecord;
  } catch (error) {
    console.error(error);
  }
}

export async function addVehicle(data: VehicleInput): Promise<VehicleMutationResponse | undefined> {
  try {
    const res = await fetch(`${URL}/vehicles`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error(`Failed to add vehicle: ${res.status}`);
    }

    return (await res.json()) as VehicleMutationResponse;
  } catch (error) {
    console.error(error);
  }
}

export async function removeVehicle(id: number | string | undefined): Promise<VehicleDeleteResponse | undefined> {
  try {
    const res = await fetch(`${URL}/vehicles/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      throw new Error(`Failed to delete vehicle: ${res.status}`);
    }

    return (await res.json()) as VehicleDeleteResponse;
  } catch (error) {
    console.error(error);
  }
}

export async function editVehicle(
  id: number | string,
  data: Partial<VehicleInput>,
): Promise<VehicleDeleteResponse | undefined> {
  try {
    const res = await fetch(`${URL}/vehicles/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error(`Failed to edit vehicle: ${res.status}`);
    }

    return (await res.json()) as VehicleDeleteResponse;
  } catch (error) {
    console.error(error);
  }
}