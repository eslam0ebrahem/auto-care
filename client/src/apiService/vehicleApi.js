const URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:3005';

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : '',
  };
}

export async function getVehicles() {
  try {
    const res = await fetch(`${URL}/vehicles`, {
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch vehicles: ${res.status}`);
    }
    return res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getVehicleById(id) {
  try {
    const res = await fetch(`${URL}/vehicles/${id}`, {
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch vehicle: ${res.status}`);
    }
    return res.json();
  } catch (error) {
    console.error(error);
  }
}

export async function addVehicle(data) {
  try {
    const res = await fetch(`${URL}/vehicles`, {
      method: 'POST',
      headers: getAuthHeaders(),
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
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      throw new Error(`Failed to delete vehicle: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error(error);
  }
}

export async function editVehicle(id, data) {
  try {
    const res = await fetch(`${URL}/vehicles/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error(`Failed to edit vehicle: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error(error);
  }
}
