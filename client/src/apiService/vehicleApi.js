const URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:3005';

export async function getVehicles() {
  try {
    const res = await fetch(`${URL}/vehicles`);

    if (!res.ok) {
      throw new Error(`Failed to fetch vehicles: ${res.status}`);
    }
    return res.json();
  } catch (error) {
    console.error(error);
  }
}

export async function getVehicleById(id) {
  try {
    const res = await fetch(`${URL}/vehicles/${id}`);

    if (!res.ok) {
      throw new Error(`Failed to fetch vehicle: ${res.status}`);
    }
    return res.json();
  } catch (error) {
    console.error(error);
  }
}

export async function addVehicle(data) {
  // data = {make, model, year, licensePlate};
  try {
    const res = await fetch(`${URL}/vehicles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error(`Failed to add vehicle: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error(error);
  }
}

export async function removeVehicle(id) {
  try {
    const res = await fetch(`${URL}/vehicles/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      throw new Error(`Failed to delete vehicle: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error(error);
  }
}
